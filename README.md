# 🚀 Portfolio Website CMS

A modern, full-featured portfolio website with an integrated Content Management System (CMS) built with React, TypeScript, and Supabase.

![Portfolio CMS](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)

---
- Portfolio Website: [Mahedi Hasan Emon](https://mahedihasanemon.site/)
## ✨ Features

### 🎨 Public Website
- **Hero Section** - Dynamic introduction with CTA buttons
- **About Page** - Bio, skills, education & experience
- **Portfolio** - Projects, publications & achievements showcase
- **Services** - List of professional services offered
- **Blog** - Article publishing with rich content
- **Contact** - Contact form with message management

### 🔐 Admin Panel
- **Secure Authentication** - Supabase Auth with session management
- **Dashboard** - Overview stats and quick actions
- **CMS Editor** - Edit all website content in real-time
- **Media Library** - Upload, manage & organize files
- **Resume Manager** - Upload PDFs and set active resume
- **Contact Messages** - View and manage inquiries

### 🗄️ Backend (Supabase)
- **PostgreSQL Database** - 17 tables with RLS policies
- **File Storage** - 4 buckets (images, documents, resumes, gallery)
- **Row Level Security** - Protected data access
- **Real-time Updates** - Live data synchronization

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, Vite 5 |
| **Styling** | Tailwind CSS 3, Custom Components |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **Routing** | React Router DOM v6 |
| **Icons** | Lucide React |
| **Validation** | Zod |
| **Build** | Vite with code splitting |

---

## 📁 Project Structure

```
src/
├── admin/                 # Admin panel
│   ├── cms/              # CMS schema definitions
│   ├── components/       # Admin UI components
│   └── pages/            # Admin pages
├── app/                  # App configuration
│   ├── guards/           # Route protection
│   ├── layouts/          # Page layouts
│   └── providers/        # Context providers
├── components/           # Shared components
├── context/              # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   └── CmsContext.tsx    # CMS data management
├── hooks/                # Custom React hooks
├── lib/                  # External library configs
│   └── supabase.ts       # Supabase client
├── pages/                # Public pages
├── services/             # API services
│   ├── supabaseCms.ts    # Supabase CRUD operations
│   └── cmsRepository.ts  # Local data fallback
├── styles/               # Global styles
└── utils/                # Utility functions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio-website-saas-cms.git
   cd portfolio-website-saas-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL scripts in `supabase/` folder:
     - `schema.sql` - Creates database tables
     - `seed.sql` - Adds sample data
     - `storage-policies.sql` - Sets up storage buckets
   - Create an admin user in Supabase Auth

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

---

## 🗃️ Database Schema

### Core Tables
- `cms_hero` - Hero section content
- `cms_about` - About page content
- `cms_contact` - Contact information
- `cms_resume_settings` - Active resume configuration

### Collection Tables
- `education` - Educational background
- `skills` - Technical skills
- `experience` - Work experience
- `projects` - Portfolio projects
- `publications` - Research publications
- `certifications` - Professional certifications
- `achievements` - Awards and achievements
- `services` - Services offered
- `blogs` - Blog posts
- `testimonials` - Client testimonials
- `clients` - Client logos and info
- `resumes` - Resume files
- `contact_messages` - Contact form submissions
- `tech_stack_categories` - Technology categories

### Storage Buckets
- `images` - Profile photos, covers, logos
- `documents` - PDFs, certificates
- `resumes` - Resume files
- `gallery` - Project gallery images

---

## 🎯 Admin Access

Navigate to `/admin/login` and sign in with your Supabase Auth credentials.

**Admin Features:**
- Edit all website content
- Upload and manage media files
- Set active resume for download
- View and respond to contact messages
- Manage blog posts

---

## 🏗️ Build & Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` folder with optimized chunks:
- `vendor-react` - React libraries
- `vendor-supabase` - Supabase client
- `vendor-ui` - UI libraries (Lucide, Zod)
- `index` - Application code

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

> **Note:** Remember to set environment variables in your deployment platform.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
This project uses [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

---



## 👨‍💻 Author

**Mahedi Hasan Emon**

- GitHub: [@mahedi-emon](https://github.com/mahedi-emon)
- LinkedIn: [Mahedi Hasan Emon](https://www.linkedin.com/in/mahediemon/)
- Portfolio: [Website](https://mahedihasanemon.site/)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI Library
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [Lucide](https://lucide.dev/) - Icon Library

---

<p align="center">
  Made with ❤️ using React & Supabase
</p>
