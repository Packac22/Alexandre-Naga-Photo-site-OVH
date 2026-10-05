'use strict';

// Progressive navigation: without this script, all menu links remain visible.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuButton && nav) {
  const setMenu = open => {
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  };
  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  });
  window.matchMedia('(min-width: 851px)').addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });
  document.documentElement.classList.add('js');
}

const photoDialog = document.querySelector('.photo-dialog');
if (photoDialog && typeof photoDialog.showModal === 'function') {
  const photoLinks = [...document.querySelectorAll('.portrait-open')];
  const largePhoto = photoDialog.querySelector('.photo-large');
  const counter = photoDialog.querySelector('.photo-counter');
  const errorMessage = photoDialog.querySelector('.photo-error');
  let activePhoto = 0;
  let opener = null;

  function updateSizes() {
    if (!photoDialog.open) return;
    const style = getComputedStyle(photoDialog);
    const availableWidth = photoDialog.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const availableHeight = photoDialog.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    const ratio = largePhoto.width / largePhoto.height;
    largePhoto.sizes = `${Math.max(1, Math.floor(Math.min(availableWidth, availableHeight * ratio)))}px`;
  }

  function showPhoto(index) {
    activePhoto = (index + photoLinks.length) % photoLinks.length;
    const original = photoLinks[activePhoto].querySelector('img');
    largePhoto.hidden = false;
    errorMessage.hidden = true;
    largePhoto.width = Number(original.getAttribute('width'));
    largePhoto.height = Number(original.getAttribute('height'));
    largePhoto.alt = original.alt;
    updateSizes();
    // Existing WebP variants handle smaller displays. The full JPEG remains
    // available to the browser for large/high-density screens, without cropping.
    largePhoto.srcset = `${original.srcset}, ${original.dataset.full} ${largePhoto.width}w`;
    largePhoto.src = original.src;
    counter.textContent = `${activePhoto + 1} / ${photoLinks.length}`;
  }

  largePhoto.addEventListener('error', () => {
    largePhoto.hidden = true;
    errorMessage.textContent = 'La photographie n’a pas pu être chargée. Passez à la suivante ou réessayez.';
    errorMessage.hidden = false;
  });
  photoLinks.forEach((link, index) => link.addEventListener('click', event => {
    // Keep the usual open-in-new-tab behaviour.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    photoDialog.showModal();
    document.body.classList.add('locked');
    showPhoto(index);
    photoDialog.querySelector('.photo-close').focus();
  }));
  photoDialog.querySelector('.photo-close').addEventListener('click', () => photoDialog.close());
  photoDialog.querySelector('.photo-prev').addEventListener('click', () => showPhoto(activePhoto - 1));
  photoDialog.querySelector('.photo-next').addEventListener('click', () => showPhoto(activePhoto + 1));
  // Close on the backdrop or the unused space around the contained image.
  function isBackground(event) {
    if (event.target === photoDialog) return true;
    if (event.target !== largePhoto) return false;
    const rect = largePhoto.getBoundingClientRect();
    const ratio = largePhoto.width / largePhoto.height;
    const width = Math.min(rect.width, rect.height * ratio);
    const height = width / ratio;
    return Math.abs(event.clientX - (rect.left + rect.width / 2)) > width / 2 ||
      Math.abs(event.clientY - (rect.top + rect.height / 2)) > height / 2;
  }
  let startedOnBackground = false;
  photoDialog.addEventListener('pointerdown', event => { startedOnBackground = isBackground(event); });
  photoDialog.addEventListener('click', event => {
    if (startedOnBackground && isBackground(event)) photoDialog.close();
    startedOnBackground = false;
  });
  photoDialog.addEventListener('close', () => {
    document.body.classList.remove('locked');
    if (opener) opener.focus();
  });
  photoDialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const controls = [...photoDialog.querySelectorAll('button:not([disabled])')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(activePhoto - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(activePhoto + 1); }
  });
  window.addEventListener('resize', updateSizes);
}
