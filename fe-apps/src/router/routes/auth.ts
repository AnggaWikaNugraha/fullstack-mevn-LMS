import type { RouteRecordRaw } from 'vue-router';

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        meta: { guestOnly: true },
        component: () => import('@/views/auth/LoginView.vue'),
      },
      {
        path: 'register',
        name: 'register',
        meta: { guestOnly: true },
        component: () => import('@/views/auth/RegisterView.vue'),
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        meta: { guestOnly: true },
        component: () => import('@/views/auth/ForgotPasswordView.vue'),
      },
      {
        path: 'verify-otp',
        name: 'verify-otp',
        component: () => import('@/views/auth/OtpVerificationView.vue'),
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/views/auth/ResetPasswordView.vue'),
      },
      {
        path: 'google/callback',
        name: 'google-callback',
        component: () => import('@/views/auth/GoogleCallbackView.vue'),
      },
    ],
  },
];

export default authRoutes;
