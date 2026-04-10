# GLAMORA — Luxury E-Commerce Platform

A high-performance, full-stack luxury e-commerce application built with **React 18** and **Supabase**, designed for a premium shopping experience with security and scalability at its core.

🔗 **Links:**
- **Live Demo:** [https://glamora-store.vercel.app/]

---

## 📋 Table of Contents
1. [Overview](#-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Security Decisions](#-security-decisions)
5. [Architecture Decisions](#-architecture-decisions)
6. [Project Structure](#-project-structure)
7. [Database Schema](#-database-schema)
8. [Setup & Installation](#-setup--installation)
9. [Deployment](#-deployment)
10. [What's Next](#-whats-next)
11. [Author](#-author)

---

## 🌟 Overview
Glamora is a full-stack e-commerce application for luxury goods, built with React 18 and Supabase. The platform manages product listings, user authentication, and persistent shopping carts through a centralized Redux state. It features secure order creation via PostgreSQL RPC, cross-device synchronization, a personalized wishlist, and a mobile-first responsive UI.

---

## ✨ Features
- 🛍️ **Curated Product Catalog** - Paginated browsing of luxury goods with server-side category filtering.
- 🔍 **Real-time Server Search** - Sanitized search implementation using Postgres `ilike` for efficient large-scale discovery.
- 🛒 **Advanced Persistent Cart** - Cross-device cart synchronization with a dual-sync strategy (Local + Cloud).
- 👤 **Premium Auth & Profiles** - Secure JWT-based authentication with automatic profile management and session persistence.
- 💳 **Secure Checkout Flow** - Multi-step checkout with complex form validation via React Hook Form and Yup.
- 📦 **Order Management** - Complete order history tracking with secure, backend-calculated transactional records.
- **💖 Personalized Wishlist** - Seamlessly save and manage favorite items for future consideration with one-click cart migration.
- 📱 **Mobile-First UX** - Fully responsive, pixel-perfect UI styled with Tailwind CSS and advanced CSS animations.

---

## 🛠️ Tech Stack

| Domain | Technologies |
|--------|--------------|
| **Frontend** | React 18.2, React Router Dom 6.26 |
| **Backend** | Supabase (PostgreSQL, Auth, RLS, RPC) |
| **State** | Redux Toolkit 2.11, RTK Query |
| **Styling** | Tailwind CSS 3.4, Custom Animations |
| **Forms** | React Hook Form 7.69, Yup 1.7 |

---

## 🛡️ Security Decisions

### Secure Transactional Logic (Postgres RPC)
To prevent frontend-based price manipulation, order creation is handled exclusively via a **Supabase RPC function** (`create_secure_order`). This function fetches the current price directly from the database and calculates the total server-side, ensuring that the "trust" remains in the backend.

### Database-Level Security (RLS)
Security is implemented as a first-class citizen using **Row Level Security (RLS)**. Policies are enforced at the PostgreSQL level for `orders`, `profiles`, and `cart_items` tables, ensuring that a user can never access or modify data that does not belong to them, even if frontend guards are bypassed.

### Identity Integrity & Sanitization
- **Session-First Auth**: Derived exclusively via the authenticated Supabase session (`supabase.auth.getUser()`) to prevent identity spoofing and client-side credential tampering.
- **Advanced XSS Mitigation**: Enforces strict URL encoding and input length limits on all search-integrated fields, protecting the application from common injection vectors.
- **Production Error Masking**: Custom **Error Boundaries** intercept system exceptions and suppress sensitive stack traces in production to prevent technical information leakage.
- **Stateful Auth Persistence**: Advanced `ProtectedRoute` logic implements location state-tracking to provide a secure and seamless redirect-back flow after successful authentication.

---

## 🏗️ Architecture Decisions

### Dual-Sync Persistence Strategy
A custom **Redux Middleware** (`cartPersistenceMiddleware`) handles a complex synchronization flow. It provides an immediate "optimistic" backup to `localStorage` for zero-latency performance while concurrently syncing with the **Supabase** cloud database for a consistent cross-device experience.

### Shared Logic via Custom Hooks
To keep the UI components "thin" and focused on presentation, all core business logic—such as cart operations (`useCartActions`) and user feedback (`useToast`)—is abstracted into a reusable hook layer, ensuring high maintainability and code reuse.

### RTK Query for Data Caching
Uses **RTK Query** (`productsApi`) for all catalog-related data fetching. This implementation provides automatic caching, smart re-fetching, and tag-based invalidation, significantly reducing network overhead and improving perceived performance.

---

## ⚡ Performance Optimizations

### Route-Based Code Splitting
Implemented using `React.lazy` and `Suspense` in `App.js`. This ensures that each page's bundle is only loaded when needed, drastically reducing the initial bundle size and improving the **First Contentful Paint (FCP)**.

### RTK Query Caching & Normalization
Centralized in `productsApi.js`. By leveraging RTK Query's caching layer, the app prevents redundant API calls for previously fetched products, providing a near-instant navigation experience for returning screens.

### Server-Side Pagination & Range Limits
Implemented in `productsApi.js` via Supabase `.range(from, to)`. This technique minimizes the amount of data transferred per request, ensuring fast load times even as the product catalog grows to thousands of items.

### Optimized Request Debouncing
Handled via the custom `useDebounce` hook. This throttles server-side search suggestions and filter updates, ensuring that database queries are only triggered after the user stops typing, reducing unnecessary server load.

### Granular Render Optimization
Extensive use of `React.memo`, `useMemo`, and `useCallback` in high-frequency components (like `ProductCard` and `HomePage`). This prevents expensive re-render cascades in large product lists, maintaining a stable 60FPS even during intense interaction.

### Intelligent API Throttling
Leverages RTK Query's `skip` logic and dynamic query parameters to prevent redundant or premature API calls (e.g., suppressing search suggestions for single-character inputs).

### Perceived Performance via Skeleton Loaders
Utilizes the `LoadingSkeleton.jsx` component as a fallback for `React.Suspense` in `App.js`. This provides immediate visual feedback during route transitions, significantly reducing the "empty state" duration and improving the cumulative user experience.

---

## 📂 Project Structure

```text
glamora/
├── src/
│   ├── components/      # Reusable UI (Toast, Header, Modals, Skeleton)
│   ├── hooks/           # Business logic (useCartActions, useDebounce)
│   ├── pages/           # Route-level components (HomePage, Checkout, Profile)
│   ├── redux/
│   │   ├── slices/      # Feature states (auth, cart, orders, wishlist)
│   │   ├── middleware/  # Persistence and side-effect logic
│   │   └── store.js     # Global store configuration
│   ├── assets/          # Icons, images, and global styles
│   └── supabaseClient.js # Centralized backend configuration
├── public/              # Static assets and PWA manifest
└── package.json         # Dependency and script orchestration
```

---

## 📊 Database Schema (Normalized Design)

- **`products`** — Comprehensive catalog storage including metadata, pricing, and ratings.
- **`categories`** — Hierarchical classification system for efficient product discovery.
- **`profiles`** — Secure user identity metadata (address, contact) linked via Supabase Auth UUID.
- **`orders`** — **(Order Header)** Secure transaction records containing totals and shipping status.
- **`order_items`** — **(Line Items)** Granular records for each product in an order, separated for historical accuracy.
- **`cart_items`** — Persistent device-agnostic storage for real-time shopping cart synchronization.
- **`wishlist`** — Personalized storage for user-saved luxury items.

---

## 🚀 Local Setup & Installation

1. **Clone the repository**
   ```bash
   git clone your-github-url
   cd glamora
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Reference the [.env.example](.env.example) and add your keys:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Launch Application**
   ```bash
   npm start
   ```

5. **Configure Supabase Auth**
   Add your local and deployed URL to the Supabase Dashboard:
   Authentication → URL Configuration → Add Site URL
   (e.g., `http://localhost:3000` for local development)

---

## 🌍 Deployment
The application is optimized for deployment on **Vercel**. Ensure all environment variables are added to the Vercel dashboard prior to deployment.
```bash
npm run build
```

---

## 🔮 What's Next
- [ ] **Payment Integration** - Integrating Stripe/Razorpay for real transactions.
- [ ] **E2E Testing** - Adding Playwright for comprehensive checkout flow testing.
- [ ] **TypeScript Migration** - Strengthening type safety across the Redux ecosystem.

---

## 👤 Author
**[Prerna Sharma]**

---
**Built with precision using React, Redux Toolkit, and Supabase.**