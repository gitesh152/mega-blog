# Mega Blog

Mega Blog is a React + TypeScript blogging app powered by Appwrite. It includes authentication, protected routes, post creation and editing, image uploads, a rich text editor, and a persisted light/dark theme.

## Features

- Email/password signup and login with Appwrite authentication
- Protected routes for creating, editing, and viewing a user's own posts
- Public-style home feed for authenticated users showing active community posts
- Rich text post editor using TinyMCE
- Featured image upload and storage with Appwrite Storage
- Post data stored in Appwrite TablesDB
- Redux Toolkit state management for auth and theme
- Responsive UI built with Tailwind CSS v4
- Theme preference saved in local storage

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router 7
- Redux Toolkit + React Redux
- React Hook Form
- Tailwind CSS v4
- Appwrite
- TinyMCE
- html-react-parser

## App Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public shell, personalized content after login | Home page |
| `/login` | Guest only | Login form |
| `/signup` | Guest only | Signup form |
| `/all-posts` | Auth required | Logged-in user's active posts |
| `/add-post` | Auth required | Create a new post |
| `/edit-post/:slug` | Auth required | Edit an existing post |
| `/post/:slug` | Public route | View a single post |

## Project Structure

```text
src/
  app/
    components/      Reusable UI and form components
    features/        Redux slices for auth and theme
    pages/           Route-level pages
    App.tsx          Root layout and auth bootstrap
    store.ts         Redux store setup
  appwrite/
    auth.service.ts  Authentication wrapper
    storage.service.ts Data and file storage wrapper
  conf/
    conf.ts          Environment variable mapping
  types/
    auth.ts          Auth-related types
    post.ts          Post-related types
```

## Environment Variables

Copy `.env.sample` to `.env` and fill in your Appwrite and TinyMCE values.

```env
VITE_APPWRITE_PROJECT_ID=""
VITE_APPWRITE_PROJECT_NAME=""
VITE_APPWRITE_ENDPOINT=""
VITE_APPWRITE_DATABASE_ID=""
VITE_APPWRITE_COLLECTION_ID=""
VITE_APPWRITE_BUCKET_ID=""
VITE_TINYMCE_API_KEY=""
API_KEY_SECRET=""
```

### What each variable is used for

- `VITE_APPWRITE_PROJECT_ID`: Appwrite project ID
- `VITE_APPWRITE_PROJECT_NAME`: Project name reference
- `VITE_APPWRITE_ENDPOINT`: Appwrite API endpoint
- `VITE_APPWRITE_DATABASE_ID`: Database containing blog data
- `VITE_APPWRITE_COLLECTION_ID`: TablesDB table ID used for posts
- `VITE_APPWRITE_BUCKET_ID`: Storage bucket for featured images
- `VITE_TINYMCE_API_KEY`: TinyMCE editor API key
- `API_KEY_SECRET`: Present in the sample file, but not currently used by the frontend app

## Appwrite Setup Notes

The app expects:

- An Appwrite project with Auth enabled for email/password login
- A database and table for blog posts
- A storage bucket for post images
- Appropriate permissions so authenticated users can read posts and manage their own content/files

### Post fields expected by the app

- `title`
- `content`
- `featuredImage`
- `status`
- `userId`

The app uses the generated slug as the row ID when creating posts.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file from `.env.sample` and add your real credentials.

### 3. Start the development server

```bash
npm run dev
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## How the App Works

- On app load, the app checks Appwrite for the current user and restores auth state in Redux.
- Authenticated users can create posts with a slug, rich text content, status, and featured image.
- Uploaded images are stored in Appwrite Storage.
- Posts are created, listed, updated, and deleted through the Appwrite service layer.
- Post content is rendered on the single-post page from stored rich text HTML.
- Theme mode is stored in local storage and applied to the document root.

## Notes

- The current README documents the project as it exists in this repository, not the default Vite starter template.
- The repository includes a `dist/` folder, which appears to contain a production build output.
