'use strict';
(() => {
 const book=window.BOOK, $=id=>document.getElementById(id);
 if(!book || !book.sections?.length || book.sections.some(s=>!s.pages?.length)) { $('error').hidden=false; $('error').textContent='Не вдалося завантажити конфігурацію видання.'; return; }
 Object.entries(book.theme||{}).forEach(([k,v])=>document.documentElement.style.setProperty('--'+k,v));
 document.title=book.title+' — Домашній театр'; $('title').textContent=book.title; $('subtitle').textContent=book.subtitle||'';
 const pages=book.sections.flatMap((s,section)=>s.pages.map((p,sub)=>({...p,section,sub}))); let current=0;
 const mainButtons=[], subButtons=[];
 const makeButton=(label,callback)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',callback);return b;};
 book.sections.forEach((s,i)=>{const b=makeButton(s.label,()=>show(pages.findIndex(p=>p.section===i))); if(s.pages.length>1){b.setAttribute('aria-controls','sub-nav');b.setAttribute('aria-expanded','false');} $('main-nav').append(b);mainButtons.push(b);});
 const sheet=$('sheet');sheet.addEventListener('error',()=>{ $('error').hidden=false;$('error').textContent='Не вдалося завантажити сторінку.'; });sheet.addEventListener('load',()=>{$('error').hidden=true;});
 function show(index){if(index<0||index>=pages.length)return;current=index;const p=pages[index], section=book.sections[p.section];mainButtons.forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===p.section));if(b.hasAttribute('aria-expanded'))b.setAttribute('aria-expanded',String(i===p.section));});const sub=$('sub-nav');sub.replaceChildren();sub.hidden=section.pages.length<2;subButtons.length=0;if(!sub.hidden)section.pages.forEach((item,i)=>{const b=makeButton(item.label,()=>show(pages.findIndex(x=>x.section===p.section&&x.sub===i)));b.setAttribute('aria-pressed',String(i===p.sub));sub.append(b);subButtons.push(b);});
 sheet.alt=p.label+(p.text?' — '+p.text:'');sheet.src=p.image;$('status').textContent=`${index+1} / ${pages.length} · ${p.label}`;$('prev').disabled=index===0;$('next').disabled=index===pages.length-1; }
 $('prev').onclick=()=>show(current-1);$('next').onclick=()=>show(current+1);
 document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}});
 const download=$('download');if(book.pdf)download.href=book.pdf;else download.hidden=true;
 const printImages=pages.map(p=>{const div=document.createElement('div');div.className='print-page';const img=document.createElement('img');img.src=p.image;img.alt='';div.append(img);$('print-area').append(div);return img;});
 $('print').onclick=async()=>{const b=$('print');b.disabled=true;try{await Promise.all(printImages.map(i=>i.decode()));window.print();}catch(e){alert('Не вдалося підготувати всі сторінки. Спробуйте завантажити PDF.');}finally{b.disabled=false;}};
 $('footer').textContent=`${pages.length} аркушів · А4, альбомний формат · Для масок друкуйте PDF у масштабі 100% (без підгонки). Вирізання — за допомогою дорослих.`;
 show(0);
})();
