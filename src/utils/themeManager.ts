// themeManager.ts
// Centralizes theme and decoration logic for sakura/lily, backgrounds, and dark mode

export type ThemeMode = 'light' | 'dark';
export type ThemeBackground = 'default' | 'lain';
export type ThemeDecoration = 'sakura' | 'lily';

export interface ThemeOptions {
  mode?: ThemeMode;
  background?: ThemeBackground;
  decoration?: ThemeDecoration;
}

export function setTheme({ mode, background, decoration }: ThemeOptions) {
  // Mode (dark/light)
  if (mode) {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }
  // Background
  if (background) {
    setBackground(background);
  }
  // Decoration
  if (decoration) {
    setDecoration(decoration);
  }
}

export function setDecoration(type: ThemeDecoration) {
  const sakura = document.querySelector('.sakura-decoration');
  const lily = document.querySelector('.lily-decoration');
  if (type === 'lily') {
    sakura?.classList.add('hidden');
    lily?.classList.remove('hidden');
  } else {
    sakura?.classList.remove('hidden');
    lily?.classList.add('hidden');
  }
}

export function setBackground(type: ThemeBackground) {
  const body = document.body;
  const lainVideo = document.getElementById('lain-bg-video') as HTMLVideoElement | null;
  if (type === 'lain') {
    body.classList.add('lain-background');
    if (lainVideo) {
      lainVideo.classList.remove('hidden');
      lainVideo.play();
    }
  } else {
    body.classList.remove('lain-background');
    if (lainVideo) {
      lainVideo.classList.add('hidden');
      lainVideo.pause();
      lainVideo.currentTime = 0;
    }
  }
}
