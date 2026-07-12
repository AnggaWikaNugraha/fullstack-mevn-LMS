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
│   ├── bootcamps.ts           # Bootcamp API calls
│   ├── quiz.ts                # Quiz API calls
│   ├── tasks.ts               # Task API calls
│   ├── checkout.ts            # Checkout + payment verify API calls
│   ├── enrollments.ts         # Enrollment check + my-courses API calls
│   ├── users.ts               # User profile + change-password API calls
│   └── orders.ts              # Purchase history API calls
├── composables/
│   ├── useDeviceId.ts         # Generate and read UUID deviceId
│   ├── auth/                  # Auth composables (logic separated from views)
│   │   ├── useLogin.ts
│   │   ├── useRegister.ts
│   │   ├── useOtpVerification.ts
│   │   ├── useForgotPassword.ts
│   │   ├── useResetPassword.ts
│   │   └── useGoogleAuth.ts
│   ├── courses/               # Course composables
│   │   ├── useCourses.ts      # useQuery for course list + topic filter
│   │   ├── useCourseDetail.ts # useQuery for course detail + lesson list + course/isEnrolled computed
│   │   ├── useProgress.ts     # useMutation for mark lesson complete
│   │   ├── useQuiz.ts         # Quiz questions, attempt, submit mutation
│   │   └── useTask.ts         # Task submission query + submit mutation
│   ├── bootcamps/
│   │   ├── useBootcamps.ts
│   │   └── useBootcampDetail.ts
│   ├── checkout/
│   │   ├── useCheckout.ts     # load snap.js, createOrder, snap.pay callbacks
│   │   └── useEnrollment.ts   # polling + timeout + manualVerify fallback
│   ├── enrollments/
│   │   └── useMyEnrollments.ts  # useQuery for my-courses with progress
│   ├── orders/
│   │   └── useOrders.ts         # useQuery for purchase history
│   └── user/
│       └── useProfile.ts        # getProfile query + updateProfile + changePassword mutations
├── layouts/
│   ├── DefaultLayout.vue      # Navbar + Footer
│   ├── AuthLayout.vue         # Split-screen (branding left, form right)
│   └── ProfileLayout.vue      # Navbar + sidebar (Course Saya, Profil, Riwayat Pembelian) + RouterView
├── router/
│   ├── index.ts               # Vue Router + navigation guard
│   └── routes/
│       ├── auth.ts            # Auth routes (guest-only)
│       ├── public.ts          # Public routes under DefaultLayout
│       └── protected.ts       # Protected routes under ProfileLayout (requiresAuth)
├── stores/
│   ├── authStore.ts           # Pinia — access token (memory), user, refresh token (localStorage)
│   └── errorStore.ts          # Pinia — global error modal state
├── types/
│   ├── api.ts                 # Shared ApiResponse<T> + Pagination
│   ├── auth.ts                # Auth requests/responses + UpdateProfilePayload + ChangePasswordPayload
│   ├── courses.ts             # Course, Lesson, Module, Chapter, CourseDetail, Progress
│   ├── bootcamps.ts           # Bootcamp types
│   ├── checkout.ts            # Order, CreateOrderResponse, EnrollmentStatus, VerifyPaymentResponse
│   ├── quiz.ts                # QuizQuestion, QuizAttemptResult, TaskSubmission
│   ├── enrollments.ts         # MyCourse, MyCoursesResponse
│   └── orders.ts              # MyOrder, MyOrdersResponse
├── utils/
│   └── format.ts              # formatRupiah, formatDate, progressPercent
├── views/
│   ├── HomeView.vue
│   ├── courses/
│   │   └── CourseDetailView.vue
│   ├── bootcamps/
│   │   ├── BootcampsView.vue
│   │   └── BootcampDetailView.vue
│   ├── checkout/
│   │   └── CheckoutResultView.vue
│   ├── user/
│   │   ├── MyCoursesView.vue        # Grid kursus yang sudah dibeli + progress bar
│   │   ├── ProfileView.vue          # Edit nama, avatar URL, ganti password
│   │   └── PurchaseHistoryView.vue  # List riwayat order + status badge
│   └── auth/
│       ├── LoginView.vue
│       ├── RegisterView.vue
│       ├── OtpVerificationView.vue
│       ├── ForgotPasswordView.vue
│       ├── ResetPasswordView.vue
│       └── GoogleCallbackView.vue
└── components/
    ├── ui/
    │   ├── GlobalErrorModal.vue
    │   ├── AppNavbar.vue           # Dropdown user menu (Course Saya, Profil, Riwayat Pembelian, Logout)
    │   ├── AppFooter.vue
    │   └── GoogleSignInButton.vue
    ├── sections/
    │   ├── HeroSection.vue
    │   ├── CoursesSection.vue
    │   ├── BootcampSection.vue
    │   └── BenefitsSection.vue
    └── course/
        ├── CourseCard.vue
        ├── BootcampCard.vue
        ├── CourseSidebar.vue
        ├── VideoPlayer.vue
        ├── QuizPlayer.vue
        └── TaskPlayer.vue
