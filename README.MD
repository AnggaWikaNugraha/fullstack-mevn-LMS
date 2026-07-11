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
    │   ├── GlobalErrorModal.vue    # Global error modal (network / server errors)
    │   ├── AppNavbar.vue           # Sticky navbar — desktop + mobile menu, auth state (login/logout)
    │   ├── AppFooter.vue           # Footer — logo, nav links, social media icons (TikTok, LinkedIn, Instagram, X)
    │   └── GoogleSignInButton.vue  # Google branding button — calls redirectToGoogle() on click
    ├── sections/
    │   ├── HeroSection.vue       # Image slider (auto-advance)
    │   ├── CoursesSection.vue    # Course cards + topic filter pills
    │   ├── BootcampSection.vue   # Bootcamp cards
    │   └── BenefitsSection.vue   # Company profile — alternating image/text blocks
    └── course/
        ├── CourseCard.vue        # Course card (cover, level badge, topic name, video count, Free/Premium)
        ├── BootcampCard.vue      # Bootcamp card (image, title, status badge, starting price)
        ├── CourseSidebar.vue     # Module accordion → Chapter → Lesson list (is_done, is_locked icons, active highlight) + progress bar
        └── VideoPlayer.vue       # YouTube IFrame API embed — emits 'ended' event when video finishes
```

### Backend (`be-server/src/`)

```
src/
├── config/
│   ├── database.ts        # MongoDB connection
│   └── mailer.ts          # Nodemailer Gmail setup
├── controllers/
│   ├── authController.ts      # Auth route handlers
│   ├── courseController.ts    # Course, topic, lesson, and progress route handlers
│   └── bootcampController.ts  # Bootcamp package, batch, session route handlers (Phase 2.3)
├── middlewares/
│   ├── authMiddleware.ts  # protect (JWT + session check) + optionalProtect (public endpoints with optional auth)
│   ├── errorHandler.ts    # Global error handler
│   ├── rateLimiter.ts     # Rate limit configs per endpoint
│   └── requestLogger.ts   # Log request method, url, payload & response (Asia/Jakarta)
├── models/
│   ├── User.ts            # User mongoose model
│   ├── Session.ts         # Device session model (TTL index)
│   ├── Course.ts          # Course mongoose model
│   ├── Module.ts          # Course module model
│   ├── Chapter.ts         # Module chapter model
│   ├── Lesson.ts          # Lesson model (type: video | quiz, video_url, duration, is_locked)
│   ├── Progress.ts        # User lesson progress model
│   ├── BootcampPackage.ts  # Bootcamp package model
│   ├── BootcampBatch.ts    # Bootcamp batch model (multiple runs of same package)
│   └── BootcampSession.ts  # Individual session schedule per batch
├── routes/
│   ├── index.ts
│   ├── authRoutes.ts      # Auth routes
│   ├── courseRoutes.ts    # Course, topic, lesson, and progress routes
│   └── bootcampRoutes.ts  # Bootcamp routes (Phase 2.3)
├── seeds/
│   ├── courseSeeder.ts    # Sample course data — npm run seed:courses
│   ├── lessonSeeder.ts    # Sample modules, chapters, lessons — npm run seed:lessons
│   └── bootcampSeeder.ts  # Sample bootcamp data (Phase 2.3)
├── templates/
│   └── otpEmail.ts        # OTP email HTML template (verification & reset)
├── validations/
│   └── authValidation.ts  # Zod schemas for auth endpoints
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

| Feature                                           | Status          |
|---------------------------------------------------|-----------------|
| Authentication                                    | ✅ Done         |
| Course List (landing page)                        | ✅ Done         |
| Course Detail + Video Player                      | ✅ Done         |
| Company Profile Section (Benefits + Footer)       | ✅ Done         |
| Bootcamp List & Detail                            | ✅ Done         |
| Live Session (Agora RTC)                          | 🔄 Coming Soon  |
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

![course](docs/course.png)

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

![course detail](docs/course%20detail%20+%20vid%20player.png)

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
                        BE: save Progress record (upsert — safe to call multiple times)
                              |
                              ▼
                        FE: invalidate course detail query → refetch
                        BE: recomputes is_locked per lesson from latest Progress
                        FE: tick is_done in sidebar, next lesson unlocked
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
moduleId         → ref to Module
title            → string
order            → number
chapter_duration → number (sum of lesson durations, in seconds)
```

**Data Model — Lesson:**
```
chapterId     → ref to Chapter
courseId      → ref to Course (denormalized — used in getCourseProgress + stored in Progress)
title         → string
type          → enum: "video" | "quiz"
order         → number
duration      → number (in seconds — 0 for quiz type)
video_url     → string | null (full YouTube embed URL — null for quiz type)
description   → string
is_locked     → boolean — dual meaning:
                  false = free preview lesson, always accessible without login
                  true  = gated: unauthenticated = locked;
                          authenticated = locked until previous lesson is completed
