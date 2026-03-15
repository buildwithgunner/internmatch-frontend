import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  HomeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  BookmarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext.jsx";

function StudentLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Simple dark mode init (you can move this to a context/provider later if needed)
  useEffect(() => {
    // On mount: respect saved preference or system
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { to: "dashboard", icon: HomeIcon, label: "Overview" },
    { to: "browse", icon: BriefcaseIcon, label: "Explore" },
    { to: "saved", icon: BookmarkIcon, label: "Saved" },
    { to: "applications", icon: DocumentTextIcon, label: "Applied" },
    { to: "interviews", icon: ChatBubbleLeftRightIcon, label: "Interviews" },
    { to: "ambassador", icon: SparklesIcon, label: "Ambassador" },
    { to: "/student/profile", icon: UserIcon, label: "Profile" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      {/* --- DESKTOP SIDEBAR (Hover-Expand) --- */}
      <aside
        className={`
          hidden lg:flex flex-col 
          bg-slate-950 dark:bg-slate-950 
          text-white 
          transition-all duration-300 ease-in-out z-50 
          w-20 hover:w-72 group 
          border-r border-white/5 dark:border-slate-800/60
        `}
      >
        <div className="h-20 flex items-center px-6 overflow-hidden">
          <div className="min-w-[32px] h-8 bg-orange-600 dark:bg-orange-700 rounded-lg flex items-center justify-center font-black italic text-white">
            iM
          </div>
          <span className="ml-4 text-xl font-black italic tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Intern<span className="text-orange-500 dark:text-orange-400">match.</span>
          </span>
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center h-12 rounded-xl transition-all duration-200 overflow-hidden ${isActive
                  ? "bg-orange-600 text-white dark:bg-orange-700"
                  : "text-slate-400 dark:text-slate-500 hover:bg-white/5 dark:hover:bg-slate-800/50 hover:text-white dark:hover:text-slate-200"
                }`
              }
            >
              <div className="min-w-[56px] flex justify-center">
                <item.icon className="h-6 w-6" />
              </div>
              <span className="font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 dark:border-slate-800/60">
          <button
            onClick={handleLogout}
            className="flex items-center w-full h-12 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-red-500/10 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all overflow-hidden"
          >
            <div className="min-w-[56px] flex justify-center">
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            </div>
            <span className="font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE NAVBAR --- */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <header className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between px-6 z-40 transition-colors">
          <span className="font-black italic text-xl tracking-tighter text-slate-900 dark:text-white">
            Intern<span className="text-orange-500 dark:text-orange-400">match.</span>
          </span>
          <button onClick={() => setIsMobileOpen(true)} className="p-2 text-slate-900 dark:text-slate-200">
            <Bars3Icon className="h-6 w-6" />
          </button>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
          <Outlet />
        </main>
      </div>

      {/* --- MOBILE DRAWER OVERLAY --- */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-slate-950 dark:bg-slate-950 p-6 shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <span className="font-black italic text-2xl text-white">
                Intern<span className="text-orange-500 dark:text-orange-400">match.</span>
              </span>
              <button onClick={() => setIsMobileOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${isActive
                      ? "bg-orange-600 text-white dark:bg-orange-700"
                      : "text-slate-300 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-slate-800/50"
                    }`
                  }
                >
                  <item.icon className="h-6 w-6" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10 dark:border-slate-800/60">
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 w-full p-4 rounded-xl font-bold text-slate-300 dark:text-slate-400 hover:bg-red-500/10 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all"
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentLayout;