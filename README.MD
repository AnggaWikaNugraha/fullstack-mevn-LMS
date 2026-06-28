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

| Category      | Technology                 |
|---------------|----------------------------|
| Framework     | Vue 3                      |
| Language      | TypeScript                 |
| Build Tool    | Vite                       |
| Styling       | Tailwind CSS v4            |
| Icons         | @lucide/vue                |
| Routing       | Vue Router 4               |
| State Manager | Pinia                      |
| HTTP Client   | Axios                      |
| Server State  | TanStack Query (Vue Query) |
| Form          | VeeValidate + Zod          |

### Backend (`be-server`)

| Category        | Technology           |
|-----------------|----------------------|
| Runtime         | Node.js              |
| Framework       | Express              |
| Language        | TypeScript           |
| ODM             | Mongoose             |
| Database        | MongoDB Atlas        |
| Auth            | JWT (JSON Web Token) |
| Email           | Nodemailer (Gmail)   |
| Validation      | Zod                  |
| Rate Limiting   | express-rate-limit   |

---

## Features

| Feature                                           | Status      |
|---------------------------------------------------|-------------|
| Authentication                                    | ✅ Done     |
| Courses & Bootcamp (list, detail, video player)   | Coming Soon |
| Quiz & Task                                       | Coming Soon |
| Checkout & Subscription                           | Coming Soon |
| User Profile                                      | Coming Soon |
| Purchase History                                  | Coming Soon |
| Notifications                                     | Coming Soon |

---

## Development Flow

> Dev order: **BE first** (model + API) → **FE** (UI + integration)

### Phase 1 — Authentication ✅

#### 1.1 Register + OTP Verification

**Register Flow:**

![Register](docs/auth%20-%20register.png)

```
[Register Page]
User fills form (name, email, password) → submit
        ↓
BE: validate input (Zod)
        ↓
BE: check if email exists?
  → isVerified: true  → error "Email already registered"
  → isVerified: false → delete old account, create new
        ↓
BE: save user (isVerified: false) + generate 6-digit OTP + send email (Nodemailer)
        ↓
FE: redirect to [OTP Verification Page] (pass email via router state)
```

**OTP Verification Flow:**

![OTP Verify](docs/auth%20-%20OTP%20verify.png)

```
[OTP Verification Page]
User inputs OTP code received via email
        ↓
BE: validate OTP (check code + expiry 15 min)
  → expired → error "OTP expired, please resend"
  → invalid → error "Invalid OTP"
  → valid   → mark isVerified: true, clear OTP
        ↓
FE: redirect to [Login Page]
```

**Edge Cases:**
- Email already registered and verified → reject with error
- Email registered but unverified → replace account and resend OTP
- OTP expired → user must click resend (not re-register)
- Resend OTP → BE enforces 60s cooldown (rate-limited), regenerate OTP and resend email
- Brute force OTP → rate limiting on `/verify-otp` endpoint

**BE Tasks:**
- [x] User model (`name`, `email`, `password`, `role`, `isVerified`, `otp`, `otpExpires`, `otpLastSentAt`)
- [x] Zod validation schema for register, verify OTP, resend OTP
- [x] Email service config (Nodemailer SMTP setup)
- [x] OTP email template (HTML email sent to user)
- [x] `POST /api/auth/register` — validate input, check email, create user, generate OTP, send email
- [x] `POST /api/auth/verify-otp` — check OTP + expiry, mark account as verified
- [x] `POST /api/auth/resend-otp` — enforce 60s cooldown, generate new OTP, resend email
- [x] Rate limit on `/verify-otp` & `/resend-otp`

**FE Tasks:**
- [x] Zod schema for register validation (name, email, password, confirm password)
- [x] API service `src/api/auth.ts` — `register()`, `verifyOtp()`, `resendOtp()`
- [x] `/auth/register` — registration form page (VeeValidate + Zod)
- [x] `/auth/verify-otp` — OTP input page (6-digit, 60s resend countdown)
- [x] Handle error responses from BE (email already registered, OTP invalid/expired)
- [x] Loading state on form submit (`isPending` from TanStack Query `useMutation`)

---

#### 1.2 Login (Single Device + Token Strategy)

**Rule: 1 account = 1 active device at a time (Web or Mobile)**

**Token Strategy:**
| Token         | Expiry         | Description                                                                                                  |
|---------------|----------------|--------------------------------------------------------------------------------------------------------------|
| Access Token  | 15 minutes     | Used for all API requests                                                                                    |
| Refresh Token | 1 day (fixed)  | Used to request a new access token. Not extended on activity. After 1 day the user must log in again.       |

![Login](docs/auth%20-%20login.png)