```
> `is_locked` in the API response is computed dynamically per user from their Progress records — the DB value serves as the free/gated flag, not the final state.

**Data Model — Progress:**
```
userId        → ref to User
lessonId      → ref to Lesson
courseId      → ref to Course (denormalized)
completedAt   → Date
```
> Unique index on `[userId, lessonId]` — one record per user per lesson.

**BE Tasks:**
- [x] Module model (`courseId`, `title`, `order`, `module_duration`)
- [x] Chapter model (`moduleId`, `title`, `order`, `chapter_duration`)
- [x] Lesson model (`chapterId`, `courseId`, `title`, `type`, `order`, `duration`, `video_url`, `description`, `is_locked`)
- [x] Progress model (`userId`, `lessonId`, `courseId`, `completedAt`) — unique index on `[userId, lessonId]`
- [x] `optionalProtect` middleware — passes unauthenticated requests through; attaches `req.userId` if token is valid
- [x] `GET /api/courses/:id` — course detail + nested modules → chapters → lessons with dynamic `is_done` + `is_locked` per user
- [x] `POST /api/courses/update-progress` — mark lesson as complete (`{ lesson_id }` in body), upsert — requires auth
- [x] `GET /api/courses/:id/progress` — completed lesson count + percentage for a course, requires auth
- [x] Seed script `npm run seed:lessons` — 2 modules, 4 chapters, 14 lessons (12 video + 2 quiz) for "Belajar Vue 3 dari Nol"

**FE Tasks:**
- [x] `src/types/courses.ts` — added `Lesson`, `Chapter`, `Module`, `CourseDetail`, `CourseDetailResponse`, `CourseProgressResponse`
- [x] `src/api/courses.ts` — added `getCourseDetail()`, `updateProgress()`, `getCourseProgress()`
- [x] `src/composables/courses/useCourseDetail.ts` — `useQuery` + auto-select first unlocked lesson + `findNextLesson`
- [x] `src/composables/courses/useProgress.ts` — `useMutation` that invalidates course detail query on success
- [x] `/courses/:id` — `CourseDetailView.vue` — responsive: video + lesson info on left/top, sidebar on right/bottom
- [x] `CourseSidebar.vue` — Module accordion → Chapter → Lesson list (is_done ✓, is_locked 🔒, active highlight) + progress bar
- [x] `VideoPlayer.vue` — YouTube IFrame API (dynamic script inject, `onStateChange` → emit `'ended'`)
- [x] "Tandai Selesai" button + auto-mark on video end → calls `updateProgress()`, invalidates query
- [x] "Selanjutnya →" button — navigates to next unlocked lesson
- [x] Lesson locking overlay — if `is_locked: true`, show lock icon + message on video player
- [x] Login prompt banner — shown to unauthenticated visitors on course detail page
- [x] Mobile responsive — stacks vertically on mobile (video → info → sidebar), side-by-side on desktop (lg+)

---

#### 2.3 Bootcamp List & Detail

![Bootcamps](docs/course.png)

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

![Bootcamp details](docs/bootcamp%20detail.png)

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
- [x] BootcampPackage model (`title`, `description`, `image_url`, `status`, `mentors[]`)
- [x] BootcampBatch model (`packageId`, `title`, `sub_title`, `description`, `started_at`, `ended_at`, `quota_used_percentage`, `price`, `strikethrough_price`, `package_type`)
- [x] BootcampSession model (`batchId`, `title`, `session_name`, `session_date`, `session_start_time`, `session_end_time`)
- [x] `GET /api/bootcamps` — list all packages with pagination + search + `?status=`; `starting_price` dihitung dari batch termurah per package
- [x] `GET /api/bootcamps/:id` — package detail with nested batches and sessions (single `$in` query for sessions)
- [x] Seed script `npm run seed:bootcamps` — 3 packages (2 open, 1 coming_soon), 5 batches, 18 sessions

**FE Tasks:**
- [x] `src/types/bootcamps.ts` — `BootcampMentor`, `BootcampSession`, `BootcampBatch`, `BootcampPackage`, `BootcampListResponse`, `BootcampDetailResponse`
- [x] `src/api/bootcamps.ts` — `getBootcamps()`, `getBootcampDetail()`
- [x] `src/composables/bootcamps/useBootcamps.ts` — `useQuery(['bootcamps'])`, staleTime 5 menit
- [x] `src/composables/bootcamps/useBootcampDetail.ts` — `useQuery`, `selectedBatchIndex` (client-side switching), `formatRupiah`, `formatSessionDate`
- [x] `BootcampSection.vue` — grid card + skeleton loading + error/empty state, mounted di `HomeView`
- [x] `BootcampCard.vue` — cover image, status badge, mentor avatars, starting price, link ke detail
- [x] `/bootcamps/:id` — `BootcampDetailView.vue` — cover header, deskripsi, mentor list, batch tabs, session list, sticky CTA card
- [x] CTA card — harga + strikethrough price, progress bar kuota, tombol disabled saat `coming_soon`/`closed`/quota penuh
- [x] Login redirect — simpan `redirect_after_login` ke localStorage, push ke `/auth/login`
- [x] Fix URL `/bootcamp` → `/bootcamps` di `BenefitsSection.vue` dan `AppFooter.vue`

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
- [x] `BenefitsSection.vue` — 3 alternating image + text blocks, static content (Bootcamp, Personal Mentor, Diverse Courses)
- [x] `AppFooter.vue` — logo, navigation links, social media icons (TikTok, LinkedIn, Instagram, X)
- [x] `HomeView.vue` — mount `BenefitsSection` after `CoursesSection`
- [x] `DefaultLayout.vue` — mount `AppFooter` below `<main>` (flex-col so footer sticks to bottom)

### Phase 2.5 — Live Session (Agora RTC)

**Bootcamp sessions run as live video meetings using Agora.io — multiple enrolled users can join the same channel.**

```
[Bootcamp Session Page]

