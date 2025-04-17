// Types
import { playSound } from './audioManager';

interface WindowState {
  id: string;
  element: HTMLElement;
}

// State
let activeWindows: WindowState[] = [];
let highestZIndex: number = 10;

/**
 * Opens a window with the specified ID
 */
export function openWindow(windowId: string): void {
  console.log('Opening window:', windowId);
  // Check if window is already open
  const existingWindow = document.querySelector(`.window[data-window-id="${windowId}"]`) as HTMLElement;
  if (existingWindow) {
    // Add shake animation to indicate it's already open
    existingWindow.classList.add('window-shake');
    setTimeout(() => {
      existingWindow.classList.remove('window-shake');
    }, 500);

    bringToFront(existingWindow);
    return;
  }

  // Create new window from template
  const template = document.getElementById('window-template');
  if (!template) {
    console.error('Window template not found');
    return;
  }

  // Clone the template content
  const clonedContent = (template as HTMLTemplateElement).content.cloneNode(true) as DocumentFragment;
  const windowEl = clonedContent.querySelector('.window') as HTMLElement;
  
  if (!windowEl) {
    console.error('Window element not found in template');
    return;
  }

  // Set window ID
  windowEl.dataset.windowId = windowId;

  // Set window title
  const titleEl = windowEl.querySelector('.bg-secondary div') as HTMLElement;
  if (!titleEl) {
    console.error('Window title element not found');
  } else {
    titleEl.textContent = windowId;
  }

  // Ensure title bar has solid background color
  const titleBar = windowEl.querySelector('.bg-secondary') as HTMLElement;
  if (titleBar) {
    titleBar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--window-title-bg');
  }

  // Add to container
  const container = document.getElementById('windows-container');
  if (!container) {
    console.error('Windows container not found');
    return;
  }
  container.appendChild(windowEl);

  // Calculate window size and position
  const windowWidth = windowEl.offsetWidth;
  const windowHeight = windowEl.offsetHeight;
  const position = calculateWindowPosition(windowWidth, windowHeight);
  
  windowEl.style.left = `${position.left}px`;
  windowEl.style.top = `${position.top}px`;

  // Add to active windows
  activeWindows.push({
    id: windowId,
    element: windowEl
  });

  // Initialize window events
  initWindowEvents(windowEl);

  // Add to container and start animations in one sequence
  setTimeout(() => {
    // Play window opening sound
    playSound('windowOpen');
    
    // First add the opening animation
    windowEl.classList.add('window-opening');
    windowEl.classList.add('window-active');
    bringToFront(windowEl);
    
    // Then load content after the window appears
    loadWindowContent(windowId, windowEl);
  }, 10);
}

/**
 * Loads content into a window
 */
function loadWindowContent(windowId: string, windowEl: HTMLElement): void {
  const contentEl = windowEl.querySelector('.window > div:nth-child(2)') as HTMLElement;
  if (!contentEl) {
    console.error('Window content element not found');
    return;
  }
  contentEl.classList.add('loading');
  contentEl.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--window-content-bg');

  // Simulate loading content with a shorter delay
  setTimeout(() => {
    // Create the content based on window ID
    const contentHtml = createWindowContent(windowId);
    if (!contentHtml) {
      console.error(`Content for ${windowId} could not be created`);
      return;
    }
    
    // Clear loading indicator
    contentEl.innerHTML = '';
    
    // Add content
    contentEl.innerHTML = contentHtml;
    contentEl.classList.remove('loading');
    
    // Add fade-in animation to content
    const innerContent = contentEl.firstElementChild as HTMLElement;
    if (innerContent) {
      innerContent.classList.add('content-fade-in');
    }
    
    // We don't need an additional bounce animation here since the window is already visible
  }, 300); // Reduced from 500ms to 300ms for a snappier feel
}

/**
 * Creates window content based on window ID
 */