**Flow:**
```
[Login Page]
User inputs email + password + deviceId → submit
        ↓
BE: validate input (Zod)
        ↓
BE: check credentials + isVerified
        ↓
BE: check active session for this user
  → no session                      → create new session
  → session exists
      → refresh token expired        → delete old session, create new session (auto)
      → same deviceId               → delete old session, create new session, return new tokens
      → different device            → reject: "Account is active on another device. Please logout first."
        ↓
BE: return access token (15 min) + refresh token (1 day fixed)
        ↓
FE: store access token in Pinia (memory), refresh token in localStorage
        ↓
FE: redirect to [Dashboard]

--- when access token expires (15 minutes) ---

FE: send refresh token to BE (silent, in background)
        ↓
BE: validate refresh token + not expired + same deviceId
        ↓
BE: return new access token (15 min)
        ↓
FE: continue using the app, user is unaware

--- after 1 day ---

Refresh token expired → FE force logout → redirect to login
```

**Device ID:**
- Web: UUID generated on first visit, stored in `localStorage`
- Mobile: native device ID (`expo-device` / `react-native-device-info`)
- Sent in every login request as `deviceId` field

**Session Model (`sessions` collection):**
```
userId            → ref to User
deviceId          → string (unique per device)
refreshToken      → string (hashed with bcrypt)
refreshExpiredAt  → Date (fixed 1 day from login)
createdAt         → Date
```

**Edge Cases:**
- No active session → login allowed
- Same device, refresh token still valid → issue new access token
- Different device, refresh token still valid → reject with error
- Different device, refresh token expired → auto-delete old session, login allowed
- Refresh token expired → force logout, redirect to login

**BE Tasks:**
- [x] Session model (`userId`, `deviceId`, `refreshToken`, `refreshExpiredAt`, `createdAt`)
- [x] Zod validation schema for login
- [x] `POST /api/auth/login` — validate credentials, check session, hash refresh token, return access token + refresh token
- [x] `POST /api/auth/refresh` — validate refresh token, check session, return new access token
- [x] `POST /api/auth/logout` — delete session by deviceId
- [x] `GET /api/auth/me` — return currently logged-in user data (requires access token)
- [x] Auth middleware — verify access token + check active session in DB
- [x] Rate limit on `/login`

**FE Tasks:**
- [x] Zod schema for login validation (email, password)
- [x] Generate UUID deviceId on first app open, store in localStorage (`useDeviceId` composable)
- [x] API service `src/api/auth.ts` — `login()`, `refresh()`, `logout()`, `getMe()`
- [x] `/auth/login` — login form page (VeeValidate + Zod)
- [x] Pinia authStore — store access token in memory, refresh token + user data + deviceId in localStorage
- [x] Load user data via `getMe()` on app startup (if token is still valid)
- [x] Axios interceptor — auto silent refresh when access token expires (401)
- [x] Handle "account active on another device" error with a clear message
- [x] Loading state on form submit (`isPending` from TanStack Query `useMutation`)

---

#### 1.3 Forgot Password

**Forgot Password Flow:**

![Forgot Password](docs/auth%20-%20forgot%20password.png)

```
[Forgot Password Page]
User inputs email → submit
        ↓
BE: check if email exists + generate OTP + send email
  (always returns 200 even if email not found — prevents email enumeration)
        ↓
FE: redirect to [OTP Verification Page] (reset mode, pass email via router state)
        ↓
User inputs OTP → BE validate OTP + expiry
        ↓
FE: redirect to [Reset Password Page] (pass email + otp via router state)
```

**Reset Password Flow:**

![New Password](docs/auth%20-%20new%20password.png)

```
[Reset Password Page]
User inputs new password + confirm password → submit
        ↓
BE: re-validate OTP (prevents skipping the verify step)
        ↓
BE: update password + delete all active sessions (force logout all devices)
        ↓
FE: show success state → redirect to [Login Page]
```

**BE Tasks:**
- [x] Zod validation schema for forgot password, verify reset OTP, reset password
- [x] `POST /api/auth/forgot-password` — check email exists, generate OTP, send email
- [x] `POST /api/auth/verify-reset-otp` — validate OTP for password reset
- [x] `POST /api/auth/reset-password` — validate new password (min length, confirm match), update password, delete all active sessions
- [x] Rate limit on `/forgot-password`

**FE Tasks:**
- [x] Zod schema validation (email, OTP, new password + confirm password)
- [x] API service `src/api/auth.ts` — `forgotPassword()`, `verifyResetOtp()`, `resetPassword()`
- [x] `/auth/forgot-password` — email input page
- [x] `/auth/verify-otp` — reused in reset mode (not a new page, differentiated via `history.state.mode`)
- [x] `/auth/reset-password` — new password + confirm password page, success state with auto redirect
- [x] Handle error responses from BE
- [x] Loading state on form submit (`isPending` from TanStack Query `useMutation`)

---

#### 1.4 Global FE — Auth Infrastructure

**FE Tasks:**
- [x] `src/api/client.ts` — Axios instance + interceptors (silent refresh, global error modal)
- [x] `src/api/auth.ts` — all auth API calls in one file
- [x] `src/types/api.ts` — shared `ApiResponse<T>` generic type
- [x] `src/types/auth.ts` — TypeScript types for all auth requests & responses
- [x] Router guard (navigation guard) — redirect to `/auth/login` if unauthenticated, redirect to `/` if already authenticated
- [x] `src/composables/useDeviceId.ts` — composable to generate and read UUID deviceId
- [x] `src/composables/auth/` — all auth logic extracted into composables (Vue equivalent of React custom hooks)

