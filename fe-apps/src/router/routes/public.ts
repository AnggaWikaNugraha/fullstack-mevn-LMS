import type { RouteRecordRaw } from 'vue-router';

const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: 'courses',
        name: 'courses',
        component: () => import('@/views/courses/CoursesView.vue'),
      },
      {
        path: 'courses/:id',
        name: 'course-detail',
        component: () => import('@/views/courses/CourseDetailView.vue'),
      },
      {
        // Sertifikat memakai DefaultLayout seperti halaman course lain,
        // tapi tetap butuh login — meta anak digabung dengan meta induk
        path: 'courses/:id/certificate',
        name: 'course-certificate',
        component: () => import('@/views/courses/CertificateView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'bootcamps',
        name: 'bootcamps',
        component: () => import('@/views/bootcamps/BootcampsView.vue'),
      },
      {
        path: 'bootcamps/:id',
        name: 'bootcamp-detail',
        component: () => import('@/views/bootcamps/BootcampDetailView.vue'),
      },
      {
        // Live session butuh login; enrollment dan kuota dicek server saat
        // meminta token, bukan di router guard
        path: 'bootcamps/sessions/:sessionId/live',
        name: 'live-session',
        component: () => import('@/views/bootcamps/LiveSessionView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'checkout/result',
        name: 'checkout-result',
        component: () => import('@/views/checkout/CheckoutResultView.vue'),
      },
      {
        path: 'checkout/bootcamp/result',
        name: 'checkout-bootcamp-result',
        component: () => import('@/views/bootcamps/CheckoutBootcampResultView.vue'),
      },
    ],
  },
];

export default publicRoutes;
