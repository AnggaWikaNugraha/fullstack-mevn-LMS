import type { RouteRecordRaw } from 'vue-router';

// Protected routes — each child must have meta: { requiresAuth: true }
// Example: profile, my courses, purchase history, etc.
const protectedRoutes: RouteRecordRaw[] = [];

export default protectedRoutes;