```

### Backend (`be-server/src/`)

```
src/
├── config/
│   ├── database.ts        # MongoDB connection
│   └── mailer.ts          # Nodemailer Gmail setup
├── controllers/
│   ├── authController.ts        # Auth route handlers
│   ├── courseController.ts      # Course, topic, lesson, progress route handlers
│   ├── bootcampController.ts    # Bootcamp package, batch, session route handlers
│   ├── checkoutController.ts    # createOrder, handleWebhook, verifyPayment
│   ├── enrollmentController.ts  # checkEnrollment, getMyCourses
│   ├── quizController.ts        # Quiz questions, submit, my-attempt
│   ├── taskController.ts        # Task submit, my-submission
│   ├── userController.ts        # getProfile, updateProfile, changePassword
│   └── orderController.ts       # getMyOrders
├── middlewares/
│   ├── authMiddleware.ts  # protect + optionalProtect
│   ├── errorHandler.ts
│   ├── rateLimiter.ts
│   └── requestLogger.ts
├── models/
│   ├── User.ts             # name, email, password?, googleId?, avatar_url?, role, isVerified, otp
│   ├── Session.ts          # Device session (TTL index)
│   ├── Course.ts           # title, cover_url, topic, level, isFree, price, stats
│   ├── Module.ts
│   ├── Chapter.ts
│   ├── Lesson.ts           # type: video|quiz|task, passing_score, is_locked
│   ├── Progress.ts         # userId, lessonId, courseId — unique [userId, lessonId]
│   ├── QuizQuestion.ts     # options[], correct_index (never sent to FE)
│   ├── QuizAttempt.ts      # answers[], score, passed — multiple attempts allowed
│   ├── TaskSubmission.ts   # submission_url, note, status — unique [userId, lessonId]
│   ├── Order.ts            # amount, status, snap_token, midtrans_order_id, paidAt
│   ├── Enrollment.ts       # userId, courseId, orderId — unique [userId, courseId]
│   ├── BootcampPackage.ts
│   ├── BootcampBatch.ts
│   └── BootcampSession.ts
├── routes/
│   ├── index.ts
│   ├── authRoutes.ts
│   ├── courseRoutes.ts
│   ├── bootcampRoutes.ts
│   ├── quizRoutes.ts
│   ├── taskRoutes.ts
│   ├── checkoutRoutes.ts
│   ├── enrollmentRoutes.ts
│   ├── userRoutes.ts        # GET/PATCH /users/profile, PATCH /users/change-password
│   └── orderRoutes.ts       # GET /orders/my-orders
├── seeds/
│   ├── courseSeeder.ts      # npm run seed:courses
│   ├── lessonSeeder.ts      # npm run seed:lessons
│   ├── bootcampSeeder.ts    # npm run seed:bootcamps
│   ├── allLessonsSeeder.ts  # npm run seed:all-lessons (all 6 courses)
│   └── allQuizSeeder.ts     # npm run seed:all-quiz (5 questions × 15 quiz lessons)
├── templates/
│   └── otpEmail.ts
├── validations/
│   └── authValidation.ts
└── index.ts
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
| Quiz & Task                                       | ✅ Done         |
| Checkout & Payment (Midtrans)                     | ✅ Done         |
| Course Saya (My Courses)                          | ✅ Done         |
| User Profile (edit nama, avatar, password)        | ✅ Done         |
| Purchase History (riwayat pembelian)              | ✅ Done         |
| Admin — Course & Quiz Management                  | 🔄 Coming Soon  |
| Admin — User & Bootcamp Management                | 🔄 Coming Soon  |
| Admin — Order & Task Review                       | 🔄 Coming Soon  |
| Admin — Dashboard Stats & Revenue Report          | 🔄 Coming Soon  |
| Bootcamp Checkout & Payment (Midtrans)            | 🔄 Coming Soon  |
| Bootcamp Saya (My Bootcamps)                      | 🔄 Coming Soon  |
| Course Completion Certificate (PDF download)      | 🔄 Coming Soon  |
| Live Session (Agora RTC)                          | 🔄 Coming Soon  |
| Notifications                                     | 🔄 Coming Soon  |

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
- [x] `POST /api/courses/update-progress` — mark lesson as complete (`{ lesson_id }` in body), upsert Progress; jika course `isFree: true` → upsert Enrollment (orderId: null) sekaligus (⚠️ update existing code in Phase 4)
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
          ├─→ submission exists → show read-only submitted view
          |   (URL + note + status badge: Menunggu Review / Disetujui / Ditolak + feedback)
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
              BE: save TaskSubmission (status: 'submitted')
              ⚠️  Progress NOT created yet — lesson stays locked until admin approves (Phase 6.7)
              FE: invalidateQueries(['submission', lessonId])
              sidebar: lesson tampil badge "Menunggu Review" (bukan is_done ✓)
```

> **Phase 6.7 changes this behavior**: `POST /api/tasks/:lessonId/submit` no longer auto-creates Progress.
> Progress is only created when admin approves the submission via `PATCH /api/admin/tasks/:submissionId`.

**Data Model — TaskSubmission:**
```
userId          → ref to User
lessonId        → ref to Lesson (type: 'task')
courseId        → ref to Course (denormalized)
submission_url  → string
note            → string (optional)
status          → 'submitted' | 'approved' | 'rejected'
feedback        → string | null  (diisi admin saat reject)
submittedAt     → Date
```
> Unique index on `[userId, lessonId]` — one submission per user per lesson.

**BE Tasks:**
- [x] `TaskSubmission` model (`userId`, `lessonId`, `courseId`, `submission_url`, `note`, `status`, `submittedAt`) — unique index `[userId, lessonId]`
- [x] `POST /api/tasks/:lessonId/submit` — save TaskSubmission (status: `'submitted'`), **no Progress created** (⚠️ update existing code in Phase 6.7)
- [x] `GET /api/tasks/:lessonId/my-submission` — submission or null
- [x] Register `taskRoutes` in `routes/index.ts`

**FE Tasks:**
- [x] `src/types/quiz.ts` — add `TaskSubmission`, `TaskSubmitPayload`
- [x] `src/api/tasks.ts` — `submitTask()`, `getMySubmission()`
- [x] `src/composables/courses/useTask.ts` — submission query, submit mutation
- [x] `TaskPlayer.vue` — submit form (URL + note). If submission exists → read-only view with status badge + feedback if rejected (⚠️ update in Phase 6.7)
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
userId     → ref to User
courseId   → ref to Course
orderId    → ref to Order, optional (null for free courses)
enrolledAt → Date
```
> Unique index on `[userId, courseId]`. Created only after Midtrans `settlement` webhook for paid courses; created directly for free courses.

**Course Model Changes:**
```
price → number (harga dalam rupiah, 0 jika isFree)
```

**getCourseDetail Changes:**
```
isFree = true           → skip enrollment check, all lessons follow sequential progress
                          isEnrolled = true (course gratis selalu dianggap enrolled)
isFree = false
  └─ not enrolled       → all locked lessons return is_locked: true + isEnrolled: false
  └─ enrolled           → sequential progress logic as before
```
> Response includes `isEnrolled: boolean` field at course level.

**Free Course — Enrollment Record:**
```
POST /api/courses/update-progress  (lesson di course isFree: true)
          |
          ▼
    BE: upsert Progress record
    BE: upsert Enrollment (orderId: null) ← dibuat saat progress pertama kali
          |
          ▼
    Course gratis muncul di "Course Saya" (GET /api/enrollments/my-courses)
```
> Enrollment untuk course gratis dibuat **lazy** — saat user pertama kali menyelesaikan sebuah lesson. `orderId` null dan tidak perlu Order record.

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

### Phase 5 — User Profile & Purchase History ✅

> Semua route protected: `requiresAuth: true`. Menggunakan `ProfileLayout.vue` yang menyediakan navbar + sidebar (Course Saya, Profil, Riwayat Pembelian) — mobile pakai pill nav.

#### 5.1 My Courses (Course Saya)

**Flow:**

```
User navigates to /my-courses  (requires auth)
          |
          ▼
    GET /api/enrollments/my-courses
    Response: list enrolled courses + completed_lessons per course
          |
          ▼
    FE: tampilkan card per course
        - cover, title, tanggal bergabung
        - progress bar (completed / total_lessons, %)
        - link "Lanjut Belajar" → /courses/:id
```

**Data yang dikembalikan per course:**
```
enrollment_id     → string
enrolled_at       → Date
completed_lessons → number (count dari Progress collection)
course            → { _id, title, cover_url, level, topic_name, total_lessons, ... }
```
> Tidak butuh model baru — query join `Enrollment` + `Progress.countDocuments` + populate `Course`.

**BE Tasks:**
- [x] `GET /api/enrollments/my-courses` — list enrolled courses + `completed_lessons` per course (dihitung dari Progress)

**FE Tasks:**
- [x] `src/types/enrollments.ts` — `MyCourse`, `MyCoursesResponse`
- [x] `src/api/enrollments.ts` — tambah `getMyCourses()`
- [x] `src/composables/enrollments/useMyEnrollments.ts` — `useQuery` + `courses` computed
- [x] `src/utils/format.ts` — tambah `formatDate()`, `progressPercent()`
- [x] `src/views/user/MyCoursesView.vue` — grid card enrolled courses + progress bar
- [x] Add route `/my-courses` → `MyCoursesView` (requiresAuth, under ProfileLayout)
- [x] `AppNavbar.vue` — dropdown user menu dengan link "Course Saya"

---

#### 5.2 User Profile

**Flow:**

```
User navigates to /profile  (requires auth)
          |
          ▼
    GET /api/users/profile
          |
          ▼
    FE: tampilkan form edit (nama, avatar URL)
          |
    User submit perubahan
          |
          ▼
    PATCH /api/users/profile  { name, avatar_url }
    → authStore.setUser(updatedUser) — sinkronkan navbar
          |
    User ganti password (non-Google only)
          |
          ▼
    PATCH /api/users/change-password  { currentPassword, newPassword, confirmPassword }
    BE: validasi currentPassword, skip jika akun Google-only
```

**User Model Changes:**
```
avatar_url  → string | null, optional (URL foto profil)
```

**BE Tasks:**
- [x] Update `User` model — tambah field `avatar_url?: string`
- [x] `GET /api/users/profile` — return user data
- [x] `PATCH /api/users/profile` — update name + avatar_url (min 2 karakter)
- [x] `PATCH /api/users/change-password` — validasi currentPassword, hash baru, return 400 jika Google-only

**FE Tasks:**
- [x] `src/types/auth.ts` — tambah `avatar_url` ke `User`, `UpdateProfilePayload`, `ChangePasswordPayload`
- [x] `src/api/users.ts` — `getProfile()`, `updateProfile()`, `changePassword()`
- [x] `src/composables/user/useProfile.ts` — profile query + updateProfile mutation (sync authStore) + changePassword mutation
- [x] `src/views/user/ProfileView.vue` — form edit nama + avatar preview + form ganti password
- [x] Add route `/profile` → `ProfileView` (requiresAuth, under ProfileLayout)

---

#### 5.3 Purchase History (Riwayat Pembelian)

**Flow:**

```
User navigates to /purchases  (requires auth)
          |
          ▼
    GET /api/orders/my-orders
    Response: list orders diurutkan terbaru, populate course title + cover
          |
          ▼
    FE: tampilkan list order
        - cover course, judul, tanggal, midtrans_order_id
        - harga + status badge (Berhasil / Menunggu / Gagal / Kedaluwarsa)
```

**Data yang dikembalikan per order:**
```
_id                → string
courseId           → { _id, title, cover_url }  (populate)
amount             → number
status             → 'pending' | 'paid' | 'failed' | 'expired'
midtrans_order_id  → string
paidAt?            → Date
createdAt          → Date
```
> Tidak butuh model baru — query dari `Order` collection, populate `courseId`.

**BE Tasks:**
- [x] `GET /api/orders/my-orders` — list semua order milik user, populate `courseId` (title + cover_url)

**FE Tasks:**
- [x] `src/types/orders.ts` — `MyOrder`, `MyOrdersResponse`
- [x] `src/api/orders.ts` — `getMyOrders()`
- [x] `src/composables/orders/useOrders.ts` — `useQuery` + `orders` computed
- [x] `src/views/user/PurchaseHistoryView.vue` — list order dengan status badge + formatRupiah
- [x] Add route `/purchases` → `PurchaseHistoryView` (requiresAuth, under ProfileLayout)

**Shared Layout:**
- [x] `src/layouts/ProfileLayout.vue` — Navbar + sidebar desktop (sticky, active-class highlight) + pill nav mobile
- [x] `router/routes/protected.ts` — ProfileLayout sebagai parent, 3 child routes di dalamnya

---

### Phase 6 — Admin Dashboard

> Role guard: hanya user dengan `role: 'admin'` yang bisa mengakses. Semua route admin di bawah `AdminLayout` dengan sidebar tersendiri.

**Fitur yang ditambahkan dibanding Phase 1–5:**

| Gap | Solusi |
|-----|--------|
| Course langsung live saat dibuat | Tambah field `status: draft \| published` — student hanya lihat `published` |
| Admin tidak bisa lihat semua transaksi | Halaman order management semua user + filter status |
| Task auto-approve tanpa review | Admin/instructor bisa approve / reject task submission |
| Topics tidak bisa dikelola | CRUD topic dari admin panel |

---

#### 6.1 Auth & Layout Admin

**Flow:**

```
User navigates to /admin/*
          |
          ▼
    Router guard cek role
          |
          ├─→ role !== 'admin'   → redirect ke /
          └─→ role === 'admin'   → lanjut ke halaman admin
```

**FE Tasks:**
- [ ] `src/layouts/AdminLayout.vue` — Navbar + sidebar admin (Dashboard, Courses, Quiz, Users, Bootcamps, Orders, Tasks, Revenue)
- [ ] `router/routes/admin.ts` — semua route `/admin/*` dengan guard `requiresAdmin`
- [ ] Update router guard di `router/index.ts` — cek `auth.user?.role === 'admin'`

---

#### 6.2 Course Management (CRUD)

**Flow:**

```
Admin navigates to /admin/courses
          |
          ▼
    GET /api/admin/courses  (list semua course, termasuk yang hidden)
          |
          ▼
    Admin klik "Tambah Course"
          |
          ▼
    POST /api/admin/courses  { title, description, cover_url, topic, level, isFree, price }
          |
    Admin klik "Edit"
          |
          ▼
    PATCH /api/admin/courses/:id
          |
    Admin klik "Hapus"
          |
          ▼
    DELETE /api/admin/courses/:id
          |
    Admin kelola Module → Chapter → Lesson
          |
          ▼
    POST /api/admin/courses/:id/modules
    POST /api/admin/modules/:id/chapters
    POST /api/admin/chapters/:id/lessons
    PATCH /api/admin/lessons/:id
    DELETE /api/admin/lessons/:id
```

**Course Model Changes:**
```
status  → 'draft' | 'published'  (default: 'draft')
```
> `GET /api/courses` (public) hanya return course dengan `status: 'published'`. Admin bisa lihat semua termasuk draft.
> **Migration**: jalankan `db.courses.updateMany({status:{$exists:false}}, {$set:{status:'published'}})` sekali setelah deploy — semua course seeded tetap tampil di student view.

**Data yang bisa dikelola per Lesson:**
```
title         → string
type          → video | quiz | task
order         → number
duration      → number (seconds)
video_url     → string | null
description   → string
is_locked     → boolean (free preview flag)
passing_score → number (untuk tipe quiz)
```

**BE Tasks:**
- [ ] `adminMiddleware.ts` — cek `req.userId` punya `role: 'admin'`
- [ ] Update `Course` model — tambah field `status: 'draft' | 'published'` (default `'draft'`)
- [ ] Update `GET /api/courses` (public) — filter hanya `status: 'published'`
- [ ] `GET /api/admin/courses` — list semua course (draft + published) + total_lessons + total_students
- [ ] `GET /api/admin/courses/:id` — detail course lengkap dengan modules → chapters → lessons (untuk pre-fill form edit + `CourseContentView`)
- [ ] `POST /api/admin/courses` — create course (default status: draft)
- [ ] `PATCH /api/admin/courses/:id` — update course termasuk publish/unpublish
- [ ] `DELETE /api/admin/courses/:id` — delete course + cascade: Module, Chapter, Lesson, QuizQuestion, QuizAttempt, Progress, TaskSubmission (by courseId)
- [ ] `POST /api/admin/courses/:id/modules` — tambah module
- [ ] `PATCH /api/admin/modules/:id` — edit module
- [ ] `DELETE /api/admin/modules/:id` — delete module + cascade: Chapter, Lesson, QuizQuestion, QuizAttempt, Progress, TaskSubmission (by moduleId/related lessons)
- [ ] `POST /api/admin/modules/:id/chapters` — tambah chapter
- [ ] `PATCH /api/admin/chapters/:id` — edit chapter
- [ ] `DELETE /api/admin/chapters/:id` — delete chapter + cascade: Lesson, QuizQuestion, QuizAttempt, Progress, TaskSubmission (by chapterId/related lessons)
- [ ] `POST /api/admin/chapters/:id/lessons` — tambah lesson
- [ ] `PATCH /api/admin/lessons/:id` — edit lesson
- [ ] `DELETE /api/admin/lessons/:id` — delete lesson + cascade: QuizQuestion, QuizAttempt, Progress, TaskSubmission (by lessonId)
- [ ] `GET /api/admin/topics` — list semua topic
- [ ] `POST /api/admin/topics` — tambah topic baru (`topic` slug + `topic_name`)
- [ ] `PATCH /api/admin/topics/:topic` — rename topic
- [ ] `DELETE /api/admin/topics/:topic` — hapus topic (cegah jika masih ada course yang pakai)

**FE Tasks:**
- [ ] `src/api/admin/courses.ts` — CRUD course + module + chapter + lesson + publish toggle
- [ ] `src/composables/admin/useCourseAdmin.ts`
- [ ] `src/views/admin/courses/CourseListView.vue` — tabel course + status badge (Draft/Published) + toggle publish + tombol edit/hapus
- [ ] `src/views/admin/courses/CourseFormView.vue` — form create/edit course + pilih topic dari dropdown; gunakan `GET /api/admin/courses/:id` untuk pre-fill saat edit
- [ ] `src/views/admin/courses/CourseContentView.vue` — nested editor: module → chapter → lesson; lesson bertipe `quiz` tampilkan tombol "Kelola Soal →" yang navigasi ke `/admin/quiz/:lessonId` (link ke 6.3)
- [ ] `src/views/admin/topics/TopicListView.vue` — CRUD topic

---

#### 6.3 Quiz Management

**Flow:**

```
Admin navigates to /admin/quiz/:lessonId
          |
          ▼
    GET /api/admin/quiz/:lessonId/questions  (dengan correct_index — admin only)
          |
          ▼
    Admin tambah / edit / hapus soal
          |
          ▼
    POST   /api/admin/quiz/:lessonId/questions   { question, options[], correct_index, order }
    PATCH  /api/admin/quiz/questions/:questionId
    DELETE /api/admin/quiz/questions/:questionId
```

**Format Input — Markdown**

Pertanyaan dan opsi jawaban ditulis dalam **Markdown** — admin bisa pakai bold, italic, kode inline, dan blok kode. Live preview ditampilkan di sebelah editor. Di `QuizPlayer` (FE student), teks di-render ke HTML via `marked` / `markdown-it`.

```
Contoh pertanyaan:
"Apa output dari kode berikut?\n\n```js\nconsole.log(typeof null)\n```"

Opsi:
A. "object"
B. "null"
C. "undefined"
D. "string"
```

**Validasi (non-empty):**
- BE: `question.trim().length > 0` + semua `options[i].trim().length > 0` — return 400 jika ada yang kosong
- FE (Zod): `z.string().trim().min(1)` untuk question dan setiap opsi
- `correct_index` harus 0–3

**BE Tasks:**
- [ ] `GET /api/admin/quiz/:lessonId/questions` — return questions **dengan** `correct_index`
- [ ] `POST /api/admin/quiz/:lessonId/questions` — tambah soal (validasi trim non-empty)
- [ ] `PATCH /api/admin/quiz/questions/:questionId` — edit soal
- [ ] `DELETE /api/admin/quiz/questions/:questionId` — hapus soal

**FE Tasks:**
- [ ] Install `marked` — render Markdown ke HTML di QuizPlayer + admin preview
- [ ] `src/api/admin/quiz.ts`
- [ ] `src/views/admin/quiz/QuizEditorView.vue` — textarea Markdown + live preview + pilih jawaban benar + Zod validation
- [ ] Update `QuizPlayer.vue` — render `question` dan `options` sebagai HTML (via `marked`)

---

#### 6.4 User Management

**Flow:**

```
Admin navigates to /admin/users
          |
          ▼
    GET /api/admin/users  (pagination + search by name/email)
          |
          ▼
    Admin klik user → lihat detail (enrollment list, order history, total spent)
          |
          └─→ Admin ubah role
                    ▼
              PATCH /api/admin/users/:id/role  { role: 'admin' | 'student' }
```

**BE Tasks:**
- [ ] `GET /api/admin/users` — list semua user, pagination + search by name/email
- [ ] `GET /api/admin/users/:id` — detail user + enrollment list + total spent (sum paid orders)
- [ ] `PATCH /api/admin/users/:id/role` — ubah role

**FE Tasks:**
- [ ] `src/api/admin/users.ts`
- [ ] `src/views/admin/users/UserListView.vue` — tabel user + search + badge role
- [ ] `src/views/admin/users/UserDetailView.vue` — detail user + enrollment list + order history

