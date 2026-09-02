# Fullstack MEVN - Learning Management System

A fullstack Learning Management System (LMS) built with the **MEVN** stack — MongoDB, Express, Vue.js, Node.js.

> 🇮🇩 Indonesian version: [README.id.md](README.id.md)
>
> Identifiers (file names, functions, endpoints, field names) are kept as-is in both
> versions so they still match the code. In-app UI labels that are written in Indonesian
> are also quoted verbatim rather than translated.

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
│   ├── orders.ts              # Purchase history API calls
│   └── admin/
│       ├── courses.ts         # Admin CRUD course + module + chapter + lesson (TypeScript interfaces + API calls)
│       ├── quiz.ts            # Admin quiz CRUD + AdminQuizQuestion interface
│       ├── bootcamps.ts       # Admin bootcamp CRUD; MentorUser / AdminMentor / AdminMentorPayload / AdminBootcampParticipant + adminListMentors() / adminListBootcampParticipants()
│       ├── topics.ts          # Admin topic CRUD; AdminTopic interface + adminListTopics/adminCreateTopic/adminUpdateTopic/adminDeleteTopic
│       ├── users.ts           # Admin user; AdminUser/AdminUserDetail/AdminUserEnrollment/AdminUserOrder interfaces + adminListUsers/adminGetUser/adminUpdateUserRole
│       ├── tasks.ts           # Admin task review; AdminTaskSubmission/AdminTaskSubmissionDetail/AdminTaskHistoryItem interfaces + adminListSubmissions/adminGetSubmission/adminReviewSubmission
│       └── dashboard.ts       # Admin dashboard; AdminDashboardStats / AdminRevenueReport / RevenuePoint / RevenueTopCourse interfaces + adminGetDashboardStats/adminGetRevenueReport
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
│   │   ├── useBootcampDetail.ts
│   │   ├── useBootcampCheckout.ts # load snap.js, createOrder per batch, callback snap.pay
│   │   └── useBootcampEnrollment.ts # polling enrollment batch + timeout + manualVerify
│   ├── checkout/
│   │   ├── useCheckout.ts     # load snap.js, createOrder, snap.pay callbacks
│   │   └── useEnrollment.ts   # polling + timeout + manualVerify fallback
│   ├── enrollments/
│   │   └── useMyEnrollments.ts  # useQuery for my-courses with progress
│   ├── orders/
│   │   └── useOrders.ts         # useQuery for purchase history
│   ├── user/
│   │   └── useProfile.ts        # getProfile query + updateProfile + changePassword mutations
│   └── admin/                   # Admin composables (one file per concern)
│       ├── useCourseList.ts     # course list query + togglePublish + confirmDelete
│       ├── useCourseForm.ts     # create/edit course form mutations
│       ├── useCourseContent.ts  # course detail query + invalidate helper
│       ├── useCourseEditor.ts   # expand state + all module/chapter/lesson CRUD mutations + expandedQuizzes/toggleQuiz
│       ├── useAdminMenu.ts     # adminMenuItems + isAdminMenuActive — single source for the admin menu (AdminLayout sidebar & navbar dropdown)
│       ├── useQuizEditor.ts     # quiz question CRUD mutations per lesson (add / edit / delete + showAddForm state)
│       ├── useBootcampList.ts   # bootcamp list query + confirmDelete
│       ├── useBootcampForm.ts   # create/edit package + mentor picker (toggleMentor / isMentorSelected / updateOccupation)
│       ├── useBootcampContent.ts # package detail query + invalidate helper
│       ├── useBootcampParticipants.ts # package participant query + per-batch counts + batch filter + badge/date helpers
│       ├── useBootcampEditor.ts  # expandedBatches + toggleBatch + expandAll/collapseAll + CRUD batch + session mutations
│       ├── useTopicList.ts      # topic list query + add/edit/delete mutations + showAddForm/editingTopic state
│       ├── useUserList.ts       # user list query (search + pagination) + changeRole mutation
│       ├── useUserDetail.ts     # user detail query + changeRole mutation + roleBadge/roleOptions/formatDate/formatRupiah/statusBadge helpers
│       ├── useTaskReview.ts     # task submission list query (filter by status + pagination) + quick approve mutation + shared display helpers (taskStatusBadge/taskStatusLabel/taskFilterOptions/formatTaskDate/formatTaskDateTime/userInitials)
│       ├── useTaskReviewDetail.ts # single submission detail query (brief + answer + history) + approve/reject mutations with feedback
│       ├── useDashboardStats.ts  # dashboard stats query (counts + revenue + recent orders)
│       └── useRevenueReport.ts   # revenue query keyed by year + two zero-filled 12-month bar sets (courseBars & bootcampBars, shared scale) + year picker state
├── layouts/
│   ├── DefaultLayout.vue      # Navbar + Footer
│   ├── AuthLayout.vue         # Split-screen (branding left, form right)
│   ├── ProfileLayout.vue      # Navbar + sidebar (My Courses, Profile, Purchase History) + RouterView
│   └── AdminLayout.vue        # Navbar + admin sidebar (menu read from useAdminMenu) + RouterView
├── router/
│   ├── index.ts               # Vue Router + navigation guard (requiresAuth + requiresAdmin)
│   └── routes/
│       ├── auth.ts            # Auth routes (guest-only)
│       ├── public.ts          # Public routes under DefaultLayout
│       ├── protected.ts       # Protected routes under ProfileLayout (requiresAuth)
│       └── admin.ts           # Admin routes under AdminLayout (requiresAdmin)
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
│   ├── orders.ts              # MyOrder, MyOrdersResponse
│   └── router.d.ts            # Extend RouteMeta: requiresAuth, requiresAdmin, guestOnly
├── utils/
│   ├── format.ts              # formatRupiah, formatDate, progressPercent
│   └── snap.ts                # loadSnapScript() — shared by the course and bootcamp checkout
├── views/
│   ├── HomeView.vue
│   ├── courses/
│   │   └── CourseDetailView.vue
│   ├── bootcamps/
│   │   ├── BootcampsView.vue
│   │   ├── BootcampDetailView.vue
│   │   └── CheckoutBootcampResultView.vue
│   ├── checkout/
│   │   └── CheckoutResultView.vue
│   ├── user/
│   │   ├── MyCoursesView.vue        # Grid of purchased courses + progress bar
│   │   ├── ProfileView.vue          # Edit name, avatar URL, change password
│   │   └── PurchaseHistoryView.vue  # Order history list + status badge
│   ├── auth/
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   ├── OtpVerificationView.vue
│   │   ├── ForgotPasswordView.vue
│   │   ├── ResetPasswordView.vue
│   │   └── GoogleCallbackView.vue
│   └── admin/
│       ├── AdminDashboardView.vue  # 4 stat cards (users, courses, enrollments, revenue) + recent transactions table
│       ├── courses/
│       │   ├── CourseListView.vue   # Course table + status badge + publish toggle + edit/delete
│       │   ├── CourseFormView.vue   # Create/edit course form (title, desc, cover, topic dropdown from the Topics API, level, price)
│       │   └── CourseContentView.vue # Tree outline editor: module→chapter→lesson; click the quiz icon → inline QuizEditorPanel; click the video icon → YouTube preview modal
│       ├── topics/
│       │   └── TopicListView.vue    # Topic table (slug + name); expanding add form; inline row edit; delete guarded while a course still uses the slug
│       ├── users/
│       │   ├── UserListView.vue     # User table + avatar/initials + debounced search + inline role dropdown + status badge + pagination
│       │   └── UserDetailView.vue   # User card (role picker, join date, total spent); enrolled courses; order history
│       ├── bootcamps/
│       │   ├── BootcampListView.vue  # Package table + status badge + Content/Edit/Delete buttons
│       │   ├── BootcampFormView.vue  # Create/edit package form; mentor picker (toggle users with role 'mentor' + occupation input)
│       │   └── BootcampContentView.vue # Card-based editor: mentor strip; batch cards (click-to-expand, quota bar, type badge, participant count badge); session rows (number badge + date+time chip); add-session form as an expanding card; Bootcamp Participants panel (batch filter pills + participant list)
│       ├── tasks/
│       │   ├── TaskListView.vue      # Submission table + filter pills (All/Pending/Approved/Rejected) + quick Approve button + Review/Detail link + pagination
│       │   └── TaskDetailView.vue    # Review page: full task brief, student answer (URL + note), decision panel (feedback + Approve/Reject), student/course/history sidebar
│       ├── orders/
│       │   └── OrderListView.vue     # Placeholder
│       └── revenue/
│           └── RevenueView.vue       # 4 stat cards (total card shows the course/bootcamp split) + two separate bar charts (course & bootcamp) + top courses & bootcamps tables + year picker
└── components/
    ├── ui/
    │   ├── GlobalErrorModal.vue
    │   ├── AppNavbar.vue           # User dropdown menu (My Courses, Profile, Purchase History, Logout) + admin-only Admin dropdown
    │   ├── AppFooter.vue
    │   └── GoogleSignInButton.vue
    ├── sections/
    │   ├── HeroSection.vue
    │   ├── CoursesSection.vue
    │   ├── BootcampSection.vue
    │   └── BenefitsSection.vue
    ├── course/
    │   ├── CourseCard.vue
    │   ├── BootcampCard.vue
    │   ├── CourseSidebar.vue
    │   ├── VideoPlayer.vue
    │   ├── QuizPlayer.vue
    │   └── TaskPlayer.vue
    └── admin/
        └── QuizEditorPanel.vue  # Inline quiz CRUD panel: question list + edit/delete + add-question form (toggle)
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
│   ├── orderController.ts       # getMyOrders
│   └── admin/
│       ├── courseAdminController.ts    # Admin CRUD: course + module + chapter + lesson + cascade delete; topic_name resolved automatically from the Topic collection
│       ├── quizAdminController.ts      # Admin quiz CRUD: get/create/update/delete questions (with correct_index)
│       ├── bootcampAdminController.ts  # Admin CRUD: package + batch + session + cascade delete; listPackageParticipants (participants across batches, from BootcampEnrollment)
│       ├── topicAdminController.ts     # Admin CRUD topic: list/create/update/delete (guarded while a course still uses the slug)
│       ├── userAdminController.ts      # Admin user: listUsers (pagination+search) + getUserDetail (enrollments+orders+total_spent) + updateUserRole
│       ├── taskAdminController.ts     # Admin task review: listSubmissions (filter by status + populate) + getSubmissionDetail (lesson+chapter+module+course+history) + reviewSubmission (approve → upsert Progress; reject → delete Progress + set feedback)
│       └── dashboardAdminController.ts # Admin dashboard: getDashboardStats (counts + revenue + 5 recent orders) + getRevenueReport (12-month series + top courses + summary, all WIB-based)
├── middlewares/
│   ├── authMiddleware.ts    # protect + optionalProtect
│   ├── adminMiddleware.ts   # adminOnly — checks role === 'admin'
│   ├── errorHandler.ts
│   ├── rateLimiter.ts
│   └── requestLogger.ts
├── models/
│   ├── User.ts             # name, email, password?, googleId?, avatar_url?, role, isVerified, otp
│   ├── Session.ts          # Device session (TTL index)
│   ├── Topic.ts            # slug (unique), name — used as the reference list for course topics
│   ├── Course.ts           # title, cover_url, topic (slug), topic_name (resolved from Topic), level, isFree, price, status (draft|published)
│   ├── Module.ts
│   ├── Chapter.ts
│   ├── Lesson.ts           # type: video|quiz|task, passing_score, is_locked
│   ├── Progress.ts         # userId, lessonId, courseId — unique [userId, lessonId]
│   ├── QuizQuestion.ts     # options[], correct_index (never sent to FE)
│   ├── QuizAttempt.ts      # answers[], score, passed — multiple attempts allowed
│   ├── TaskSubmission.ts   # submission_url, note, status — unique [userId, lessonId]
│   ├── Order.ts            # amount, status, snap_token, midtrans_order_id, paidAt
│   ├── Enrollment.ts       # userId, courseId, orderId — unique [userId, courseId]
│   ├── BootcampEnrollment.ts # userId, packageId, batchId, orderId — unique [userId, batchId]
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
│   ├── orderRoutes.ts       # GET /orders/my-orders
│   └── admin/
│       ├── courseAdminRoutes.ts      # All /admin/courses/* routes (protect + adminOnly middleware)
│       ├── quizAdminRoutes.ts        # All /admin/quiz/* routes (protect + adminOnly middleware)
│       ├── bootcampAdminRoutes.ts    # All /admin/bootcamps/* routes (protect + adminOnly middleware)
│       ├── topicAdminRoutes.ts       # All /admin/topics/* routes (protect + adminOnly middleware)
│       ├── userAdminRoutes.ts        # All /admin/users/* routes (protect + adminOnly middleware)
│       ├── taskAdminRoutes.ts        # All /admin/tasks/* routes (protect + adminOnly middleware)
│       └── dashboardAdminRoutes.ts   # All /admin/dashboard/* routes (protect + adminOnly middleware)
├── seeds/
│   ├── courseSeeder.ts      # npm run seed:courses  (seeds 5 topics into the Topic collection first, then 6 courses with status: published)
│   ├── lessonSeeder.ts      # npm run seed:lessons
│   ├── mentorSeeder.ts      # npm run seed:mentors  (5 mentor users, idempotent via $setOnInsert)
│   ├── bootcampSeeder.ts    # npm run seed:bootcamps  (requires seed:mentors first)
│   ├── allLessonsSeeder.ts  # npm run seed:all-lessons (all 6 courses; hard-clears collections first)
│   ├── allQuizSeeder.ts     # npm run seed:all-quiz (5 questions × 15 quiz lessons)
│   └── adminSeeder.ts       # npm run seed:admin  (admin@gmail.com / 123123123)
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
| My Courses                                        | ✅ Done         |
| User Profile (edit name, avatar, password)        | ✅ Done         |
| Purchase History                                  | ✅ Done         |
| Admin — Layout, Auth Guard & Admin Seed           | ✅ Done         |
| Admin — Course Management (CRUD + Content Editor) | ✅ Done         |
| Admin — Quiz Management                           | ✅ Done         |
| Admin — User & Bootcamp Management                | ✅ Done         |
| Admin — Task Review                               | ✅ Done         |
| Admin — Order Management                          | 🔄 Coming Soon  |
| Admin — Dashboard Stats & Revenue Report          | ✅ Done         |
| Bootcamp Checkout & Payment (Midtrans)            | ✅ Done         |
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

