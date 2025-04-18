# cutesite - Aesthetic Personal Website

![cutesite Screenshot](https://github.com/notquitethereyet/cutesite/raw/main/public/images/screenshot.png)

cutesite is a charming, interactive personal website with a nostalgic desktop interface fueled by my love for 花見 (Hanami, "flower viewing"). Built with Astro and TailwindCSS, it features a playful design with cherry blossom animations, customizable themes, and interactive windows.

## ✨ Features

- **Desktop Interface**: Navigate through a cute desktop environment with clickable icons and draggable windows
- **Aesthetic Design**: Enjoy a pastel color scheme with sakura (cherry blossom) theme
- **Dark/Light Mode**: Toggle between light and dark themes with persistent preferences
- **Interactive Elements**: Experience delightful animations and sound effects
- **Responsive Design**: Works beautifully on both desktop and mobile devices (i think)
- **Optimized Assets**: WebP images and WebM videos for fast loading times

## 🌸 Themes and Customization

cutesite comes with multiple themes and decorative elements:

- **Light Mode**: Soft pastel pink and peach colors with sakura decorations
- **Dark Mode**: Elegant dark blue-purple theme with subtle pink accents
- **Decorations**: Sakura and lily decorations

## 🎮 Interactive Features

- **Window System**: Open, close, and drag windows around the desktop
- **Sound Effects**: Gentle audio feedback for interactions (all set at 30% volume)
- **Cherry Blossom Animation**: Falling petals create a serene atmosphere
- **Oneko Cat**: A cute cat cursor follows your mouse movements

## 🚀 Project Structure

```text
/
├── public/               # Static assets (images, icons, sounds)
│   ├── images/           # Website images and decorations
│   │   ├── icons/        # SVG icons for desktop elements
│   │   └── ...           # Other image assets
│   └── audio/            # Sound effect files
├── src/
│   ├── components/       # UI components (Desktop, Window, etc.)
│   ├── layouts/          # Page layouts
│   ├── pages/            # Astro pages
│   ├── styles/           # CSS styles
│   └── utils/            # Utility functions and managers
│       ├── audioManager.ts    # Sound effect handling
│       ├── iconManager.ts     # Desktop icon management
│       ├── themeManager.ts    # Theme and decoration control
│       ├── windowManager.ts   # Window system management
│       └── ...                # Other utilities
└── package.json         # Project dependencies
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 🔧 Technologies

- **[Astro](https://astro.build/)**: Fast, modern static site generator
- **[TailwindCSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript
- **[Howler.js](https://howlerjs.com/)**: Audio library for sound effects

## 🚀 Deployment

The site is configured for easy deployment to GitHub Pages using GitHub Actions. Simply push to the main branch, and the site will be automatically built and deployed.

## 🎨 Customization

You can easily customize the site by modifying:

- **`src/utils/siteConfig.ts`**: Update personal information and social links
- **`src/styles/global.css`**: Adjust color schemes and visual styles
- **`public/images/`**: Replace images with your own assets

## 📝 License

This project is licensed under the "do whatever you want" license.

---

Created with 💖 by [quiet](https://github.com/notquitethereyet)
