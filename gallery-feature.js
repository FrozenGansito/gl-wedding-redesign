// Collect all gallery images into an array
const galleryImgs = Array.from(document.querySelectorAll('.image-grid img'));

const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbClose   = document.getElementById('lb-close');
const lbPrev    = document.getElementById('lb-prev');
const lbNext    = document.getElementById('lb-next');
const lbCounter = document.getElementById('lb-counter');

let currentIndex = 0;

// Open the lightbox at a given index
function openLightbox(index) {
  currentIndex = index;
  const thumb = galleryImgs[currentIndex];
  lbImg.src = thumb.dataset.full || thumb.src;
  lbImg.alt = thumb.alt;
  lbCounter.textContent = `${currentIndex + 1} / ${galleryImgs.length}`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // prevent background scrolling
  resetZoom();
}

// Close the lightbox
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  resetZoom();
}

// Navigate between images
function showNext() {
  openLightbox((currentIndex + 1) % galleryImgs.length);
}

function showPrev() {
  openLightbox((currentIndex - 1 + galleryImgs.length) % galleryImgs.length);
}

// Attach click listeners to each thumbnail
galleryImgs.forEach((img, index) => {
  img.addEventListener('click', () => openLightbox(index));
});

// Button listeners
lbClose.addEventListener('click', closeLightbox);
lbNext.addEventListener('click', showNext);
lbPrev.addEventListener('click', showPrev);

// Click the dark backdrop (not the image) to close
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'Escape')     closeLightbox();
});

// Touch support: pinch/double-tap to zoom, drag to pan
let scale = 1;
let translateX = 0;
let translateY = 0;
let startDistance = 0;
let startScale = 1;
let isPinching = false;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let panOriginX = 0;
let panOriginY = 0;
let lastTapTime = 0;
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;

function getDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function applyTransform() {
  lbImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function resetZoom() {
  scale = 1;
  translateX = 0;
  translateY = 0;
  isPinching = false;
  isPanning = false;
  applyTransform();
}

lightbox.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    isPinching = true;
    startDistance = getDistance(e.touches);
    startScale = scale;
    return;
  }

  if (e.touches.length === 1) {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      lastTapTime = 0;
      scale > 1 ? resetZoom() : (scale = DOUBLE_TAP_SCALE, applyTransform());
      return;
    }
    lastTapTime = now;

    if (scale > 1) {
      isPanning = true;
      panStartX = e.touches[0].clientX;
      panStartY = e.touches[0].clientY;
      panOriginX = translateX;
      panOriginY = translateY;
    }
  }
});

lightbox.addEventListener('touchmove', (e) => {
  if (isPinching && e.touches.length === 2) {
    e.preventDefault();
    const newDistance = getDistance(e.touches);
    scale = Math.min(MAX_SCALE, Math.max(1, startScale * (newDistance / startDistance)));
    applyTransform();
  } else if (isPanning && e.touches.length === 1) {
    e.preventDefault();
    translateX = panOriginX + (e.touches[0].clientX - panStartX);
    translateY = panOriginY + (e.touches[0].clientY - panStartY);
    applyTransform();
  }
}, { passive: false });

lightbox.addEventListener('touchend', (e) => {
  if (e.touches.length === 0) {
    isPinching = false;
    isPanning = false;
    if (scale < 1.05) resetZoom(); // snap back if barely zoomed
  }
});