function createWindowContent(windowId: string): string | null {
  // This function dynamically creates the HTML for each window type
  
  switch (windowId) {
    case 'about':
      return `
        <div class="about-window">
          <img src="/images/profile.png" alt="Profile picture" class="profile-image" id="profile-image">
          <h2 class="font-bold text-2xl text-text dark:text-text-dark">Your Name</h2>
          <p>Your bio and description here. Tell visitors about yourself!</p>
          <ul>
            <li>What you do</li>
            <li>Your skills</li>
            <li>Your interests</li>
          </ul>
        </div>
      `;
    case 'links':
      return `
        <div class="links-window">
          <div class="links-grid">
            <a href="#" target="_blank" class="link-item">
              <div class="link-icon twitter-icon">
                <img src="/images/icons/social-twitter.svg" alt="Twitter" width="30" height="30">
              </div>
              <div class="link-text">twitter</div>
            </a>
            <a href="#" target="_blank" class="link-item">
              <div class="link-icon youtube-icon">
                <img src="/images/icons/social-youtube.svg" alt="YouTube" width="30" height="30">
              </div>
              <div class="link-text">youtube</div>
            </a>
            <a href="#" target="_blank" class="link-item">
              <div class="link-icon instagram-icon">
                <img src="/images/icons/social-instagram.svg" alt="Instagram" width="30" height="30">
              </div>
              <div class="link-text">instagram</div>
            </a>
          </div>
          <p class="links-note">clicking any of the links will open a new tab!</p>
        </div>
      `;
    case 'work':
      return `
        <div class="work-window">
          <h2 class="font-bold text-2xl text-text dark:text-text-dark">My Work</h2>
          <div class="work-items">
            <div class="work-item">
              <h3>Project 1</h3>
              <p>Description of project 1</p>
            </div>
            <div class="work-item">
              <h3>Project 2</h3>
              <p>Description of project 2</p>
            </div>
          </div>
        </div>
      `;
    case 'faq':
      return `
        <div class="faq-window">
          <h2 class="font-bold text-2xl text-text dark:text-text-dark">Frequently Asked Questions</h2>
          <div class="faq-item">
            <h3>Question 1?</h3>
            <p>Answer to question 1.</p>
          </div>
          <div class="faq-item">
            <h3>Question 2?</h3>
            <p>Answer to question 2.</p>
          </div>
        </div>
      `;
    case 'contact':
      return `
        <div class="contact-window">
          <h2 class="font-bold text-2xl text-secondary dark:text-text-dark">Contact Me</h2>
          <p>Feel free to reach out to me at: <a href="mailto:your.email@example.com">your.email@example.com</a></p>
        </div>
      `;
    default:
      return null;
  }
}

/**
 * Closes a window
 */
export function closeWindow(windowEl: HTMLElement): void {
  // Play window closing sound
  playSound('windowClose');
  
  // Add closing animation
  windowEl.classList.add('window-closing');
  windowEl.classList.remove('window-active');
  
  // Remove from DOM after animation completes
  setTimeout(() => {
    const windowId = windowEl.dataset.windowId;
    windowEl.remove();
    
    // Remove from active windows array
    if (windowId) {
      activeWindows = activeWindows.filter(w => w.id !== windowId);
    }
  }, 300);
}

/**
 * Brings a window to the front
 */
export function bringToFront(windowEl: HTMLElement): void {
  // Increment highest z-index
  highestZIndex += 1;
  windowEl.style.zIndex = `${highestZIndex}`;

  // Update active class
  document.querySelectorAll('.window').forEach(w => {
    w.classList.remove('window-active');
  });
  windowEl.classList.add('window-active');
}

/**
 * Initialize window events
 */
function initWindowEvents(windowEl: HTMLElement): void {
  // Close button
  const closeBtn = windowEl.querySelector('button') as HTMLButtonElement;
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeWindow(windowEl);
    });
  }

  // Make window draggable
  const titleBar = windowEl.querySelector('.bg-secondary') as HTMLElement;
  if (titleBar) {
    makeDraggable(windowEl, titleBar);
  }

  // Double click on title bar to close
  if (titleBar) {
    titleBar.addEventListener('dblclick', () => {
      closeWindow(windowEl);
    });
  }
}

/**
 * Makes an element draggable
 */
