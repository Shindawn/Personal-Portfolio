# Portfolio Website

A modern, interactive portfolio website built with React, TypeScript, and Vite. Features a responsive design, dark mode support, animated UI components, and an interactive chatbot powered by Gemini AI.

## ✨ Features

- **Responsive Design** - Mobile-first approach with tailored breakpoints
- **Dark Mode** - System-wide dark theme support with theme toggle
- **Animated UI** - Smooth animations using Framer Motion
- **Interactive CV Viewer** - PDF resume viewer with clickable links
- **Typing Effect** - Dynamic role display with typing animation
- **Chatbot** - AI-powered chat interface using Gemini API
- **Project Showcase** - Display of projects with descriptions and links
- **Certifications** - Organized certification gallery
- **Gallery** - Image gallery for creative work
- **Graphic Designs** - Showcase of graphic design portfolio
- **Presentations** - Presentation viewer and manager

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **PDF Handling**: react-pdf
- **Icons**: lucide-react
- **Backend Services**: Supabase
- **AI**: Google Gemini API
- **Hosting**: Vercel
- **Testing**: Vitest

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- Bun (or npm/yarn as alternative)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Portfolio-main
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Create environment variables**
   Create a `.env.local` file in the root directory:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🚀 Running the Project

### Development
```bash
bun dev
```

### Build
```bash
bun run build
```

### Preview Build
```bash
bun run preview
```

### Testing
```bash
bun run test
```

## 📁 Project Structure

```
Portfolio-main/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Hero.tsx      # Hero section with CV viewer
│   │   ├── Chatbot.tsx   # AI chatbot component
│   │   └── ...           # Other components
│   ├── pages/            # Page components
│   ├── app/
│   │   └── api/          # API routes
│   │       └── chat/     # Chat API endpoint
│   ├── services/         # External service integrations
│   │   └── geminiService.ts
│   ├── lib/              # Utility functions
│   │   └── supabase/     # Supabase configuration
│   ├── data/             # Static data
│   ├── hooks/            # Custom React hooks
│   ├── assets/           # Images and media
│   └── main.tsx          # Entry point
├── public/               # Static files
│   ├── resumes/         # Resume/CV files
│   ├── gallery/         # Gallery images
│   ├── graphic-designs/ # Graphic design samples
│   └── presentations/   # Presentation files
├── supabase/            # Supabase functions
│   └── functions/
│       └── chat/        # Chat function
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind configuration
└── package.json         # Dependencies
```

## 🎨 Key Components

- **Hero** - Landing section with profile image, CV viewer, and contact buttons
- **About** - About me section
- **TechStack** - Technology skills display
- **Projects** - Project portfolio showcase
- **Experience** - Work experience timeline
- **Certifications** - Professional certifications
- **Gallery** - Creative work gallery
- **GraphicDesigns** - Graphic design portfolio
- **Chatbot** - AI-powered chat assistant
- **PresentationViewer** - Presentation display

## 🔧 Configuration

### Theme
The app defaults to dark mode and supports theme toggle. Theme preference is stored and persists across sessions.

### PDF Viewer
Resume PDFs are viewed with full interactivity including:
- Text selection
- Clickable links and URLs
- Multi-page navigation

### Responsive Design
The layout adapts to different screen sizes:
- Mobile: `< 640px`
- Tablet: `640px - 1024px`
- Desktop: `> 1024px`

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI chatbot |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |

## 🚢 Deployment

This project is configured for deployment on Vercel. Configuration is in `vercel.json`.

### Deploy on Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Manual Build & Deploy
```bash
bun run build
# Deploy the dist/ directory
```

## 📄 License

This project is personal portfolio content. Feel free to use it as a template but replace content with your own.

## 🤝 Contact

- Email: caadlawony@gmail.com
- Location: Bagamanoc, Catanduanes, Philippines

---

Built using React, TypeScript, and Vite