---

#### 6.5 Bootcamp Management

**Flow:**

```
Admin navigates to /admin/bootcamps
          |
          ▼
    CRUD BootcampPackage → BootcampBatch → BootcampSession
    (struktur sama seperti Course Management)
```

**BE Tasks:**
- [ ] `GET /api/admin/bootcamps` — list semua package
- [ ] `GET /api/admin/bootcamps/:id` — detail package + batches + sessions (untuk pre-fill form edit)
- [ ] `POST /api/admin/bootcamps` — create package
- [ ] `PATCH /api/admin/bootcamps/:id` — edit package
- [ ] `DELETE /api/admin/bootcamps/:id` — delete package + cascade: BootcampBatch, BootcampSession
- [ ] `POST /api/admin/bootcamps/:id/batches` — tambah batch
- [ ] `PATCH /api/admin/batches/:id` — edit batch
- [ ] `DELETE /api/admin/batches/:id` — delete batch + cascade: BootcampSession
- [ ] `POST /api/admin/batches/:id/sessions` — tambah session
- [ ] `PATCH /api/admin/sessions/:id` — edit session
- [ ] `DELETE /api/admin/sessions/:id` — delete session
- [ ] `GET /api/admin/batches/:id/enrollments` — list peserta yang enrolled di batch ini (Phase 7)

**FE Tasks:**
- [ ] `src/api/admin/bootcamps.ts`
- [ ] `src/views/admin/bootcamps/BootcampAdminView.vue` — CRUD package + nested batch + session
- [ ] `src/views/admin/bootcamps/BootcampEnrollmentsView.vue` — list peserta per batch + tombol revoke

---

#### 6.6 Order Management (Semua User)

**Flow:**

```
Admin navigates to /admin/orders
          |
          ▼
    GET /api/admin/orders  (pagination + filter by status + search by order_id/user)
    Response: list semua order dari semua user, populate user + course
          |
          ▼
    FE: tabel order — nama user, nama course, harga, status, tanggal
        + filter pill: All / Paid / Pending / Failed / Expired
          |
          └─→ Admin klik order yang stuck (user sudah bayar tapi status masih pending)
                    ▼
              PATCH /api/admin/orders/:id/mark-paid
              → set status: 'paid', paidAt: now
              → upsert Enrollment (userId + courseId dari order)
              → FE: invalidate order list
```

> Use case: webhook Midtrans gagal total dan user sudah transfer manual atau konfirmasi lewat CS.

**BE Tasks:**
- [ ] `GET /api/admin/orders` — list semua order (semua user), pagination + filter `?status=` + search
- [ ] `PATCH /api/admin/orders/:id/mark-paid` — set status `'paid'`, paidAt now, upsert Enrollment

**FE Tasks:**
- [ ] `src/views/admin/orders/OrderListView.vue` — tabel order semua user + filter status + tombol "Mark as Paid" untuk order berstatus pending

---

#### 6.7 Task Review

**Flow:**

```
Admin navigates to /admin/tasks
          |
          ▼
    GET /api/admin/tasks  (list semua submission, filter by status: pending/approved/rejected)
          |
          ▼
    Admin klik submission → lihat URL + note
          |
          ├─→ Admin klik "Approve"
          |         ▼
          |   PATCH /api/admin/tasks/:submissionId  { status: 'approved' }
          |   → Progress record tetap ada (sudah dibuat saat submit)
          |
          └─→ Admin klik "Reject"
                    ▼
              PATCH /api/admin/tasks/:submissionId  { status: 'rejected', feedback? }
              → Hapus Progress record agar lesson kembali belum selesai
              → FE student: lesson is_done kembali false, perlu submit ulang
```

**TaskSubmission Model Changes:**
```
status    → 'submitted' | 'approved' | 'rejected'  (dari sebelumnya hanya 'submitted')
feedback  → string | null  (komentar admin saat reject, opsional)
```

**BE Tasks:**
- [ ] Update `TaskSubmission` model — tambah nilai `'approved'` dan `'rejected'` ke enum `status`, tambah `feedback?: string`
- [ ] Update `POST /api/tasks/:lessonId/submit` — status default `'submitted'` (tidak lagi auto-approve Progress)
- [ ] `GET /api/admin/tasks` — list semua submission, filter `?status=`, populate user + lesson + course
- [ ] `PATCH /api/admin/tasks/:submissionId` — update status + feedback; jika `rejected` → delete Progress record

**FE Tasks:**
- [ ] Update `TaskPlayer.vue` — tampilkan status badge (Menunggu Review / Disetujui / Ditolak + feedback)
- [ ] `src/views/admin/tasks/TaskReviewView.vue` — tabel submission + tombol Approve/Reject + form feedback

---

#### 6.8 Dashboard Stats

**Flow:**

```
Admin navigates to /admin
          |
          ▼
    GET /api/admin/stats
    Response: { totalUsers, totalCourses, totalEnrollments, totalRevenue, recentOrders[] }
```

**BE Tasks:**
- [ ] `GET /api/admin/stats` — aggregate: count User, Course (published), Enrollment, sum paid Order.amount, 5 order terbaru

**FE Tasks:**
- [ ] `src/views/admin/DashboardView.vue` — 4 stat card (Users, Courses, Enrollments, Revenue) + tabel 5 order terbaru

---

#### 6.9 Revenue Report

**Flow:**

```
Admin navigates to /admin/revenue
          |
          ▼
    GET /api/admin/revenue?from=2024-01-01&to=2024-12-31
    Response:
      total_revenue          → number (all time paid orders)
      revenue_this_month     → number
      revenue_last_month     → number
      revenue_by_month[]     → [{ month: "2024-01", total: 1500000 }, ...]
      revenue_by_course[]    → [{ courseId, title, cover_url, total, count }, ...]
      success_rate           → number (% order paid vs semua order)
          |
          ▼
    FE: tampilkan
        - 3 stat card (total, bulan ini, bulan lalu)
        - Bar/line chart — revenue per bulan (dari revenue_by_month)
        - Tabel course terlaris (dari revenue_by_course)
        - Badge success rate
```

**Data yang dikembalikan:**
```
total_revenue       → sum amount where status: 'paid' (sesuai filter tanggal)
revenue_this_month  → sum amount bulan berjalan
revenue_last_month  → sum amount bulan sebelumnya
revenue_by_month[]  → aggregate group by year-month, sorted ascending
  └ month           → string "YYYY-MM"
  └ total           → number
  └ count           → number (jumlah transaksi)
revenue_by_course[] → aggregate group by courseId, sorted by total desc
  └ courseId        → string
  └ title           → string (populate)
  └ cover_url       → string (populate)
  └ total           → number (total revenue dari course ini)
  └ count           → number (jumlah pembelian)
success_rate        → (paid orders / total orders) * 100
```
> Semua dari satu MongoDB aggregation pipeline di `Order` collection — tidak butuh model baru.

