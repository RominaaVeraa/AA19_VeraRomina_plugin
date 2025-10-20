async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = html;
    }
    return true;
  } catch (error) {
    console.error(`Error cargando componente ${componentPath}:`, error);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const headerOk = await loadComponent('header-component', 'components/header.html');
  const footerOk = await loadComponent('footer-component', 'components/footer.html');

  if (headerOk) {
    setTimeout(() => {
      if (typeof initializeGlobalComponents === 'function') {
        initializeGlobalComponents();
      }
      if (typeof updateProfileButton === 'function') {
        updateProfileButton();
      }
      if (typeof updateHeaderProfile === 'function') {
        updateHeaderProfile();
      }

      try {
        window.dispatchEvent(new CustomEvent('header:loaded'));
      } catch {}

    }, 50);
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'currentUserEmail' || e.key === 'digitalPointUsers') {
      if (typeof updateProfileButton === 'function') updateProfileButton();
      if (typeof updateHeaderProfile === 'function') updateHeaderProfile();
    }
  });
});
