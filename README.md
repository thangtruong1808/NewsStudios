# NewsStudios - Modern News & Media Management Platform

A full-featured news and media management platform built with Next.js 14, featuring a modern front-end for readers and a comprehensive admin dashboard for content management.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Author](#author)

## 🎯 Overview

NewsStudios is a comprehensive news and media management platform that provides:

- **Front-end**: A modern, responsive news website with article browsing, search, categories, tags, and user engagement features
- **Dashboard**: A powerful admin panel for managing articles, users, categories, tags, media, and analytics
- **User Features**: Authentication, comments, likes, and personalized content discovery
- **Content Management**: Full CRUD operations for articles, categories, subcategories, tags, authors, users, photos, and videos

## ✨ Features

### Front-End Features

- **Home Page**
  - Video carousel with auto-play and manual navigation
  - Featured articles grid (5-column layout)
  - Highlight articles section
  - Trending articles with likes and comments counts
  - Related articles recommendations
  - Tags browsing section
  - Scroll-to-top/bottom buttons

- **Article Pages**
  - Rich article content with images and videos
  - Article metadata (author, date, category, subcategory)
  - Tag display with enhanced styling
  - Comments system (authenticated users only)
  - Likes system (authenticated users only)
  - Real-time comment and like count updates
  - Related articles suggestions

- **Explore & Discovery**
  - Category and subcategory filtering
  - Tag-based article browsing
  - Advanced search with drawer interface
  - Search by article title
  - Filter by categories and subcategories (checkboxes)
  - Dedicated search results page with pagination
  - Active category/subcategory highlighting in navbar

- **Navigation & UI**
  - Responsive navbar with desktop and mobile menus
  - Category and subcategory icons (Lucide React)
  - User profile dropdown with avatar
  - Search drawer (left-side overlay)
  - Modern footer with social media links
  - Consistent gradient backgrounds
  - Glassmorphism effects

- **User Features**
  - User authentication (login/signup)
  - Password reset functionality
  - User profile management
  - Avatar display with initials fallback
  - Role-based access control

### Dashboard Features

- **Dashboard Overview**
  - Real-time statistics (total likes, comments, articles, users)
  - Active/inactive user counts
  - Most liked article display
  - Trending articles with likes and comments
  - Category/subcategory article distribution chart
  - Recent activity feed
  - Modern, professional layout

- **Content Management**
  - Articles: Create, edit, delete with rich text editor
  - Categories: Full CRUD operations
  - Subcategories: Full CRUD operations with category association
  - Tags: Full CRUD operations with color coding
  - Authors: Author management
  - Photos: Photo gallery management with Cloudinary integration
  - Videos: Video management with Cloudinary integration

- **User Management**
  - User CRUD operations
  - Role management (admin, user, editor)
  - User status management (active/inactive)
  - User profile with avatar support

- **Advanced Features**
  - Pagination with First/Previous/Next/Last buttons
  - Search functionality across all entities
  - Sorting capabilities
  - Bulk operations
  - Image and video uploads via Cloudinary
  - Table name resolution for production compatibility

## 🛠 Tech Stack

### Core Framework
- **Next.js 14.1.0** - React framework with App Router
- **React 18.2.0** - UI library
- **TypeScript** - Type safety

### Database & Backend
- **MySQL2** - Database driver
- **NextAuth.js 4.24.5** - Authentication
- **bcryptjs** - Password hashing

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Unstyled UI components
- **Heroicons** - Icon library
- **Lucide React** - Additional icons
- **React Icons** - Social media icons
- **Framer Motion** - Animation library

### Media Management
- **Cloudinary** - Image and video hosting
- **next-cloudinary** - Cloudinary integration for Next.js

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### Data Visualization
- **Chart.js** - Charts and graphs

### Utilities
- **date-fns** - Date formatting
- **use-debounce** - Debounce hooks
- **react-hot-toast** - Toast notifications
- **clsx** - Conditional class names
- **tailwind-merge** - Tailwind class merging

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun**
- **MySQL** 8.0 or higher
- **Cloudinary account** (for media uploads)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NewsStudios
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables) section)