---

#### 1.5 Global FE — Error Handling

**Error handling rules:**

| Error Type          | Example                         | Handler                                     |
|---------------------|---------------------------------|---------------------------------------------|
| Network error       | No internet, timeout            | Global modal                                |
| Server error (5xx)  | Server crash, maintenance       | Global modal                                |
| Auth error (401)    | Token expired                   | Silent refresh → if failed → redirect login |
| Validation error (400) | Invalid email format         | Inline in form                              |
| Not found (404)     | Data not found                  | Inline in form                              |

**FE Tasks:**
- [x] `src/stores/errorStore.ts` — Pinia store for global error state
- [x] `src/components/ui/GlobalErrorModal.vue` — error modal mounted in `App.vue`
- [x] `src/api/client.ts` — Axios interceptor catches network errors & 5xx, triggers errorStore
- [x] `App.vue` — mounts `GlobalErrorModal` at root

---

### Phase 2 — Courses & Bootcamp

> Coming Soon

### Phase 3 — Quiz & Task

> Coming Soon

### Phase 4 — Checkout & Subscription

> Coming Soon

### Phase 5 — User Profile & Purchase History

> Coming Soon

---

## Folder Structure

### Frontend (`fe-apps/src/`)

```
src/
├── api/
│   ├── client.ts              # Axios instance + interceptors (silent refresh)
│   └── auth.ts                # All auth API calls
├── composables/
│   ├── useDeviceId.ts         # Generate and read UUID deviceId
│   └── auth/                  # Auth composables (logic separated from views)
│       ├── useLogin.ts
│       ├── useRegister.ts
│       ├── useOtpVerification.ts
│       ├── useForgotPassword.ts
│       └── useResetPassword.ts
├── layouts/
│   ├── DefaultLayout.vue
│   └── AuthLayout.vue         # Split-screen layout (branding left, form right)
├── router/
│   ├── index.ts               # Vue Router + navigation guard
│   └── routes/
│       ├── auth.ts            # Auth routes (guest-only)
│       └── protected.ts       # Protected routes (requiresAuth)
├── stores/
│   ├── authStore.ts           # Pinia — access token (memory), user, refresh token (localStorage)
│   └── errorStore.ts          # Pinia — global error modal state
├── types/
│   ├── api.ts                 # Shared ApiResponse<T> generic type
│   └── auth.ts                # TypeScript types for auth requests & responses
├── views/
│   ├── HomeView.vue
│   └── auth/
│       ├── LoginView.vue
│       ├── RegisterView.vue
│       ├── OtpVerificationView.vue  # Used for both register and reset password (via history.state.mode)
│       ├── ForgotPasswordView.vue
│       └── ResetPasswordView.vue
└── components/
    └── ui/
        └── GlobalErrorModal.vue  # Global error modal (network / server errors)
```

### Backend (`be-server/src/`)

```
src/
├── config/
│   ├── database.ts        # MongoDB connection
│   └── mailer.ts          # Nodemailer Gmail setup
├── controllers/
│   └── authController.ts  # Auth route handlers
├── middlewares/
│   ├── authMiddleware.ts  # JWT verification + session check
│   ├── errorHandler.ts    # Global error handler
│   ├── rateLimiter.ts     # Rate limit configs per endpoint
│   └── requestLogger.ts   # Log request method, url, payload & response (Asia/Jakarta)
├── models/
│   ├── User.ts            # User mongoose model
│   └── Session.ts         # Device session model (TTL index)
├── routes/
│   ├── index.ts
│   └── authRoutes.ts      # Auth routes
├── templates/
│   └── otpEmail.ts        # OTP email HTML template (verification & reset)
├── validations/
│   └── authValidation.ts  # Zod schemas for auth endpoints
└── index.ts               # Entry point
```

---

## API Endpoints

### Auth

| Method | Endpoint                    | Description                                         | Auth |
|--------|-----------------------------|-----------------------------------------------------|------|
| GET    | /api/health                 | Health check                                        | -    |
| POST   | /api/auth/register          | Register + send OTP to email                        | -    |
| POST   | /api/auth/verify-otp        | Verify OTP (account activation)                     | -    |
| POST   | /api/auth/resend-otp        | Resend OTP (60s cooldown)                           | -    |
| POST   | /api/auth/login             | Login + device check, return access & refresh token | -    |
| POST   | /api/auth/refresh           | Silent refresh — return new access token            | -    |
| POST   | /api/auth/logout            | Logout, delete session                              | JWT  |
| GET    | /api/auth/me                | Get current logged-in user data                     | JWT  |
| POST   | /api/auth/forgot-password   | Send OTP for password reset                         | -    |
| POST   | /api/auth/verify-reset-otp  | Verify OTP for password reset                       | -    |
| POST   | /api/auth/reset-password    | Set new password + delete all active sessions       | -    |

> More endpoints will be added per phase.

---
