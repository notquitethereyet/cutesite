// Types
import { playSound } from './audioManager';
import { userName, userEmail, socialLinks } from './siteConfig';
import { setTheme } from './themeManager';

// State
interface WindowState {
  id: string;
  element: HTMLElement;
}
let activeWindows: WindowState[] = [];
let highestZIndex: number = 10;

/**
 * Opens a window with the specified ID
 */
export function openWindow(windowId: string): void {
  // Make the function available globally
  if (typeof window !== 'undefined') {
    (window as any).openWindow = openWindow;
  }
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

  // If opening the autism window, toggle decorations and ensure Lain background
  if (windowId === 'autism') {
    setTheme({ mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light', background: 'lain', decoration: 'lily' });
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
    // Set a more descriptive title based on the window ID
    if (windowId.startsWith('blog-')) {
      const slug = windowId.replace('blog-', '');
      // Map slugs to descriptive titles
      const titleMap: {[key: string]: string} = {
        'project-1': 'Personal Website',
        'project-2': 'Machine Learning Art',
        'project-3': 'NixOS Configuration'
      };
      titleEl.textContent = titleMap[slug] || `Blog: ${slug}`;
    } else {
      // Capitalize the first letter of each word for other windows
      titleEl.textContent = windowId.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }

  // Special case for home window - make it wider on mobile
  if (windowId === 'home') {
    windowEl.classList.add('home-window');
    // Add responsive width classes
    windowEl.style.width = 'min(90vw, 500px)';
  }

  // Special case for work window - make it larger
  if (windowId === 'work') {
    windowEl.classList.add('work-window');
    // Set a larger size for work window
    windowEl.style.width = 'min(90vw, 900px)';
    windowEl.style.height = 'min(90vh, 700px)';
  }

  // Special case for blog post windows - make them larger
  if (windowId.startsWith('blog-')) {
    windowEl.classList.add('blog-window');
    // Set a larger size for blog windows
    windowEl.style.width = 'min(95vw, 1000px)';
    windowEl.style.height = 'min(95vh, 800px)';
  }

  // Special case for links window - set appropriate size
  if (windowId === 'links') {
    windowEl.classList.add('links-window-container');
    // Set a good size for the links window
    windowEl.style.width = 'min(90vw, 450px)';
    windowEl.style.height = 'min(90vh, 400px)';
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

    // Special handling for the work window to load content dynamically
    if (windowId === 'work') {
      // Fetch the WorkWindow component HTML
      fetch(`${getBasePath()}work-component`)
        .then(response => response.text())
        .then(html => {
          const dynamicContent = contentEl.querySelector('#dynamic-work-content');
          if (dynamicContent) {
            dynamicContent.innerHTML = html;

            // Add event listeners to the entire blog post cards
            const blogPosts = contentEl.querySelectorAll('.blog-post');
            blogPosts.forEach(post => {
              post.addEventListener('click', () => {
                const url = (post as HTMLElement).dataset.url;
                if (url) {
                  // Extract the slug from the URL
                  const slug = url.split('/').pop();
                  if (slug) {
                    openWindow(`blog-${slug}`);
                  }
                }
              });
            });
          }
        })
        .catch(error => {
          console.error('Error loading work component:', error);
          // Fallback content if fetch fails
          const dynamicContent = contentEl.querySelector('#dynamic-work-content');
          if (dynamicContent) {
            dynamicContent.innerHTML = `
              <div class="p-4 text-center">
                <h3 class="text-lg font-bold mb-2">Error Loading Projects</h3>
                <p>Could not load the projects. Please try again later.</p>
              </div>
            `;
          }
        });
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
          <img src="${getBasePath()}images/profile.webp" alt="Profile picture" class="profile-image" id="profile-image" loading="lazy" width="120" height="120">
          <h2 class="font-bold text-2xl text-text dark:text-text-dark">${userName}</h2>
          <p class="mb-3">CS graduate student with software development experience.</p>
          <div class="about-sections">
            <div class="about-section">
              <h3 class="font-bold text-lg text-text dark:text-text-dark">Tech Interests</h3>
              <ul class="list-disc pl-5 mb-3">
                <li>Open-source, Linux (Arch & NixOS)</li>
                <li>Machine Learning & Deep Learning</li>
                <li>Virtualization & VFIO GPU passthrough</li>
                <li>Hobby projects with anything I can get my hands on</li>
              </ul>
            </div>
            <div class="about-section">
              <h3 class="font-bold text-lg text-text dark:text-text-dark">Hobbies</h3>
              <ul class="list-disc pl-5">
                <li>Anime, manga, sketching, videogames, and music</li>
                <li>City Pop, Japanese Alternative Rock & guitars</li>
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
            spotify: 'fab fa-spotify',
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
        <div class="links-window p-4">
          <h2 class="font-bold text-2xl text-highlight dark:text-highlight-dark mb-6 text-center">Find Me Online</h2>
          <div class="links-grid mx-auto" style="max-width: 400px;">
            ${socialLinksHTML}
            <a href="mailto:${userEmail}" class="link-item">
              <i class="fas fa-envelope link-icon"></i>
              <span>Email</span>
            </a>
            <a href="${getBasePath()}posts" class="link-item">
              <i class="fas fa-mobile-alt link-icon"></i>
              <span>My Blogs</span>
            </a>
          </div>
        </div>
      `;
    case 'work':
      // Load the work window component dynamically
      return `<div id="dynamic-work-content" class="w-full h-full"></div>`;

    case 'faq':
      return `
        <div class="faq-window">
          <h2 class="font-bold text-2xl text-highlight dark:text-highlight-dark mb-6">???</h2>

          <div class="faq-item">
            <h3 class="font-bold text-highlight dark:text-highlight-dark">???</h3>
            <p class="text-highlight dark:text-highlight-dark">???</p>
          </div>

          <div class="faq-item" id="controller-trigger-panel">
            <h3 class="font-bold text-highlight dark:text-highlight-dark">???</h3>
            <p class="text-highlight dark:text-highlight-dark">???</p>
          </div>

          <div class="faq-item">
            <h3 class="font-bold text-highlight dark:text-highlight-dark">???</h3>
            <p class="text-highlight dark:text-highlight-dark">???</p>
          </div>
        </div>
      `;
    case 'autism':
      // Link data structure
      const links = [
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

      // Generate HTML for links with card-list structure
      const linksHtml = generateCardListHtml(links);

      return `
        <div class="flex flex-col gap-4">
          ${linksHtml}
        </div>
      `;
    default:
      // Check if it's a blog post window
      if (windowId.startsWith('blog-')) {
        const slug = windowId.replace('blog-', '');
        // Create an iframe to load the blog post
        return `
          <div class="blog-post-iframe-container" style="height: 100%; width: 100%; overflow: hidden; background-color: var(--window-content-bg); position: relative; z-index: 1;">
            <iframe src="${getBasePath()}posts/${slug}" style="height: 100%; width: 100%; border: none; display: block; overflow: auto; background-color: var(--window-content-bg);" frameborder="0" scrolling="yes" allowtransparency="false"></iframe>
          </div>
        `;
      }
      return null;
  }
}

/**
 * Utility to get the site base path in a modular, industry-standard way
 */
export function getBasePath() {
  // Astro injects import.meta.env.BASE_URL, fallback to '/cutesite/' if unavailable
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) {
    return import.meta.env.BASE_URL;
  }
  return '/cutesite/';
}

/**
 * Closes a window
 */
export function closeWindow(windowId: string): void {
  playSound('windowClose');
  const windowElement = document.querySelector(`.window[data-window-id="${windowId}"]`);
  if (windowElement) {
    windowElement.classList.add('closing');
    setTimeout(() => {
      windowElement.remove();

      // If this was the autism window, redirect to home
      if (windowId === 'autism') {
        setTheme({ mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light', background: 'default', decoration: 'sakura' });
        window.location.href = window.location.origin + getBasePath();
      }
    }, 300);
  }
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
  addWindowEventListeners(windowEl);

  // Make window draggable
  const titleBar = windowEl.querySelector('.bg-secondary') as HTMLElement;
  if (titleBar) {
    makeDraggable(windowEl, titleBar);
  }

  // Special case: Make the home window draggable on desktop
  if (windowEl.dataset.windowId === 'home') {
    if (titleBar) {
      makeDraggable(windowEl, titleBar);
    }
  }
}

/**
 * Adds event listeners to a window
 */
function addWindowEventListeners(windowEl: HTMLElement): void {
  // Close button
  const closeBtn = windowEl.querySelector('button') as HTMLButtonElement;
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const windowId = windowEl.dataset.windowId;
      if (windowId) {
        closeWindow(windowId);
      }
    });
  }

  // Double click on title bar to close
  const titleBar = windowEl.querySelector('.window-title') as HTMLElement;
  if (titleBar) {
    titleBar.addEventListener('dblclick', () => {
      const windowId = windowEl.dataset.windowId;
      if (windowId) {
        closeWindow(windowId);
      }
    });
  }
}

/**
 * Makes an element draggable
 */
export function makeDraggable(element: HTMLElement, handle: HTMLElement): void {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e: MouseEvent): void {
    e.preventDefault();

    // Bring window to front
    bringToFront(element);

    // Add dragging class
    addDragClass(element);

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
    const { top, left } = getDragBounds(newTop, newLeft);

    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
  }

  function closeDragElement(): void {
    // Remove dragging class
    removeDragClass(element);

    // Stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Shared helpers for drag logic
/**
 * Clamp window position within viewport bounds
 */
export function getDragBounds(top: number, left: number): { top: number, left: number } {
  const maxTop = window.innerHeight - 50;
  const maxLeft = window.innerWidth - 50;
  return {
    top: Math.min(Math.max(0, top), maxTop),
    left: Math.min(Math.max(0, left), maxLeft)
  };
}

/**
 * Add dragging class to window element
 */
export function addDragClass(windowEl: HTMLElement) {
  windowEl.classList.add('window-dragging');
}

/**
 * Remove dragging class from window element
 */
export function removeDragClass(windowEl: HTMLElement) {
  windowEl.classList.remove('window-dragging');
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

/**
 * Utility: Generate card-list HTML for any list of {title, description, url}
 */
function generateCardListHtml(items: { title: string; description: string; url: string }[]): string {
  return `
    <div class="card-list">
      ${items.map(item => `
        <a href="${item.url}" class="card-link" target="_blank" rel="noopener noreferrer">
          <div class="card">
            <h3 class="font-bold text-highlight dark:text-highlight-dark">${item.title}</h3>
            <p class="text-highlight dark:text-highlight-dark">${item.description}</p>
          </div>
        </a>
      `).join('')}
    </div>
  `;
}