function makeDraggable(element: HTMLElement, handle: HTMLElement): void {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e: MouseEvent): void {
    e.preventDefault();

    // Bring window to front
    bringToFront(element);

    // Add dragging class
    element.classList.add('window-dragging');

    // Get the mouse cursor position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e: MouseEvent): void {
    e.preventDefault();

    // Calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // Set the element's new position
    const newTop = element.offsetTop - pos2;
    const newLeft = element.offsetLeft - pos1;

    // Keep window within viewport
    const maxTop = window.innerHeight - 50;
    const maxLeft = window.innerWidth - 50;

    element.style.top = `${Math.min(Math.max(0, newTop), maxTop)}px`;
    element.style.left = `${Math.min(Math.max(0, newLeft), maxLeft)}px`;
  }

  function closeDragElement(): void {
    // Remove dragging class
    element.classList.remove('window-dragging');

    // Stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

/**
 * Calculate staggered position for new windows
 */
function calculateWindowPosition(windowWidth: number, windowHeight: number): { left: number, top: number } {
  // Base position (center of screen)
  const baseLeft = (window.innerWidth - windowWidth) / 2;
  const baseTop = (window.innerHeight - windowHeight) / 2;

  // If no windows are open, center the window
  if (activeWindows.length === 0) {
    return { left: baseLeft, top: baseTop };
  }

  // Offset each window by a certain amount
  const offsetX = 40;
  const offsetY = 40;

  // Use modulo to reset the cascade after a certain number of windows
  const cascadeLimit = 5;
  const cascadeIndex = activeWindows.length % cascadeLimit;

  // Calculate new position
  const newLeft = baseLeft + (cascadeIndex * offsetX);
  const newTop = baseTop + (cascadeIndex * offsetY);

  // Ensure window stays within viewport bounds
  const maxLeft = window.innerWidth - windowWidth - 10;
  const maxTop = window.innerHeight - windowHeight - 10;

  return {
    left: Math.min(Math.max(10, newLeft), maxLeft),
    top: Math.min(Math.max(10, newTop), maxTop)
  };
}

/**
 * Reposition windows when screen is resized
 */
export function repositionWindows(): void {
  // Reposition each window with staggered effect
  const windows = document.querySelectorAll('.window');

  windows.forEach((windowEl, index) => {
    const htmlWindowEl = windowEl as HTMLElement;
    const windowWidth = htmlWindowEl.offsetWidth;
    const windowHeight = htmlWindowEl.offsetHeight;

    // Base position (center of screen)
    const baseLeft = (window.innerWidth - windowWidth) / 2;
    const baseTop = (window.innerHeight - windowHeight) / 2;

    // Offset each window by a certain amount
    const offsetX = 40;
    const offsetY = 40;

    // Use modulo to reset the cascade after a certain number of windows
    const cascadeLimit = 5;
    const cascadeIndex = index % cascadeLimit;

    // Calculate new position
    const newLeft = baseLeft + (cascadeIndex * offsetX);
    const newTop = baseTop + (cascadeIndex * offsetY);

    // Ensure window stays within viewport bounds
    const maxLeft = window.innerWidth - windowWidth - 10;
    const maxTop = window.innerHeight - windowHeight - 10;

    // Add smooth transition for repositioning
    htmlWindowEl.style.transition = 'left 0.3s ease, top 0.3s ease';

    // Set new position
    htmlWindowEl.style.left = `${Math.min(Math.max(10, newLeft), maxLeft)}px`;
    htmlWindowEl.style.top = `${Math.min(Math.max(10, newTop), maxTop)}px`;

    // Remove transition after animation completes
    setTimeout(() => {
      htmlWindowEl.style.transition = '';
    }, 300);
  });
}

/**
 * Rearrange all windows in a staggered pattern
 */
export function rearrangeWindows(): void {
  // Sort windows by z-index to maintain the visual stack order
  const sortedWindows = activeWindows.sort((a, b) => {
    return parseInt(a.element.style.zIndex || '0') - parseInt(b.element.style.zIndex || '0');
  });

  // Reposition each window with staggered effect
  sortedWindows.forEach((windowState, index) => {
    const windowEl = windowState.element;
    const windowWidth = windowEl.offsetWidth;
    const windowHeight = windowEl.offsetHeight;

    // Base position (center of screen)
    const baseLeft = (window.innerWidth - windowWidth) / 2;
    const baseTop = (window.innerHeight - windowHeight) / 2;

    // Offset each window by a certain amount
    const offsetX = 40;
    const offsetY = 40;

    // Use modulo to reset the cascade after a certain number of windows
    const cascadeLimit = 5;
    const cascadeIndex = index % cascadeLimit;

    // Calculate new position
    const newLeft = baseLeft + (cascadeIndex * offsetX);
    const newTop = baseTop + (cascadeIndex * offsetY);

    // Ensure window stays within viewport bounds
    const maxLeft = window.innerWidth - windowWidth - 10;
    const maxTop = window.innerHeight - windowHeight - 10;

    // Add smooth transition for repositioning
    windowEl.style.transition = 'left 0.3s ease, top 0.3s ease';

    // Set new position
    windowEl.style.left = `${Math.min(Math.max(10, newLeft), maxLeft)}px`;
    windowEl.style.top = `${Math.min(Math.max(10, newTop), maxTop)}px`;

    // Remove transition after animation completes
    setTimeout(() => {
      windowEl.style.transition = '';
    }, 300);
  });
}
