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

**Flow:**
```
[Register Page]
User fills form (name, email, password) → submit
        ↓
BE: validate input (Zod)
        ↓
BE: check email exists?
  → isVerified: true  → error "Email already registered"
  → isVerified: false → delete old account, create new
        ↓
BE: save user (isVerified: false) + generate 6-digit OTP + send email (Nodemailer)
        ↓
FE: redirect to [OTP Verification Page] (pass email via router state)
        ↓
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
- Email already registered & verified → reject with error
- Email registered but unverified → replace account & resend OTP
- OTP expired → user must click resend (not re-register)
- Resend OTP → BE enforces 60s cooldown (rate-limited), regenerate OTP & resend email
- Brute force OTP → rate limiting on `/verify-otp` endpoint

**BE Tasks:**
- [x] User model (`name`, `email`, `password`, `role`, `isVerified`, `otp`, `otpExpires`, `otpLastSentAt`)
- [x] Zod validation schema untuk register, verify OTP, resend OTP
- [x] Email service config (Nodemailer SMTP setup)
- [x] Template email OTP (konten email yang dikirim ke user)
- [x] `POST /api/auth/register` — validasi input, cek email, buat user, generate OTP, kirim email
- [x] `POST /api/auth/verify-otp` — cek OTP + expiry, tandai akun sebagai verified
- [x] `POST /api/auth/resend-otp` — enforce cooldown 60s, generate OTP baru, kirim ulang email
- [x] Rate limit pada `/verify-otp` & `/resend-otp`

**FE Tasks:**
- [x] Zod schema validasi register (nama, email, password, konfirmasi password)
- [x] API service `src/api/auth.ts` — fungsi `register()`, `verifyOtp()`, `resendOtp()`
- [x] `/auth/register` — halaman form pendaftaran (VeeValidate + Zod)
- [x] `/auth/verify-otp` — halaman input OTP (6-digit, resend countdown 60s)
- [x] Handle error response dari BE (email sudah terdaftar, OTP invalid/expired)
- [x] Loading state saat submit form (`isPending` dari TanStack Query `useMutation`)

---

#### 1.2 Login (Single Device + Token Strategy)

**Rule: 1 account = 1 active device at a time (Web or Mobile)**

**Token Strategy:**
| Token         | Expiry         | Keterangan                                      |
|---------------|----------------|-------------------------------------------------|
| Access Token  | 15 menit       | Dipakai untuk request ke API                    |
| Refresh Token | 1 hari (fixed) | Dipakai untuk minta access token baru. Tidak diperpanjang meski aktif. Setelah 1 hari harus login ulang. |

**Flow:**
```
[Login Page]
User inputs email + password + deviceId → submit
        ↓
BE: validate input (Zod)
        ↓
BE: check credentials + isVerified
        ↓
BE: check active Session for this user
  → no session                      → buat session baru
  → session exists
      → refresh token expired        → hapus session lama, buat session baru (auto)
      → same deviceId               → hapus session lama, buat session baru, return token baru
      → different device            → reject: "Account is active on another device. Please logout first."
        ↓
BE: return access token (15m) + refresh token (1 hari fixed)
        ↓
FE: simpan access token di Pinia (memory), refresh token di localStorage
        ↓
FE: redirect to [Dashboard]

--- saat access token expired (15 menit) ---

FE: kirim refresh token ke BE (silent, di background)
        ↓
BE: cek refresh token valid + belum expired + deviceId sama
        ↓
BE: return access token baru (15m)
        ↓
FE: lanjut pakai app, user tidak sadar

--- setelah 1 hari ---

Refresh token expired → FE paksa logout → redirect ke login
```

**Device ID:**
- Web: UUID generated on first visit, stored in `localStorage`
- Mobile: native device ID (`expo-device` / `react-native-device-info`)
- Sent in every login request as `deviceId` field

**Session Model (`sessions` collection):**
```
userId            → ref to User
deviceId          → string (unique per device)
refreshToken      → string (hashed dengan bcrypt)
refreshExpiredAt  → Date (fixed 1 hari sejak login)
createdAt         → Date
```

**Edge Cases:**
- No active session → login allowed
- Same device, refresh token still valid → perbarui access token
- Different device, refresh token still valid → reject dengan error
- Different device, refresh token expired → hapus session lama otomatis, login diizinkan
- Refresh token expired → paksa logout, redirect ke login

**BE Tasks:**
- [x] Session model (`userId`, `deviceId`, `refreshToken`, `refreshExpiredAt`, `createdAt`)
- [x] Zod validation schema untuk login
- [x] `POST /api/auth/login` — validasi kredensial, cek session, hash refresh token, return access token + refresh token
- [x] `POST /api/auth/refresh` — validasi refresh token, cek session, return access token baru
- [x] `POST /api/auth/logout` — hapus session berdasarkan deviceId
- [x] `GET /api/auth/me` — return data user yang sedang login (butuh access token)
- [x] Auth middleware — verifikasi access token + cek session aktif di DB
- [x] Rate limit pada `/login`

**FE Tasks:**
- [x] Zod schema validasi login (email, password)
- [x] Generate UUID deviceId saat pertama kali buka app, simpan di localStorage (`useDeviceId` composable)
- [x] API service `src/api/auth.ts` — fungsi `login()`, `refresh()`, `logout()`, `getMe()`
- [x] `/auth/login` — halaman form login (VeeValidate + Zod)
- [x] Pinia authStore — simpan access token di memory, refresh token + user data + deviceId di localStorage
- [x] Load user data via `getMe()` saat app pertama dibuka (jika token masih valid)
- [x] Axios interceptor — auto silent refresh saat access token expired (401)
- [x] Handle error "akun aktif di perangkat lain" dengan pesan yang jelas
- [x] Loading state saat submit form (`isPending` dari TanStack Query `useMutation`)

---

#### 1.3 Forgot Password

**Flow:**
```
[Forgot Password Page]
User inputs email → submit
        ↓
BE: check email exists + generate OTP + send email
        ↓
FE: redirect to [OTP Verification Page] (reset mode)
        ↓
User inputs OTP
        ↓
FE: redirect to [Reset Password Page]
        ↓
User inputs new password → submit
        ↓
BE: update password + hapus semua session aktif (force logout semua device)
        ↓
FE: redirect to [Login Page]
```

**BE Tasks:**
- [x] Zod validation schema untuk forgot password, verify reset OTP, reset password
- [x] `POST /api/auth/forgot-password` — cek email terdaftar, generate OTP, kirim email
- [x] `POST /api/auth/verify-reset-otp` — validasi OTP untuk reset password
- [x] `POST /api/auth/reset-password` — validasi password baru (min length, konfirmasi), update password, hapus semua session aktif
- [x] Rate limit pada `/forgot-password`

**FE Tasks:**
- [x] Zod schema validasi (email, OTP, password baru + konfirmasi password)
- [x] API service `src/api/auth.ts` — fungsi `forgotPassword()`, `verifyResetOtp()`, `resetPassword()`
- [x] `/auth/forgot-password` — halaman input email
- [x] `/auth/verify-otp` — dipakai ulang dalam mode reset (bukan halaman baru, dibedakan via `history.state.mode`)
- [x] `/auth/reset-password` — halaman input password baru + konfirmasi, success state dengan redirect otomatis
- [x] Handle error response dari BE
- [x] Loading state saat submit form (`isPending` dari TanStack Query `useMutation`)

---

#### 1.4 Global FE — Auth Infrastructure

**FE Tasks:**
- [x] `src/api/client.ts` — Axios instance + interceptors (silent refresh, global error modal)
- [x] `src/api/auth.ts` — semua API call auth terkumpul dalam satu file
- [x] `src/types/api.ts` — shared `ApiResponse<T>` generic type
- [x] `src/types/auth.ts` — TypeScript types untuk semua request & response auth
- [x] Router guard (navigation guard) — redirect ke `/auth/login` jika belum auth, redirect ke `/` jika sudah auth
- [x] `src/composables/useDeviceId.ts` — composable untuk generate & baca UUID deviceId
- [x] `src/composables/auth/` — semua logic auth di-extract ke composable (Vue equivalent of React custom hooks)

---

#### 1.5 Global FE — Error Handling

**Aturan penanganan error:**

| Jenis Error         | Contoh                          | Handler                          |
|---------------------|---------------------------------|----------------------------------|
| Network error       | Tidak ada internet, timeout     | Modal global                     |
| Server error (5xx)  | Server crash, maintenance       | Modal global                     |
| Auth error (401)    | Token expired                   | Silent refresh → gagal → redirect login |
| Validation error (400) | Email salah format           | Inline di form                   |
| Not found (404)     | Data tidak ditemukan            | Inline di form                   |

**FE Tasks:**
- [x] `src/stores/errorStore.ts` — Pinia store untuk state error global
- [x] `src/components/ui/GlobalErrorModal.vue` — modal error yang dipasang di `App.vue`
- [x] `src/api/client.ts` — Axios interceptor tangkap network error & 5xx, trigger errorStore
- [x] `App.vue` — pasang `GlobalErrorModal` di root app

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
│   └── auth.ts                # Semua API call auth
├── composables/
│   ├── useDeviceId.ts         # Generate & baca UUID deviceId
│   └── auth/                  # Auth composables (logic dipisah dari view)
│       ├── useLogin.ts
│       ├── useRegister.ts
│       ├── useOtpVerification.ts
│       ├── useForgotPassword.ts
│       └── useResetPassword.ts
├── layouts/
│   ├── DefaultLayout.vue
│   └── AuthLayout.vue         # Split-screen layout (branding kiri, form kanan)
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
│   └── auth.ts                # TypeScript types request & response auth
├── views/
│   ├── HomeView.vue
│   └── auth/
│       ├── LoginView.vue
│       ├── RegisterView.vue
│       ├── OtpVerificationView.vue  # Dipakai untuk register & reset password (via history.state.mode)
│       ├── ForgotPasswordView.vue
│       └── ResetPasswordView.vue
└── components/
    └── ui/
        └── GlobalErrorModal.vue  # Modal error global (network / server error)
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
│   └── authValidation.ts  # Zod schemas untuk auth endpoints
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
