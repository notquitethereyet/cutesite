# Portfolio with Boid Fish Simulation - Astro Version

This is a portfolio website featuring a beautiful interactive boid fish simulation background, ported to the Astro framework.

## Features

- Interactive boid fish simulation background
- Responsive portfolio layout
- Tailwind CSS for styling
- Custom color theme based on Catppuccin Mocha
- Optimized for performance with Astro

## Project Structure

- `src/` - Contains all Astro components and pages
  - `layouts/` - Layout components
  - `pages/` - Page components
  - `styles/` - Global CSS styles
- `public/` - Static assets
  - `js/` - JavaScript files including the boid simulation
  - `css/` - CSS files

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Build for production:
   ```
   npm run build
   ```

## Porting Notes

This project was ported from a vanilla HTML/CSS/JS implementation to Astro. The main changes include:

1. Creating an Astro component structure
2. Moving static assets to the public directory
3. Adapting the JavaScript to work with Astro's component lifecycle
4. Maintaining the same visual design and interactive elements

## Technologies Used

- [Astro](https://astro.build/) - The web framework for content-driven websites
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Font Awesome](https://fontawesome.com/) - Icon library
- Vanilla JavaScript for the boid simulation