#### 2.1 Course List

![course](docs/course%20list.png)

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
slug      → string (unique, e.g. "web-dev") — acuan utama; matches Course.topic
name      → string (display name, e.g. "Web Development") — matches Course.topic_name
```

> Topics live in a separate `Topic` collection — `/api/courses/topics` reads from it rather than aggregating over Course. `Course.topic_name` is resolved automatically from Topic whenever an admin creates or edits a course.

**BE Tasks:**
- [x] Course model (`title`, `description`, `cover_url`, `topic`, `topic_name`, `level`, `isFree`, `video_amount`, `total_lessons`, `course_duration`)
- [x] Topic model (`slug` unique, `name`) — a separate collection; managed from the admin panel
- [x] `GET /api/courses` — list all courses, support optional `?topic=` query filter + pagination
- [x] `GET /api/courses/topics` — list all topics from the Topic collection (not an aggregate)
- [x] Seed script (`npm run seed:courses`) — seeds 5 topics into the Topic collection, then 6 sample courses

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
- [x] `POST /api/courses/update-progress` — mark lesson as complete (`{ lesson_id }` in body), upsert Progress; if the course is `isFree: true` → also upsert Enrollment (orderId: null) (⚠️ update existing code in Phase 4)
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

![Bootcamps](docs/bootcamp%20list.png)

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
  userId        → ref to User (role: 'mentor') — populated: name, avatar_url
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
- [x] BootcampPackage model (`title`, `description`, `image_url`, `status`, `mentors[]` — ref to User + occupation)
- [x] BootcampBatch model (`packageId`, `title`, `sub_title`, `description`, `started_at`, `ended_at`, `quota_used_percentage`, `price`, `strikethrough_price`, `package_type`)
- [x] BootcampSession model (`batchId`, `title`, `session_name`, `session_date`, `session_start_time`, `session_end_time`)
- [x] `GET /api/bootcamps` — list all packages with pagination + search + `?status=`; `starting_price` computed from the cheapest batch per package
- [x] `GET /api/bootcamps/:id` — package detail with nested batches and sessions; `mentors.userId` populated (name, avatar_url)
- [x] Seed script `npm run seed:bootcamps` — 3 packages (2 open, 1 coming_soon), 5 batches, 18 sessions; requires `seed:mentors` first

**FE Tasks:**
- [x] `src/types/bootcamps.ts` — `BootcampMentor` (userId populated: name + avatar_url), `BootcampSession`, `BootcampBatch`, `BootcampPackage`, `BootcampListResponse`, `BootcampDetailResponse`
- [x] `src/api/bootcamps.ts` — `getBootcamps()`, `getBootcampDetail()`
- [x] `src/composables/bootcamps/useBootcamps.ts` — `useQuery(['bootcamps'])`, staleTime 5 minutes
- [x] `src/composables/bootcamps/useBootcampDetail.ts` — `useQuery`, `selectedBatchIndex` (client-side switching), `formatRupiah`, `formatSessionDate`
- [x] `BootcampSection.vue` — grid card + skeleton loading + error/empty state, mounted in `HomeView`
- [x] `BootcampCard.vue` — cover image, status badge, mentor avatars, starting price, link to detail
- [x] `/bootcamps/:id` — `BootcampDetailView.vue` — cover header, description, mentor list, batch tabs, session list, sticky CTA card
- [x] CTA card — price + strikethrough price, quota progress bar, button disabled when `coming_soon`/`closed`/quota is full
- [x] Login redirect — store `redirect_after_login` in localStorage, push to `/auth/login`
- [x] Fix URL `/bootcamp` → `/bootcamps` in `BenefitsSection.vue` and `AppFooter.vue`

---

#### 2.4 Company Profile Section (Static)

![Landing Page](docs/course.png) (Landing Page)

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

> Assumptions: Task = submit URL + optional note. Quiz retry = unlimited. `passing_score` stored on Lesson (default 70). Task **requires admin approval** (Phase 6.7) — Progress only created after admin approves.

#### 3.1 Quiz

![quiz](docs/quiz.png)

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
- [x] `QuizPlayer.vue` — question form → loading → result (score + LULUS/GAGAL + retry). If `isDone` → show result directly
- [x] `CourseDetailView.vue` — branch `activeLesson.type`: `'quiz'` → `<QuizPlayer>`. Fix `handleVideoEnded` guard. Hide "Tandai Selesai" for quiz
- [x] `CourseSidebar.vue` — already has "Quiz" label — no change needed

---

#### 3.2 Task

![quiz](docs/task.png)

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
              sidebar: lesson shows the "Menunggu Review" badge (not is_done ✓)
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
feedback        → string | null  (filled in by admin on reject)
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
- [x] `TaskPlayer.vue` — submit form (URL + note). If submission exists → status-aware view: ✅ Disetujui (hijau) / ❌ Ditolak (merah + feedback box) / 📎 Menunggu Review (kuning)
- [x] `CourseDetailView.vue` — branch `activeLesson.type`: `'task'` → `<TaskPlayer>`. Hide "Tandai Selesai" for task
- [x] `CourseSidebar.vue` — add "Task" label for `lesson.type === 'task'`

### Phase 4 — Checkout & Subscription

> Per-course purchase (lifetime access). Payment via Midtrans Snap. Free courses (`isFree: true`) skip checkout entirely. `Order` locks in price at creation time. Enrollment is created by the Midtrans webhook after settlement.

#### 4.1 Course Checkout

**Checkout Flow:**

```
User navigates to /courses/:id
          |
          ▼
    GET /api/courses/:id  (optionalProtect — middleware authMiddleware.ts)
    Response: { course: { ...courseData, isEnrolled: boolean, modules: [...] } }
          |
          ├─→ course.isFree = true    → all lessons accessible, skip enrollment check
          ├─→ isEnrolled: true        → render the course content normally
          └─→ isEnrolled: false
                    |
                    ▼
              CourseDetailView.vue shows the "Beli Kurs" button
              User clicks → useCheckout.ts is invoked
                    |
                    ▼
              POST /api/checkout/create-order  { courseId }
              ├─→ free course         → 400 error
              ├─→ already enrolled    → 409 error
              ├─→ pending order found → reuse the existing snap_token
              └─→ buat Order baru (status: 'pending') + generate Snap token
                    |
                    ▼
              FE: loadSnapScript() → inject snap.js into <head>
              window.snap.pay(snap_token, { onSuccess, onPending, onError, onClose })
              Midtrans popup terbuka
                    |
              User pays
                    |
                    ▼
              ┌─────────────────────────────────────────────────┐
              │  Two paths run in parallel                       │
              └─────────────────────────────────────────────────┘
                    ↓                              ↓
          Snap callback (FE)            Midtrans POST webhook (server-to-server)
          onSuccess / onPending         POST /api/checkout/webhook
          router.push to               1. Verify SHA512 signature_key
          /checkout/result             2. Order.status = 'paid', paidAt = now
          ?order_id=                   3. Enrollment.findOneAndUpdate (upsert)
          &course_id=                     { userId, courseId, orderId, enrolledAt }
          &result=success/pending
                    ↓
          CheckoutResultView.vue
          useEnrollment(courseId).startPolling(onEnrolled, onTimeout)
          every 2 seconds, max 15x (30 seconds):
            GET /api/enrollments/check/:courseId
            ├─→ isEnrolled: true   → clearInterval → router.push /courses/:id ✅
            └─→ isEnrolled: false  → wait for the webhook to fill the DB, retry
                    |
              (after 30 seconds, the webhook never arrived)
                    ↓
              isTimedOut = true
              show a warning + the "Cek Status Pembayaran" button
                    |
              user clicks → manualVerify(orderId)
                    ↓
              GET /api/checkout/verify/:orderId
              BE asks the Midtrans API directly
              ├─→ settled → upsert Enrollment → router.push /courses/:id ✅
              └─→ not yet → button re-enabled, user can retry
