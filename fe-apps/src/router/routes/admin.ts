import type { RouteRecordRaw } from 'vue-router';

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/AdminDashboardView.vue'),
      },
      // 6.2 Course Management
      {
        path: 'courses',
        name: 'admin-courses',
        component: () => import('@/views/admin/courses/CourseListView.vue'),
      },
      {
        path: 'courses/new',
        name: 'admin-course-new',
        component: () => import('@/views/admin/courses/CourseFormView.vue'),
      },
      {
        path: 'courses/:id/edit',
        name: 'admin-course-edit',
        component: () => import('@/views/admin/courses/CourseFormView.vue'),
      },
      {
        path: 'courses/:id/content',
        name: 'admin-course-content',
        component: () => import('@/views/admin/courses/CourseContentView.vue'),
      },
      // 6.3 Quiz Management
      {
        path: 'quiz/:lessonId',
        name: 'admin-quiz-editor',
        component: () => import('@/views/admin/quiz/QuizEditorView.vue'),
      },
      // 6.4 User Management
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/users/UserListView.vue'),
      },
      // 6.5 Bootcamp Management
      {
        path: 'bootcamps',
        name: 'admin-bootcamps',
        component: () => import('@/views/admin/bootcamps/BootcampListView.vue'),
      },
      {
        path: 'bootcamps/new',
        name: 'admin-bootcamp-new',
        component: () => import('@/views/admin/bootcamps/BootcampFormView.vue'),
      },
      {
        path: 'bootcamps/:id/edit',
        name: 'admin-bootcamp-edit',
        component: () => import('@/views/admin/bootcamps/BootcampFormView.vue'),
      },
      {
        path: 'bootcamps/:id/content',
        name: 'admin-bootcamp-content',
        component: () => import('@/views/admin/bootcamps/BootcampContentView.vue'),
      },
      // 6.6 Order Management
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('@/views/admin/orders/OrderListView.vue'),
      },
      // 6.7 Task Review
      {
        path: 'tasks',
        name: 'admin-tasks',
        component: () => import('@/views/admin/tasks/TaskListView.vue'),
      },
      // 6.8 Revenue
      {
        path: 'revenue',
        name: 'admin-revenue',
        component: () => import('@/views/admin/revenue/RevenueView.vue'),
      },
    ],
  },
];

export default adminRoutes;
