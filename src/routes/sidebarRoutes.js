// Sidebar menu id -> route path, keyed to match Sidebar's DEFAULT_MENU_ITEMS
// ids exactly. Only ids that have a real route/view in AppRoutes belong
// here — items without a page yet are intentionally omitted so clicking
// them is a no-op instead of navigating to a route that doesn't exist.
export const SIDEBAR_ROUTES = {
  dashboard: '/dashboard',
  pesanan: '/orders',
  layanan: '/products',
}
