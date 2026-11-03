const $=s=>document.querySelector(s);
const pad=n=>String(n).padStart(2,"0");
const initials=n=>n.replace(/[\[\]_]/g," ").trim().split(/\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase()||"✦";
function img(src,alt,fallback,cls){ // gambar dengan fallback anggun
  const wrap=document.createElement("div");wrap.style.cssText="width:100%;height:100%;display:contents";
  if(!src){const p=document.createElement("div");p.className="ph";p.textContent=fallback;p.setAttribute("role","img");p.setAttribute("aria-label",alt);return p}
  const i=new Image();i.src=src;i.alt=alt;i.loading="lazy";if(cls)i.className=cls;
  i.onerror=()=>{const p=document.createElement("div");p.className="ph";p.textContent=fallback;p.setAttribute("role","img");p.setAttribute("aria-label",alt);i.replaceWith(p)};
  return i;
}
function avatar(l){const d=document.createElement("div");d.className="av";const t=initials(l.name);
  if(l.photo){const i=new Image();i.src=l.photo;i.alt=l.name;i.loading="lazy";i.onerror=()=>{d.textContent=t};d.append(i)}else d.textContent=t;return d}
