# Fullstack MEVN - Learning Management System

A fullstack Learning Management System (LMS) built with the **MEVN** stack — MongoDB, Express, Vue.js, Node.js.

## Project Structure

```
fullstack-mevn-lsm/
├── fe-apps/      # Frontend - Vue 3 + TypeScript + Vite
└── be-server/    # Backend  - Node.js + Express + MongoDB + Mongoose
```

---

## Tech Stack

### Frontend (`fe-apps`)

| Category      | Technology                          |
|---------------|-------------------------------------|
| Framework     | Vue 3                               |
| Language      | TypeScript                          |
| Build Tool    | Vite                                |
| Routing       | Vue Router 4                        |
| State Manager | Pinia                               |
| HTTP Client   | Axios                               |

### Backend (`be-server`)

| Category  | Technology                |
|-----------|---------------------------|
| Runtime   | Node.js                   |
| Framework | Express                   |
| Language  | TypeScript                |
| ODM       | Mongoose                  |
| Database  | MongoDB                   |
| Auth      | JWT (JSON Web Token)      |

---

## Coming Soon

- Authentication (Register, Login, Forgot Password)
- Courses & Bootcamp (list, detail, video player)
- Quiz & Task
- Checkout & Subscription
- User Profile
- Purchase History
- Notifications

---

### Frontend (`fe-apps/src/`)

```
src/
├── api/
│   └── client.ts         # Axios instance + interceptors
├── composables/          # Reusable Vue composables
├── layouts/
│   ├── DefaultLayout.vue
│   └── AuthLayout.vue
├── router/
│   └── index.ts          # Vue Router configuration
├── stores/
│   └── authStore.ts      # Pinia auth store
├── types/                # TypeScript types
├── views/
│   ├── HomeView.vue
│   └── auth/
│       ├── LoginView.vue
│       └── RegisterView.vue
└── components/
    └── ui/               # Reusable UI components
```

### Backend (`be-server/src/`)

```
src/
├── config/
│   └── database.ts       # MongoDB connection
├── controllers/          # Route handlers
├── middlewares/
│   ├── authMiddleware.ts # JWT verification
│   └── errorHandler.ts   # Global error handler
├── models/               # Mongoose models
├── routes/               # Express routes
├── types/                # TypeScript types
└── index.ts              # Entry point
```

---

## API Endpoints

| Method | Endpoint    | Description  | Auth |
|--------|-------------|--------------|------|
| GET    | /api/health | Health check | -    |

> More endpoints will be added as frontend requirements are defined.

---
