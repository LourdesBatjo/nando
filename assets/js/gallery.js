/* gallery */
const grid=$("#grid"),lb=$("#lb");let gi=0;
const galleryList = (window.GALLERY && Array.isArray(window.GALLERY)) ? window.GALLERY : [];

if(grid && galleryList.length){
  galleryList.forEach((g,i)=>{
    const b=document.createElement("button");b.className="tile";b.setAttribute("aria-label",`Buka foto ${i+1}`+(g.caption?`: ${g.caption}`:""));
    const el=img(g.src,g.caption||`Foto ${i+1}`,"✦");if(!g.src)el.style.setProperty("--r",g.r||"4/5");
    b.style.setProperty("--r",g.r||"4/5");b.append(el);
    if(g.caption){const c=document.createElement("span");c.className="cap";c.textContent=g.caption;b.append(c)}
    b.onclick=()=>showPhoto(i);grid.append(b);
  });
}

function showPhoto(i){
  if(!galleryList.length || !lb) return;
  gi=(i+galleryList.length)%galleryList.length;const g=galleryList[gi];
  lb.innerHTML=`<figure></figure><div class="nv"><button class="ib" data-d="-1" aria-label="Foto sebelumnya">‹</button><span>${pad(gi+1)} / ${pad(galleryList.length)}</span><button class="ib" data-d="1" aria-label="Foto berikutnya">›</button><button class="ib" data-x aria-label="Tutup">✕</button></div>`;
  const f=lb.querySelector("figure");f.append(img(g.src,g.caption||`Foto ${gi+1}`,"✦"));
  if(g.caption){const c=document.createElement("figcaption");c.textContent=g.caption;f.append(c)}
  if(!lb.open)lb.showModal();
}

if(lb){
  lb.addEventListener("click",e=>{const b=e.target.closest("button");if(b&&b.dataset.d)showPhoto(gi+ +b.dataset.d);else if((b&&"x"in b.dataset)||e.target===lb)lb.close()});
}