User joins a live session
          |
          ▼
    POST /api/bootcamps/sessions/:sessionId/token  (requires auth + enrollment)
          |
          ├─→ Not authenticated          → redirect to login
          ├─→ Not enrolled in batch      → 403 Forbidden
          └─→ Authenticated + enrolled
                    |
                    ▼
              BE generates Agora RTC token
              (App ID + App Certificate + channelName + uid)
                    |
                    ▼
              FE joins Agora channel with token
              FE renders video grid (mentor + participants)
```

**Agora Integration:**
- Channel name: derived from `BootcampSession._id` (unique per session)
- Token expiry: short-lived (1 hour), generated on demand
- App Certificate stored server-side only (never exposed to FE)

**Data Model Changes:**
```
BootcampSession — no new fields needed; channel name = session _id
```

**BE Tasks:**
- [ ] Add `AGORA_APP_ID` + `AGORA_APP_CERTIFICATE` to `.env`
- [ ] Install `agora-token` (npm) — Agora token generation library
- [ ] `POST /api/bootcamps/sessions/:sessionId/token` — validate enrollment, generate RTC token, return `{ token, channelName, appId, uid }`
- [ ] Enrollment check middleware — verify user is registered for the batch that owns this session

**FE Tasks:**
- [ ] Install `agora-rtc-sdk-ng` (npm)
- [ ] `src/api/bootcamps.ts` — add `getSessionToken(sessionId)`
- [ ] `src/composables/bootcamps/useLiveSession.ts` — join/leave channel, manage local + remote tracks
- [ ] `src/views/bootcamps/LiveSessionView.vue` — video grid (mentor + participants), mic/camera toggle, leave button
- [ ] Add route `/bootcamps/sessions/:sessionId/live` → `LiveSessionView`

---

### Phase 3 — Quiz & Task

> Assumptions: Task = submit URL + optional note. Quiz retry = unlimited. `passing_score` stored on Lesson (default 70). Task auto-approved on submit.

#### 3.1 Quiz

**Quiz Flow:**

```
User clicks quiz lesson in sidebar
          |
          ▼
    GET /api/quiz/:lessonId/my-attempt
          |
          ├─→ has attempt → show result (score + LULUS/GAGAL + retry button)
          |
          └─→ no attempt
                    |
                    ▼
              GET /api/quiz/:lessonId/questions
              (correct_index excluded from response)
                    |
                    ▼
              FE: render multiple-choice form
                    |
              User answers all questions → submit
                    |
                    ▼
              POST /api/quiz/:lessonId/submit  { answers[] }
                    |
                    ├─→ passed: false
                    |         |
                    |         ▼
                    |   FE: show score + "Coba Lagi" button
                    |   Progress NOT created → next lesson stays locked
                    |
                    └─→ passed: true  (score ≥ passing_score)
                              |
                              ▼
                        BE: upsert Progress record
                        FE: invalidateQueries(['course', courseId])
                        sidebar: lesson is_done ✓, next lesson unlocked
```

**Data Model — QuizQuestion:**
```
lessonId      → ref to Lesson (type: 'quiz')
question      → string
options       → string[] (4 choices)
correct_index → number (0–3) — never sent to FE
order         → number
```

**Data Model — QuizAttempt:**
```
userId        → ref to User
lessonId      → ref to Lesson
courseId      → ref to Course (denormalized)
answers       → number[] (selected option index per question, in order)
score         → number (0–100)
passed        → boolean
attemptedAt   → Date
```
> No unique index — multiple attempts allowed. `my-attempt` returns the latest.

**Lesson Model Changes:**
```
type          → enum: 'video' | 'quiz' | 'task'  (add 'task')
passing_score → number, default: 70              (new field)
```
> `POST /api/courses/update-progress` returns 400 if `lesson.type !== 'video'`. Quiz completion is handled exclusively by `POST /api/quiz/:lessonId/submit`.

**BE Tasks:**
- [x] Update `Lesson` model — add `'task'` to type enum, add `passing_score` (default 70)
- [x] `QuizQuestion` model (`lessonId`, `question`, `options[]`, `correct_index`, `order`)
- [x] `QuizAttempt` model (`userId`, `lessonId`, `courseId`, `answers[]`, `score`, `passed`, `attemptedAt`)
- [x] Update `updateProgress` controller — 400 if `lesson.type !== 'video'`
- [x] `GET /api/quiz/:lessonId/questions` — return questions, **exclude `correct_index`**
- [x] `POST /api/quiz/:lessonId/submit` — score server-side, save QuizAttempt, upsert Progress if passed
- [x] `GET /api/quiz/:lessonId/my-attempt` — latest attempt or null
- [x] Register `quizRoutes` in `routes/index.ts`
- [x] Seed script `npm run seed:quiz` — questions for existing quiz lessons

**FE Tasks:**
- [x] `src/types/courses.ts` — `Lesson.type` add `'task'`, add `passing_score`
- [x] `src/types/quiz.ts` — `QuizQuestion`, `QuizAttemptResult`, `QuizSubmitPayload`
- [x] `src/api/quiz.ts` — `getQuizQuestions()`, `submitQuizAnswers()`, `getMyAttempt()`
- [x] `src/composables/courses/useQuiz.ts` — questions query, attempt query, submit mutation, `userAnswers` state, `allAnswered` computed
- [x] `QuizPlayer.vue` — form soal → loading → result (score + LULUS/GAGAL + retry). If `isDone` → show result directly
- [x] `CourseDetailView.vue` — branch `activeLesson.type`: `'quiz'` → `<QuizPlayer>`. Fix `handleVideoEnded` guard. Hide "Tandai Selesai" for quiz
- [x] `CourseSidebar.vue` — already has "Quiz" label — no change needed

---

#### 3.2 Task

**Task Flow:**

```
User clicks task lesson in sidebar
          |
          ▼
    GET /api/tasks/:lessonId/my-submission
          |
          ├─→ submission exists → show read-only submitted view (URL + note + "Selesai" badge)
          |
          └─→ no submission
                    |
                    ▼
              FE: show task description + URL input + optional note textarea
                    |
              User inputs URL → submit
                    |
                    ▼
              POST /api/tasks/:lessonId/submit  { submission_url, note }
                    |
                    ▼
              BE: save TaskSubmission
              BE: upsert Progress record (auto-approve)
              FE: invalidateQueries(['course', courseId])
              sidebar: lesson is_done ✓
```

**Data Model — TaskSubmission:**
```
userId          → ref to User
lessonId        → ref to Lesson (type: 'task')
courseId        → ref to Course (denormalized)
submission_url  → string
note            → string (optional)
status          → 'submitted'
submittedAt     → Date
```
> Unique index on `[userId, lessonId]` — one submission per user per lesson.

**BE Tasks:**
- [x] `TaskSubmission` model (`userId`, `lessonId`, `courseId`, `submission_url`, `note`, `status`, `submittedAt`) — unique index `[userId, lessonId]`
- [x] `POST /api/tasks/:lessonId/submit` — save TaskSubmission, upsert Progress
- [x] `GET /api/tasks/:lessonId/my-submission` — submission or null
- [x] Register `taskRoutes` in `routes/index.ts`

**FE Tasks:**
- [x] `src/types/quiz.ts` — add `TaskSubmission`, `TaskSubmitPayload`
- [x] `src/api/tasks.ts` — `submitTask()`, `getMySubmission()`
- [x] `src/composables/courses/useTask.ts` — submission query, submit mutation
- [x] `TaskPlayer.vue` — submit form (URL + note). If `isDone` → read-only submitted view
- [x] `CourseDetailView.vue` — branch `activeLesson.type`: `'task'` → `<TaskPlayer>`. Hide "Tandai Selesai" for task
- [x] `CourseSidebar.vue` — add "Task" label for `lesson.type === 'task'`

### Phase 4 — Checkout & Subscription

> Per-course purchase (lifetime access). Payment via Midtrans Snap. Free courses (`isFree: true`) skip checkout entirely. `Order` locks in price at creation time. Enrollment dibuat oleh Midtrans webhook setelah settlement.

#### 4.1 Course Checkout

**Checkout Flow:**

```
User navigates to /courses/:id
          |
          ▼
    GET /api/courses/:id  (optionalProtect — middleware authMiddleware.ts)
    Response: { course: { ...courseData, isEnrolled: boolean, modules: [...] } }
          |
          ├─→ course.isFree = true    → semua lesson accessible, skip enrollment check
          ├─→ isEnrolled: true        → tampilkan konten kursus normal
          └─→ isEnrolled: false
                    |
                    ▼
              CourseDetailView.vue tampilkan tombol "Beli Kurs"
              User klik → useCheckout.ts dipanggil
                    |
                    ▼
              POST /api/checkout/create-order  { courseId }
              ├─→ course gratis       → 400 error
              ├─→ sudah enrolled      → 409 error
              ├─→ ada pending order   → reuse snap_token yang ada
              └─→ buat Order baru (status: 'pending') + generate Snap token
                    |
                    ▼
              FE: loadSnapScript() → inject snap.js ke <head>
              window.snap.pay(snap_token, { onSuccess, onPending, onError, onClose })
              Midtrans popup terbuka
                    |
              User bayar
                    |
                    ▼
              ┌─────────────────────────────────────────────────┐
              │  Dua path berjalan paralel                       │
              └─────────────────────────────────────────────────┘
                    ↓                              ↓
          Snap callback (FE)            Midtrans POST webhook (server-to-server)
          onSuccess / onPending         POST /api/checkout/webhook
          router.push ke               1. Verifikasi SHA512 signature_key
          /checkout/result             2. Order.status = 'paid', paidAt = now
          ?order_id=                   3. Enrollment.findOneAndUpdate (upsert)
          &course_id=                     { userId, courseId, orderId, enrolledAt }
          &result=success/pending
                    ↓
          CheckoutResultView.vue
          useEnrollment(courseId).startPolling(onEnrolled, onTimeout)
          setiap 2 detik, max 15x (30 detik):
            GET /api/enrollments/check/:courseId
            ├─→ isEnrolled: true   → clearInterval → router.push /courses/:id ✅
            └─→ isEnrolled: false  → tunggu webhook isi DB, coba lagi
                    |
              (setelah 30 detik, webhook tidak sampai)
                    ↓
              isTimedOut = true
              tampilkan warning + tombol "Cek Status Pembayaran"
                    |
              user klik → manualVerify(orderId)
                    ↓
              GET /api/checkout/verify/:orderId
              BE tanya langsung ke Midtrans API
              ├─→ settled → upsert Enrollment → router.push /courses/:id ✅
              └─→ belum   → tombol aktif kembali, user bisa coba lagi
```

**Snap.js URL:**
```
Sandbox   : https://app.sandbox.midtrans.com/snap/snap.js
Production: https://app.midtrans.com/snap/snap.js
```
> Ganti `src` di `loadSnapScript()` pada `useCheckout.ts` sesuai environment.

**Local Development — Setup Webhook dengan ngrok:**
```bash
# 1. Install ngrok
brew install ngrok

# 2. Tambahkan auth token (daftar gratis di ngrok.com)
ngrok config add-authtoken <your_token>

# 3. Expose BE server
ngrok http 3000
# → output: https://xxxx.ngrok-free.app

# 4. Set Notification URL di Midtrans Dashboard
#    Settings → Payment → Notification URL:
#    https://xxxx.ngrok-free.app/api/checkout/webhook
```
> URL ngrok berubah setiap restart (free plan) — update ulang di Midtrans Dashboard setiap kali ngrok dijalankan ulang.

**Fallback — Manual Verify (tanpa ngrok):**

`GET /api/checkout/verify/:orderId` — BE aktif tanya status ke Midtrans API langsung, upsert Enrollment jika settled. Berguna saat webhook tidak bisa jangkau localhost.

**Data Model — Order:**
```
userId         → ref to User
courseId       → ref to Course
amount         → number (locked-in price at order creation)
status         → 'pending' | 'paid' | 'failed' | 'expired'
snap_token     → string (Midtrans Snap token)
midtrans_order_id → string (unique, format: ORD-{base36timestamp}-{random6}, max 50 chars)
paidAt         → Date | null
```

**Data Model — Enrollment:**
```
userId    → ref to User
courseId  → ref to Course
orderId   → ref to Order
enrolledAt → Date
```
> Unique index on `[userId, courseId]`. Created only after Midtrans `settlement` webhook.

**Course Model Changes:**
```
price → number (harga dalam rupiah, 0 jika isFree)
```

**getCourseDetail Changes:**
```
isFree = true           → skip enrollment check, all lessons follow sequential progress
isFree = false
  └─ not enrolled       → all locked lessons return is_locked: true + isEnrolled: false
  └─ enrolled           → sequential progress logic as before
