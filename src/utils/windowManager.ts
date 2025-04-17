// Types
import { playSound } from './audioManager';
import { userName, userEmail, socialLinks } from './siteConfig';

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
          <h2 class="font-bold text-2xl text-text dark:text-text-dark">${userName}</h2>
          <p class="mb-3">CS graduate student with software development experience.</p>
          <div class="about-sections">
            <div class="about-section">
              <h3 class="font-bold text-lg text-text dark:text-text-dark">Tech Interests</h3>
              <ul class="list-disc pl-5 mb-3">
                <li>Open-source, Linux (Arch & NixOS)</li>
                <li>Machine Learning & Deep Learning</li>
                <li>Virtualization & VFIO GPU passthrough</li>
              </ul>
            </div>
            <div class="about-section">
              <h3 class="font-bold text-lg text-text dark:text-text-dark">Hobbies</h3>
              <ul class="list-disc pl-5">
                <li>Anime, manga, sketching, videogames</li>
                <li>City Pop, J-Rock & Japanese guitars</li>
                <li>Mechanical keyboards (Cherry MX Blacks & Topre)</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    case 'links':
      // Generate HTML for each available social link
      const socialLinksHTML = Object.entries(socialLinks)
        .map(([platform, url]) => {
          // Map platform names to Font Awesome icon classes
          const iconMap: Record<string, string> = {
            github: 'fab fa-github',
            twitter: 'fab fa-twitter',
            linkedin: 'fab fa-linkedin',
            devto: 'fab fa-dev',
            medium: 'fab fa-medium'
          };
          
          // Only create HTML for platforms that have an icon mapping
          if (iconMap[platform]) {
            const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
            return `
              <a href="${url}" class="link-item" target="_blank">
                <i class="${iconMap[platform]} link-icon"></i>
                <span>${platformName}</span>
              </a>
            `;
          }
          return '';
        })
        .join('');
      
      return `
        <div class="links-window">
          <h2 class="font-bold text-2xl text-text dark:text-text-dark">Find Me Online</h2>
          <div class="links-grid">
            ${socialLinksHTML}
            <a href="mailto:${userEmail}" class="link-item">
              <i class="fas fa-envelope link-icon"></i>
              <span>Email</span>
            </a>
          </div>
        </div>
      `;
    case 'work':
      return `
        <div class="work-window">
          <h2 class="font-bold text-2xl text-text dark:text-text-dark">My Work</h2>
          <div class="work-items">
            <div class="work-item">
              <h3>Project 1</h3>
              <p>Description of project 1.</p>
            </div>
            <div class="work-item">
              <h3>Project 2</h3>
              <p>Description of project 2.</p>
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
    case 'secret':
      // Link data structure
      const links = [
        {
          title: "My Medium Blog",
          description: "I write about things that interest me! Check me out!",
          url: "https://medium.com/@notquitethereyet_/"
        },
        {
          title: "Degoogling",
          description: "Reduce the amount of data Google can steal from you!",
          url: "https://www.reddit.com/r/degoogle/comments/huk4rp/why_you_should_degoogle_intro_degoogling/"
        },
        {
          title: "Stay Private Online!",
          description: "Various Privacy Tools",
          url: "https://www.privacytools.io/"
        },
        {
          title: "Are VPNs really private?",
          description: "VPNs keep no logs. Right? RIGHT??????",
          url: "https://www.youtube.com/watch?v=239w7x2TdWE"
        },
        {
          title: "BitTorrent crypto mining",
          description: "Your harem anime spiking CPU usage?",
          url: "https://www.trustedreviews.com/news/utorrent-silently-installing-bundled-bitcoin-mining-software-2931825"
        },
        {
          title: "PlayStation 2 BIOS",
          description: "Curated BIOS that I need to play PS2 games.",
          url: "https://drive.google.com/file/d/1H_ydGw_leVuMpRzrEoC8nAWhmR1kGr0i/view"
        },
        {
          title: "PlayStation 3 Firmware",
          description: "Official Sony repo for PS3 firmware! Good job Sony!",
          url: "https://www.playstation.com/en-us/support/hardware/ps3/system-software/"
        },
        {
          title: "Stealing Stuff Pt. 1",
          description: "Stealing guide for games!",
          url: "https://www.reddit.com/r/Piracy/wiki/megathread/games/"
        },
        {
          title: "Stealing Stuff Pt. 2",
          description: "Stealing Guide for other software!",
          url: "https://www.reddit.com/r/Piracy/wiki/tools"
        },
        {
          title: "Stealing Stuff Pt. 3",
          description: "Stealing Guide for stinky weebs!",
          url: "https://nyaa.si/"
        }
      ];

      // Generate HTML for links
      const linksHtml = links.map(link => `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
           class="link-card bg-opacity-10 bg-secondary dark:bg-accent-dark dark:bg-opacity-20 p-4 rounded-lg shadow-md transform hover:-translate-y-1 transition duration-300 group">
          <div>
            <h3 class="text-lg font-bold mb-2 text-text dark:text-text-dark group-hover:text-accent dark:group-hover:text-accent-dark transition duration-300">${link.title}</h3>
            <p class="text-text dark:text-text-dark opacity-80">${link.description}</p>
          </div>
        </a>
      `).join('');

      return `
        <div class="secret-window">
          <h2 class="font-bold text-2xl text-text dark:text-text-dark mb-6 text-center w-full">Autism Links</h2>
          <p class="mb-6 text-center text-text dark:text-text-dark opacity-80">A collection of useful and interesting links</p>
          
          <div class="links-grid grid grid-cols-1 md:grid-cols-2 gap-4">
            ${linksHtml}
          </div>
          
          <div class="mt-8 p-4 bg-opacity-50 bg-secondary dark:bg-accent-dark dark:bg-opacity-30 rounded-lg">
            <p class="text-center italic text-text dark:text-text-dark">This area is for your eyes only!</p>
          </div>
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
