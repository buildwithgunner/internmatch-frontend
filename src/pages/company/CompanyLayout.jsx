import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  Briefcase,
  FileText,
  Users,
  User,
  Menu,
  X,
  Calendar,
  LogOut,             
} from "lucide-react";
import { Zap } from 'lucide-react';
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function CompanyLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="drawer lg:drawer-open font-sans min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <input id="company-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Header */}
        <div className="navbar bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 lg:hidden px-6">
          <div className="flex-none">
            <label htmlFor="company-drawer" className="btn btn-square btn-ghost text-slate-900 dark:text-slate-200">
              <Menu className="h-6 w-6" />
            </label>
          </div>
          <div className="flex-1 ml-4">
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
              Intern<span className="text-orange-600 dark:text-orange-500 italic">match.</span>
            </span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label htmlFor="company-drawer" className="drawer-overlay"></label>
        <div className="w-80 min-h-full bg-slate-950 text-white p-6 flex flex-col border-r border-slate-800/60">
          <div className="flex items-center justify-between mb-12 px-2">
            <h2 className="text-2xl font-black tracking-tighter italic">
              Intern<span className="text-orange-600">match.</span>
            </h2>
            <label htmlFor="company-drawer" className="lg:hidden text-white/60 cursor-pointer">
              <X className="h-6 w-6" />
            </label>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { to: "dashboard", icon: Home, label: "Dashboard" },
              { to: "post", icon: Briefcase, label: "Post Internship" },
              { to: "manage", icon: FileText, label: "Manage Postings" },
              { to: "applicants", icon: Users, label: "Applicants" },
              { to: "interviews", icon: Calendar, label: "Interviews" },
              { to: "profile", icon: User, label: "Company Profile" },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) => `
                  flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300
                  ${isActive 
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30" 
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"}
                `}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800/60">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-4 px-5 py-4 text-slate-400 font-semibold hover:text-orange-500 hover:bg-orange-900/20 transition-all w-full rounded-2xl text-left"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyLayout;