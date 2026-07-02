# Fullstack MEVN - Learning Management System

A fullstack Learning Management System (LMS) built with the **MEVN** stack — MongoDB, Express, Vue.js, Node.js.

## Project Structure

```
fullstack-mevn-lsm/
├── fe-apps/      # Frontend - Vue 3 + TypeScript + Vite
└── be-server/    # Backend  - Node.js + Express + MongoDB + Mongoose
```

---

## Folder Structure

### Frontend (`fe-apps/src/`)

```
src/
├── api/
│   ├── client.ts              # Axios instance + interceptors (silent refresh)
│   ├── auth.ts                # All auth API calls
│   ├── courses.ts             # Course + lesson + progress API calls
│   └── bootcamps.ts           # Bootcamp API calls
├── composables/
│   ├── useDeviceId.ts         # Generate and read UUID deviceId
│   ├── auth/                  # Auth composables (logic separated from views)
│   │   ├── useLogin.ts
│   │   ├── useRegister.ts
│   │   ├── useOtpVerification.ts
│   │   ├── useForgotPassword.ts
│   │   ├── useResetPassword.ts
│   │   └── useGoogleAuth.ts   # redirectToGoogle() builds OAuth URL; handleCallback(code) → call /api/auth/google → store tokens
│   └── courses/               # Course composables
│       ├── useCourses.ts      # useQuery for course list + topic filter
│       ├── useCourseDetail.ts # useQuery for course detail + lesson list
│       └── useProgress.ts     # useMutation for mark lesson complete
├── layouts/
│   ├── DefaultLayout.vue      # Layout with Navbar + Footer
│   └── AuthLayout.vue         # Split-screen layout (branding left, form right)
├── router/
│   ├── index.ts               # Vue Router + navigation guard
│   └── routes/
│       ├── auth.ts            # Auth routes (guest-only)
│       ├── public.ts          # Public routes under DefaultLayout (home, courses, bootcamp)
│       └── protected.ts       # Protected routes under DefaultLayout (requiresAuth per child)
├── stores/
│   ├── authStore.ts           # Pinia — access token (memory), user, refresh token (localStorage)
│   └── errorStore.ts          # Pinia — global error modal state
├── types/
│   ├── api.ts                 # Shared ApiResponse<T> generic type
│   ├── auth.ts                # TypeScript types for auth requests & responses
│   └── courses.ts             # TypeScript types for Course, Lesson, Topic, Bootcamp, Progress
├── views/
│   ├── HomeView.vue           # Landing page (hero + courses + bootcamp + benefits)
│   ├── courses/
│   │   ├── CourseDetailView.vue   # Course info + lesson sidebar
│   │   └── LessonView.vue         # Video player page
│   ├── bootcamps/
│   │   └── BootcampDetailView.vue
│   └── auth/
│       ├── LoginView.vue
│       ├── RegisterView.vue
│       ├── OtpVerificationView.vue  # Used for both register and reset password (via history.state.mode)
│       ├── ForgotPasswordView.vue
│       ├── ResetPasswordView.vue
│       └── GoogleCallbackView.vue  # Receives redirect from Google, extracts code, calls BE
└── components/
    ├── ui/
    │   ├── GlobalErrorModal.vue  # Global error modal (network / server errors)
    │   └── GoogleSignInButton.vue  # Google branding button — calls redirectToGoogle() on click
    ├── sections/
    │   ├── HeroSection.vue       # Image slider (auto-advance)
    │   ├── CoursesSection.vue    # Course cards + topic filter pills
    │   ├── BootcampSection.vue   # Bootcamp cards
    │   └── BenefitsSection.vue   # Company profile — alternating image/text blocks
    └── course/
        ├── CourseCard.vue        # Course card (cover, title, video count)
        ├── BootcampCard.vue      # Bootcamp card (image, title, status badge, starting price)
        ├── CourseSidebar.vue     # Module accordion → Chapter → Lesson list (is_done, is_locked, active)
        ├── CourseHeader.vue      # Course title + progress bar
        └── VideoPlayer.vue       # YouTube iframe embed, fires onEnded event
```

### Backend (`be-server/src/`)

