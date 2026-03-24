import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    Briefcase,
    Users,
    Search,
    Bookmark,
    UserCircle,
    Settings,
    LogOut,
    Menu,
    X,
    Bell
} from 'lucide-react';
import api from '../../services/api.js';
import Swal from 'sweetalert2';

const RecruiterLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/recruiter/dashboard' },
        { icon: PlusCircle, label: 'Post Internship', path: '/recruiter/post', primary: true },
        { icon: Briefcase, label: 'My Internships', path: '/recruiter/my-internships' },
        { icon: Users, label: 'Applicants', path: '/recruiter/applicants' },
        { icon: Search, label: 'Discover Students', path: '/recruiter/discover' },
        { icon: Bookmark, label: 'Saved Candidates', path: '/recruiter/saved' },
        { icon: UserCircle, label: 'Profile', path: '/recruiter/profile' },
        { icon: Settings, label: 'Settings', path: '/recruiter/settings' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-12 px-2">
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                            <Briefcase className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">InternMatch</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all
                                    ${item.primary
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] mb-6'
                                        : isActive
                                            ? 'bg-slate-50 dark:bg-slate-950 text-orange-600 border border-slate-100 dark:border-slate-800'
                                            : 'text-slate-500 hover:text-orange-600 hover:bg-slate-50 dark:hover:bg-slate-950/50'}
                                `}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                        <button
                            className="flex items-center gap-4 px-4 py-3.5 w-full rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                            onClick={async () => {
                                const result = await Swal.fire({
                                    title: 'Sign out?',
                                    text: 'Are you sure you want to end your session?',
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonText: 'Yes, Sign Out',
                                    confirmButtonColor: '#0f172a',
                                    customClass: { popup: 'rounded-[2.5rem]' }
                                });

                                if (result.isConfirmed) {
                                    try {
                                        await api.post('/logout');
                                        localStorage.clear();
                                        navigate('/login');
                                    } catch (err) {
                                        localStorage.clear();
                                        navigate('/login');
                                    }
                                }
                            }}
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 min-h-screen relative">
                {/* Content Area */}
                <div className="container mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-30 lg:hidden"
                />
            )}
        </div>
    );
};

export default RecruiterLayout;
