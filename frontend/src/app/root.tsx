import { Links, Meta, Outlet, Scripts, ScrollRestoration, Link, useLocation } from "react-router";
import type { LinksFunction } from "react-router";
import "./app.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-50">
        {!isAuthPage && (
          <nav className="bg-white border-b border-slate-200/60 sticky top-0 z-50 px-4 md:px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600">
                <span>🧠</span> ResumeAI
              </Link>

              <div className="flex items-center gap-6">
                <Link to="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/resumes" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  Resumes
                </Link>
                <Link to="/templates" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  Templates
                </Link>
                <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  Pricing
                </Link>
                <Link to="/profile" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  👤 Profile
                </Link>
                <Link to="/auth" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
          </nav>
        )}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}