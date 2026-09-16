/*
  Lightbox for project build-phase photos.
  No dependencies. Click (or Enter/Space) an image to view it full-screen;
  click anywhere, press Escape, or use the close button to dismiss.
*/
(function () {
  var triggers = document.querySelectorAll('.phase__media img');
  if (!triggers.length) return;

  var lastFocused = null;

  // Build the overlay once.
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Image viewer');
  box.hidden = true;

  var full = document.createElement('img');
  full.className = 'lightbox__img';
  full.alt = '';

  var caption = document.createElement('p');
  caption.className = 'lightbox__caption';

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'lightbox__close';
  closeBtn.setAttribute('aria-label', 'Close image viewer');
  closeBtn.innerHTML = '&times;';

  var figure = document.createElement('figure');
  figure.className = 'lightbox__figure';
  figure.appendChild(full);
  figure.appendChild(caption);

  box.appendChild(figure);
  box.appendChild(closeBtn);
  document.body.appendChild(box);

  function open(img) {
    lastFocused = img;
    full.src = img.currentSrc || img.src;
    full.alt = img.alt || '';
    if (img.alt) {
      caption.textContent = img.alt;
      caption.hidden = false;
    } else {
      caption.hidden = true;
    }
    box.hidden = false;
    // force a reflow so the opacity transition runs after display changes
    void box.offsetWidth;
    box.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    box.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    var done = function () {
      box.hidden = true;
      full.src = '';
      box.removeEventListener('transitionend', done);
    };
    box.addEventListener('transitionend', done);
    // fallback if no transition fires
    setTimeout(function () { if (!box.classList.contains('is-open')) box.hidden = true; }, 300);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  triggers.forEach(function (img) {
    img.classList.add('is-zoomable');
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    img.setAttribute('aria-label', 'View image full screen' + (img.alt ? ': ' + img.alt : ''));
    img.addEventListener('click', function () { open(img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        open(img);
      }
    });
  });

  // Click anywhere in the overlay closes it.
  box.addEventListener('click', close);
  closeBtn.addEventListener('click', function (e) { e.stopPropagation(); close(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && box.classList.contains('is-open')) close();
  });
})();
