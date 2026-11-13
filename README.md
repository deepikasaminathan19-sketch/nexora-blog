
# NEXORA — Explore. Learn. Innovate.

NEXORA is a modern technology blog platform built using the MERN stack. It provides a clean reading experience for users and a secure admin dashboard for managing articles, categories, authors, and comments.

## Live Demo

- **Website:** https://nexora-blog-nine.vercel.app/
- **Admin Login:** https://nexora-blog-nine.vercel.app/admin/login
- **GitHub Repository:** https://github.com/deepikasaminathan19-sketch/nexora-blog

## Tech Stack

### Frontend
- React.js
- Vite
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- Mongoose

### Database & Services
- MongoDB Atlas
- Cloudinary

### Deployment
- Vercel (Frontend)
- Render (Backend)

## Key Features

- Modern and responsive blog interface
- Browse and search technology articles
- Explore articles by category
- Individual article pages
- Reading time estimation
- Popular and related articles
- Helpful article feedback
- Comment submission and admin approval
- Secure admin authentication
- Admin dashboard for content management
- Create, edit, publish, and delete blog posts
- Manage categories, tags, and authors
- Schedule articles for future publishing
- Image uploads using Cloudinary
- Newsletter subscription support
- SEO-friendly sitemap and robots.txt

## Project Structure

```text
nexora-blog/
├── client/       # React frontend
├── server/       # Express backend
├── README.md
└── .gitignore
```

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/deepikasaminathan19-sketch/nexora-blog.git
cd nexora-blog
```

### 2. Start the Backend

```bash
cd server
cp .env.example .env
npm install
```

Configure the required environment variables in `server/.env`.

```bash
npm run seed
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3. Start the Frontend

Open a new terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

Set `VITE_API_URL` in the frontend environment file to your backend API URL.

## Admin Dashboard

Access the admin login page:

`http://localhost:5173/admin/login`

Use the administrator credentials configured in the backend environment variables.

The admin dashboard supports:
- Article management
- Categories, tags, and authors
- Comment moderation
- Scheduled publishing
- Dashboard statistics

## Deployment

- **Frontend:** Deployed on Vercel.
- **Backend:** Deployed on Render.
- **Database:** MongoDB Atlas.
- **Image Storage:** Cloudinary.

The frontend communicates with the deployed backend through the configured `VITE_API_URL`.

## Security

- Passwords are protected using bcrypt hashing.
- Admin routes are secured using JWT authentication.
- Public APIs display published articles only.
- Comments require admin approval before appearing publicly.
- Environment files containing secrets are excluded from version control.

---

**NEXORA — Explore. Learn. Innovate.**