```
src/
├── config/
│   ├── database.ts        # MongoDB connection
│   └── mailer.ts          # Nodemailer Gmail setup
├── controllers/
│   ├── authController.ts      # Auth route handlers
│   ├── courseController.ts    # Course + topic route handlers
│   ├── lessonController.ts    # Lesson + progress route handlers
│   └── bootcampController.ts  # Bootcamp package, batch, session route handlers
├── middlewares/
│   ├── authMiddleware.ts  # JWT verification + session check
│   ├── errorHandler.ts    # Global error handler
│   ├── rateLimiter.ts     # Rate limit configs per endpoint
│   └── requestLogger.ts   # Log request method, url, payload & response (Asia/Jakarta)
├── models/
│   ├── User.ts            # User mongoose model
│   ├── Session.ts         # Device session model (TTL index)
│   ├── Course.ts          # Course mongoose model
│   ├── Module.ts          # Course module model
│   ├── Chapter.ts         # Module chapter model
│   ├── Lesson.ts          # Lesson model (type: video | quiz, embeds video object)
│   ├── Progress.ts        # User lesson progress model
│   ├── BootcampPackage.ts  # Bootcamp package model
│   ├── BootcampBatch.ts    # Bootcamp batch model (multiple runs of same package)
│   └── BootcampSession.ts  # Individual session schedule per batch
├── routes/
│   ├── index.ts
│   ├── authRoutes.ts      # Auth routes
│   ├── courseRoutes.ts    # Course + topic routes
│   ├── lessonRoutes.ts    # Lesson + progress routes
│   └── bootcampRoutes.ts  # Bootcamp routes
├── seeds/
│   ├── courseSeeder.ts    # Sample course + topic data
│   └── bootcampSeeder.ts  # Sample bootcamp data
├── templates/
│   └── otpEmail.ts        # OTP email HTML template (verification & reset)
├── validations/
│   ├── authValidation.ts  # Zod schemas for auth endpoints
│   └── courseValidation.ts # Zod schemas for course endpoints
└── index.ts               # Entry point
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
| Runtime         | Node.js ≥ 18         |
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
User fills form (name, email, password) → submit
          |
          ▼
    POST /auth/register
          |
          ├─→ Validation error (Zod)       → error with field messages
          |
          ├─→ Email exists & isVerified     → error "Email already registered"
          |
          ├─→ Email exists & !isVerified    → delete old account, create new
          |
          └─→ Valid
                    |
                    ▼
              Save user (isVerified: false)
              Generate 6-digit OTP (expires 15 min)
              Send OTP via email (Nodemailer)
                    |
                    ▼
              FE: redirect to [OTP Verification Page]
              (pass email via router state)
```

**OTP Verification Flow:**

![OTP Verify](docs/auth%20-%20OTP%20verify.png)

```
User inputs 6-digit OTP → submit
          |
          ▼
    POST /auth/verify-otp
          |
          ├─→ OTP expired    → error "OTP expired, please resend"
          |
          ├─→ OTP invalid    → error "Invalid OTP"
          |
          └─→ OTP valid
                    |
                    ▼
              Mark isVerified: true
              Clear OTP fields
                    |
                    ▼
              FE: redirect to [Login Page]
```

**Resend OTP Flow:**

```
User clicks "Resend OTP"
          |
          ▼
    POST /auth/resend-otp
          |
          ├─→ Within 60s cooldown    → error "Please wait before resending"
          |
          └─→ Cooldown passed
                    |
                    ▼
              Generate new OTP
              Reset otpLastSentAt
              Send email
                    |
                    ▼
              FE: restart 60s countdown
```

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

**Login Flow:**