```
> Response includes `isEnrolled: boolean` field at course level.

**BE Tasks:**
- [x] Update `Course` model — add `price` field
- [x] `Order` model (`userId`, `courseId`, `amount`, `status`, `snap_token`, `midtrans_order_id`, `paidAt`)
- [x] `Enrollment` model (`userId`, `courseId`, `orderId`, `enrolledAt`) — unique index `[userId, courseId]`
- [x] `POST /api/checkout/create-order` — validate, reuse pending order or create new, return Snap token
- [x] `POST /api/checkout/webhook` — **primary**: Midtrans push notification, verify signature, update Order, upsert Enrollment
- [x] `GET /api/checkout/verify/:orderId` — **fallback**: BE aktif tanya ke Midtrans API, upsert Enrollment jika settled (untuk local dev / tombol "Cek Status")
- [x] `GET /api/enrollments/check/:courseId` — return `{ isEnrolled: boolean }` — dipolling FE setelah bayar
- [x] Update `getCourseDetail` — add enrollment gate + `isEnrolled` in response
- [x] Register `checkoutRoutes` and `enrollmentRoutes` in `routes/index.ts`
- [x] Update `courseSeeder` — add `price` field to all courses

**FE Tasks:**
- [x] `src/types/courses.ts` — add `price` to `Course`, add `isEnrolled` to `CourseDetail`
- [x] `src/types/checkout.ts` — `Order`, `CreateOrderResponse`, `EnrollmentStatus`
- [x] `src/api/checkout.ts` — `createOrder()`, `verifyPayment()` (fallback)
- [x] `src/api/enrollments.ts` — `checkEnrollment()`
- [x] `src/composables/checkout/useCheckout.ts` — load snap.js, createOrder mutation, snap.pay callbacks
- [x] `src/composables/checkout/useEnrollment.ts` — polls `checkEnrollment()` setiap 2s hingga webhook mengisi DB; `onTimeout` callback setelah 30 detik; `manualVerify(orderId)` sebagai fallback ke verify endpoint
- [x] `CheckoutResultView.vue` — success/pending/error state; polling dengan timeout handler; tampilkan tombol "Cek Status Pembayaran" jika webhook terlambat; redirect ke course setelah enrolled
- [x] `CourseCard.vue` — show price badge or "Free" label
- [x] `CourseDetailView.vue` — show "Beli Kurs" CTA if not enrolled, hide progress actions
- [x] Add route `/checkout/result` → `CheckoutResultView`

### Phase 5 — User Profile & Purchase History

#### 5.1 My Courses (Kursus Saya)

**Flow:**

```
User navigates to /my-courses  (requires auth)
          |
          ▼
    GET /api/enrollments/my-courses
    Response: list enrolled courses + progress per course
          |
          ▼
    FE: tampilkan card per course
        - cover, title, level
        - progress bar (% selesai)
        - tombol "Lanjut Belajar" → /courses/:id?lesson=<last_active_lesson>
          |
          └─→ course 0% → tombol "Mulai Belajar"
          └─→ course 100% → badge "Selesai" + tombol "Ulangi"
```

**Data yang dikembalikan per course:**
```
enrolledAt    → Date
course        → { _id, title, cover_url, level, topic_name, total_lessons }
progress      → { completed_lessons, total_lessons, percentage }
lastLesson    → _id lesson terakhir yang dikerjakan (dari Progress terbaru)
```
> Tidak butuh model baru — query join `Enrollment` + `Progress` + `Course`.

**BE Tasks:**
- [ ] `GET /api/enrollments/my-courses` — list enrolled courses + progress percentage per course

**FE Tasks:**
- [ ] `src/api/enrollments.ts` — tambah `getMyCourses()`
- [ ] `src/composables/enrollments/useMyCourses.ts` — `useQuery` untuk enrolled courses
- [ ] `src/views/profile/MyCoursesView.vue` — grid card enrolled courses + progress
- [ ] Add route `/my-courses` → `MyCoursesView` (requiresAuth)
- [ ] `AppNavbar.vue` — tambah link "Kursus Saya" untuk user yang login

---

#### 5.2 User Profile

**Flow:**

```
User navigates to /profile  (requires auth)
          |
          ▼
    GET /api/auth/me  (sudah ada)
          |
          ▼
    FE: tampilkan info (nama, email, avatar, metode login)
          |
    User edit nama / upload foto
          |
          ▼
    PATCH /api/users/profile  { name, avatar_url }
          |
    User ganti password (non-Google only)
          |
          ▼
    PATCH /api/users/change-password  { currentPassword, newPassword }
