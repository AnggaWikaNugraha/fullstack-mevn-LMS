import type { RouteRecordRaw } from 'vue-router';

const protectedRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/ProfileLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'my-courses',
        name: 'my-courses',
        component: () => import('@/views/user/MyCoursesView.vue'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/user/ProfileView.vue'),
      },
      {
        path: 'purchases',
        name: 'purchases',
        component: () => import('@/views/user/PurchaseHistoryView.vue'),
      },
    ],
  },
];

export default protectedRoutes;