```
User inputs email + password → submit
          |
          ▼
    POST /auth/login  (+ deviceId in body)
          |
          ├─→ Validation error (Zod)         → error with field messages
          |
          ├─→ Email not found                → error "Email or password incorrect"
          |
          ├─→ Wrong password                 → error "Email or password incorrect"
          |
          ├─→ Account not verified           → error "Please verify your email first"
          |
          └─→ Valid & verified
                    |
                    ▼
              Check active session
                    |
                    ├─→ No session                    → create new session
                    |
                    ├─→ Same deviceId                 → replace session, return new tokens
                    |
                    ├─→ Different device, expired     → delete old session, create new session
                    |
                    └─→ Different device, still valid → error "Account is active on another device"
                              |
                              ▼
                        Generate access token (15 min)
                        Generate refresh token (1 day fixed, hashed in DB)
                        Save session to DB
                              |
                              ▼
                        FE: store access token in Pinia (memory)
                        FE: store refresh token + deviceId in localStorage
                        FE: redirect to [Home]
```

**Silent Refresh Flow:**

```
API request returns 401 (access token expired)
          |
          ▼
    POST /auth/refresh  (refresh token + deviceId)
          |
          ├─→ Refresh token invalid/expired  → force logout → redirect to [Login Page]
          |
          └─→ Valid
                    |
                    ▼
              Return new access token (15 min)
                    |
                    ▼
              FE: retry original request — user is unaware
```

**Logout Flow:**

