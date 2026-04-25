# HIRAETH - The Internal Archive

A sophisticated, editorial-style personal journal for capturing memory fragments in text, audio, video, and image formats.

## Features

- **Sophisticated Dark Aesthetic**: A curated design with a muted, high-end editorial feel.
- **Multi-modal Entries**: Capture "Narratives" (text), "Voice Memoirs" (audio), "Video Fragments", and "Image Memories".
- **Secure Access**: Protected by an archive identity key (customizable in settings).
- **Chronology**: A detailed timeline of your memory fragments.
- **Editorial Layout**: Beautiful two-column display of fragments, mimicking a premium gallery or blog.
- **Dynamic Quotes**: Inspiritional quotes that change with every refresh.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hiraeth.git
   cd hiraeth
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### GitHub Pages

1. In your `vite.config.ts`, you may need to set the `base` property to your repository name:
   ```ts
   export default defineConfig({
     base: '/hiraeth/', // Change to your repo name
     // ... rest of config
   })
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy the `dist` folder to GitHub Pages. You can use the `gh-pages` package or a GitHub Action.

## Security Note

This is a local-first application. All data (journal entries and the access key) is stored in your browser's `localStorage`. This ensures privacy but means your data won't sync across different browsers or devices automatically.

## License

MIT