```

**User Model Changes:**
```
avatar_url  → string, optional (URL foto profil — upload ke Cloudinary/S3)
```
> Field lain (`name`, `email`, `password`, `googleId`) sudah ada sejak Phase 1.

**BE Tasks:**
- [ ] Update `User` model — tambah field `avatar_url?: string`
- [ ] `PATCH /api/users/profile` — update name + avatar_url
- [ ] `PATCH /api/users/change-password` — validasi current password, update hash (skip jika Google-only user)

**FE Tasks:**
- [ ] `src/api/users.ts` — `updateProfile()`, `changePassword()`
- [ ] `src/composables/profile/useProfile.ts` — mutation update profile + change password
- [ ] `src/views/profile/ProfileView.vue` — form edit nama, upload avatar, ganti password
- [ ] Add route `/profile` → `ProfileView` (requiresAuth)

---

#### 5.3 Purchase History

**Flow:**

```
User navigates to /profile/orders  (requires auth)
          |
          ▼
    GET /api/orders/my-orders
    Response: list orders dengan status (paid, pending, expired, failed)
          |
          ▼
    FE: tampilkan list order
        - nama course, harga, tanggal, status badge
        - order pending → tombol "Selesaikan Pembayaran" (buka snap dengan token yang sama)
```

**Data yang dikembalikan per order:**
```
midtrans_order_id  → string
amount             → number
status             → 'pending' | 'paid' | 'failed' | 'expired'
paidAt?            → Date
createdAt          → Date
course             → { _id, title, cover_url } (populate dari courseId)
```
> Tidak butuh model baru — query dari `Order` collection yang sudah ada, populate `courseId`.

**BE Tasks:**
- [ ] `GET /api/orders/my-orders` — list semua order milik user, populate course title + cover

**FE Tasks:**
- [ ] `src/api/orders.ts` — `getMyOrders()`
- [ ] `src/composables/profile/useMyOrders.ts` — `useQuery` untuk order history
- [ ] `src/views/profile/OrderHistoryView.vue` — tabel/list order dengan status badge
- [ ] Add route `/profile/orders` → `OrderHistoryView` (requiresAuth)

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

### Quiz

| Method | Endpoint                              | Description                                                         | Auth |
|--------|---------------------------------------|---------------------------------------------------------------------|------|
| GET    | /api/quiz/:lessonId/questions         | Quiz questions for a lesson (correct_index excluded)                | JWT  |
| POST   | /api/quiz/:lessonId/submit            | Submit answers — scores server-side, creates Progress if passed     | JWT  |
| GET    | /api/quiz/:lessonId/my-attempt        | Latest quiz attempt for current user (null if none)                 | JWT  |

### Task

| Method | Endpoint                              | Description                                                         | Auth |
|--------|---------------------------------------|---------------------------------------------------------------------|------|
| POST   | /api/tasks/:lessonId/submit           | Submit task URL + note, auto-creates Progress                       | JWT  |
| GET    | /api/tasks/:lessonId/my-submission    | Task submission for current user (null if none)                     | JWT  |

### Checkout & Enrollment

| Method | Endpoint                              | Description                                                                          | Auth |
|--------|---------------------------------------|--------------------------------------------------------------------------------------|------|
| POST   | /api/checkout/create-order            | Create order + generate Midtrans Snap token (reuses pending order if exists)         | JWT  |
| POST   | /api/checkout/webhook                 | **Primary** — Midtrans push: verify signature, update Order, upsert Enrollment       | -    |
| GET    | /api/checkout/verify/:orderId         | **Fallback** — BE pulls status from Midtrans API, upsert Enrollment if settled       | JWT  |
| GET    | /api/enrollments/check/:courseId      | Cek status enrollment user — dipolling FE setelah bayar hingga webhook mengisi DB    | JWT  |

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
| `MIDTRANS_SERVER_KEY`   | `Mid-server-xxxx`                            | Midtrans server key (never exposed to FE)|
| `MIDTRANS_CLIENT_KEY`   | `Mid-client-xxxx`                            | Midtrans client key                      |
| `MIDTRANS_IS_PRODUCTION`| `false`                                      | `true` for production environment        |

### Frontend (`fe-apps/.env`)

| Variable                  | Example                                      | Description                        |
|---------------------------|----------------------------------------------|------------------------------------|
| `VITE_API_URL`            | `http://localhost:3000/api`                  | BE API base URL                    |
| `VITE_GOOGLE_CLIENT_ID`   | `xxxx.apps.googleusercontent.com`            | Google OAuth client ID (same as BE)|
| `VITE_GOOGLE_REDIRECT_URI`   | `http://localhost:5173/auth/google/callback` | Must match BE env & Google Console |
| `VITE_MIDTRANS_CLIENT_KEY`   | `Mid-client-xxxx`                            | Midtrans client key (for snap.js)  |

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐
│    User     │──1:N──│   Session   │
│─────────────│       │─────────────│
│ _id         │       │ userId (FK) │
│ name        │       │ deviceId    │
│ email       │       │ refreshToken│
│ password?   │       │ expiredAt   │
│ googleId?   │       └─────────────┘
│ avatar_url? │
│ role        │
│ isVerified  │       ┌─────────────┐
│ otp?        │──1:N──│  Progress   │
└──────┬──────┘       │─────────────│
       │              │ userId (FK) │
       │              │ lessonId(FK)│
       │              │ courseId(FK)│
       │              │ completedAt │
       │              └─────────────┘
       │
       │              ┌─────────────┐
       ├───────1:N────│ QuizAttempt │
       │              │─────────────│
       │              │ userId (FK) │
       │              │ lessonId(FK)│
       │              │ courseId(FK)│
       │              │ answers[]   │
       │              │ score       │
       │              │ passed      │
       │              └─────────────┘
       │
       │              ┌──────────────────┐
       ├───────1:N────│  TaskSubmission   │
       │              │──────────────────│
       │              │ userId (FK)      │
       │              │ lessonId (FK)    │
       │              │ courseId (FK)    │
       │              │ submission_url   │
       │              │ note?            │
       │              │ status           │
       │              └──────────────────┘
       │
       │              ┌─────────────┐       ┌─────────────┐
       └───────1:N────│    Order    │──1:1──│  Enrollment │
                      │─────────────│       │─────────────│
                      │ userId (FK) │       │ userId (FK) │
                      │ courseId(FK)│       │ courseId(FK)│
                      │ amount      │       │ orderId (FK)│
                      │ status      │       │ enrolledAt  │
                      │ snap_token  │       └─────────────┘
                      │ midtrans_id │
                      │ paidAt?     │
                      └─────────────┘


