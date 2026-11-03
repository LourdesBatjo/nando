/* letters */
const cards=$("#cards"),lt=$("#lt");let li=0;
const lettersList = (window.LETTERS && Array.isArray(window.LETTERS)) ? window.LETTERS : [];
const lettersTitle=$("#letters-title");
if(lettersTitle) lettersTitle.textContent=`${lettersList.length} Letters, ${lettersList.length} Wishes`;

if(cards && lettersList.length){
  lettersList.forEach((l,i)=>{
    const c=document.createElement("article");c.className="card rv";
    const numId = l.id || (i+1);
    c.innerHTML=`<span class="no">${pad(numId)}</span>`;c.append(avatar(l));
    c.insertAdjacentHTML("beforeend",`<h3></h3><p class="rel"></p><button class="btn">Read letter</button>`);
    c.querySelector("h3").textContent=l.name;c.querySelector(".rel").textContent=l.relationship||"";
    c.querySelector("button").setAttribute("aria-label",`Baca surat ${pad(numId)} dari ${l.name}`);
    c.querySelector("button").onclick=()=>showLetter(i);cards.append(c);
  });
}

function showLetter(i){
  if(!lettersList.length || !lt) return;
  li=(i+lettersList.length)%lettersList.length;const l=lettersList[li];
  const numId = l.id || (li+1);
  lt.innerHTML=`<button class="ib mx" data-x aria-label="Tutup surat">✕</button><div class="lt"><div id="lav"></div><h3></h3><p class="rel"></p><div class="body"></div></div><div class="nv"><button class="ib" data-d="-1" aria-label="Surat sebelumnya">‹</button><span>SURAT ${pad(numId)} / ${pad(lettersList.length)}</span><button class="ib" data-d="1" aria-label="Surat berikutnya">›</button></div>`;
  lt.querySelector("#lav").replaceWith(avatar(l));
  lt.querySelector("h3").textContent=l.name;lt.querySelector(".rel").textContent=l.relationship||"";lt.querySelector(".body").textContent=l.message;
  lt.scrollTop=0;if(!lt.open)lt.showModal();
}
if(lt){
  lt.addEventListener("click",e=>{const b=e.target.closest("button");if(b&&b.dataset.d)showLetter(li+ +b.dataset.d);else if((b&&"x"in b.dataset)||e.target===lt)lt.close()});
}
document.addEventListener("keydown",e=>{
  const isLbOpen = typeof lb !== 'undefined' && lb && lb.open;
  const isLtOpen = typeof lt !== 'undefined' && lt && lt.open;
  const m=isLbOpen?[lb,showPhoto,typeof gi!=='undefined'?gi:0]:isLtOpen?[lt,showLetter,li]:null;if(!m)return;
  if(e.key==="ArrowRight")m[1](m[2]+1);if(e.key==="ArrowLeft")m[1](m[2]-1);
});
