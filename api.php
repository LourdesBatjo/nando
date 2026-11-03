<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-PIN');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$action = $_GET['action'] ?? ($_POST['action'] ?? '');

// Test koneksi API
if ($action === 'ping') {
    send_json_response(true, ['message' => 'API Online & Terhubung dengan config.php']);
}

// 1. SIMPAN PERUBAHAN DATA (data.js)
if ($action === 'save_data') {
    // Validasi otentikasi admin
    if (!verify_admin_auth()) {
        send_json_response(false, ['error' => 'Akses ditolak: PIN Admin tidak valid.'], 403);
    }

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if (!$data) {
        send_json_response(false, ['error' => 'Data JSON tidak valid'], 400);
    }

    $config = $data['config'] ?? [];
    $gallery = $data['gallery'] ?? [];
    $letters = $data['letters'] ?? [];

    $dataJsContent = "/* ============ DATA WEBSITE ULANG TAHUN ============ */\n";
    $dataJsContent .= "window.CONFIG = " . json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . ";\n\n";
    $dataJsContent .= "window.GALLERY = " . json_encode($gallery, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . ";\n\n";
    $dataJsContent .= "window.LETTERS = " . json_encode($letters, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . ";\n\n";
    $dataJsContent .= "var CONFIG = window.CONFIG;\n";
    $dataJsContent .= "var GALLERY = window.GALLERY;\n";
    $dataJsContent .= "var LETTERS = window.LETTERS;\n\n";
    $dataJsContent .= "// Sinkronisasi otomatis dengan localStorage jika ada perubahan lokal\n";
    $dataJsContent .= "try {\n";
    $dataJsContent .= "  var localConfig = localStorage.getItem('bday_config');\n";
    $dataJsContent .= "  if (localConfig) { Object.assign(window.CONFIG, JSON.parse(localConfig)); CONFIG = window.CONFIG; }\n";
    $dataJsContent .= "  var localGallery = localStorage.getItem('bday_gallery');\n";
    $dataJsContent .= "  if (localGallery) { window.GALLERY = JSON.parse(localGallery); GALLERY = window.GALLERY; }\n";
    $dataJsContent .= "  var localLetters = localStorage.getItem('bday_letters');\n";
    $dataJsContent .= "  if (localLetters) { window.LETTERS = JSON.parse(localLetters); LETTERS = window.LETTERS; }\n";
    $dataJsContent .= "} catch (e) {\n";
    $dataJsContent .= "  console.warn('Storage sync error:', e);\n";
    $dataJsContent .= "}\n";

    if (strlen($dataJsContent) < 100) {
        send_json_response(false, ['error' => 'Konten data terlalu pendek, dibatalkan demi keamanan.'], 400);
    }

    $filePath = FILE_DATA_JS;
    $tempPath = FILE_DATA_JS . '.tmp';

    // Tulis ke file sementara terlebih dahulu untuk mencegah kerusakan jika disk penuh
    if (@file_put_contents($tempPath, $dataJsContent, LOCK_EX) !== false && filesize($tempPath) > 100) {
        @rename($tempPath, $filePath);
        send_json_response(true, ['message' => 'File data.js berhasil diperbarui di server!']);
    } else {
        if (@file_put_contents($filePath, $dataJsContent, LOCK_EX) !== false) {
            send_json_response(true, ['message' => 'File data.js berhasil diperbarui di server!']);
        } else {
            send_json_response(false, ['error' => 'Gagal menulis file data.js. Periksa hak izin (chmod 755/777) folder assets/js/.'], 500);
        }
    }
}

// 2. UNGGAH GAMBAR (Upload Image)
if ($action === 'upload_image') {
    // Validasi otentikasi admin
    if (!verify_admin_auth()) {
        send_json_response(false, ['error' => 'Akses ditolak: PIN Admin tidak valid.'], 403);
    }

    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        $errorCode = $_FILES['file']['error'] ?? 'UNKNOWN';
        send_json_response(false, ['error' => "Gagal mengunggah file (Kode error PHP: $errorCode). Periksa upload_max_filesize di server."], 400);
    }

    $file = $_FILES['file'];

    // Validasi ukuran file
    if ($file['size'] > MAX_UPLOAD_SIZE) {
        send_json_response(false, ['error' => 'Ukuran file melebihi batas maksimal (16 MB). Silakan kompres gambar terlebih dahulu.'], 400);
    }

    // Validasi ekstensi
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ALLOWED_EXTENSIONS)) {
        send_json_response(false, ['error' => 'Format file tidak didukung. Harap gunakan format JPG, PNG, atau WEBP.'], 400);
    }

    $category = $_POST['category'] ?? 'gallery'; // 'profile', 'gallery', 'contributor'

    if ($category === 'profile') {
        $targetDir = DIR_IMG_PROFILE;
        ensure_directory($targetDir);
        $filename = 'profile.' . ($ext === 'jpeg' ? 'jpg' : $ext);
        $relativePath = 'assets/images/birthday-person/' . $filename;
    } elseif ($category === 'contributor') {
        $targetDir = DIR_IMG_CONTRIBUTOR;
        ensure_directory($targetDir);
        $filename = 'contributor_' . time() . '_' . rand(10, 99) . '.' . $ext;
        $relativePath = 'assets/images/contributors/' . $filename;
    } else {
        $targetDir = DIR_IMG_GALLERY;
        ensure_directory($targetDir);
        $filename = 'photo_' . time() . '_' . rand(100, 999) . '.' . $ext;
        $relativePath = 'assets/images/gallery/' . $filename;
    }

    $destPath = $targetDir . '/' . $filename;
    if (@move_uploaded_file($file['tmp_name'], $destPath)) {
        send_json_response(true, [
            'message' => 'Gambar berhasil diunggah',
            'path' => $relativePath
        ]);
    } else {
        send_json_response(false, ['error' => 'Gagal memindahkan file ke folder tujuan. Periksa permission folder assets/images/.'], 500);
    }
}

send_json_response(true, ['status' => 'API Admin Aktif']);
