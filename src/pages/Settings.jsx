import { useState } from 'react';
import { Settings as SettingsIcon, Lock, Shield, Bell, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const toast = useToast();

    const handlePasswordChange = async (e) => {
        e.preventDefault();

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

    return (
        <div className="min-h-screen gradient-mesh-bg">
            <main className="page-container flex justify-center items-center py-6 sm:py-24">
                <div className="w-full max-w-4xl reveal px-0 sm:px-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                        {/* Sidebar */}
                        <div className="md:col-span-4 space-y-4">
                            <h1 className="text-2xl sm:text-3xl font-black text-white px-6 sm:px-0 mb-2 sm:mb-8 tracking-tight flex items-center gap-4">
                                <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                                SETTINGS
                            </h1>
                            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 px-6 sm:px-0 no-scrollbar">
                                {[
                                    { id: 'security', label: 'Security', icon: Lock, active: true },
                                    { id: 'notifications', label: 'Notifications', icon: Bell, active: false },
                                    { id: 'privacy', label: 'Privacy', icon: Shield, active: false },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        className={`whitespace-nowrap flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all transition-all duration-300 ${item.active
                                            ? 'bg-white text-black shadow-xl shadow-white/10 scale-[1.02]'
                                            : 'text-white/40 hover:text-white hover:bg-white/5 bg-white/2 border border-white/5 opacity-80 cursor-not-allowed'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 shrink-0 ${item.active ? 'text-black' : 'text-current'}`} />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="md:col-span-8">
                            <div className="glass-panel p-6 sm:p-10 overflow-visible shadow-2xl relative group rounded-t-none sm:rounded-[2.5rem]">
                                <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-purple-500/10 transition-all duration-700"></div>

                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                            <Lock className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-white">Security Settings</h2>
                                            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Update your security preferences</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handlePasswordChange} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Current Password</label>
                                            <div className="relative group/input">
                                                <input
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    required
                                                    className="input-premium font-bold pl-14! h-14 group-hover/input:border-purple-500/30 transition-all"
                                                    placeholder="••••••••"
                                                />
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-hover/input:text-purple-400 transition-colors">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">New Password</label>
                                                <div className="relative group/input">
                                                    <input
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                        required
                                                        className="input-premium font-bold pl-14! h-14 group-hover/input:border-purple-500/30 transition-all"
                                                        placeholder="••••••••"
                                                    />
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-hover/input:text-purple-400 transition-colors">
                                                        <Lock className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Confirm New Password</label>
                                                <div className="relative group/input">
                                                    <input
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        required
                                                        className="input-premium font-bold pl-14! h-14 group-hover/input:border-purple-500/30 transition-all"
                                                        placeholder="••••••••"
                                                    />
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-hover/input:text-purple-400 transition-colors">
                                                        <Lock className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-4 items-start">
                                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-amber-500/80 leading-relaxed font-medium">
                                                Warning: Changing your password will not log out your current session, but you will need to use the new password for future logins.
                                            </p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary w-full! bg-linear-to-r! from-purple-600! to-pink-500! text-white! p-4! group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                            <div className="relative flex items-center justify-center gap-3">
                                                {loading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                        Update Password
                                                    </>
                                                )}
                                            </div>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