**BE Tasks:**
- [ ] `GET /api/admin/revenue` — aggregation pipeline: group by month + group by course, support `?from=` & `?to=` date filter

**FE Tasks:**
- [ ] Install `chart.js` + `vue-chartjs` — untuk bar/line chart revenue per bulan
- [ ] `src/api/admin/revenue.ts` — `getRevenue(from?, to?)`
- [ ] `src/composables/admin/useRevenue.ts` — useQuery + date range filter state
- [ ] `src/views/admin/revenue/RevenueView.vue` — stat cards + chart + tabel course terlaris + date range picker

---

### Phase 7 — Bootcamp Payment & Course Certificate

#### 7.1 Bootcamp Checkout & Payment

**Flow:**

```
User navigates to /bootcamps/:id
          |
          ▼
    GET /api/bootcamps/:id
    Response: { ...packageData, isEnrolled: boolean (cek apakah user sudah enrolled di salah satu batch) }
          |
          ▼
    User klik "Register Now" → modal terbuka (batch info + harga)
          |
          ▼
    User klik "Bayar Sekarang"
          |
          ▼
    POST /api/checkout/bootcamp/create-order  { batchId }
    ├─→ batch tidak ditemukan   → 404
    ├─→ sudah enrolled di batch → 409
    ├─→ ada pending order       → reuse snap_token
    └─→ buat BootcampOrder baru (status: 'pending') + generate Snap token
          |
          ▼
    FE: window.snap.pay(snap_token, callbacks)
          |
    User bayar
          |
          ▼
    ┌─────────────────────────────────────────────────┐
    │  Dua path berjalan paralel                       │
    └─────────────────────────────────────────────────┘
          ↓                              ↓
    Snap callback (FE)            Midtrans POST webhook (server-to-server)
    router.push ke                POST /api/checkout/bootcamp/webhook
    /checkout/bootcamp/result     1. Verifikasi SHA512 signature_key
    ?order_id=&batch_id=          2. BootcampOrder.status = 'paid', paidAt = now
    &result=success               3. BootcampEnrollment.findOneAndUpdate (upsert)
          ↓
    CheckoutBootcampResultView.vue
    polling GET /api/bootcamps/enrollments/check/:batchId setiap 2s
    ├─→ isEnrolled: true  → redirect ke /bootcamps/:packageId ✅
    └─→ isEnrolled: false → tunggu webhook
```

**Order Model Changes:**
```
type     → 'course' | 'bootcamp'  (default: 'course')
batchId  → ref to BootcampBatch, optional (hanya untuk type 'bootcamp')
courseId → optional (hanya untuk type 'course')
```
> Satu Order model untuk kedua jenis transaksi. Webhook membedakan via `order.type`.

**Data Model — BootcampOrder:**
> Gunakan model `Order` yang sudah ada dengan tambahan field `type` dan `batchId`.

**Data Model — BootcampEnrollment (NEW):**
```
userId      → ref to User
packageId   → ref to BootcampPackage (denormalized)
batchId     → ref to BootcampBatch
orderId     → ref to Order, optional (null jika gratis)
enrolledAt  → Date
```
> Unique index on `[userId, batchId]`.

**BE Tasks:**
- [ ] Update `Order` model — tambah `type: 'course' | 'bootcamp'` (default `'course'`), `batchId?: ref`; `courseId` jadi optional
- [ ] `BootcampEnrollment` model (`userId`, `packageId`, `batchId`, `orderId?`, `enrolledAt`) — unique index `[userId, batchId]`
- [ ] `POST /api/checkout/bootcamp/create-order` — create BootcampOrder + Snap token
- [ ] `POST /api/checkout/bootcamp/webhook` — verifikasi signature, update BootcampOrder, upsert BootcampEnrollment
- [ ] `GET /api/checkout/bootcamp/verify/:orderId` — fallback manual verify ke Midtrans
- [ ] `GET /api/bootcamps/enrollments/check/:batchId` — return `{ isEnrolled: boolean }`
- [ ] Update `GET /api/bootcamps/:id` — tambah `isEnrolled` di response (cek BootcampEnrollment)

**FE Tasks:**
- [ ] `src/types/bootcamps.ts` — tambah `BootcampEnrollment`, `BootcampEnrollmentStatus`
- [ ] `src/api/bootcamps.ts` — tambah `createBootcampOrder()`, `verifyBootcampPayment()`, `checkBootcampEnrollment()`
- [ ] `src/composables/bootcamps/useBootcampCheckout.ts` — load snap.js, createOrder mutation, snap.pay callbacks
- [ ] `src/composables/bootcamps/useBootcampEnrollment.ts` — polling + timeout + manualVerify
- [ ] `BootcampDetailView.vue` — update modal "Register Now" → tombol "Bayar Sekarang" + useBootcampCheckout
- [ ] `src/views/bootcamps/CheckoutBootcampResultView.vue` — polling enrollment status + redirect
- [ ] Add route `/checkout/bootcamp/result` → `CheckoutBootcampResultView`

---

#### 7.2 Bootcamp Saya (My Bootcamps)

**Flow:**

```
User navigates to /my-bootcamps  (requires auth)
          |
          ▼
    GET /api/bootcamps/my-enrollments
    Response: list batch yang sudah diikuti + package info + sesi mendatang
          |
          ▼
    FE: card per batch
        - nama package, nama batch, tanggal mulai–selesai
        - jumlah sesi, status batch (ongoing/completed)
        - link ke halaman sesi live (Phase 2.5)
```

**BE Tasks:**
- [ ] `GET /api/bootcamps/my-enrollments` — list BootcampEnrollment user, populate batchId + packageId
- [ ] `GET /api/admin/batches/:id/enrollments` — list semua peserta yang enrolled di batch (admin only)

**FE Tasks:**
- [ ] `src/types/bootcamps.ts` — tambah `MyBootcampEnrollment`
- [ ] `src/api/bootcamps.ts` — tambah `getMyBootcampEnrollments()`
- [ ] `src/composables/bootcamps/useMyBootcamps.ts`
- [ ] `src/views/user/MyBootcampsView.vue` — list enrolled batches + info sesi
- [ ] Update `ProfileLayout.vue` — tambah menu "Bootcamp Saya" (LayoutIcon) ke sidebar + pill nav
- [ ] Add route `/my-bootcamps` → `MyBootcampsView` (requiresAuth, under ProfileLayout)
- [ ] `AppNavbar.vue` — tambah "Bootcamp Saya" di dropdown user menu

