import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import authRoutes from './routes/auth';
import publicRoutes from './routes/public';
import protectedRoutes from './routes/protected';
import adminRoutes from './routes/admin';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    ...protectedRoutes,
    ...adminRoutes,
    ...authRoutes,
    // Catch-all → home (guard will redirect to login if not authed)
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

// Runs before every navigation to enforce access control
router.beforeEach((to) => {
  const auth = useAuthStore();

  // Admin page — harus login dan punya role admin
  if (to.meta.requiresAdmin) {
    if (!auth.isAuthenticated) return { name: 'login' };
    if (auth.user?.role !== 'admin') return { name: 'home' };
  }

  // Protected page but not logged in → go to login
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' };
  }

  // Guest-only page but already logged in → go to home
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'home' };
  }
});

export default router;