```

**Snap.js URL:**
```
Sandbox   : https://app.sandbox.midtrans.com/snap/snap.js
Production: https://app.midtrans.com/snap/snap.js
```
> Swap the `src` in `loadSnapScript()` inside `useCheckout.ts` to match the environment.

**Local Development — Webhook Setup with ngrok:**
```bash
# 1. Install ngrok
brew install ngrok

# 2. Add your auth token (free signup at ngrok.com)
ngrok config add-authtoken <your_token>

# 3. Expose BE server
ngrok http 3000
# → output: https://xxxx.ngrok-free.app

# 4. Set the Notification URL in the Midtrans Dashboard
#    Settings → Payment → Notification URL:
#    https://xxxx.ngrok-free.app/api/checkout/webhook
```
> The ngrok URL changes on every restart (free plan) — update it in the Midtrans Dashboard each time you restart ngrok.

**Fallback — Manual Verify (tanpa ngrok):**

`GET /api/checkout/verify/:orderId` — the BE actively asks the Midtrans API for status and upserts Enrollment if settled. Useful when the webhook cannot reach localhost.

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
price → number (price in rupiah, 0 when isFree)
```

**getCourseDetail Changes:**
```
isFree = true           → skip enrollment check, all lessons follow sequential progress
                          isEnrolled = true (a free course always counts as enrolled)
isFree = false
  └─ not enrolled       → all locked lessons return is_locked: true + isEnrolled: false
  └─ enrolled           → sequential progress logic as before
```
> Response includes `isEnrolled: boolean` field at course level.

**Free Course — Enrollment Record:**
```
POST /api/courses/update-progress  (lesson in a course with isFree: true)
          |
          ▼
    BE: upsert Progress record
    BE: upsert Enrollment (orderId: null) ← created on the first progress event
          |
          ▼
    Free course appears in "My Courses" (GET /api/enrollments/my-courses)
```
> Enrollment for a free course is created **lazily** — the first time the user completes a lesson. `orderId` is null and no Order record is needed.

**BE Tasks:**
- [x] Update `Course` model — add `price` field
- [x] `Order` model (`userId`, `courseId`, `amount`, `status`, `snap_token`, `midtrans_order_id`, `paidAt`)
- [x] `Enrollment` model (`userId`, `courseId`, `orderId`, `enrolledAt`) — unique index `[userId, courseId]`
- [x] `POST /api/checkout/create-order` — validate, reuse pending order or create new, return Snap token
- [x] `POST /api/checkout/webhook` — **primary**: Midtrans push notification, verify signature, update Order, upsert Enrollment
- [x] `GET /api/checkout/verify/:orderId` — **fallback**: the BE asks the Midtrans API directly and upserts Enrollment if settled (for local dev / the "Check Status" button)
- [x] `GET /api/enrollments/check/:courseId` — returns `{ isEnrolled: boolean }` — polled by the FE after payment
- [x] Update `getCourseDetail` — add enrollment gate + `isEnrolled` in response
- [x] Register `checkoutRoutes` and `enrollmentRoutes` in `routes/index.ts`
- [x] Update `courseSeeder` — add `price` field to all courses

**FE Tasks:**
- [x] `src/types/courses.ts` — add `price` to `Course`, add `isEnrolled` to `CourseDetail`
- [x] `src/types/checkout.ts` — `Order`, `CreateOrderResponse`, `EnrollmentStatus`
- [x] `src/api/checkout.ts` — `createOrder()`, `verifyPayment()` (fallback)
- [x] `src/api/enrollments.ts` — `checkEnrollment()`
- [x] `src/composables/checkout/useCheckout.ts` — load snap.js, createOrder mutation, snap.pay callbacks
- [x] `src/composables/checkout/useEnrollment.ts` — polls `checkEnrollment()` every 2s until the webhook fills the DB; `onTimeout` callback after 30 seconds; `manualVerify(orderId)` as a fallback to the verify endpoint
- [x] `CheckoutResultView.vue` — success/pending/error state; polling with a timeout handler; shows a "Check Payment Status" button when the webhook is late; redirects to the course once enrolled
- [x] `CourseCard.vue` — show price badge or "Free" label
- [x] `CourseDetailView.vue` — show "Beli Kurs" CTA if not enrolled, hide progress actions
- [x] Add route `/checkout/result` → `CheckoutResultView`

### Phase 5 — User Profile & Purchase History ✅

> All routes are protected: `requiresAuth: true`. They use `ProfileLayout.vue`, which provides a navbar + sidebar (My Courses, Profile, Purchase History) — mobile uses pill nav.

#### 5.1 My Courses (Course Saya)

![my_course](docs/my%20course.png)

**Flow:**

```
User navigates to /my-courses  (requires auth)
          |
          ▼
    GET /api/enrollments/my-courses
    Response: list enrolled courses + completed_lessons per course
          |
          ▼
    FE: render one card per course
        - cover, title, tanggal bergabung
        - progress bar (completed / total_lessons, %)
        - link "Lanjut Belajar" → /courses/:id
```

**Data returned per course:**
```
enrollment_id     → string
enrolled_at       → Date
completed_lessons → number (count from the Progress collection)
course            → { _id, title, cover_url, level, topic_name, total_lessons, ... }
```
> Tidak butuh model baru — query join `Enrollment` + `Progress.countDocuments` + populate `Course`.

**BE Tasks:**
- [x] `GET /api/enrollments/my-courses` — list enrolled courses + `completed_lessons` per course (computed from Progress)

**FE Tasks:**
- [x] `src/types/enrollments.ts` — `MyCourse`, `MyCoursesResponse`
- [x] `src/api/enrollments.ts` — add `getMyCourses()`
- [x] `src/composables/enrollments/useMyEnrollments.ts` — `useQuery` + `courses` computed
- [x] `src/utils/format.ts` — add `formatDate()`, `progressPercent()`
- [x] `src/views/user/MyCoursesView.vue` — grid card enrolled courses + progress bar
- [x] Add route `/my-courses` → `MyCoursesView` (requiresAuth, under ProfileLayout)
- [x] `AppNavbar.vue` — user dropdown menu with a "My Courses" link

---

#### 5.2 User Profile

![profile](docs/profile.png)

**Flow:**

```
User navigates to /profile  (requires auth)
          |
          ▼
    GET /api/users/profile
          |
          ▼
    FE: render the edit form (name, avatar URL)
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
    BE: validate currentPassword, skip for Google-only accounts
```

**User Model Changes:**
```
avatar_url  → string | null, optional (profile photo URL)
```

**BE Tasks:**
- [x] Update `User` model — add field `avatar_url?: string`
- [x] `GET /api/users/profile` — return user data
- [x] `PATCH /api/users/profile` — update name + avatar_url (min 2 karakter)
- [x] `PATCH /api/users/change-password` — validate currentPassword, hash the new one, return 400 for Google-only accounts

**FE Tasks:**
- [x] `src/types/auth.ts` — add `avatar_url` to `User`, `UpdateProfilePayload`, `ChangePasswordPayload`
- [x] `src/api/users.ts` — `getProfile()`, `updateProfile()`, `changePassword()`
- [x] `src/composables/user/useProfile.ts` — profile query + updateProfile mutation (sync authStore) + changePassword mutation
- [x] `src/views/user/ProfileView.vue` — name edit form + avatar preview + change-password form
- [x] Add route `/profile` → `ProfileView` (requiresAuth, under ProfileLayout)

---

#### 5.3 Purchase History (Riwayat Pembelian)

![purchase history](docs/riwayat%20pembelian.png)

**Flow:**

```
User navigates to /purchases  (requires auth)
          |
          ▼
    GET /api/orders/my-orders
    Response: list orders diurutkan terbaru, populate course title + cover
          |
          ▼
    FE: render the order list
        - cover course, judul, tanggal, midtrans_order_id
        - harga + status badge (Berhasil / Menunggu / Gagal / Kedaluwarsa)
```

**Data returned per order:**
```
_id                → string
courseId           → { _id, title, cover_url }  (populate)
amount             → number
status             → 'pending' | 'paid' | 'failed' | 'expired'
midtrans_order_id  → string
paidAt?            → Date
createdAt          → Date
```
> No new model needed — query the `Order` collection and populate `courseId`.

**BE Tasks:**
- [x] `GET /api/orders/my-orders` — list all of the user's orders, populate `courseId` (title + cover_url)

**FE Tasks:**
- [x] `src/types/orders.ts` — `MyOrder`, `MyOrdersResponse`
- [x] `src/api/orders.ts` — `getMyOrders()`
- [x] `src/composables/orders/useOrders.ts` — `useQuery` + `orders` computed
- [x] `src/views/user/PurchaseHistoryView.vue` — order list with status badge + formatRupiah
- [x] Add route `/purchases` → `PurchaseHistoryView` (requiresAuth, under ProfileLayout)

**Shared Layout:**
- [x] `src/layouts/ProfileLayout.vue` — Navbar + sidebar desktop (sticky, active-class highlight) + pill nav mobile
- [x] `router/routes/protected.ts` — ProfileLayout as the parent, with 3 child routes inside it

---

### Phase 6 — Admin Dashboard

> Role guard: only users with `role: 'admin'` may access these. All admin routes sit under `AdminLayout`, which has its own sidebar.

**What this phase adds on top of Phases 1–5:**

| Gap | Solution |
|-----|--------|
| Courses went live the moment they were created | Added a `status: draft \| published` field — students only see `published` |
| Admins could not see every transaction | Order management page across all users + status filter |
| Tasks were auto-approved without review | Admin/instructor can approve or reject a task submission |
| Topics could not be managed | Topic CRUD from the admin panel |

---

#### 6.1 Auth & Layout Admin

**Flow:**

```
User navigates to /admin/*
          |
          ▼
    Router guard checks role
          |
          ├─→ role !== 'admin'   → redirect to /
          └─→ role === 'admin'   → continue to the admin page
```

**FE Tasks:**
- [x] `src/layouts/AdminLayout.vue` — AppNavbar + admin sidebar card (Dashboard, Courses, Topics, Quiz, Users, Bootcamps, Orders, Tasks, Revenue); mobile pill nav
- [x] `src/composables/admin/useAdminMenu.ts` — `adminMenuItems` + `isAdminMenuActive()` as the single source for the admin menu list, shared by the `AdminLayout` sidebar and the navbar dropdown so the two can never drift apart
- [x] `src/components/ui/AppNavbar.vue` — an **Admin** dropdown (shield icon) shown only when `auth.user?.role === 'admin'`, listing every `/admin/*` link with an active-item marker; the trigger itself highlights while on an admin page. Only one dropdown may be open — opening Admin closes the user menu and vice versa. On narrow screens the dropdown becomes a separated "Admin" section inside the mobile menu
- [x] `router/routes/admin.ts` — all `/admin/*` routes with the `requiresAdmin` guard; placeholder views for every sub-page
- [x] Update the router guard in `router/index.ts` — check `auth.user?.role === 'admin'`
- [x] `src/types/router.d.ts` — extend `RouteMeta` with `requiresAdmin`
- [x] `src/seeds/adminSeeder.ts` — seed the admin account (`admin@gmail.com` / `123123123`); script `seed:admin`

---

#### 6.2 Course Management (CRUD)

**Flow:**

```
Admin navigates to /admin/courses
          |
          ▼
    GET /api/admin/courses  (list all courses, including hidden ones)
          |
          ▼
    Admin clicks "Tambah Course"
          |
          ▼
    POST /api/admin/courses  { title, description, cover_url, topic, level, isFree, price }
          |
    Admin clicks "Edit"
          |
          ▼
    PATCH /api/admin/courses/:id
          |
    Admin clicks "Hapus"
          |
          ▼
    DELETE /api/admin/courses/:id
          |
    Admin manages Module → Chapter → Lesson
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
> `GET /api/courses` (public) only returns courses with `status: 'published'`. Admins see everything, including drafts.
> **Migration**: run `db.courses.updateMany({status:{$exists:false}}, {$set:{status:'published'}})` once after deploying — every seeded course stays visible in the student view.

**Fields manageable per Lesson:**
```
title         → string
type          → video | quiz | task
order         → number
duration      → number (seconds)
video_url     → string | null
description   → string
is_locked     → boolean (free preview flag)
passing_score → number (for quiz type)
```

**BE Tasks:**
- [x] `adminMiddleware.ts` — check that `req.userId` has `role: 'admin'`
- [x] Update `Course` model — add field `status: 'draft' | 'published'` (default `'draft'`)
- [x] Update `GET /api/courses` (public) — filter to `status: 'published'` only
- [x] `GET /api/admin/courses` — list all courses (draft + published) + total_lessons + total_students
- [x] `GET /api/admin/courses/:id` — full course detail with modules → chapters → lessons (for edit-form pre-fill + `CourseContentView`)
- [x] `POST /api/admin/courses` — create course (default status: draft)
- [x] `PATCH /api/admin/courses/:id` — update course including publish/unpublish
- [x] `DELETE /api/admin/courses/:id` — delete course + cascade: Module, Chapter, Lesson, QuizQuestion, QuizAttempt, Progress, TaskSubmission (by courseId)
- [x] `POST /api/admin/courses/:id/modules` — add module
- [x] `PATCH /api/admin/modules/:id` — edit module
- [x] `DELETE /api/admin/modules/:id` — delete module + cascade: Chapter, Lesson, QuizQuestion, QuizAttempt, Progress, TaskSubmission (by moduleId/related lessons)
- [x] `POST /api/admin/modules/:id/chapters` — add chapter
- [x] `PATCH /api/admin/chapters/:id` — edit chapter
- [x] `DELETE /api/admin/chapters/:id` — delete chapter + cascade: Lesson, QuizQuestion, QuizAttempt, Progress, TaskSubmission (by chapterId/related lessons)
- [x] `POST /api/admin/chapters/:id/lessons` — add lesson
- [x] `PATCH /api/admin/lessons/:id` — edit lesson
- [x] `DELETE /api/admin/lessons/:id` — delete lesson + cascade: QuizQuestion, QuizAttempt, Progress, TaskSubmission (by lessonId)
- [x] `GET /api/admin/topics` — list all topics from the Topic collection
- [x] `POST /api/admin/topics` — add a new topic (slug format validated; 409 if the slug already exists)
- [x] `PATCH /api/admin/topics/:id` — update slug/name; syncs `topic` + `topic_name` across every course using the old slug
- [x] `DELETE /api/admin/topics/:id` — delete topic (blocked while any course still uses this slug)

**FE Tasks:**
- [x] `src/api/admin/courses.ts` — TypeScript interfaces (AdminCourse, AdminLesson, dll.) + CRUD course + module + chapter + lesson + publish toggle
- [x] `src/composables/admin/useCourseList.ts` — course list query + togglePublish mutation + confirmDelete
- [x] `src/composables/admin/useCourseForm.ts` — create/edit course mutations + pre-fill query
- [x] `src/composables/admin/useCourseContent.ts` — course detail query + invalidate helper
- [x] `src/composables/admin/useCourseEditor.ts` — expand state (auto-expand on load, collapse/expand all) + all module/chapter/lesson CRUD mutations
- [x] `src/views/admin/courses/CourseListView.vue` — course table + status badge (Draft/Published) + publish toggle + Konten/Edit/Hapus buttons
- [x] `src/views/admin/courses/CourseFormView.vue` — create/edit course form; topic is a dropdown fed by the Topics API (not free text); `topic_name` is resolved automatically by the BE from the chosen slug
- [x] `src/views/admin/courses/CourseContentView.vue` — tree outline editor (MS Word style): module → chapter → lesson with hierarchical numbering (1, 1.1, 1.1.1); per-type icons (video/quiz/task); inline edit on hover; click the PlayCircle icon → video preview modal (YouTube embed); click the CircleHelp icon → inline QuizEditorPanel; per-module collapse/expand buttons + global Expand All / Collapse All
- [x] `src/views/admin/topics/TopicListView.vue` — topic table (slug badge + name); expanding add form on top; inline row edit with confirm/cancel; delete blocked while the slug is still used by a course

---

#### 6.3 Quiz Management

**Flow:**

```
Admin navigates to /admin/courses/:id/content
          |
          ▼
    CourseContentView: tree outline modul → bab → lesson
          |
          ▼
    Admin clicks the CircleHelp (quiz) icon on a lesson row
          |
          ▼
    QuizEditorPanel appears below the lesson row (inline)
          |
          ▼
    GET /api/admin/quiz/:lessonId/questions  (with correct_index — admin only)
          |
          ▼
    Admin adds / edits / deletes questions — inline CRUD without leaving the page
          |
          ▼
    POST   /api/admin/quiz/:lessonId/questions   { question, options[], correct_index }
    PATCH  /api/admin/quiz/questions/:questionId
    DELETE /api/admin/quiz/questions/:questionId
```

> Quiz management happens **inline** inside `CourseContentView`, not on a separate page. Click the quiz icon or the chevron button in the hover area to open the question panel.

**BE Tasks:**
- [x] `GET /api/admin/quiz/:lessonId/questions` — return questions **with** `correct_index`
- [x] `POST /api/admin/quiz/:lessonId/questions` — add question
- [x] `PATCH /api/admin/quiz/questions/:questionId` — edit question
- [x] `DELETE /api/admin/quiz/questions/:questionId` — delete question
- [x] `quizAdminRoutes.ts` — every route guarded by `protect + adminOnly`
- [x] Register in `routes/index.ts` → `router.use('/admin/quiz', quizAdminRoutes)`

**FE Tasks:**
- [x] `src/api/admin/quiz.ts` — `AdminQuizQuestion` interface + CRUD API calls
- [x] `src/composables/admin/useQuizEditor.ts` — `useQuery` for questions + `useMutation` add/save/delete + `showAddForm` state
- [x] `src/components/admin/QuizEditorPanel.vue` — inline panel: question list (numbered, correct answer highlighted green) + edit form + add form (toggle)
- [x] `CourseContentView.vue` — click the CircleHelp icon or the purple chevron in the hover area → toggles `expandedQuizzes`; `QuizEditorPanel` appears below the lesson row when expanded

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
    Admin clicks a user → view detail (enrollment list, order history, total spent)
          |
          └─→ Admin changes role
                    ▼
              PATCH /api/admin/users/:id/role  { role: 'admin' | 'student' }
```

**BE Tasks:**
- [x] `GET /api/admin/users` — list all users; pagination + regex search by name/email; safe field selection (no password/otp)
- [x] `GET /api/admin/users/:id` — user detail + enrollments (populate courseId) + orders (populate courseId) + `total_spent` (sum of amounts on orders with status 'paid')
- [x] `PATCH /api/admin/users/:id/role` — change role; validate enum; block an admin from changing their own role

**FE Tasks:**
- [x] `src/api/admin/users.ts` — interface `AdminUser`, `AdminUserDetail`, `AdminUserEnrollment`, `AdminUserOrder` + `adminListUsers` / `adminGetUser` / `adminUpdateUserRole`
- [x] `src/composables/admin/useUserList.ts` — list query with a computed queryKey (search + page) + debounced search + `changeRole` mutation
- [x] `src/views/admin/users/UserListView.vue` — user table + initials avatar (fallback when there is no photo) + search bar (350ms debounce) + inline role dropdown + Verified/Unverified status badge + pagination
- [x] `src/views/admin/users/UserDetailView.vue` — user card (avatar, name, email, role picker, join date, total spent); enrolled courses section (cover + title + topic + date); order history section (title + midtrans ID + price + status badge)

---

#### 6.5 Bootcamp Management

**Flow:**

```
Admin navigates to /admin/bootcamps
          |
          ▼
    CRUD BootcampPackage → BootcampBatch → BootcampSession
    Mentors are picked from users with role 'mentor' (not embedded strings)
```

**BE Tasks:**
- [x] Update `User` model — add `'mentor'` to the `role` enum
- [x] Update `BootcampPackage` model — `mentors[]` changed from embedded strings (name, image_url) to a User ref (`userId` + `occupation`)
- [x] `GET /api/admin/bootcamps` — list all packages + batch_count; populate `mentors.userId`
- [x] `GET /api/admin/bootcamps/:id` — detail package + batches + sessions; populate `mentors.userId` (name, avatar_url)
- [x] `GET /api/admin/bootcamps/mentors` — list all users with `role: 'mentor'` (used by the FE mentor picker) — **must be declared before `/:id` in the router**
- [x] `GET /api/admin/bootcamps/:id/participants` — every participant of the package across all batches; reads `BootcampEnrollment` via the denormalized `packageId`; populates `userId` (name, email, avatar_url) + `batchId` (title) + `orderId` (amount, status, paidAt); sorted by `enrolledAt` descending
- [x] `POST /api/admin/bootcamps` — create package
- [x] `PATCH /api/admin/bootcamps/:id` — edit package; populate `mentors.userId` in the response
- [x] `DELETE /api/admin/bootcamps/:id` — delete package + cascade: BootcampBatch, BootcampSession
- [x] `POST /api/admin/bootcamps/:id/batches` — add batch
- [x] `PATCH /api/admin/bootcamps/batches/:id` — edit batch
- [x] `DELETE /api/admin/bootcamps/batches/:id` — delete batch + cascade: BootcampSession
- [x] `POST /api/admin/bootcamps/batches/:id/sessions` — add session
- [x] `PATCH /api/admin/bootcamps/sessions/:id` — edit session
- [x] `DELETE /api/admin/bootcamps/sessions/:id` — delete session
- [x] Seed script `npm run seed:mentors` — upsert 5 mentor users (idempotent, using `$setOnInsert`)
- [x] Update `bootcampSeeder.ts` — query mentor users by email, fail fast when missing; use `{ userId, occupation }` instead of `{ name, image_url }`
- [x] ~~`GET /api/admin/batches/:id/enrollments`~~ — superseded by `GET /api/admin/bootcamps/:id/participants` above: one query for every batch, with the per-batch split done on the FE

**FE Tasks:**
- [x] `src/api/admin/bootcamps.ts` — `MentorUser` (populated), `AdminMentor` (userId: MentorUser), `AdminMentorPayload` (userId: string), `PackagePayload.mentors: AdminMentorPayload[]`; add `adminListMentors()`
- [x] `src/composables/admin/useBootcampList.ts` — list query + confirmDelete
- [x] `src/composables/admin/useBootcampForm.ts` — create/edit mutations + pre-fill (converts `m.userId._id` → string) + `availableMentors` query; `toggleMentor`, `isMentorSelected`, `updateOccupation`, `getMentorPayload` functions
- [x] `src/composables/admin/useBootcampContent.ts` — package detail query + invalidate helper
- [x] `src/composables/admin/useBootcampParticipants.ts` — `['admin-bootcamp-participants', packageId]` query; derived `countByBatch` (participant badge on each batch card), `batchesWithParticipants` (filter pills), `batchFilter` + `filtered`; `orderStatusBadge` / `formatParticipantDate` / `participantInitials` helpers
- [x] `src/composables/admin/useBootcampEditor.ts` — expand state (expandedBatches + toggleBatch + expandAll + collapseAll) + CRUD batch + session mutations
- [x] `src/views/admin/bootcamps/BootcampListView.vue` — package table + status badge + Konten/Edit/Hapus buttons
- [x] `src/views/admin/bootcamps/BootcampFormView.vue` — create/edit form; mentor picker: list of mentor users with a select toggle (UserCheck/UserX) + an occupation input per selected mentor
- [x] `src/views/admin/bootcamps/BootcampContentView.vue` — card-based editor: mentor strip on top; batch cards (click the header to expand, chevron indicator, type badge, quota bar, **real participant count badge**); session rows with number badge + name + date+time chip; add-session form as an expanding card (not an inline grid); **Bootcamp Participants** panel below the batch list — total enrolled, per-batch filter pills (shown when participants span more than one batch), participant rows (avatar, name linked to `/admin/users/:id`, email, batch, order status badge + amount, join date)
- [ ] Revoke (unenroll) button on the Bootcamp Participants panel (Phase 7)

---

#### 6.6 Order Management (Semua User)

**Flow:**

```
Admin navigates to /admin/orders
          |
          ▼
    GET /api/admin/orders  (pagination + filter by status + search by order_id/user)
    Response: every order from every user, populate user + course
          |
          ▼
    FE: order table — user name, course name, price, status, date
        + filter pill: All / Paid / Pending / Failed / Expired
          |
          └─→ Admin clicks a stuck order (user already paid but status is still pending)
                    ▼
              PATCH /api/admin/orders/:id/mark-paid
              → set status: 'paid', paidAt: now
              → upsert Enrollment (userId + courseId from the order)
              → FE: invalidate order list
```

> Use case: the Midtrans webhook failed entirely and the user already transferred manually or confirmed through customer support.

**BE Tasks:**
- [ ] `GET /api/admin/orders` — list all orders (all users), pagination + `?status=` filter + search
- [ ] `PATCH /api/admin/orders/:id/mark-paid` — set status `'paid'`, paidAt now, upsert Enrollment

**FE Tasks:**
- [ ] `src/views/admin/orders/OrderListView.vue` — order table across all users + status filter + a "Mark as Paid" button for pending orders

---

#### 6.7 Task Review

**Flow:**

```
Admin navigates to /admin/tasks
          |
          ▼
    GET /api/admin/tasks  (list all submissions, filter by status: pending/approved/rejected)
          |
          ▼
    Admin clicks "Review" on a row → /admin/tasks/:submissionId
          |
          ▼
    GET /api/admin/tasks/:submissionId
    → task brief (lesson.description) + curriculum position (Course › Module › Chapter)
    → student answer (submission_url + note + submittedAt)
    → the student's other submissions in the same course
          |
          ├─→ Admin clicks "Setujui Tugas"  (also available as a quick action in the table)
          |         ▼
          |   PATCH /api/admin/tasks/:submissionId  { status: 'approved', feedback? }
          |   → upsert Progress record → lesson is_done ✓, lesson berikutnya terbuka
          |
          └─→ Admin writes feedback → "Tolak Tugas" → confirm
                    ▼
              PATCH /api/admin/tasks/:submissionId  { status: 'rejected', feedback }
              → delete the Progress record (if any) → the lesson becomes incomplete again
              → FE student: TaskPlayer shows the Ditolak badge + admin feedback; a resubmission is required
```

> Rejection is only possible from the detail page — the admin needs to read the brief alongside the
> answer, and feedback is mandatory. The table only offers the quick **Approve** action.

**TaskSubmission Model Changes:**
```
status    → 'submitted' | 'approved' | 'rejected'  (previously 'submitted' only)
feedback  → string | null  (optional admin comment on reject)
```

**BE Tasks:**
- [x] Update `TaskSubmission` model — add `'approved'` and `'rejected'` to the `status` enum, add `feedback: string | null`
- [x] Update `POST /api/tasks/:lessonId/submit` — default status `'submitted'`; Progress is **not** created automatically — the admin creates it on approve
- [x] `GET /api/admin/tasks` — list all submissions, filter `?status=`, pagination; populate `userId` (name, email, avatar_url) + `lessonId` (title, type) + `courseId` (title)
- [x] `GET /api/admin/tasks/:submissionId` — single submission detail; populate `lessonId` (+ `description` as the task brief, `chapterId` → `moduleId`) + `courseId` (title, cover_url, level, topic_name) + `userId`; also returns `history` (up to 10 other submissions by the same student in that course)
- [x] `PATCH /api/admin/tasks/:submissionId` — `approved` → upsert Progress; `rejected` → delete Progress; feedback is stored on both decisions
- [x] `taskAdminRoutes.ts` — every route guarded by `protect + adminOnly`; register in `routes/index.ts`

**FE Tasks:**
- [x] Update `src/types/quiz.ts` — `TaskSubmission.status` is now `'submitted' | 'approved' | 'rejected'`; add field `feedback: string | null`
- [x] Update `TaskPlayer.vue` — render UI per status: ✅ Approved (green), ❌ Rejected (red + admin feedback box), 📎 Awaiting Review (yellow)
- [x] `src/api/admin/tasks.ts` — `AdminTaskSubmission` / `AdminTaskSubmissionDetail` / `AdminTaskHistoryItem` interfaces + `adminListSubmissions` / `adminGetSubmission` / `adminReviewSubmission`
- [x] `src/composables/admin/useTaskReview.ts` — list query (statusFilter + page) + quick `approve` mutation; display helpers exported for shared use (`taskStatusBadge`, `taskStatusLabel`, `taskFilterOptions`, `formatTaskDate`, `formatTaskDateTime`, `userInitials`)
- [x] `src/composables/admin/useTaskReviewDetail.ts` — `['admin-task', id]` query + `feedbackText` (seeded from existing feedback) + `confirmingReject` + `approve` / `reject` mutations; invalidates both `admin-task` and `admin-tasks`
- [x] `src/views/admin/tasks/TaskListView.vue` — submission table + filter pills (All/Pending/Approved/Rejected) + quick Approve button + Review/Detail link + pagination
- [x] `src/views/admin/tasks/TaskDetailView.vue` — task brief card (full lesson description), student answer card (full URL + note + timestamp), decision panel (feedback textarea + Approve/Reject with confirmation), sidebar with student/course/other submissions
- [x] `admin-task-detail` route (`/admin/tasks/:id`) in `src/router/routes/admin.ts`
- [x] `TaskPlayer.vue` — the "Tugas Disetujui" card now also renders admin feedback when present (previously rejected-only)

