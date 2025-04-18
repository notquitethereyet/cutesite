// No import! Use global trianglify from CDN

function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getPalette(mode) {
  // Richer gradient: 5 colors, darkest to lightest
  if (mode === "dark") {
    return [
      "#2a2d3a", // extra dark blue-purple
      "#505477", // dark blue-purple
      "#616c99", // medium blue-purple
      "#b9a6c8", // soft lavender
      "#fcddf2"  // light pink
    ];
  } else {
    return [
      "#562135", // extra dark mauve
      "#c3829e", // deep mauve
      "#e9b1cd", // light pink
      "#fcd1d7", // pale rose
      "#ffe7de"  // pale peach
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
    cellSize: 100,
    variance: 0.8,
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
