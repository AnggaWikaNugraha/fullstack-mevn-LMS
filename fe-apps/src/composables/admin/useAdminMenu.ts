import {
  LayoutDashboard,
  BookOpen,
  Tag,
  CircleHelp,
  Users,
  GraduationCap,
  ShoppingCart,
  ClipboardList,
  BarChart2,
} from '@lucide/vue';

export interface AdminMenuItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

// Sumber tunggal daftar menu admin — dipakai sidebar AdminLayout sekaligus
// dropdown Admin di navbar, supaya keduanya tidak pernah berbeda isi
export const adminMenuItems: AdminMenuItem[] = [
  { to: '/admin',           label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { to: '/admin/courses',   label: 'Courses',    icon: BookOpen },
  { to: '/admin/topics',    label: 'Topics',     icon: Tag },
  { to: '/admin/quiz',      label: 'Quiz',       icon: CircleHelp },
  { to: '/admin/users',     label: 'Users',      icon: Users },
  { to: '/admin/bootcamps', label: 'Bootcamps',  icon: GraduationCap },
  { to: '/admin/orders',    label: 'Orders',     icon: ShoppingCart },
  { to: '/admin/tasks',     label: 'Tasks',      icon: ClipboardList },
  { to: '/admin/revenue',   label: 'Revenue',    icon: BarChart2 },
];

// Dashboard dicocokkan persis; menu lain aktif untuk seluruh sub-route-nya
export function isAdminMenuActive(item: AdminMenuItem, path: string): boolean {
  return item.exact ? path === item.to : path.startsWith(item.to);
}
