console.log('Content script loaded');

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'showOverlay') {
    console.log('Received showOverlay message');
    showOverlay();
  }
});

function showOverlay() {
  // Check if overlay already exists
  if (document.getElementById('pr-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'pr-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Invisible background
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '999999';
  overlay.style.cursor = 'pointer';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.5s ease-in-out';

  const img = document.createElement('img');
  img.src = browser.runtime.getURL('pull-request-merged.jpg');
  img.style.maxWidth = '80%';
  img.style.maxHeight = '80%';
  img.style.objectFit = 'contain';
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.5s ease-in-out';

  overlay.appendChild(img);
  document.body.appendChild(overlay);

  // Fade in
  setTimeout(() => {
    overlay.style.opacity = '1';
    img.style.opacity = '1';
  }, 10);

  // Auto-remove after 5 seconds with fade out
  setTimeout(() => {
    fadeOut();
  }, 5000);

  function fadeOut() {
    overlay.style.opacity = '0';
    img.style.opacity = '0';
    overlay.addEventListener('transitionend', () => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, { once: true });
  }

  // Remove on click with fade out
  overlay.addEventListener('click', fadeOut);
}