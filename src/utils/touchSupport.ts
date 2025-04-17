import { bringToFront, getDragBounds } from './windowManager';

/**
 * Initialize touch support for mobile devices
 */
export function initTouchSupport(): void {
  // Apply touch dragging to existing windows
  const existingWindows = document.querySelectorAll('.window');
  existingWindows.forEach(windowEl => {
    const titleBar = windowEl.querySelector('.bg-secondary');
    if (titleBar) {
      touchDraggable(windowEl as HTMLElement, titleBar as HTMLElement);
    }
  });

  // Apply touch dragging to all windows
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.classList && node.classList.contains('window')) {
            const titleBar = node.querySelector('.bg-secondary');
            if (titleBar) {
              touchDraggable(node, titleBar as HTMLElement);
            }
          }
        });
      }
    });
  });

  const windowsContainer = document.getElementById('windows-container');
  if (windowsContainer) {
    observer.observe(windowsContainer, { childList: true });
  }
}

/**
 * Makes an element draggable with touch events
 */
function touchDraggable(windowEl: HTMLElement, handleEl: HTMLElement): void {
  if (!handleEl) return;
  handleEl.addEventListener('touchstart', touchStart, { passive: false });

  function touchStart(e: TouchEvent): void {
    // Don't prevent default for touchstart to allow scrolling inside windows

    // Bring window to front
    bringToFront(windowEl);

    // Add dragging class
    // addDragClass(windowEl); // Removed this line

    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    const startTop = windowEl.offsetTop;
    const startLeft = windowEl.offsetLeft;

    // Add event listeners to document instead of handleEl for better touch tracking
    document.addEventListener('touchmove', touchMove, { passive: false });
    document.addEventListener('touchend', touchEnd, { passive: false });

    function touchMove(e: TouchEvent): void {
      // Prevent default to stop scrolling while dragging
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // Set the element's new position
      const newTop = startTop + deltaY;
      const newLeft = startLeft + deltaX;

      // Use shared drag helpers from windowManager for bounds and class logic
      const { top, left } = getDragBounds(newTop, newLeft);
      windowEl.style.top = `${top}px`;
      windowEl.style.left = `${left}px`;
    }

    function touchEnd(): void {
      document.removeEventListener('touchmove', touchMove);
      document.removeEventListener('touchend', touchEnd);

      // Remove dragging class
      // removeDragClass(windowEl); // Removed this line
    }
  }
}
