export const ROUTES = {
  home: "/",
  features: "/features",
  howItWorks: "/how-it-works",
  login: "/login",
  signup: "/signup",
  studentDashboard: "/student/dashboard",
  admin: "/admin/dashboard",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