---

#### 6.8 Dashboard Stats ✅

**Flow:**

```
Admin navigates to /admin
          |
          ▼
    GET /api/admin/dashboard/stats
          |
          ▼
    Six independent reads run in parallel via Promise.all:
      User.countDocuments        → total + new this month
      Course.countDocuments      → published + draft
      Enrollment.countDocuments  → total
      Order aggregate (sum)      → revenue all time + this month
      Order.find (limit 5)       → most recent paid orders
```

**Returned data:**
```
users.total          → number
users.newThisMonth   → number (createdAt >= start of current month, WIB)
courses.published    → number
courses.draft        → number
enrollments.total    → number
revenue.allTime      → number (sum amount where status: 'paid')
revenue.thisMonth    → number
recentOrders[]       → 5 most recent paid orders, sorted by paidAt desc
  └ _id              → string
  └ amount           → number
  └ paidAt           → string | null
  └ user             → { _id, name, email, avatar_url }
  └ course           → { _id, title, cover_url }
```
> If a course or user was deleted after the order was created, the order is still
> returned with a placeholder label and `_id: null` rather than being dropped.
> Removing it would make this table contradict the revenue totals on the same page.

**BE Tasks:**
- [x] `src/controllers/admin/dashboardAdminController.ts` — `getDashboardStats`; counts and sums computed in the database, never by loading orders into memory
- [x] `src/routes/admin/dashboardAdminRoutes.ts` — mounted at `/api/admin/dashboard`, chained `protect` + `adminOnly`

**FE Tasks:**
- [x] `src/api/admin/dashboard.ts` — `AdminDashboardStats` / `AdminRecentOrder` interfaces + `adminGetDashboardStats`
- [x] `src/composables/admin/useDashboardStats.ts` — single useQuery, no local state
- [x] `src/views/admin/AdminDashboardView.vue` — 4 stat cards (Users, Courses, Enrollments, Revenue) + recent transactions table

---

#### 6.9 Revenue Report ✅

**Flow:**

```
Admin navigates to /admin/revenue
          |
          ▼
    GET /api/admin/dashboard/revenue?year=2026
          |
          ├─→ year missing or invalid → falls back to the current year (no error)
          |
          ▼
    Four aggregations run in parallel on the Order collection
          |
          ▼
    Months with no sales are back-filled with zero, so series is always 12 items
          |
          ▼
    FE renders
        - 4 stat cards (total, paid orders, average order, conversion)
        - CSS bar chart — revenue per month
        - Top-earning courses table
        - Year picker built from availableYears
```

**Returned data:**
```
year                → number (the year actually reported on)
availableYears[]    → number[] — years that have paid orders, current year always included
series[]            → always 12 items, ascending, zero-filled
  └ period          → string "YYYY-MM"
  └ total           → number
  └ orders          → number
topCourses[]        → top 5 by revenue, descending
  └ courseId        → string
  └ title           → string ($lookup; falls back to a placeholder if deleted)
  └ cover_url       → string | null
  └ revenue         → number
  └ sold            → number
summary.total          → number (sum amount where status: 'paid', within the year)
summary.paidOrders     → number
summary.avgOrderValue  → number (rounded)
summary.conversionRate → number 0..1, paid ÷ orders created that year
summary.ordersByStatus → { pending?, paid?, failed?, expired? }
```

Three details that are easy to get wrong and are handled explicitly:

| Pitfall | Handling |
|---------|----------|
| MongoDB stores UTC, so a payment at 06:00 WIB on the 1st lands in the previous month | Every `$dateToString` / `$year` passes `timezone: 'Asia/Jakarta'`; range bounds are built from WIB wall-clock time (fixed UTC+7, no DST) |
| Aggregation omits months with no sales, making the chart skip months | Backend back-fills all 12 months with zero before responding |
| Existing index `{ userId, courseId, status }` does not serve a `status` + `paidAt` range scan | Added `{ status: 1, paidAt: -1 }` to `Order` |

> Grouping uses `paidAt`, not `createdAt` — revenue is only real once payment clears.
> Conversion rate is the exception: it is based on `createdAt`, because pending orders have no `paidAt`.
> `amount` is the price locked in at order time, so past reports stay accurate after a price change.

⚠️ **Scope:** course sales only. `Order` has no `bootcampId` and the checkout flow never
touches the bootcamp models, so no bootcamp revenue exists to report yet — see Phase 7.1.

**BE Tasks:**
- [x] `GET /api/admin/dashboard/revenue` — four parallel aggregations: monthly series, top courses (`$lookup` into `courses`), yearly summary, status breakdown
- [x] The monthly series and the yearly summary split revenue by product type via `$cond` — `course_total` / `bootcamp_total` (plus `course_orders` / `bootcamp_orders`) on the series, `courseTotal` / `bootcampTotal` on the summary. `total` stays the combined figure. Legacy orders with no `type` field fall on the course side, consistent with the `{ $ne: 'bootcamp' }` filter used by the top-courses ranking
- [x] `src/models/Order.ts` — added index `{ status: 1, paidAt: -1 }` for the report queries

**FE Tasks:**
- [x] `src/api/admin/dashboard.ts` — `AdminRevenueReport` / `RevenuePoint` (carries `course_total` / `bootcamp_total` / `course_orders` / `bootcamp_orders`) / `RevenueTopCourse` interfaces + `adminGetRevenueReport`; `summary` carries `courseTotal` / `bootcampTotal`
- [x] `src/composables/admin/useRevenueReport.ts` — useQuery keyed by year, `placeholderData` keeps the previous year on screen while the new one loads; `courseBars` / `bootcampBars` (typed `RevenueChartBar`) feed the two separate charts, with heights measured against `maxSegment` — the tallest segment across both types — so the two charts share a scale and stay comparable; `hasCourseRevenue` / `hasBootcampRevenue` decide which chart renders its empty state
- [x] `src/views/admin/revenue/RevenueView.vue` — stat cards + bar chart + top courses table + year picker
- [x] Monthly revenue renders as **two separate charts** side by side (`xl:grid-cols-2`, stacking vertically on narrow screens) — Course (indigo) and Bootcamp (amber) — rather than one stacked bar, so each reads on its own. The "Total" card also shows the course/bootcamp split so the combined figure can be traced
- [x] `src/components/admin/RevenueBarChart.vue` — one bar-chart component used twice; props `title` / `bars` / `color` (`indigo` \| `amber`) / `total` / `hasData` / `emptyLabel` / `dimmed`; per-bar tooltip carries the amount, order count and month name; months with no transactions still render as a thin grey tick

> No charting library was added. Twelve monthly bars are plain flexbox `div`s sized by
> percentage height, which keeps the bundle unchanged for a single page.

---

### Phase 7 — Bootcamp Payment & Course Certificate

#### 7.1 Bootcamp Checkout & Payment

> Reuses the Phase 4 checkout rails: the same `Order` model, the same Midtrans Snap flow, the same webhook + manual-verify pair. What is new is a second enrollment target — `BootcampEnrollment`, keyed per **batch** — and a `type` discriminator on `Order`.

**Design decisions:**

| Question                          | Choice                                                        | Reason                                                                                                                                                             |
|-----------------------------------|---------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| One `Order` model or two?         | One — `Order.type: 'course' \| 'bootcamp'`                    | Purchase history, the admin order list and the revenue report already aggregate over `orders`. A second collection would mean duplicating every aggregation.         |
| One webhook or two?               | One — the existing `POST /api/checkout/webhook` branches on `order.type` | Midtrans allows only **one** Notification URL per merchant account. A second webhook endpoint would simply never be called.                              |
| Enrollment per package or batch?  | Per batch — unique `[userId, batchId]`                        | A user can buy Batch 1 now and Batch 2 later. Sessions (and the future live-session page) hang off the batch. `packageId` is denormalized so "My Bootcamps" needs no extra lookup. |
| Free bootcamp?                    | Not supported                                                 | `BootcampBatch.price` is required and there is no `isFree` flag — every batch goes through checkout. No lazy-enrollment path like free courses have.                 |
| Quota enforcement                 | Soft — `quota_used_percentage` stays a manual admin field     | It is a display percentage, not a seat count. Checkout is blocked at ≥ 100% and when the package is not `open`, but a payment does not move the bar.                 |

**Flow:**

