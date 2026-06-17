import { type RouteConfig } from "@react-router/dev/routes";

export default [
 
  { path: "/", file: "routes/home.tsx" },
  { path: "/results", file: "routes/results.tsx" },
  { path: "/my-data", file: "routes/my-data.tsx" },
  { path: "/resumes", file: "routes/resumes.tsx" },
  { path: "/resume/:id", file: "routes/resume-detail.tsx" },
  { path: "/auth", file: "routes/auth.tsx" },
  { path: "/auth/github/callback", file: "routes/github-callback.tsx" },
  { path: "/profile", file: "routes/profile.tsx" },
  { path: "/templates", file: "routes/templates.tsx" },
  { path: "/pricing", file: "routes/pricing.tsx" },
  { path: "/admin", file: "routes/admin.tsx" },
  { path: "/verify/:token", file: "routes/verify-email.tsx" },
  { path: "/forgot-password", file: "routes/forgot-password.tsx" },
  { path: "/reset-password/:token", file: "routes/reset-password.tsx" },
  { path: "/success", file: "routes/success.tsx" },
  { path: "/cancel", file: "routes/cancel.tsx" },
] satisfies RouteConfig;