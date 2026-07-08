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
        path: 'bootcamps',
        name: 'bootcamps',
        component: () => import('@/views/bootcamps/BootcampsView.vue'),
      },
      {
        path: 'bootcamps/:id',
        name: 'bootcamp-detail',
        component: () => import('@/views/bootcamps/BootcampDetailView.vue'),
      },
    ],
  },
];

export default publicRoutes;
