import { openWindow } from './windowManager';

/**
 * Initialize desktop icons
 */
export function initIcons(): void {
  console.log('Initializing icons');
  const icons = document.querySelectorAll('[data-window]');
  console.log('Found icons:', icons.length);

  icons.forEach((icon) => {
    // Add click event
    icon.addEventListener('click', (e) => {
      if (!(e instanceof MouseEvent)) return;
      // Create ripple effect
      const ripple = document.createElement('div');
      ripple.classList.add('ripple');

      const rect = (icon as HTMLElement).getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      icon.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);

      // Get window ID from data attribute
      const windowId = (icon as HTMLElement).dataset.window;
      if (!windowId) {
        console.error('No window ID found on icon');
        return;
      }

      // Open window
      openWindow(windowId);
    });

    // Add floating animation
    const delay = Array.from(icons).indexOf(icon) * 0.2;
    (icon as HTMLElement).style.animation = `float 3s ease-in-out ${delay}s infinite`;
  });
}
