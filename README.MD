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

#### 2.1 Course List (Landing Page)

**Flow:**

```
[Landing Page / Home]
User opens app (logged in or not)
        ↓
FE: fetch all courses + fetch all topics in parallel
        ↓
FE: display hero slider + course cards (horizontal scroll)
        ↓
User clicks a topic pill → filter courses by topic (client-side)
        ↓
User clicks a course card
        ↓
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
- [ ] Course model (`title`, `description`, `cover_url`, `topic`, `topic_name`, `level`, `isFree`, `video_amount`, `total_lessons`, `course_duration`)
- [ ] No separate Topic model — topics are aggregated from Course (`distinct topic + topic_name`)
- [ ] Zod validation schema for course
- [ ] `GET /api/courses` — list all courses, support optional `?topic=` query filter + pagination
- [ ] `GET /api/courses/topics` — list all unique topics
- [ ] Seed script — populate sample courses, topics, and lessons for development (admin panel will be added in a later phase)

**FE Tasks:**
- [ ] API service `src/api/courses.ts` — `getCourses()`, `getTopics()`
- [ ] TanStack Query `useQuery` for courses and topics (not `useMutation` — these are GET requests)
- [ ] `/` (HomeView) — hero slider + course card row + topic filter pills + filtered course row
- [ ] `CourseCard.vue` component — cover image, title, lesson count, topic badge
- [ ] Skeleton loading state for cards and topic pills
- [ ] Topic filter — client-side filter on already-fetched data (no refetch on pill click)

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

**Flow:**

```
[Course Detail Page] /courses/:id
        ↓
FE: fetch course detail (includes modules → chapters → lessons)
        ↓
FE: display course info (cover, title, description, level, progress bar)
    + sidebar: Module accordion → Chapter → Lesson list
        ↓
User clicks a lesson
  → is_locked: true  → show "complete previous lesson first" message
  → is_locked: false → load lesson content
        ↓
  type: "video" → display YouTube iframe + title + description
  type: "quiz"  → display quiz questions (Phase 3)
        ↓
Video ends → "Next Lesson" button appears
        ↓
User clicks "Next Lesson"
  → if lesson not yet done → POST update-progress (mark as complete)
  → if already done        → directly go to next lesson
        ↓
BE: record progress (userId + lessonId)
        ↓
FE: update is_done in sidebar + unlock next lesson + recalculate progress %
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

#### 2.3 Bootcamp List

**Flow:**

```
[Landing Page / Home — Bootcamp Section]
        ↓
FE: fetch all bootcamps
        ↓
FE: display bootcamp cards (title, cover, schedule, price, seats)
        ↓
User clicks a bootcamp card
        ↓
FE: redirect to [Bootcamp Detail Page]
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
│   │   └── useResetPassword.ts
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
│       ├── protected.ts       # Protected routes (requiresAuth)
│       └── courses.ts         # Course + bootcamp routes
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
│       └── ResetPasswordView.vue
└── components/
    ├── ui/
    │   └── GlobalErrorModal.vue  # Global error modal (network / server errors)
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