```
User clicks logout
          |
          ▼
    POST /auth/logout  (requires JWT)
          |
          ▼
    Delete session from DB (by deviceId)
          |
          ▼
    FE: clear Pinia store + localStorage
    FE: redirect to [Login Page]
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

#### 1.3 Login with Google (OAuth 2.0)

**Account Rules:**
- Google user (new email) → create account automatically (`isVerified: true`, no password)
- Google email matches existing account → **merge**: add `googleId` to existing user, can login both ways
- Google-only user tries email/password login → guided error: "Set a password first via Forgot Password" + link to Forgot Password page
- After setting password via Forgot Password → account becomes dual-method (Google + email/password)
- Google user uses Forgot Password → allowed: OTP sent, can set password, account becomes dual-method

**Google Login Flow (Authorization Code — Redirect):**

```
User clicks "Continue with Google"
          |
          ▼
    FE redirect → accounts.google.com/o/oauth2/v2/auth
    (user selects account on Google's own page)
          |
          ├─→ User cancels → Google redirects back with error → FE redirect to /auth/login
          |
          └─→ User selects account
                    |
                    ▼
              Google redirects to /auth/google/callback?code=xxx
                    |
                    ▼
              GoogleCallbackView extracts code from URL
                    |
                    ▼
              POST /api/auth/google  { code, deviceId }
                    |
                    ├─→ code invalid/expired    → error "Google authentication failed"
                    |
                    └─→ code valid
                              |
                              ▼
                        BE exchanges code → Google Token endpoint
                        → get idToken → verify → extract:
                        email, name, googleId (sub)
                              |
                              ├─→ Email not in DB
                              |         |
                              |         ▼
                              |   Create new user
                              |   (isVerified: true, googleId, no password)
                              |
                              ├─→ Email exists, no googleId (merge)
                              |         |
                              |         ▼
                              |   Add googleId to existing user
                              |
                              └─→ Email exists, has googleId
                                        |
                                        ▼
                                  [Session logic — same as regular login]
                                  Check active session
                                        |
                                        ├─→ Different device, still valid
                                        |   → error "Account is active on another device"
                                        |
                                        └─→ No session / same device / expired
                                                  |
                                                  ▼
                                            Generate access token (15 min)
                                            Generate refresh token (1 day fixed)
                                            Save session to DB
                                                  |
                                                  ▼
                                            FE: store access token in Pinia (memory)
                                            FE: store refresh token + deviceId in localStorage
                                            FE: redirect to [Home]
```

**Google-only User tries Email/Password Login:**

```
Google-only user inputs email + password → submit
          |
          ▼
    POST /api/auth/login
          |
          └─→ Email found, password === undefined (Google-only account)
                    |
                    ▼
              Return 403 with specific message:
              "This account was created with Google.
               Please set a password first via Forgot Password."
                    |
                    ▼
              FE: show guided error + "Set Password" link → [Forgot Password Page]
                    |
                    ▼
              User sets password via OTP flow
                    |
                    ▼
              Account is now dual-method (Google + email/password) ✅
```

**User Model Changes:**
```
password   → String, now optional  (Google-only users have no password)
googleId   → String, optional      (stores Google "sub" identifier)
```

**BE Tasks:**
- [x] Update User model — `password` optional, add `googleId?: string`
- [x] Update `pre-save` hook — skip password hashing if `password` is undefined
- [x] Update `login` controller — detect `password === undefined`, return 403 with guided message
- [x] Zod schema `googleAuthSchema` — validate `{ code, deviceId }`
- [x] `POST /api/auth/google` — exchange code → verify idToken → find/create/merge user → session logic → return tokens
- [x] Add `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` + `GOOGLE_REDIRECT_URI` to `.env`
- [x] Install `google-auth-library` (BE dependency)
- [x] Node.js ≥ 18 required (`google-auth-library@10` uses `Headers` API not available in Node 16)

**FE Tasks:**
- [x] Add `VITE_GOOGLE_CLIENT_ID` to `.env`
- [x] Update `src/types/auth.ts` — add `GoogleLoginPayload` type (`{ code, deviceId }`)
- [x] API service `src/api/auth.ts` — add `googleLogin({ code, deviceId })`
- [x] `src/composables/auth/useGoogleAuth.ts` — `redirectToGoogle()` builds OAuth URL + redirect; `handleCallback(code)` sends code to BE
- [x] `src/components/ui/GoogleSignInButton.vue` — button that calls `redirectToGoogle()`
- [x] `src/views/auth/GoogleCallbackView.vue` — extracts `code` from URL → calls BE → stores tokens → redirect Home
- [x] Add route `/auth/google/callback` → `GoogleCallbackView`
- [x] `/auth/login` — add `GoogleSignInButton` + handle 403 guided error with "Set Password" link
- [x] `/auth/register` — add `GoogleSignInButton`
- [x] Add `VITE_GOOGLE_REDIRECT_URI` to `.env`
- [x] Google Cloud Console — add **Authorized redirect URI**: `http://localhost:5173/auth/google/callback`

---

#### 1.4 Forgot Password

**Forgot Password Flow:**

![Forgot Password](docs/auth%20-%20forgot%20password.png)

```
User inputs email → submit
          |
          ▼
    POST /auth/forgot-password
          |
          └─→ Always returns 200 (prevents email enumeration)
                    |
                    ├─→ Email not found    → no email sent (silent)
                    |
                    └─→ Email found
                              |
                              ▼
                        Generate OTP (expires 15 min)
                        Send OTP via email
                              |
                              ▼
                        FE: redirect to [OTP Verification Page] (reset mode)
                        (pass email via router state)
```

**OTP Verification Flow (Reset Mode):**

```
User inputs 6-digit OTP → submit
          |
          ▼
    POST /auth/verify-reset-otp
          |
          ├─→ OTP expired    → error "OTP expired, please resend"
          |
          ├─→ OTP invalid    → error "Invalid OTP"
          |
          └─→ OTP valid
                    |
                    ▼
              FE: redirect to [Reset Password Page]
              (pass email + otp via router state)
```

**Reset Password Flow:**

![New Password](docs/auth%20-%20new%20password.png)

```
User inputs new password + confirm password → submit
          |
          ▼
    POST /auth/reset-password
          |
          ├─→ OTP invalid/expired    → error (prevents skipping verify step)
          |
          ├─→ Password too short     → error "Password must be at least 8 characters"
          |
          ├─→ Passwords do not match → error "Passwords do not match"
          |
          └─→ Valid
                    |
                    ▼
              Update password (hashed)
              Delete all active sessions (force logout all devices)
                    |
                    ▼
              FE: show success state
              FE: redirect to [Login Page] (after 2s)
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

#### 1.5 Global FE — Auth Infrastructure

**FE Tasks:**
- [x] `src/api/client.ts` — Axios instance + interceptors (silent refresh, global error modal)
- [x] `src/api/auth.ts` — all auth API calls in one file
- [x] `src/types/api.ts` — shared `ApiResponse<T>` generic type
- [x] `src/types/auth.ts` — TypeScript types for all auth requests & responses
- [x] Router guard (navigation guard) — redirect to `/auth/login` if unauthenticated, redirect to `/` if already authenticated
- [x] `src/composables/useDeviceId.ts` — composable to generate and read UUID deviceId
- [x] `src/composables/auth/` — all auth logic extracted into composables (Vue equivalent of React custom hooks)

---

#### 1.6 Global FE — Error Handling

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

#### 2.1 Course List (Landing Page)

**Flow:**

```
User opens app (logged in or not)
          |
          ▼
    GET /api/courses + GET /api/courses/topics  (parallel)
          |
          ▼
    FE: display hero slider + course cards (horizontal scroll)
        + topic filter pills
          |
          ├─→ User clicks a topic pill
          |         |
          |         ▼
          |   FE: filter courses client-side (no refetch)
          |   FE: update displayed cards
          |
          └─→ User clicks a course card
                    |
                    ▼
              FE: redirect to [Course Detail Page]
```

**Course Access Model: Free + Paid**
- `isFree: true` — anyone can watch without login
- `isFree: false` — requires active subscription or one-time purchase (Phase 4)
- Course list is always visible to everyone; only video playback is gated

**Data Model — Course:**
```
title            → string (required)
description      → string
cover_url        → string (image URL)
topic            → string (slug, e.g. "web-dev")
topic_name       → string (display name, e.g. "Web Development")
level            → enum: beginner | intermediate | advanced
isFree           → boolean (true = open access, false = requires subscription/purchase)
video_amount     → number (total video count — displayed on course card)
total_lessons    → number (auto-calculated from Lesson count)
course_duration  → number (total duration of all videos in seconds)
createdAt        → Date
```

**Data Model — Topic:**
```
topic         → string (unique slug, e.g. "web-dev") — matches Course.topic
topic_name    → string (display name, e.g. "Web Development") — matches Course.topic_name
```

> Topics are not a separate collection — `/api/courses/topics` aggregates distinct `topic` + `topic_name` values from the Course collection.

**BE Tasks:**
- [x] Course model (`title`, `description`, `cover_url`, `topic`, `topic_name`, `level`, `isFree`, `video_amount`, `total_lessons`, `course_duration`)
- [x] No separate Topic model — topics are aggregated from Course (`distinct topic + topic_name`)
- [x] `GET /api/courses` — list all courses, support optional `?topic=` query filter + pagination
- [x] `GET /api/courses/topics` — list all unique topics
- [x] Seed script (`npm run seed:courses`) — 6 sample courses across 4 topics

**FE Tasks:**
- [x] `src/types/courses.ts` — `Course`, `Topic`, `CourseListResponse` types (`Pagination` moved to `types/api.ts`)
- [x] `src/api/courses.ts` — `getCourses()`, `getTopics()`
- [x] `src/composables/courses/useCourses.ts` — `useQuery` for courses + topics, client-side topic filter
- [x] `CourseCard.vue` — cover image, level badge, topic name, video count, Free/Premium badge
- [x] `CoursesSection.vue` — topic pills + course grid + skeleton loading
- [x] `HeroSection.vue` — 3-slide auto-advance carousel (5s), prev/next arrows, dot indicators
- [x] `AppNavbar.vue` — sticky navbar, desktop + mobile menu, auth state (login/logout)
- [x] `DefaultLayout.vue` — mount `AppNavbar`
- [x] `HomeView.vue` — `HeroSection` + `CoursesSection`
- [x] `types/api.ts` — added global `Pagination` interface

---

#### 2.2 Course Detail + Video Player

**Content Hierarchy (matches reference):**
```
Course
  └── Module        (e.g. "Fundamentals", "Advanced Topics")
        └── Chapter  (e.g. "Intro to Vue", "State Management")
              └── Lesson (type: video | quiz)
                    └── Video (embedded — title, description, video_url)
```

**Course Detail Flow:**

```
User navigates to /courses/:id
          |
          ▼
    GET /api/courses/:id
    (returns course + modules → chapters → lessons with is_done + is_locked)
          |
          ▼
    FE: display course info (cover, title, level, progress bar)
        + sidebar: Module accordion → Chapter → Lesson list
          |
          ▼
    FE: auto-select first incomplete + unlocked lesson
          |
          ▼
    User clicks a lesson in sidebar
          |
          ├─→ is_locked: true
          |         |
          |         ▼
          |   FE: show locked overlay
          |   "Complete the previous lesson first"
          |
          └─→ is_locked: false
                    |
                    ├─→ type: "video"
                    |         |
                    |         ▼
                    |   FE: display YouTube iframe
                    |       + lesson title + description
                    |
                    └─→ type: "quiz"
                              |
                              ▼
                        FE: display quiz questions (Phase 3)
```

**Video Progress Flow:**

```
Video ends → "Next Lesson" button appears
          |
          ▼
    User clicks "Next Lesson"
          |
          ├─→ Lesson already done (is_done: true)
          |         |
          |         ▼
          |   FE: navigate directly to next lesson
          |
          └─→ Lesson not yet done
                    |
                    ▼
              POST /api/courses/update-progress  { lesson_id }  (requires auth)
                    |
                    ├─→ Not authenticated    → show "Login to save progress" modal
                    |
                    └─→ Success
                              |
                              ▼
                        BE: save Progress record
                        BE: unlock next lesson (set is_locked: false)
                              |
                              ▼
                        FE: refetch course detail
                        FE: tick is_done in sidebar
                        FE: navigate to next lesson
                              |
                        (if last lesson)
                              ▼
                        FE: show "Course Completed!" modal
```

**Video Hosting: YouTube (unlisted)**
- Videos uploaded to YouTube as unlisted
- `video_url` stores the full embed URL: `https://www.youtube.com/embed/{id}`
- No server storage or bandwidth cost — can migrate to Cloudinary/Mux later

**Data Model — Module:**
```
courseId         → ref to Course
title            → string
order            → number
module_duration  → number (sum of all lesson durations in module, in seconds)
```

**Data Model — Chapter:**
```
moduleId      → ref to Module
title         → string
order         → number
chapter_duration → number (sum of lesson durations, in seconds)
```

**Data Model — Lesson:**
```
chapterId     → ref to Chapter
moduleId      → ref to Module (denormalized for easier queries)
courseId      → ref to Course (denormalized)
title         → string
type          → enum: "video" | "quiz"
order         → number
time          → number (duration in seconds)
is_locked     → boolean (true = must complete previous lesson first)
bonus         → number (optional — coins/points reward)
video         → embedded object (only if type = "video"):
  title         → string
  description   → string (HTML)
  video_url     → string (full YouTube embed URL)
  duration      → number (in seconds)
  topic         → string
```

**Data Model — Progress:**
```
userId        → ref to User
lessonId      → ref to Lesson
courseId      → ref to Course (denormalized)
completedAt   → Date
```
> Unique index on `[userId, lessonId]` — one record per user per lesson.

**BE Tasks:**
- [ ] Module model (`courseId`, `title`, `order`, `module_duration`)
- [ ] Chapter model (`moduleId`, `title`, `order`, `chapter_duration`)
- [ ] Lesson model (`chapterId`, `moduleId`, `courseId`, `title`, `type`, `order`, `time`, `is_locked`, `bonus`, `video`)
- [ ] Progress model (`userId`, `lessonId`, `courseId`, `completedAt`) — unique index on `[userId, lessonId]`
- [ ] `GET /api/courses/:id` — course detail + nested modules → chapters → lessons (with `is_done` + `is_locked` per lesson if authenticated)
- [ ] `POST /api/courses/update-progress` — mark lesson as complete (`{ lesson_id }` in body), requires auth
- [ ] `GET /api/courses/:id/progress` — completed lesson count + total lessons for a course
- [ ] Seed script — sample modules, chapters, lessons, and videos

**FE Tasks:**
- [ ] API service `src/api/courses.ts` — `getCourseDetail()`, `updateProgress()`, `getCourseProgress()`
- [ ] `/courses/:id` — course detail page with video player + sidebar
- [ ] `CourseSidebar.vue` — Module accordion → Chapter → Lesson list (show is_done tick, is_locked icon, active state)
- [ ] `VideoPlayer.vue` — YouTube embed via iframe, fires `onEnded` event when video finishes
- [ ] `CourseHeader.vue` — course title + progress bar (completed / total lessons)
- [ ] "Next Lesson" button — appears after video ends; calls `updateProgress()` if not yet done, then navigates to next lesson
- [ ] Lesson locking — if `is_locked: true`, show tooltip "Complete the previous lesson first"

---

#### 2.3 Bootcamp List & Detail

**Bootcamp List Flow:**

```
User opens landing page (bootcamp section)
          |
          ▼
    GET /api/bootcamps  (pagination + ?status= + search)
          |
          ▼
    FE: display bootcamp cards (image, title, status badge, starting price)
          |
          └─→ User clicks a bootcamp card
                    |
                    ▼
              FE: redirect to [Bootcamp Detail Page]
```

**Bootcamp Detail Flow:**

```
User navigates to /bootcamps/:id
          |
          ▼
    GET /api/bootcamps/:id
    (returns package + mentors + batches → sessions)
          |
          ▼
    FE: display package info (image, title, description, mentors)
        + batch tabs (Batch 1, Batch 2, ...)
        + session schedule of active batch
          |
          ▼
    User selects a batch tab
          |
          ▼
    FE: switch session list (client-side, no refetch)
          |
          ▼
    User clicks "Register Now"
          |
          ├─→ Not logged in
          |         |
          |         ▼
          |   FE: save redirect info to localStorage
          |   FE: redirect to [Login Page]
          |
          └─→ Logged in
                    |
                    ▼
              FE: open registration modal
              (show selected batch info + price)
```

**Bootcamp Hierarchy (matches reference):**
```
BootcampPackage     (e.g. "Bootcamp Web Development")
  └── BootcampBatch (e.g. "Batch 1", "Batch 2") — same bootcamp opens multiple times
        └── BootcampSession (e.g. "Session 1 - Intro") — individual meeting schedule
```

**Data Model — BootcampPackage:**
```
title         → string
description   → string
image_url     → string
status        → string (e.g. "open", "closed", "coming_soon")
mentors       → array of embedded objects:
  name          → string
  image_url     → string
  occupation    → string
batches       → ref to BootcampBatch[]
```

**Data Model — BootcampBatch:**
```
packageId         → ref to BootcampPackage
title             → string (e.g. "Batch 1")
sub_title         → string
description       → string
started_at        → Date
ended_at          → Date
quota_used_percentage → number (0–100)
price               → number
strikethrough_price → number (original price shown with strikethrough when discounted)
package_type      → string (e.g. "online", "offline", "hybrid")
sessions          → ref to BootcampSession[]
```

**Data Model — BootcampSession:**
```
batchId           → ref to BootcampBatch
title             → string
session_name      → string
session_date      → Date
session_start_time → string (e.g. "09:00")
session_end_time   → string (e.g. "12:00")
```

**BE Tasks:**
- [ ] BootcampPackage model (`title`, `description`, `image_url`, `status`, `mentors[]`)
- [ ] BootcampBatch model (`packageId`, `title`, `sub_title`, `description`, `started_at`, `ended_at`, `quota_used_percentage`, `price`, `strikethrough_price`, `package_type`)
- [ ] BootcampSession model (`batchId`, `title`, `session_name`, `session_date`, `session_start_time`, `session_end_time`)
- [ ] `GET /api/bootcamps` — list all packages with pagination + search + `?status=` + `?sort_type=` + `?order_by=`
- [ ] `GET /api/bootcamps/:id` — package detail with nested batches and sessions
- [ ] Seed script — populate sample bootcamp packages, batches, and sessions

**FE Tasks:**
- [ ] API service `src/api/bootcamps.ts` — `getBootcamps()`, `getBootcampDetail()`
- [ ] Bootcamp section on landing page — card grid (image, title, status badge, price from first open batch)
- [ ] `BootcampCard.vue` — image, title, status badge, starting price
- [ ] `/bootcamps/:id` — package detail page (info + batch list with sessions + CTA per batch)
- [ ] Skeleton loading state
- [ ] Pagination + search support on bootcamp list

---

#### 2.4 Company Profile Section (Static)

**No BE needed — FE only.**

```
[Landing Page — About / Benefits Section]

3 highlight blocks (alternating image ↔ text layout):
  1. Bootcamp "Learn by Doing" — real project experience + job placement
  2. Personal Mentor — guided learning with a dedicated mentor
  3. Diverse Courses — wide range of topics available

+ Footer — logo, nav links (Courses, Bootcamp, For Business), social media icons
```

**FE Tasks:**
- [ ] `BenefitsSection.vue` — 3 alternating image + text blocks, static content
- [ ] `AppFooter.vue` — logo, navigation links, social media icons (TikTok, LinkedIn, Instagram, X)

### Phase 3 — Quiz & Task

> Coming Soon

### Phase 4 — Checkout & Subscription

> Coming Soon

### Phase 5 — User Profile & Purchase History

> Coming Soon

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
| POST   | /api/auth/google            | Google OAuth — exchange code, find/create/merge user, return tokens  | -    |
| POST   | /api/auth/refresh           | Silent refresh — return new access token            | -    |
| POST   | /api/auth/logout            | Logout, delete session                              | JWT  |
| GET    | /api/auth/me                | Get current logged-in user data                     | JWT  |
| POST   | /api/auth/forgot-password   | Send OTP for password reset                         | -    |
| POST   | /api/auth/verify-reset-otp  | Verify OTP for password reset                       | -    |
| POST   | /api/auth/reset-password    | Set new password + delete all active sessions       | -    |

### Courses

| Method | Endpoint                       | Description                                            | Auth     |
|--------|--------------------------------|--------------------------------------------------------|----------|
| GET    | /api/courses                   | List all courses (optional `?topic=` filter, pagination) | -      |
| GET    | /api/courses/topics            | List all topics / categories                           | -        |
| GET    | /api/courses/:id               | Course detail + nested modules → chapters → lessons (with is_done + is_locked if authenticated) | - |
| POST   | /api/courses/update-progress   | Mark lesson as complete (`{ lesson_id }` in body)      | JWT      |
| GET    | /api/courses/:id/progress      | User progress for a course (completed / total lessons) | JWT      |

### Bootcamp

| Method | Endpoint                       | Description                                            | Auth     |
|--------|--------------------------------|--------------------------------------------------------|----------|
| GET    | /api/bootcamps                 | List all bootcamp packages (pagination, search, `?status=`, `?sort_type=`, `?order_by=`) | - |
| GET    | /api/bootcamps/:id             | Bootcamp package detail with nested batches and sessions | -      |

> More endpoints will be added per phase.

---

## Environment Variables

### Backend (`be-server/.env`)

| Variable                | Example                                      | Description                              |
|-------------------------|----------------------------------------------|------------------------------------------|
| `PORT`                  | `3000`                                       | Express server port                      |
| `MONGODB_URI`           | `mongodb+srv://...`                          | MongoDB Atlas connection string          |
| `JWT_SECRET`            | `your_jwt_secret`                            | Secret for signing access tokens         |
| `JWT_EXPIRES_IN`        | `15m`                                        | Access token expiry                      |
| `REFRESH_TOKEN_SECRET`  | `your_refresh_secret`                        | Secret for signing refresh tokens        |
| `REFRESH_TOKEN_EXPIRES_IN` | `1d`                                      | Refresh token expiry                     |
| `NODE_ENV`              | `development`                                | Environment mode                         |
| `GOOGLE_CLIENT_ID`      | `xxxx.apps.googleusercontent.com`            | Google OAuth client ID                   |
| `GOOGLE_CLIENT_SECRET`  | `GOCSPX-xxxx`                                | Google OAuth client secret               |
| `GOOGLE_REDIRECT_URI`   | `http://localhost:5173/auth/google/callback` | Must match Google Console & FE env       |

### Frontend (`fe-apps/.env`)

| Variable                  | Example                                      | Description                        |
|---------------------------|----------------------------------------------|------------------------------------|
| `VITE_API_URL`            | `http://localhost:3000/api`                  | BE API base URL                    |
| `VITE_GOOGLE_CLIENT_ID`   | `xxxx.apps.googleusercontent.com`            | Google OAuth client ID (same as BE)|
| `VITE_GOOGLE_REDIRECT_URI`| `http://localhost:5173/auth/google/callback` | Must match BE env & Google Console |

---
