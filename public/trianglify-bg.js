// No import! Use global trianglify from CDN

function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getPalette(mode) {
  // Use more distinct colors for better Trianglify backgrounds
  if (mode === "dark") {
    return [
      getCSSVar("--bg-color"),
      getCSSVar("--window-content-bg"),
      getCSSVar("--window-title-bg"),
      getCSSVar("--highlight-color"),
      getCSSVar("--icon-border"),
      getCSSVar("--text-color")
    ];
  } else {
    return [
      getCSSVar("--bg-color"),
      getCSSVar("--window-content-bg"),
      getCSSVar("--window-title-bg"),
      getCSSVar("--highlight-color"),
      getCSSVar("--icon-border"),
      getCSSVar("--text-color")
    ];
  }
}

function setTrianglifyBackground() {
  const isDark = document.documentElement.classList.contains("dark");
  const palette = getPalette(isDark ? "dark" : "light");
  console.log('[Trianglify] Palette:', palette);
  if (typeof trianglify !== 'function') {
    console.error('[Trianglify] Trianglify library not loaded!');
    return;
  }
  const pattern = trianglify({
    width: window.innerWidth,
    height: window.innerHeight,
    cellSize: 75,
    variance: 1,
    xColors: palette,
    yColors: "match"
  });
  // Remove any previous background node
  const prev = document.getElementById("trianglify-bg");
  if (prev) prev.remove();
  // Create a new SVG node
  const svg = pattern.toSVG();
  svg.setAttribute("id", "trianglify-bg");
  svg.style.position = "fixed";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100vw";
  svg.style.height = "100vh";
  svg.style.zIndex = "-1";
  svg.style.pointerEvents = "none";
  document.body.prepend(svg);
  console.log('[Trianglify] SVG injected');
}

window.addEventListener("DOMContentLoaded", setTrianglifyBackground);
window.addEventListener("resize", setTrianglifyBackground);
const observer = new MutationObserver(() => setTrianglifyBackground());
observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