```
User navigates to /bootcamps/:id
          |
          ▼
    GET /api/bootcamps/:id  (optionalProtect — so the guest response stays identical)
    Response: { bootcamp: { ...packageData, isEnrolled, batches: [{ ...batch, isEnrolled }] } }
          |
          ├─→ batch.isEnrolled = true   → CTA becomes "Lihat Bootcamp Saya" → /my-bootcamps
          ├─→ status ≠ 'open' / quota ≥ 100 → CTA disabled (existing isRegisterDisabled logic)
          └─→ else                       → CTA "Daftar Sekarang"
                    |
                    ▼
              Not logged in → save redirect_after_login → /auth/login   (existing behaviour)
              Logged in     → useBootcampCheckout(batchId).startCheckout()
                    |
                    ▼
              POST /api/checkout/bootcamp/create-order  { batchId }
              ├─→ batch not found         → 404
              ├─→ package not 'open'      → 400
              ├─→ already enrolled        → 409
              ├─→ pending order exists    → reuse its snap_token (no new Midtrans call)
              └─→ create Order { type: 'bootcamp', batchId, amount: batch.price, status: 'pending' }
                  + generate Snap token
                    |
                    ▼
              FE: loadSnapScript() (shared with useCheckout) → window.snap.pay(snap_token, callbacks)
                    |
              User pays
                    |
                    ▼
              ┌─────────────────────────────────────────────────┐
              │  Two paths run in parallel                       │
              └─────────────────────────────────────────────────┘
                    ↓                              ↓
          Snap callback (FE)            Midtrans POST webhook (server-to-server)
          router.push to                POST /api/checkout/webhook   ← SHARED endpoint
          /checkout/bootcamp/result     1. Verify SHA512 signature_key
          ?order_id=&batch_id=          2. Order.status = 'paid', paidAt = now
          &package_id=                  3. switch (order.type)
          &result=success/pending          ├─ 'course'   → upsert Enrollment
                    ↓                       └─ 'bootcamp' → upsert BootcampEnrollment
          CheckoutBootcampResultView.vue                    { userId, packageId, batchId, orderId }
          useBootcampEnrollment(batchId).startPolling(...)
          every 2 seconds, max 15x (30 seconds):
            GET /api/bootcamps/enrollments/check/:batchId
            ├─→ isEnrolled: true   → clearInterval → router.push /my-bootcamps ✅
            └─→ isEnrolled: false  → wait for the webhook, retry
                    |
              (after 30 seconds, the webhook never arrived)
                    ↓
              isTimedOut = true → show the "Cek Status Pembayaran" button
                    |
              user clicks → manualVerify(orderId)
                    ↓
              GET /api/checkout/verify/:orderId   ← SHARED endpoint, branches on order.type
              BE asks the Midtrans API directly
              ├─→ settled → upsert BootcampEnrollment → router.push /my-bootcamps ✅
              └─→ not yet → button re-enabled, user can retry
```

> Until Phase 7.2 ships `/my-bootcamps`, redirect back to `/bootcamps/:packageId` instead — the CTA there already flips to the enrolled state.

**Order Model Changes:**
```
type     → 'course' | 'bootcamp'   (default: 'course' — existing rows keep working without a migration)
courseId → required only when type === 'course'
batchId  → ref to BootcampBatch, required only when type === 'bootcamp'
```
> `courseId` is currently `required: true`; leaving it that way makes every bootcamp order fail Mongoose validation. Use a conditional `required` function on both fields. Add an index `[userId, batchId, status]` to mirror the existing `[userId, courseId, status]` one — it serves the pending-order reuse lookup.

**Data Model — BootcampEnrollment (NEW):**
```
userId      → ref to User
packageId   → ref to BootcampPackage (denormalized from batch.packageId)
batchId     → ref to BootcampBatch
orderId     → ref to Order
enrolledAt  → Date
```
> Unique index on `[userId, batchId]`. Upsert-safe, so a webhook retry plus a manual verify cannot produce two records.

**create-order guard rules:**

| Condition                                                       | Response |
|-----------------------------------------------------------------|----------|
| `batchId` missing                                                | 400 `batchId is required.` |
| Batch not found                                                  | 404 `Batch not found.` |
| Parent package `status !== 'open'`                               | 400 `Pendaftaran bootcamp ini belum dibuka.` |
| `quota_used_percentage >= 100`                                   | 400 `Kuota batch ini sudah penuh.` |
| `BootcampEnrollment` exists for `[userId, batchId]`              | 409 `Kamu sudah terdaftar di batch ini.` |
| Pending order exists for `[userId, batchId]`                     | 200 — return the existing `snap_token` + `midtrans_order_id` |
| Otherwise                                                        | 201 — new Order + fresh Snap token |

**Ripple effects — existing code that breaks quietly once `Order` carries two types:**

| # | File | What breaks | Fix |
|---|------|-------------|-----|
| 1 | `be-server/src/models/Order.ts` | `courseId: required: true` rejects every bootcamp order | Conditional `required` per `type` |
| 2 | `be-server/src/controllers/orderController.ts` → `getMyOrders` | Filters out orders whose populated `courseId` is null → **every bootcamp order vanishes from Purchase History** | Populate `batchId` (+ its package) as well; drop only orders whose own type's ref is missing |
| 3 | `be-server/src/controllers/admin/dashboardAdminController.ts` → `getRevenueReport` | `topCourses` groups by `$courseId`; bootcamp orders collapse into one `_id: null` bucket rendered as "(course telah dihapus)" | Scope that `$match` with `type: { $ne: 'bootcamp' }` — orders created before the field existed have no `type` at all, so `type: 'course'` would drop them — and add a parallel `topBootcamps` aggregation over `type: 'bootcamp'` |
| 4 | same file → `getDashboardStats` | `recentOrders` populates only `courseId`, so a bootcamp order shows as a deleted course | Populate both refs, pick the label by `type` |
| 5 | same file, header comment | "Bootcamp belum punya alur checkout" becomes false; `revenue.allTime` / `thisMonth` now mix both product types | Update the comment; label the figure as total revenue in `RevenueView.vue` |
| 6 | `be-server/src/controllers/admin/userAdminController.ts` → `getUserDetail` | Order list populates `courseId` only, while `total_spent` already sums every paid order → the list and the total disagree | Same type-aware populate as #2 |
| 7 | `fe-apps/src/types/orders.ts` + `views/user/PurchaseHistoryView.vue` | Reads `order.courseId.title` / `.cover_url` unconditionally → runtime error on a bootcamp row | Add `type` + `batchId` to `MyOrder`, branch the card on `type` |
| 8 | `fe-apps/src/composables/bootcamps/useBootcampDetail.ts` | `handleRegister()` still ends at the `// Phase 4: buka modal checkout` stub; the view prints "Checkout & pembayaran tersedia segera" | Wire in `useBootcampCheckout`, drop the placeholder copy |

> API shape change, both consumed by the admin FE: `GET /api/admin/dashboard/stats` renames `recentOrders[].course` → `recentOrders[].item` and adds `type`; `GET /api/admin/dashboard/revenue` adds `topBootcamps[]` alongside `topCourses[]`.

> Route-order gotcha: register `GET /api/bootcamps/enrollments/check/:batchId` **before** `GET /api/bootcamps/:id` in `bootcampRoutes.ts`, otherwise `:id` swallows the literal `enrollments` segment and returns 404 "Bootcamp not found".

