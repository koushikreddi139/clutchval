# Clutch Vault Project Documentation

_Last updated: April 27, 2025_

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Core Technologies](#core-technologies)
4. [Authentication & User Management](#authentication--user-management)
5. [Supabase Integration](#supabase-integration)
6. [Key Features & Pages](#key-features--pages)
7. [Reusable Components](#reusable-components)
8. [Context & State Management](#context--state-management)
9. [Utilities & Hooks](#utilities--hooks)
10. [Styling](#styling)
11. [How to Add New Features](#how-to-add-new-features)
12. [Development & Deployment](#development--deployment)
13. [Additional Documentation](#additional-documentation)

---

## 1. Project Overview
Clutch Vault is a Next.js-based web application for managing and participating in gaming tournaments, with features for user authentication, friend management, notifications, and real-time data powered by Supabase.

## 2. Project Structure
```
app/           # Main Next.js app directory (routes, pages, layouts)
components/    # Reusable React components (UI, layout, dashboard, etc.)
context/       # React context providers (e.g., notifications)
documentation/ # Project documentation (this file, SQL, Supabase setup)
hooks/         # Custom React hooks
lib/           # Supabase client, query utilities, and shared logic
pages/         # Next.js legacy pages (e.g., _app.tsx, registerTournament)
public/        # Static assets (images, logos, etc.)
styles/        # Global and component-level CSS
utils/         # Utility functions (e.g., auth helpers)
```

## 3. Core Technologies
- **Next.js** (App Router)
- **React** (with hooks and context)
- **Supabase** (database, auth, real-time)
- **TypeScript** (type safety)
- **Tailwind CSS** (utility-first styling)
- **Lucide React** (icons)

## 4. Authentication & User Management
- Uses Supabase Auth for sign up, login, and password reset.
- User sessions are managed via Supabase and checked in protected pages.
- Profile data is stored in the `profiles` table in Supabase.

## 5. Supabase Integration
- All data (users, tournaments, friends, messages, notifications) is stored in Supabase tables.
- `lib/supabaseClient.ts` initializes the Supabase client.
- `lib/supabaseQueries.ts` provides generic and specific query helpers (CRUD, flexible queryTable, etc.).
- Real-time updates and authentication are handled via Supabase APIs.

## 6. Key Features & Pages
- **Authentication:** `/login`, `/signup`, `/forgot-password`
- **Profile:** `/profile` (view/edit user info)
- **Friends:** `/friends`, `/friends/add` (manage, add, accept, reject friends)
- **Inbox:** `/inbox` (view/delete messages)
- **Tournaments:** `/tournaments`, `/tournaments/[id]`, `/join-tournament`, `/registerTournament` (browse, join, register, payment)
- **Static Info:** `/about`, `/privacy`, `/terms`, `/rules`

## 7. Reusable Components
- **UI Components:** Located in `components/ui/` (buttons, dialogs, forms, tabs, etc.)
- **Layout Components:** `Navbar`, `Footer`, `Dashboard`, `ThemeProvider`
- **Custom Components:** For tournament cards, friend lists, notifications, etc.

## 8. Context & State Management
- **NotificationContext:** (`context/NotificationContext.tsx`) provides global notification state and helpers.
- **React State/Hooks:** Used throughout for local UI state.

## 9. Utilities & Hooks
- **lib/supabaseQueries.ts:** Generic and table-specific query helpers (CRUD, queryTable, etc.)
- **utils/auth.ts:** Auth helpers (login checks, redirects)
- **hooks/use-toast.ts:** Toast notification hook
- **hooks/use-mobile.tsx:** Mobile detection hook

## 10. Styling
- **Tailwind CSS:** Main styling framework (see `tailwind.config.ts`)
- **Custom CSS:** In `styles/globals.css` and component styles

## 11. How to Add New Features
- Add new pages in `app/` or `pages/`.
- Use or extend `lib/supabaseQueries.ts` for all data access.
- Add new components in `components/` and UI elements in `components/ui/`.
- Use NotificationContext for global notifications.
- Follow the existing folder and file naming conventions.

## 12. Development & Deployment
- **Install dependencies:** `pnpm install`
- **Run locally:** `pnpm dev`
- **Build for production:** `pnpm build`
- **Supabase setup:** See `documentation/supabase.txt` and `documentation/sql.txt` for schema and setup.
- **Environment variables:** Configure Supabase keys in `.env.local`.

## 13. Additional Documentation
- **SQL Schema:** See `documentation/sql.txt`
- **Supabase Setup:** See `documentation/supabase.txt`
- **Component Usage:** See comments in `components/` and `components/ui/`
- **API Reference:** See `lib/supabaseQueries.ts` for all available query helpers.

---

For further details, see the code comments and the documentation folder. For questions or contributions, contact the project maintainer.
