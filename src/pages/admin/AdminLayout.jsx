import { NavLink, Outlet } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

function AdminLayout() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen">
        {/* Mobile Top Navbar */}
        <div className="navbar bg-neutral text-neutral-content lg:hidden">
          <div className="flex-none">
            <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
              <Bars3Icon className="h-6 w-6" />
            </label>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost text-xl normal-case">InternMatch Admin</a>
          </div>
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-base-100 custom-scrollbar">
          <Outlet />
        </div>
      </div>

      {/* Fixed Sidebar */}
      <div className="drawer-side">
        <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

        <ul className="menu bg-neutral text-neutral-content min-h-full w-80 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <label htmlFor="admin-drawer" className="lg:hidden">
              <XMarkIcon className="h-6 w-6" />
            </label>
          </div>

          <div className="flex-1 space-y-2">
            <li>
              <NavLink to="dashboard" end className="flex items-center gap-3 text-lg rounded-lg">
                <HomeIcon className="h-6 w-6" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="manage-postings" end className="flex items-center gap-3 text-lg rounded-lg">
                <DocumentTextIcon className="h-6 w-6" />
                Manage Postings
              </NavLink>
            </li>
            <li>
              <NavLink to="manage-users" end className="flex items-center gap-3 text-lg rounded-lg">
                <UsersIcon className="h-6 w-6" />
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink to="moderation" end className="flex items-center gap-3 text-lg rounded-lg">
                <ShieldCheckIcon className="h-6 w-6" />
                Moderation Panel
              </NavLink>
            </li>
            <li>
              <NavLink to="reports" end className="flex items-center gap-3 text-lg rounded-lg">
                <ChartBarIcon className="h-6 w-6" />
                Reports & Analytics
              </NavLink>
            </li>
          </div>

          <div className="mt-auto pt-4 border-t border-neutral-content/20">
            <li>
              <a className="flex items-center gap-3 text-lg text-error rounded-lg">
                Logout
              </a>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
}

export default AdminLayout;