┌─────────────┐
│   Course    │
│─────────────│
│ _id         │
│ title       │
│ description │
│ cover_url   │
│ topic       │
│ topic_name  │
│ level       │
│ isFree      │
│ price       │
│ video_amount│
│total_lessons│
│course_durat.│
└──────┬──────┘
       │
       │ 1:N
       ▼
┌─────────────┐
│   Module    │
│─────────────│
│ courseId(FK)│
│ title       │
│ order       │
│module_durat.│
└──────┬──────┘
       │
       │ 1:N
       ▼
┌─────────────┐
│   Chapter   │
│─────────────│
│ moduleId(FK)│
│ title       │
│ order       │
│chapter_dur. │
└──────┬──────┘
       │
       │ 1:N
       ▼
┌───────────────┐       ┌──────────────┐
│    Lesson     │──1:N──│ QuizQuestion │
│───────────────│       │──────────────│
│ chapterId(FK) │       │ lessonId(FK) │
│ courseId (FK) │       │ question     │
│ title         │       │ options[]    │
│ type          │       │ correct_index│
│ order         │       │ order        │
│ duration      │       └──────────────┘
│ video_url?    │
│ description   │
│ is_locked     │
│ passing_score │
└───────────────┘


┌──────────────────┐
│ BootcampPackage  │
│──────────────────│
│ title            │
│ description      │
│ image_url        │
│ status           │
│ mentors[]        │
│  └ name          │
│  └ image_url     │
│  └ occupation    │
└────────┬─────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│  BootcampBatch   │
│──────────────────│
│ packageId (FK)   │
│ title            │
│ sub_title        │
│ description      │
│ started_at       │
│ ended_at         │
│ quota_used_%     │
│ price            │
│ strikethrough_pr │
│ package_type     │
└────────┬─────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│ BootcampSession  │
│──────────────────│
│ batchId (FK)     │
│ title            │
│ session_name     │
│ session_date     │
│ start_time       │
│ end_time         │
└──────────────────┘
```

### Collections Summary

| Collection         | Indexes                                      | Notes                                      |
|--------------------|----------------------------------------------|--------------------------------------------|
| `users`            | `email` (unique)                             | `password` optional (Google-only users); `avatar_url` ditambah Phase 5 |
| `sessions`         | `userId + deviceId` (unique), TTL on `refreshExpiredAt` | One active session per device   |
| `courses`          | -                                            | `price = 0` when `isFree = true`           |
| `modules`          | `courseId`                                   | Ordered with `order` field                 |
| `chapters`         | `moduleId`                                   | Ordered with `order` field                 |
| `lessons`          | `chapterId`, `courseId`                      | `is_locked` = free preview flag in DB; computed dynamically in API |
| `progresses`       | `[userId, lessonId]` (unique)                | Upsert-safe                                |
| `quizquestions`    | `lessonId`                                   | `correct_index` never returned to FE       |
| `quizattempts`     | `[userId, lessonId]`                         | Multiple attempts allowed; `my-attempt` returns latest |
| `tasksubmissions`  | `[userId, lessonId]` (unique)                | One submission per user per lesson         |
| `orders`           | `midtrans_order_id` (unique), `[userId, courseId, status]` | Pending orders reused to avoid duplicate Snap tokens |
| `enrollments`      | `[userId, courseId]` (unique)                | Created after payment settlement           |
| `bootcamppackages` | -                                            | Mentors embedded (not a separate collection) |
| `bootcampbatches`  | `packageId`                                  | `starting_price` aggregated from cheapest batch |
| `bootcampsessions` | `batchId`                                    | -                                          |

---
