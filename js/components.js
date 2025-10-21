// js/components.js
async function fetchFirstOk(urls) {
  for (const url of urls) {
    try {
      const r = await fetch(url, { cache: "no-cache" });
      if (r.ok) return await r.text();
    } catch (_) { /* intenta la siguiente ruta */ }
  }
  throw new Error("No se pudo obtener ningún template de: " + urls.join(", "));
}

function candidatePaths(relPath) {
  // Rutas a probar (sirve para páginas en raíz y en subcarpetas)
  const paths = [
    relPath,                   // components/header.html
    "./" + relPath,            // ./components/header.html
    "/" + relPath,             // /components/header.html (requiere server)
    "../" + relPath,           // ../components/header.html
    "../../" + relPath,        // ../../components/header.html
  ];
  // Quitar duplicados sencillos
  return [...new Set(paths)];
}

async function loadComponentInto(elId, relPath) {
  const el = document.getElementById(elId);
  if (!el) return false;

  try {
    const html = await fetchFirstOk(candidatePaths(relPath));
    el.innerHTML = html;
    return true;
  } catch (err) {
    console.error(`Error cargando ${relPath} para #${elId}:`, err);
    return false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (location.protocol === "file:") {
    console.warn(
      "Estás abriendo con file:// — fetch a fragments puede fallar. Usá un servidor local (Live Server, http-server, etc.)"
    );
  }

  const headerOk = await loadComponentInto("header-component", "components/header.html");
  const footerOk = await loadComponentInto("footer-component", "components/footer.html");

  if (headerOk) {
    // Dale un tiempito a que se inserte el DOM del header
    setTimeout(() => {
      if (typeof initializeGlobalComponents === "function") initializeGlobalComponents();
      if (typeof updateProfileButton === "function") updateProfileButton();
      if (typeof updateHeaderProfile === "function")  updateHeaderProfile();
      try { window.dispatchEvent(new CustomEvent("header:loaded")); } catch {}
    }, 50);
  }

  // Si cambia sesión/usuarios, refrescar icono/estado del header
  window.addEventListener("storage", (e) => {
    if (e.key === "currentUserEmail" || e.key === "digitalPointUsers") {
      if (typeof updateProfileButton === "function") updateProfileButton();
      if (typeof updateHeaderProfile === "function")  updateHeaderProfile();
    }
  });
});
