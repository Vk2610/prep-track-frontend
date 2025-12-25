import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Lock, Shield, Bell, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('security');
    const [loading, setLoading] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const toast = useToast();

    // Sync state with user context when it changes
    useEffect(() => {
        if (user) {
            setNotificationsEnabled(user.notificationsEnabled ?? true);
        }
    }, [user]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        // Validation logic
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (passwordData.newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            await authAPI.updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password update failed');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="min-h-screen gradient-mesh-bg overflow-x-hidden">
            <main className="page-container px-4 sm:px-6 py-6 sm:py-20 flex justify-center">
                <div className="w-full max-w-5xl reveal">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
                        {/* Sidebar/Tabs Navigation */}
                        <div className="md:col-span-4 space-y-6">
                            <div className="px-2 sm:px-0">
                                <div className="glass-badge mb-2">USER CONFIG</div>
                                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                                    <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                                    SETTINGS
                                </h1>
                            </div>

                            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 px-2 sm:px-0 no-scrollbar sticky top-24">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const active = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`whitespace-nowrap flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 ${active
                                                ? 'bg-white text-black shadow-xl shadow-white/10 scale-[1.02]'
                                                : 'text-white/40 hover:text-white hover:bg-white/5 bg-white/2 border border-white/5'
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${active ? 'text-black' : 'text-current'}`} />
                                            <span className="text-sm sm:text-base">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="md:col-span-8">
                            <div className="glass-panel p-5 sm:p-10 shadow-2xl relative group overflow-hidden">
                                <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-purple-500/10 transition-all duration-700"></div>

                                {activeTab === 'security' && (
                                    <div className="space-y-6 sm:space-y-8 relative z-10 animate-reveal">
                                        <div className="flex items-center gap-4 pb-5 border-b border-white/5">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">Security</h2>
                                                <p className="text-white/30 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Update your security preferences</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handlePasswordChange} className="space-y-5 sm:space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Current Password</label>
                                                <div className="relative group/input">
                                                    <input
                                                        type="password"
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                        required
                                                        className="input-premium font-bold pl-12! sm:pl-14! h-12 sm:h-14 text-sm sm:text-base"
                                                        placeholder="••••••••"
                                                    />
                                                    <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-white/20 group-hover/input:text-purple-400 transition-colors">
                                                        <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">New Password</label>
                                                    <div className="relative group/input">
                                                        <input
                                                            type="password"
                                                            value={passwordData.newPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                            required
                                                            className="input-premium font-bold pl-12! sm:pl-14! h-12 sm:h-14 text-sm sm:text-base"
                                                            placeholder="••••••••"
                                                        />
                                                        <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-white/20 group-hover/input:text-purple-400 transition-colors">
                                                            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Confirm New</label>
                                                    <div className="relative group/input">
                                                        <input
                                                            type="password"
                                                            value={passwordData.confirmPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                            required
                                                            className="input-premium font-bold pl-12! sm:pl-14! h-12 sm:h-14 text-sm sm:text-base"
                                                            placeholder="••••••••"
                                                        />
                                                        <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-white/20 group-hover/input:text-purple-400 transition-colors">
                                                            <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3 sm:gap-4 items-start">
                                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 mt-0.5" />
                                                <p className="text-[10px] sm:text-xs text-amber-500/80 leading-relaxed font-medium">
                                                    Security Tip: Use at least 8 characters with numbers and symbols for better protection.
                                                </p>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="btn-primary w-full! bg-linear-to-r! from-purple-600! to-pink-500! text-white! p-3.5 sm:p-4! text-sm sm:text-base font-black uppercase tracking-widest"
                                            >
                                                <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                    Update Password
                                                </div>
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'notifications' && (
                                    <div className="space-y-8 relative z-10 animate-reveal">
                                        <div className="flex items-center gap-4 pb-5 border-b border-white/5">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">Notifications</h2>
                                                <p className="text-white/30 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Manage how you receive alerts</p>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 border border-white/10 rounded-3xl p-4 sm:p-8 flex flex-row items-center justify-between gap-4 group/toggle">
                                            <div className="space-y-1 overflow-hidden">
                                                <h3 className="text-sm sm:text-lg font-bold text-white group-hover/toggle:text-blue-400 transition-colors truncate">Push Notifications</h3>
                                                <p className="text-[10px] sm:text-sm text-white/40 leading-tight">Get instant alerts for your daily tasks.</p>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    const newState = !notificationsEnabled;
                                                    setNotificationsEnabled(newState);
                                                    try {
                                                        const response = await authAPI.updateSettings({ notificationsEnabled: newState });
                                                        if (response.data.success) {
                                                            updateUser({ notificationsEnabled: newState });
                                                            toast.success(`Notifications ${newState ? 'Enabled' : 'Disabled'}`);
                                                        }
                                                    } catch (error) {
                                                        setNotificationsEnabled(!newState); // Rollback
                                                        toast.error('Failed to update settings');
                                                    }
                                                }}
                                                className={`relative w-14 sm:w-16 h-8 sm:h-9 rounded-full shrink-0 transition-all duration-500 ${notificationsEnabled ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 left-1 bottom-1 w-6 sm:w-7 bg-white rounded-full shadow-lg transition-transform duration-500 ${notificationsEnabled ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0'}`}></div>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-white/2 border border-white/5 opacity-50 cursor-not-allowed">
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Email Alerts</p>
                                                <p className="text-xs text-white/40">Coming Soon</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white/2 border border-white/5 opacity-50 cursor-not-allowed">
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Weekly Digest</p>
                                                <p className="text-xs text-white/40">Coming Soon</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
