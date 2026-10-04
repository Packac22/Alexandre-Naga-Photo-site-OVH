const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Ouvrir le menu':'Fermer le menu');nav.classList.toggle('open',!open)});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Ouvrir le menu')}));

const photoDialog=document.querySelector('.photo-dialog');
if(photoDialog){
  const photoButtons=[...document.querySelectorAll('.portrait-open')];
  const largePhoto=photoDialog.querySelector('.photo-large');
  const counter=photoDialog.querySelector('.photo-counter');
  let activePhoto=0;
  function showPhoto(index){
    activePhoto=(index+photoButtons.length)%photoButtons.length;
    const original=photoButtons[activePhoto].querySelector('img');
    largePhoto.src=original.dataset.full || original.currentSrc || original.src;
    largePhoto.width=Number(original.getAttribute('width'));
    largePhoto.height=Number(original.getAttribute('height'));
    largePhoto.alt=original.alt;
    counter.textContent=`${activePhoto+1} / ${photoButtons.length}`;
  }
  photoButtons.forEach((button,index)=>button.addEventListener('click',()=>{
    showPhoto(index);photoDialog.showModal();document.body.classList.add('locked');
  }));
  photoDialog.querySelector('.photo-close').addEventListener('click',()=>photoDialog.close());
  photoDialog.querySelector('.photo-prev').addEventListener('click',()=>showPhoto(activePhoto-1));
  photoDialog.querySelector('.photo-next').addEventListener('click',()=>showPhoto(activePhoto+1));
  photoDialog.addEventListener('close',()=>document.body.classList.remove('locked'));
  photoDialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(activePhoto-1);}
    if(event.key==='ArrowRight'){event.preventDefault();showPhoto(activePhoto+1);}
  });
}
