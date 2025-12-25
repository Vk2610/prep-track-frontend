import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Clock, AlertCircle, Info } from 'lucide-react';
import { notificationAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const toast = useToast();

    const fetchNotifications = async () => {
        try {
            const response = await notificationAPI.getAll();
            setNotifications(response.data.data);
            setUnreadCount(response.data.data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every 2 minutes
        const interval = setInterval(fetchNotifications, 120000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleReadAll = async () => {
        try {
            await notificationAPI.readAll();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success('All marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'reminder': return <Clock className="w-4 h-4 text-amber-400" />;
            case 'alert': return <AlertCircle className="w-4 h-4 text-red-400" />;
            case 'achievement': return <Check className="w-4 h-4 text-green-400" />;
            default: return <Info className="w-4 h-4 text-blue-400" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition active:scale-95 group"
                aria-label="Notifications"
            >
                <Bell className={`w-5 h-5 transition-colors ${isOpen ? 'text-white' : 'text-white/40 group-hover:text-white'}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0a0a0f] animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-3 w-[320px] sm:w-[380px] bg-[#0a0a0f]/95 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleReadAll}
                                    className="text-[10px] font-black text-purple-400 hover:text-purple-300 uppercase underline decoration-2 underline-offset-4"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                                        className={`p-4 border-b border-white/5 cursor-pointer transition-colors active:bg-white/5 ${n.isRead ? 'opacity-50' : 'bg-white/2 hover:bg-white/5'}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                {getTypeIcon(n.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-white mb-0.5">{n.title}</p>
                                                <p className="text-[11px] text-white/40 leading-relaxed mb-1.5">{n.message}</p>
                                                <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest">
                                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            {!n.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1" />
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 flex flex-col items-center justify-center text-center opacity-30">
                                    <Bell className="w-8 h-8 mb-4" />
                                    <p className="text-xs font-bold">No notifications yet</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-white/2 border-t border-white/5 text-center">
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Stay on track with your goals</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
