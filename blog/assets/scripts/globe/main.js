import { GlobeRenderer } from './globe-renderer.js';
import { MarkerSystem } from './marker-system.js';
import { markers as markerData } from './marker-data.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* DOM refs */
const canvas = document.getElementById('globe-canvas');
const loadingEl = document.getElementById('globe-loading');
const popup = document.getElementById('marker-popup');
const popupTitle = document.getElementById('popup-title');
const popupDate = document.getElementById('popup-date');
const popupDesc = document.getElementById('popup-desc');
const popupImage = document.getElementById('popup-image');
const popupClose = document.getElementById('popup-close');
const btnZoomIn = document.getElementById('btn-zoom-in');
const btnZoomOut = document.getElementById('btn-zoom-out');
const btnAutoRotate = document.getElementById('btn-auto-rotate');

/* Init scene — await async land-data fetch */
const globe = new GlobeRenderer(canvas);
await globe.init();

const markerSystem = new MarkerSystem(globe.scene, globe.camera, canvas);
markerSystem.addMarkers(markerData);

/* Hide loading overlay */
loadingEl.classList.add('hidden');
setTimeout(() => loadingEl.remove(), 600);

/* Set initial auto-rotate button state */
btnAutoRotate.classList.toggle('globe-btn--active', globe.autoRotate);

/* Marker click → show popup */
markerSystem.onMarkerClick = (data) => {
  popupTitle.textContent = data.title;
  popupDate.textContent = data.date;
  popupDesc.textContent = data.description;

  popupImage.innerHTML = '';
  if (data.image) {
    const img = document.createElement('img');
    img.src = data.image;
    img.alt = data.title;
    popupImage.appendChild(img);
    popupImage.classList.add('has-image');
  } else {
    popupImage.classList.remove('has-image');
  }

  popup.classList.add('visible');
  popup.setAttribute('aria-hidden', 'false');
  popupClose.focus();
};

/* Close popup */
function closePopup() {
  popup.classList.remove('visible');
  popup.setAttribute('aria-hidden', 'true');
}

popupClose.addEventListener('click', closePopup);
popup.addEventListener('click', (e) => {
  if (e.target === popup) closePopup();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup();
});

/* Control buttons */
btnZoomIn.addEventListener('click', () => globe.zoomIn());
btnZoomOut.addEventListener('click', () => globe.zoomOut());
btnAutoRotate.addEventListener('click', () => {
  const next = !globe.autoRotate;
  globe.setAutoRotate(next);
  btnAutoRotate.classList.toggle('globe-btn--active', next);
});

/* Render loop with dirty-flag optimisation */
function animate(time) {
  requestAnimationFrame(animate);

  globe.update();

  /* Pulse animations require continuous rendering */
  if (!reducedMotion && markerSystem.markers.length > 0) {
    globe.dirty = true;
  }

  if (globe.dirty) {
    markerSystem.update(time * 0.001);
    globe.render();
  }
}

requestAnimationFrame(animate);
