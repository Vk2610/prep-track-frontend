import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import {
    LayoutDashboard,
    CalendarCheck,
    ClipboardList,
    BarChart3,
    UserCircle2,
    LogOut,
    Settings,
    ChevronDown,
    Menu,
    X,
    Zap,
    Users
} from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const sidebarRef = useRef(null);
    const touchStartX = useRef(0);

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/daily-tracker', label: 'Daily Tracker', icon: CalendarCheck },
        { to: '/mock-tracker', label: 'Mock Tracker', icon: ClipboardList },
        { to: '/mock-analysis', label: 'Analysis', icon: BarChart3 },
        { to: '/soft-skills', label: 'Soft Skills', icon: Users },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        authAPI.logout();
        logout();
        navigate('/login');
    };

    /* Prevent background scroll */
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    }, [menuOpen]);

    /* ESC to close mobile menu */
    useEffect(() => {
        if (!menuOpen) return;
        const onKeyDown = (e) => e.key === 'Escape' && setMenuOpen(false);
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [menuOpen]);

    /* Focus first element in sidebar */
    useEffect(() => {
        if (menuOpen && sidebarRef.current) {
            sidebarRef.current.querySelector('a, button')?.focus();
        }
    }, [menuOpen]);

    /* Swipe to close */
    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchMove = (e) => {
        const deltaX = e.touches[0].clientX - touchStartX.current;
        if (deltaX > 80) setMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50">
            <div className="backdrop-blur-2xl bg-black/20 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                    {/* LOGO */}
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            <Zap className="w-6 h-6 text-black fill-black" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white uppercase">
                            Prep<span className="text-purple-400">Track</span>
                        </span>
                    </Link>

                    {/* DESKTOP NAV */}
                    <div className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                        {navLinks.map(({ to, label, icon: Icon }) => {
                            const active = isActive(to);
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm ${active ? 'text-black' : 'text-white/50 hover:text-white'
                                        }`}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.6)]"
                                            transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
                                        />
                                    )}
                                    <Icon className="relative z-10 w-4 h-4" />
                                    <span className="relative z-10">{label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center gap-3">

                        {/* DESKTOP USER MENU */}
                        <div className="hidden md:block relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition active:scale-95"
                            >
                                <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]">
                                    <span className="text-sm font-black text-white">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-[#0a0a0f]" />
                                </div>
                                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 mt-3 w-64 bg-[#0a0a0f]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                    >
                                        <Link to="/profile" className="menu-item">
                                            <UserCircle2 className="w-4 h-4" /> Profile
                                        </Link>
                                        <Link to="/settings" className="menu-item">
                                            <Settings className="w-4 h-4" /> Settings
                                        </Link>
                                        <button onClick={handleLogout} className="menu-item text-red-400">
                                            <LogOut className="w-4 h-4" /> Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* MOBILE MENU BUTTON */}
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="md:hidden w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95"
                        >
                            <Menu className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE OVERLAY + SIDEBAR */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
                        />

                        <motion.div
                            ref={sidebarRef}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#07040d]/90 backdrop-blur-3xl z-50 border-l border-white/10 flex flex-col"
                        >
                            {/* HEADER */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <span className="text-lg font-black text-white">Menu</span>
                                <button onClick={() => setMenuOpen(false)}>
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* NAV LINKS */}
                            <div className="flex-1 p-6 space-y-3">
                                {navLinks.map(({ to, label, icon: Icon }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={() => setMenuOpen(false)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition ${isActive(to)
                                            ? 'bg-white text-black shadow-[0_0_25px_rgba(168,85,247,0.6)]'
                                            : 'text-white/50 bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {label}
                                    </Link>
                                ))}
                            </div>

                            {/* MOBILE PROFILE */}
                            <div className="p-6 border-t border-white/5 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                        <span className="text-lg font-black text-white">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#07040d]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-white truncate">{user?.name}</p>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>

                                <Link to="/profile" onClick={() => setMenuOpen(false)} className="menu-item">
                                    <UserCircle2 className="w-4 h-4" /> Profile
                                </Link>

                                <Link to="/settings" onClick={() => setMenuOpen(false)} className="menu-item">
                                    <Settings className="w-4 h-4" /> Settings
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black hover:bg-red-500/20 transition"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
