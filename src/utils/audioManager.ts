/**
 * Audio Manager using Howler.js for handling sound effects
 */
import { Howl } from 'howler';

// Define sound types
type SoundType = 'windowOpen' | 'windowClose' | 'profileClick' | 'glitch';

// Sound library - we'll initialize this after user interaction
let sounds: Record<SoundType, Howl> | null = null;
let audioInitialized = false;

// Audio file paths
const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
const AUDIO_PATHS = {
  windowOpen: `${base}audio/click.mp3`,
  windowClose: `${base}audio/close.mp3`,
  profileClick: `${base}audio/ahoy.mp3`,
  glitch: `${base}audio/glitch.mp3`
};

/**
 * Initialize the sound library
 */
function initSounds(): void {
  if (audioInitialized) return; // Already initialized

  // Create sounds only after user interaction
  sounds = {
    windowOpen: new Howl({
      src: [AUDIO_PATHS.windowOpen],
      volume: 0.3,
      preload: false // Don't preload until needed
    }),
    windowClose: new Howl({
      src: [AUDIO_PATHS.windowClose],
      volume: 0.3,
      preload: false // Don't preload until needed
    }),
    profileClick: new Howl({
      src: [AUDIO_PATHS.profileClick],
      volume: 0.3,
      preload: false // Don't preload until needed
    }),
    glitch: new Howl({
      src: [AUDIO_PATHS.glitch],
      volume: 0.3,
      preload: false // Don't preload until needed
    })
  };

  audioInitialized = true;
}

/**
 * Play a sound
 * @param sound The sound to play
 */
export function playSound(sound: SoundType): void {
  // Only try to play if we've had user interaction
  if (!audioInitialized) {
    console.warn('Audio not initialized yet - waiting for user interaction');
    return;
  }

  // Play the sound
  if (sounds && sounds[sound]) {
    // Load and play
    sounds[sound].load();
    sounds[sound].play();
  }
}

/**
 * Set up event listeners for audio interactions
 */
export function setupAudioListeners(): void {
  // First user interaction will initialize sounds
  const handleUserInteraction = (event: MouseEvent | KeyboardEvent) => {
    // Only initialize on actual user events, not synthetic ones
    if (event.isTrusted) {
      initSounds();
      // Remove the event listeners after initialization
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      console.log('Audio system initialized after user interaction');
    }
  };

  // Initialize sounds on first user interaction
  document.addEventListener('click', handleUserInteraction);
  document.addEventListener('keydown', handleUserInteraction);

  // Listen for clicks on the profile image
  document.addEventListener('click', (event) => {
    if (!event.isTrusted) return; // Only respond to real user events

    const target = event.target as HTMLElement;

    // Check if the clicked element is the profile image
    if (target && target.id === 'profile-image') {
      playSound('profileClick');

      // Add animation class
      target.classList.add('profile-click');
      setTimeout(() => {
        target.classList.remove('profile-click');
      }, 300);
    }
  });
}

/**
 * Initialize all audio-related functionality
 */
export function initAudio(): void {
  // Don't create any audio contexts yet
  // Just set up the event listeners to initialize on first interaction

  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAudioListeners);
  } else {
    // DOM already loaded, setup immediately
    setupAudioListeners();
  }

  console.log('Audio manager ready - waiting for user interaction');
}
