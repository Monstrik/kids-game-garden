(function () {
  GameTheme.initTheme(document.getElementById("themeBtn"));

  const versionEl = document.getElementById("appVersion");
  if (!versionEl) {
    return;
  }

  fetch("version.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Version file not found");
      }
      return response.json();
    })
    .then((data) => {
      if (data && typeof data.version === "string" && data.version.trim()) {
        versionEl.textContent = `Version ${data.version}`;
      }
    })
    .catch(() => {
      // Keep the default version text if fetch fails.
    });
})();
