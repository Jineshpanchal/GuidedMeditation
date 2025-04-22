# Brahma Kumaris Guided Meditation Portal

A progressive web application built with Next.js for Brahma Kumaris, providing immersive guided audio meditations. The application features age-specific content, various meditation categories, and a mobile-first design with calming pastel gradients.

## Features

- **Age-Based Meditation Selection**: Content tailored to different age groups (12-24, 25-35, 36-50, 50+)
- **Category Exploration**: Browse meditations by spiritual categories
- **Audio Player**: Custom built player with play/pause, seeking, and speed controls
- **Mobile-First Design**: Responsive UI that works great on all devices
- **Spiritual Pastel Gradient UI**: Calming and immersive user experience
- **SEO Friendly**: Static generation with dynamic paths for better SEO
- **Explore Page**: Advanced filtering and search capabilities

## Tech Stack

- **Frontend**: Next.js, React.js
- **Styling**: Tailwind CSS
- **API**: Strapi CMS backend
- **Data Fetching**: Axios for API requests
- **Deployment**: Static site generation with incremental regeneration

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd rajyog-meditation-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
rajyog-meditation-app/
├── components/          # Reusable UI components
│   ├── layout/          # Layout components like Header, Footer
│   ├── meditation/      # Meditation-specific components
│   └── ui/              # General UI components
├── lib/                 # Utility functions and API services
│   └── api/             # API service for Strapi
├── pages/               # Application pages
│   ├── rajyog-meditation/             # Main application route
│   ├── rajyog-meditation/[ageGroup]/  # Age group pages
│   ├── rajyog-meditation/[ageGroup]/[category]/ # Category pages
│   ├── rajyog-meditation/[meditationSlug]/ # Individual meditation pages
│   └── rajyog-meditation/explore/     # Explore/filter page
├── public/              # Static assets
├── styles/              # Global styles
└── tailwind.config.js   # Tailwind configuration
```

## Deployment

The application is built using Next.js static site generation with incremental static regeneration, allowing for easy deployment to various hosting platforms.

```bash
# Build for production
npm run build

# Start production server
npm start
```

## License

This project is proprietary software developed for Brahma Kumaris.

## Acknowledgements

- Brahma Kumaris for their spiritual content and guidance
- Strapi for providing the headless CMS backend
- Next.js team for the amazing React framework

---

Created with ❤️ for Brahma Kumaris 