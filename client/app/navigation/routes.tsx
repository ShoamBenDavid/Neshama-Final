// Route names for the app navigation
export const ROUTES = {
  DASHBOARD: 'Dashboard',
  JOURNAL: 'Journal',
  FORUM: 'Forum',
  SUPPORT_CENTER: 'SupportCenter',
  CONTENT_LIBRARY: 'ContentLibrary',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];