**BE Tasks:**
- [x] Update `Order` model — add `type: 'course' | 'bootcamp'` (default `'course'`) + `batchId?`; make `courseId` / `batchId` conditionally required; add index `[userId, batchId, status]`
- [x] `BootcampEnrollment` model (`userId`, `packageId`, `batchId`, `orderId`, `enrolledAt`) — unique index `[userId, batchId]`
- [x] `POST /api/checkout/bootcamp/create-order` — guard table above, reuse pending order, return Snap token
- [x] Refactor `checkoutController.handleWebhook` — after marking the order paid, branch on `order.type` to upsert `Enrollment` or `BootcampEnrollment`
- [x] Refactor `checkoutController.verifyPayment` — same branch, so the manual fallback works for both types
- [x] `GET /api/bootcamps/enrollments/check/:batchId` — returns `{ isEnrolled, enrolledAt }`, registered before the `/:id` route
- [x] Update `getBootcampDetail` — add `optionalProtect`, attach `isEnrolled` per batch + at package level
- [x] Update `getMyOrders` — type-aware populate (ripple #2)
- [x] Update `getDashboardStats` + `getRevenueReport` — type-aware recent orders, `topCourses` scoped to `type: 'course'`, new `topBootcamps` (ripple #3, #4, #5)
- [x] Update `getUserDetail` (admin) — type-aware order populate (ripple #6)

**FE Tasks:**
- [x] `src/types/bootcamps.ts` — add `isEnrolled` to `BootcampPackage` + `BootcampBatch`, add `BootcampEnrollmentStatus`
- [x] `src/types/orders.ts` — add `type` + optional `batchId` to `MyOrder`, make `courseId` optional
- [x] `src/api/bootcamps.ts` — add `createBootcampOrder(batchId)`, `checkBootcampEnrollment(batchId)`
- [x] `src/composables/checkout/useCheckout.ts` — extract `loadSnapScript()` into `src/utils/snap.ts` so both checkout composables share one loader
- [x] `src/composables/bootcamps/useBootcampCheckout.ts` — createOrder mutation + `snap.pay` callbacks → `/checkout/bootcamp/result`
- [x] `src/composables/bootcamps/useBootcampEnrollment.ts` — 2s polling, 30s timeout, `manualVerify` via the shared verify endpoint
- [x] `useBootcampDetail.ts` — replace the `handleRegister` stub with the checkout call; expose `isEnrolled` for the CTA
- [x] `BootcampDetailView.vue` — CTA states: Daftar Sekarang / Memproses… / Sudah Terdaftar / disabled; remove the "tersedia segera" note
- [x] `src/views/bootcamps/CheckoutBootcampResultView.vue` — mirrors `CheckoutResultView` (success / pending / error + polling + manual verify button)
- [x] `PurchaseHistoryView.vue` — render bootcamp rows (package title + batch title, `Bootcamp` badge)
- [x] `AdminDashboardView.vue` / `UserDetailView.vue` / `RevenueView.vue` — type-aware product label + `Bootcamp` badge, plus the new "Bootcamp Penyumbang Terbesar" table
- [x] Add route `/checkout/bootcamp/result` → `CheckoutBootcampResultView` (public routes, under `DefaultLayout`)

**Manual test checklist (Midtrans sandbox):**
- [ ] Pay a batch with a sandbox card → `BootcampEnrollment` created, CTA flips to the enrolled state
- [ ] Click "Daftar Sekarang" twice without paying → the second call reuses the same `snap_token`, no duplicate Order
- [ ] Buy the same batch again → 409; buy a different batch of the same package → allowed
- [ ] Kill ngrok, pay, wait 30s → timeout state → "Cek Status Pembayaran" → enrollment created via the verify fallback
- [ ] Purchase History shows both a course order and a bootcamp order without a blank card
- [ ] Admin → Revenue: bootcamp revenue included in the total, `topCourses` free of `null` rows

---

#### 7.2 Bootcamp Saya (My Bootcamps)

**Flow:**

```
User navigates to /my-bootcamps  (requires auth)
          |
          ▼
    GET /api/bootcamps/my-enrollments
    Response: joined batches + package info + upcoming sessions
          |
          ▼
    FE: card per batch
        - package name, batch name, start–end date
        - session count, batch status (ongoing/completed)
        - link to the live session page (Phase 2.5)
```

**BE Tasks:**
- [ ] `GET /api/bootcamps/my-enrollments` — list BootcampEnrollment user, populate batchId + packageId
- [x] Admin-side participant list — covered by `GET /api/admin/bootcamps/:id/participants` (Phase 6.5), which returns every batch of a package in one call

**FE Tasks:**
- [ ] `src/types/bootcamps.ts` — add `MyBootcampEnrollment`
- [ ] `src/api/bootcamps.ts` — add `getMyBootcampEnrollments()`
- [ ] `src/composables/bootcamps/useMyBootcamps.ts`
- [ ] `src/views/user/MyBootcampsView.vue` — list enrolled batches + session info
- [ ] Update `ProfileLayout.vue` — add a "My Bootcamps" menu item (LayoutIcon) to the sidebar + pill nav
- [ ] Add route `/my-bootcamps` → `MyBootcampsView` (requiresAuth, under ProfileLayout)
- [ ] `AppNavbar.vue` — add "My Bootcamps" to the user dropdown menu

---

#### 7.3 Course Completion Certificate

**Flow:**

```
User completes every lesson in the course (100% progress)
          |
          ▼
    CourseDetailView: progress bar at 100% → shows the "Lihat Sertifikat" button
          |
          ▼
    User clicks → navigates to /courses/:id/certificate
          |
          ▼
    GET /api/courses/:id/certificate
    ├─→ progress < 100%  → 403 "Complete every lesson first"
    └─→ progress = 100%
              |
              ▼
        BE: upsert Certificate record (idempotent)
        Return: { certificateId, userName, courseName, completedAt }
          |
          ▼
    FE: render CertificateView — HTML certificate
        + "Download PDF" button (browser print / jsPDF)
```

**Data Model — Certificate (NEW):**
```
userId          → ref to User
courseId        → ref to Course
certificateId   → string (UUID v4, unique — for verification)
issuedAt        → Date
```
> Unique index on `[userId, courseId]`. Upsert-safe — clicking repeatedly does not create a new certificate.

**BE Tasks:**
- [ ] `Certificate` model (`userId`, `courseId`, `certificateId` UUID, `issuedAt`) — unique index `[userId, courseId]`
- [ ] `GET /api/courses/:id/certificate` — check progress is 100%, upsert Certificate, return certificate data

**FE Tasks:**
- [ ] Install `jspdf` + `html2canvas` — to generate a PDF from HTML
- [ ] `src/types/courses.ts` — add `CertificateData`
- [ ] `src/api/courses.ts` — add `getCertificate(courseId)`
- [ ] `src/composables/courses/useCertificate.ts` — useQuery for certificate data
- [ ] `src/views/courses/CertificateView.vue` — certificate view (name, course, date, verification ID) + Download PDF button
- [ ] `CourseDetailView.vue` — show a "View Certificate" button at 100% progress
- [ ] Add route `/courses/:id/certificate` → `CertificateView` (requiresAuth)
- [ ] `MyCoursesView.vue` — show a "Certificate Available" badge + link on cards that reached 100%

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
| GET    | /api/bootcamps/:id             | Bootcamp package detail with nested batches and sessions (optionalProtect — adds `isEnrolled` per batch when authenticated, Phase 7) | -      |

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
| POST   | /api/checkout/webhook                 | **Primary** — Midtrans push: verify signature, update Order, upsert Enrollment (branches on `order.type`, Phase 7) | -    |
| GET    | /api/checkout/verify/:orderId         | **Fallback** — BE pulls status from Midtrans API, upsert Enrollment if settled (branches on `order.type`, Phase 7) | JWT  |
| GET    | /api/enrollments/check/:courseId      | Check the user's enrollment status — polled by the FE after payment until the webhook fills the DB | JWT  |
| GET    | /api/enrollments/my-courses           | List enrolled courses + completed_lessons per course (from the Progress collection)  | JWT  |

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
| GET    | /api/admin/dashboard/stats                    | Dashboard — total users, courses, enrollments, revenue, recent orders | JWT + Admin |
| GET    | /api/admin/courses                            | List all courses (draft + published) with student count              | JWT + Admin |
| GET    | /api/admin/courses/:id                        | Course detail + full module/chapter/lesson tree (for form pre-fill)  | JWT + Admin |
| POST   | /api/admin/courses                            | Create course (default status: draft)                                | JWT + Admin |
| PATCH  | /api/admin/courses/:id                        | Update course — including publish/unpublish (`status` field)         | JWT + Admin |
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
| GET    | /api/admin/topics                             | List all topics from Topic collection                                | JWT + Admin |
| POST   | /api/admin/topics                             | Create topic (`slug` + `name`); validates slug format; 409 if duplicate | JWT + Admin |
| PATCH  | /api/admin/topics/:id                         | Update topic; syncs `topic` + `topic_name` in all related courses    | JWT + Admin |
| DELETE | /api/admin/topics/:id                         | Delete topic (blocked if any course still uses this slug)            | JWT + Admin |
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
| GET    | /api/admin/tasks/:submissionId                | Submission detail: task brief (lesson.description), curriculum position, student answer, and the student's other submissions in the same course | JWT + Admin |
| PATCH  | /api/admin/tasks/:submissionId                | Approve or reject task + optional feedback; reject removes Progress  | JWT + Admin |
| GET    | /api/admin/bootcamps                          | List all bootcamp packages                                           | JWT + Admin |
| GET    | /api/admin/bootcamps/mentors                  | List users with role 'mentor' — for mentor picker in form            | JWT + Admin |
| GET    | /api/admin/bootcamps/:id                      | Bootcamp package detail + batches + sessions (for form pre-fill)     | JWT + Admin |
| GET    | /api/admin/bootcamps/:id/participants         | Package participants across batches (user + batch + order), newest first | JWT + Admin |
| POST   | /api/admin/bootcamps                          | Create bootcamp package                                              | JWT + Admin |
| PATCH  | /api/admin/bootcamps/:id                      | Update bootcamp package                                              | JWT + Admin |
| DELETE | /api/admin/bootcamps/:id                      | Delete package + cascade: BootcampBatch, BootcampSession             | JWT + Admin |
| POST   | /api/admin/bootcamps/:id/batches              | Add batch to bootcamp                                                | JWT + Admin |
| PATCH  | /api/admin/batches/:id                        | Update batch                                                         | JWT + Admin |
| DELETE | /api/admin/batches/:id                        | Delete batch + cascade: BootcampSession                              | JWT + Admin |
| POST   | /api/admin/batches/:id/sessions               | Add session to batch                                                 | JWT + Admin |
| PATCH  | /api/admin/sessions/:id                       | Update session                                                       | JWT + Admin |
| DELETE | /api/admin/sessions/:id                       | Delete session                                                       | JWT + Admin |
| GET    | /api/admin/dashboard/revenue                  | Revenue report — 12-month series (split course/bootcamp) + top courses & bootcamps + summary (`?year=`, defaults to current year) | JWT + Admin |

### Bootcamp Checkout & Enrollment (Phase 7)

| Method | Endpoint                                      | Description                                                          | Auth |
|--------|-----------------------------------------------|----------------------------------------------------------------------|------|
| POST   | /api/checkout/bootcamp/create-order           | Create bootcamp order + Snap token (`{ batchId }`)                   | JWT  |
| POST   | /api/checkout/webhook                         | *(shared with course checkout)* — branches on `order.type` to upsert Enrollment or BootcampEnrollment | -    |
| GET    | /api/checkout/verify/:orderId                 | *(shared with course checkout)* — same branch, used by the manual fallback button | JWT  |
| GET    | /api/bootcamps/enrollments/check/:batchId     | Check whether the user is enrolled in this batch — must be registered before `/api/bootcamps/:id` | JWT  |
| GET    | /api/bootcamps/my-enrollments                 | List all of the user's bootcamp enrollments                          | JWT  |

### Certificate (Phase 7)

| Method | Endpoint                                      | Description                                                          | Auth |
|--------|-----------------------------------------------|----------------------------------------------------------------------|------|
| GET    | /api/courses/:id/certificate                  | Get/issue certificate when progress is 100% (upsert, idempotent)     | JWT  |

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
│  └ userId (→User)│
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
| `users`            | `email` (unique)                             | `password` optional (Google-only users); `avatar_url` added in Phase 5; `role` enum: `student\|instructor\|admin\|mentor` |
| `topics`           | `slug` (unique)                              | Managed from the admin panel; `Course.topic_name` is resolved automatically from this collection on course create/update |
| `sessions`         | `userId + deviceId` (unique), TTL on `refreshExpiredAt` | One active session per device   |
| `courses`          | -                                            | `price = 0` when `isFree = true`           |
| `modules`          | `courseId`                                   | Ordered with `order` field                 |
| `chapters`         | `moduleId`                                   | Ordered with `order` field                 |
| `lessons`          | `chapterId`, `courseId`                      | `is_locked` = free preview flag in DB; computed dynamically in API |
| `progresses`       | `[userId, lessonId]` (unique)                | Upsert-safe                                |
| `quizquestions`    | `lessonId`                                   | `correct_index` never returned to FE       |
| `quizattempts`     | `[userId, lessonId]`                         | Multiple attempts allowed; `my-attempt` returns latest |
| `tasksubmissions`  | `[userId, lessonId]` (unique)                | One submission per user per lesson         |
| `orders`               | `midtrans_order_id` (unique), `[userId, courseId, status]`, `[userId, batchId, status]` (Phase 7), `[status, paidAt]` | `type: 'course'\|'bootcamp'`; `courseId` / `batchId` are conditionally required per `type` (Phase 7). The `[status, paidAt]` index serves the revenue report |
| `enrollments`          | `[userId, courseId]` (unique)                | Created after payment settlement; `orderId` null for free courses    |
| `bootcamppackages`     | -                                            | `mentors[]` embedded with a `userId` ref to User (role: mentor) + `occupation`; there is no separate mentor collection |
| `bootcampbatches`      | `packageId`                                  | `starting_price` aggregated from cheapest batch                      |
| `bootcampsessions`     | `batchId`                                    | -                                                                    |
| `bootcampenrollments`  | `[userId, batchId]` (unique)                 | Created after bootcamp payment settlement (Phase 7)                  |
| `certificates`         | `[userId, courseId]` (unique), `certificateId` (unique) | Issued when course progress = 100% (Phase 7)            |

---