4. **Set up the database** (see [Database Setup](#database-setup) section)

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Database Configuration
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
DB_PORT=3306
```

### NextAuth Configuration
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
```

### Cloudinary Configuration
```env
# Public variables (client-side)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Server-side variables
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Application Configuration
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Generating NEXTAUTH_SECRET

You can generate a secure secret using:
```bash
openssl rand -base64 32
```

## 🗄 Database Setup

### Option 1: Using Setup Script (Recommended)

Run the database setup script:
```bash
npm run setup-db
# or
ts-node app/lib/db/setup-database.ts
```

This script will:
- Create the database if it doesn't exist
- Create all necessary tables
- Set up indexes and foreign keys
- Configure relationships

### Option 2: Manual Setup

1. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS newsstudios_db;
   ```

2. Use the database:
   ```sql
   USE newsstudios_db;
   ```

3. Run the SQL schema from `app/lib/db/db-schema.txt`

### Database Schema Overview

The database includes the following main tables:
- **Users** - User accounts and authentication
- **Categories** - Article categories
- **SubCategories** - Subcategories linked to categories
- **Articles** - News articles and content
- **Tags** - Article tags with color coding
- **Article_Tags** - Many-to-many relationship
- **Authors** - Article authors
- **Comments** - User comments on articles
- **Likes** - User likes on articles
- **Images** - Image metadata
- **Videos** - Video metadata

## 🏃 Running the Project

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## 📁 Project Structure

```
NewsStudios/
├── app/
│   ├── (main)/              # Main site routes
│   │   ├── layout.tsx       # Main layout with navbar and footer
│   │   └── page.tsx         # Home page
│   ├── articles/            # Article pages
│   │   ├── [id]/            # Individual article pages
│   │   └── tag/[id]/        # Tag-based article listings
│   ├── dashboard/           # Admin dashboard
│   │   ├── articles/        # Article management
│   │   ├── categories/      # Category management
│   │   ├── subcategories/   # Subcategory management
│   │   ├── tags/            # Tag management
│   │   ├── users/            # User management
│   │   ├── author/           # Author management
│   │   ├── photos/           # Photo management
│   │   ├── videos/           # Video management
│   │   └── page.tsx          # Dashboard overview
│   ├── explore/              # Explore page with filters
│   ├── search/               # Search results page
│   ├── login/                # Authentication pages
│   ├── signup/               # User registration
│   ├── api/                  # API routes
│   │   └── auth/             # NextAuth API routes
│   ├── components/
│   │   ├── dashboard/       # Dashboard components
│   │   └── front-end/        # Front-end components
│   ├── lib/
│   │   ├── actions/          # Server actions
│   │   ├── db/               # Database utilities
│   │   ├── utils/            # Utility functions
│   │   └── validations/      # Zod schemas
│   └── layout.tsx            # Root layout
├── public/                   # Static assets
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 🎨 Key Features

### Authentication System
- Secure login/signup with password hashing
- Session management with NextAuth.js
- Role-based access control (admin, user, editor)
- Password reset functionality
- Protected routes

### Article Management
- Rich text editor for content creation
- Image and video uploads via Cloudinary
- Tag assignment with color coding
- Category and subcategory organization
- Featured article selection
- Draft/published status management

### User Engagement
- Comments system (authenticated users only)
- Likes system (authenticated users only)
- Real-time count updates
- User avatars with initials fallback

### Search & Discovery
- Full-text search by article title
- Category and subcategory filtering
- Tag-based browsing
- Advanced search drawer with multiple filters
- Pagination support

### Media Management
- Cloudinary integration for images and videos
- Image carousel with auto-slide
- Video carousel with modal playback
- Thumbnail generation
- Optimized image delivery

### Dashboard Analytics
- Real-time statistics
- User activity tracking
- Article performance metrics
- Category/subcategory distribution charts
- Trending content analysis

## 🚢 Deployment

### Deploying to Vercel

1. **Push your code to GitHub**

2. **Import project to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - Add all environment variables from your `.env.local` file
   - Ensure database credentials are correct for production

4. **Deploy**
   - Vercel will automatically build and deploy
   - The database connection uses lazy initialization to prevent build-time errors

### Important Notes for Deployment

- **Database Connection**: The app uses lazy database connection initialization to prevent build-time errors
- **Environment Variables**: Ensure all required variables are set in Vercel
- **Database Access**: Your production database must be accessible from Vercel's servers
- **Cloudinary**: Configure Cloudinary environment variables for media uploads

## 📜 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run setup-db` - Set up database schema
- `npm run seed-db` - Seed database with sample data
- `npm test` - Run tests

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Ensure components don't exceed 250 lines
- Remove all `console.log` statements
- Add concise comments with Description, Date created, and Author
- Follow the existing code structure and patterns

## 👤 Author

**thangtruong**

- Project started: 2025-June-10
- Last updated: 2025-Nov-19

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment platform
- Cloudinary for media management services
- All open-source contributors whose libraries made this project possible

---

**Note**: This is a private project. For questions or support, please contact the project maintainer.