---

#### 7.3 Course Completion Certificate

**Flow:**

```
User menyelesaikan semua lesson di course (100% progress)
          |
          ▼
    CourseDetailView: progress bar 100% → tampil tombol "Lihat Sertifikat"
          |
          ▼
    User klik → navigasi ke /courses/:id/certificate
          |
          ▼
    GET /api/courses/:id/certificate
    ├─→ progress < 100%  → 403 "Selesaikan semua lesson terlebih dahulu"
    └─→ progress = 100%
              |
              ▼
        BE: upsert Certificate record (idempotent)
        Return: { certificateId, userName, courseName, completedAt }
          |
          ▼
    FE: render CertificateView — HTML certificate
        + tombol "Download PDF" (browser print / jsPDF)
```

**Data Model — Certificate (NEW):**
```
userId          → ref to User
courseId        → ref to Course
certificateId   → string (UUID v4, unique — untuk verifikasi)
issuedAt        → Date
```
> Unique index on `[userId, courseId]`. Upsert-safe — klik berkali-kali tidak buat certificate baru.

**BE Tasks:**
- [ ] `Certificate` model (`userId`, `courseId`, `certificateId` UUID, `issuedAt`) — unique index `[userId, courseId]`
- [ ] `GET /api/courses/:id/certificate` — cek progress 100%, upsert Certificate, return data sertifikat

**FE Tasks:**
- [ ] Install `jspdf` + `html2canvas` — untuk generate PDF dari HTML
- [ ] `src/types/courses.ts` — tambah `CertificateData`
- [ ] `src/api/courses.ts` — tambah `getCertificate(courseId)`
- [ ] `src/composables/courses/useCertificate.ts` — useQuery untuk certificate data
- [ ] `src/views/courses/CertificateView.vue` — tampilan sertifikat (nama, course, tanggal, ID verifikasi) + tombol Download PDF
- [ ] `CourseDetailView.vue` — tampilkan tombol "Lihat Sertifikat" saat progress 100%
- [ ] Add route `/courses/:id/certificate` → `CertificateView` (requiresAuth)
- [ ] `MyCoursesView.vue` — tampilkan badge "Sertifikat Tersedia" + link di card yang sudah 100%

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
| POST   | /api/tasks/:lessonId/submit           | Submit task URL + note — saves TaskSubmission (status: submitted), no Progress until admin approves | JWT  |
| GET    | /api/tasks/:lessonId/my-submission    | Task submission for current user (null if none)                     | JWT  |

### Checkout & Enrollment

| Method | Endpoint                              | Description                                                                          | Auth |
|--------|---------------------------------------|--------------------------------------------------------------------------------------|------|
| POST   | /api/checkout/create-order            | Create order + generate Midtrans Snap token (reuses pending order if exists)         | JWT  |
| POST   | /api/checkout/webhook                 | **Primary** — Midtrans push: verify signature, update Order, upsert Enrollment       | -    |
| GET    | /api/checkout/verify/:orderId         | **Fallback** — BE pulls status from Midtrans API, upsert Enrollment if settled       | JWT  |
| GET    | /api/enrollments/check/:courseId      | Cek status enrollment user — dipolling FE setelah bayar hingga webhook mengisi DB    | JWT  |
| GET    | /api/enrollments/my-courses           | List enrolled courses + completed_lessons per course (dari Progress collection)      | JWT  |

### User & Orders

| Method | Endpoint                              | Description                                                                          | Auth |
|--------|---------------------------------------|--------------------------------------------------------------------------------------|------|
| GET    | /api/users/profile                    | Get current user profile                                                             | JWT  |
| PATCH  | /api/users/profile                    | Update name + avatar_url                                                             | JWT  |
| PATCH  | /api/users/change-password            | Change password — validates currentPassword; 400 if Google-only account             | JWT  |
| GET    | /api/orders/my-orders                 | List all orders for current user, sorted newest first, populate course info          | JWT  |

### Admin (Phase 6)

| Method | Endpoint                                      | Description                                                          | Auth        |
|--------|-----------------------------------------------|----------------------------------------------------------------------|-------------|
| GET    | /api/admin/stats                              | Dashboard — total users, courses, enrollments, revenue, recent orders | JWT + Admin |
| GET    | /api/admin/courses                            | List all courses (draft + published) with student count              | JWT + Admin |
| GET    | /api/admin/courses/:id                        | Course detail + full module/chapter/lesson tree (for form pre-fill)  | JWT + Admin |
| POST   | /api/admin/courses                            | Create course (default status: draft)                                | JWT + Admin |
| PATCH  | /api/admin/courses/:id                        | Update course — termasuk publish/unpublish (`status` field)          | JWT + Admin |
| DELETE | /api/admin/courses/:id                        | Delete course + cascade: Module, Chapter, Lesson, QuizQuestion, QuizAttempt, Progress, TaskSubmission | JWT + Admin |
| POST   | /api/admin/courses/:id/modules                | Add module to course                                                 | JWT + Admin |
| PATCH  | /api/admin/modules/:id                        | Update module                                                        | JWT + Admin |
| DELETE | /api/admin/modules/:id                        | Delete module + cascade: Chapter, Lesson, QuizQuestion, QuizAttempt, Progress, TaskSubmission | JWT + Admin |
| POST   | /api/admin/modules/:id/chapters               | Add chapter to module                                                | JWT + Admin |
| PATCH  | /api/admin/chapters/:id                       | Update chapter                                                       | JWT + Admin |
| DELETE | /api/admin/chapters/:id                       | Delete chapter + cascade: Lesson, QuizQuestion, QuizAttempt, Progress, TaskSubmission | JWT + Admin |
| POST   | /api/admin/chapters/:id/lessons               | Add lesson to chapter                                                | JWT + Admin |
| PATCH  | /api/admin/lessons/:id                        | Update lesson                                                        | JWT + Admin |
| DELETE | /api/admin/lessons/:id                        | Delete lesson + cascade: QuizQuestion, QuizAttempt, Progress, TaskSubmission | JWT + Admin |
| GET    | /api/admin/topics                             | List all topics                                                      | JWT + Admin |
| POST   | /api/admin/topics                             | Create topic (slug + display name)                                   | JWT + Admin |
| PATCH  | /api/admin/topics/:topic                      | Rename topic                                                         | JWT + Admin |
| DELETE | /api/admin/topics/:topic                      | Delete topic (blocked if still used by a course)                     | JWT + Admin |
| GET    | /api/admin/quiz/:lessonId/questions           | Quiz questions **with** correct_index                                | JWT + Admin |
| POST   | /api/admin/quiz/:lessonId/questions           | Add quiz question (Markdown, validated non-empty)                    | JWT + Admin |
| PATCH  | /api/admin/quiz/questions/:questionId         | Edit quiz question                                                   | JWT + Admin |
| DELETE | /api/admin/quiz/questions/:questionId         | Delete quiz question                                                 | JWT + Admin |
| GET    | /api/admin/users                              | List all users (pagination + search by name/email)                   | JWT + Admin |
| GET    | /api/admin/users/:id                          | User detail + enrollments + total spent                              | JWT + Admin |
| PATCH  | /api/admin/users/:id/role                     | Change user role                                                     | JWT + Admin |
| GET    | /api/admin/orders                             | List all orders from all users (pagination + filter by status)       | JWT + Admin |
| PATCH  | /api/admin/orders/:id/mark-paid               | Force mark order as paid + upsert Enrollment (for stuck payments)    | JWT + Admin |
| GET    | /api/admin/tasks                              | List all task submissions (filter by status: submitted/approved/rejected) | JWT + Admin |
| PATCH  | /api/admin/tasks/:submissionId                | Approve or reject task + optional feedback; reject removes Progress  | JWT + Admin |
| GET    | /api/admin/bootcamps                          | List all bootcamp packages                                           | JWT + Admin |
| GET    | /api/admin/bootcamps/:id                      | Bootcamp package detail + batches + sessions (for form pre-fill)     | JWT + Admin |
| POST   | /api/admin/bootcamps                          | Create bootcamp package                                              | JWT + Admin |
| PATCH  | /api/admin/bootcamps/:id                      | Update bootcamp package                                              | JWT + Admin |
| DELETE | /api/admin/bootcamps/:id                      | Delete package + cascade: BootcampBatch, BootcampSession             | JWT + Admin |
| POST   | /api/admin/bootcamps/:id/batches              | Add batch to bootcamp                                                | JWT + Admin |
| PATCH  | /api/admin/batches/:id                        | Update batch                                                         | JWT + Admin |
| DELETE | /api/admin/batches/:id                        | Delete batch + cascade: BootcampSession                              | JWT + Admin |
| POST   | /api/admin/batches/:id/sessions               | Add session to batch                                                 | JWT + Admin |
| PATCH  | /api/admin/sessions/:id                       | Update session                                                       | JWT + Admin |
| DELETE | /api/admin/sessions/:id                       | Delete session                                                       | JWT + Admin |
| GET    | /api/admin/revenue                            | Revenue report — by month + by course + success rate (`?from=&to=`) | JWT + Admin |
| GET    | /api/admin/batches/:id/enrollments            | List all students enrolled in a batch                                | JWT + Admin |

