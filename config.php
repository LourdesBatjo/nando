<?php
/**
 * =========================================================================
 * KONFIGURASI DEPLOYMENT & SISTEM — WEBSITE ULANG TAHUN
 * =========================================================================
 * File ini mengatur izin akses, keamanan admin, batasan upload, dan direktori.
 */

// 1. PENGATURAN LINGKUNGAN (ENVIRONMENT)
define('APP_ENV', 'production'); // 'production' atau 'development'

if (APP_ENV === 'production') {
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
} else {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
}

// 2. KONFIGURASI DATABASE MYSQL (INFINITYFREE)
define('DB_HOST', 'sql108.infinityfree.com');
define('DB_USER', 'if0_43346073');
define('DB_PASS', 'lYV0Jhn5SBg');
define('DB_PORT', 3306);
define('DB_NAME', ''); // Masukkan nama database jika sudah dibuat di InfinityFree cPanel

// 3. KEAMANAN & PIN ADMIN
// Ganti PIN di bawah ini sesuai keinginan Anda untuk keamanan live hosting
define('ADMIN_PIN', '1234');

// 4. BATASAN UPLOAD GAMBAR
// Kamera HP masa kini menghasilkan foto 3 - 8 MB
define('MAX_UPLOAD_SIZE', 16 * 1024 * 1024); // Maksimal 16 Megabytes
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'webp', 'gif']);
define('ALLOWED_MIME_TYPES', [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/webp',
    'image/gif'
]);

// 5. DIREKTORI & PATH FILE
define('DIR_ROOT', __DIR__);
define('FILE_DATA_JS', DIR_ROOT . '/assets/js/data.js');
define('DIR_IMG_PROFILE', DIR_ROOT . '/assets/images/birthday-person');
define('DIR_IMG_GALLERY', DIR_ROOT . '/assets/images/gallery');
define('DIR_IMG_CONTRIBUTOR', DIR_ROOT . '/assets/images/contributors');

// 6. HELPER KEAMANAN & RESPON
function send_json_response($success, $data = [], $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array_merge(['success' => $success], $data), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function verify_admin_auth() {
    $pin = $_SERVER['HTTP_X_ADMIN_PIN'] ?? ($_POST['admin_pin'] ?? ($_GET['admin_pin'] ?? ''));
    // Jika PIN kosong atau tidak cocok dengan ADMIN_PIN
    if ($pin !== ADMIN_PIN && !empty(ADMIN_PIN)) {
        return false;
    }
    return true;
}

function ensure_directory($dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}