### Bootcamp Checkout & Enrollment (Phase 7)

| Method | Endpoint                                      | Description                                                          | Auth |
|--------|-----------------------------------------------|----------------------------------------------------------------------|------|
| POST   | /api/checkout/bootcamp/create-order           | Create bootcamp order + Snap token (`{ batchId }`)                   | JWT  |
| POST   | /api/checkout/bootcamp/webhook                | Midtrans push: verify signature, update BootcampOrder, upsert BootcampEnrollment | -  |
| GET    | /api/checkout/bootcamp/verify/:orderId        | Fallback manual verify ke Midtrans API                               | JWT  |
| GET    | /api/bootcamps/enrollments/check/:batchId     | Cek apakah user enrolled di batch ini                                | JWT  |
| GET    | /api/bootcamps/my-enrollments                 | List semua bootcamp enrollment user                                  | JWT  |

### Certificate (Phase 7)

| Method | Endpoint                                      | Description                                                          | Auth |
|--------|-----------------------------------------------|----------------------------------------------------------------------|------|
| GET    | /api/courses/:id/certificate                  | Get/issue certificate jika progress 100% (upsert, idempotent)        | JWT  |

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
│ role        │       ┌─────────────┐
│ isVerified  │──1:N──│  Progress   │
│ otp?        │       │─────────────│
└──────┬──────┘       │ userId (FK) │
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
       │              │ feedback?        │
       │              └──────────────────┘
       │
       │              ┌──────────────────┐
       ├───────1:N────│   Certificate    │  (Phase 7)
       │              │──────────────────│
       │              │ userId (FK)      │
       │              │ courseId (FK)    │
       │              │ certificateId    │
       │              │ issuedAt         │
       │              └──────────────────┘
       │
       │              ┌────────────────────┐
       ├───────1:N────│ BootcampEnrollment │  (Phase 7)
       │              │────────────────────│
       │              │ userId (FK)        │
       │              │ packageId (FK)     │
       │              │ batchId (FK)       │
       │              │ orderId? (FK)      │
       │              │ enrolledAt         │
       │              └────────────────────┘
       │
       │              ┌──────────────────┐       ┌─────────────┐
       └───────1:N────│      Order       │──1:1──│  Enrollment │
                      │──────────────────│       │─────────────│
                      │ userId (FK)      │       │ userId (FK) │
                      │ type             │       │ courseId(FK)│
                      │ courseId? (FK)   │       │ orderId?(FK)│
                      │ batchId? (FK)    │       │ enrolledAt  │
                      │ amount           │       └─────────────┘
                      │ status           │
                      │ snap_token       │
                      │ midtrans_id      │
                      │ paidAt?          │
                      └──────────────────┘


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
│ status      │
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
│  BootcampBatch   │──────────────────────────────────────┐
│──────────────────│                                      │
│ packageId (FK)   │  1:N                                 │
│ title            │                                      │
│ sub_title        │                                      ▼
│ description      │                         ┌────────────────────┐
│ started_at       │                         │ BootcampEnrollment │  (Phase 7)
│ ended_at         │                         │────────────────────│
│ quota_used_%     │                         │ userId (FK)        │
│ price            │                         │ packageId (FK)     │
│ strikethrough_pr │                         │ batchId (FK)       │
│ package_type     │                         │ orderId? (FK)      │
└────────┬─────────┘                         │ enrolledAt         │
         │                                   └────────────────────┘
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
| `orders`               | `midtrans_order_id` (unique), `[userId, courseId, status]` | `type: 'course'\|'bootcamp'`; `batchId` populated for bootcamp orders (Phase 7) |
| `enrollments`          | `[userId, courseId]` (unique)                | Created after payment settlement; `orderId` null for free courses    |
| `bootcamppackages`     | -                                            | Mentors embedded (not a separate collection)                         |
| `bootcampbatches`      | `packageId`                                  | `starting_price` aggregated from cheapest batch                      |
| `bootcampsessions`     | `batchId`                                    | -                                                                    |
| `bootcampenrollments`  | `[userId, batchId]` (unique)                 | Created after bootcamp payment settlement (Phase 7)                  |
| `certificates`         | `[userId, courseId]` (unique), `certificateId` (unique) | Issued when course progress = 100% (Phase 7)            |

---
