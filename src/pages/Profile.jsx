import { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Shield,
    Calendar,
    Pencil,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const Profile = () => {
    const { user, login, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const toast = useToast();

    useEffect(() => {
        if (user) setFormData({ name: user.name, email: user.email });
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authAPI.updateProfile(formData);
            updateUser(res.data.user);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#0b0616] via-[#120a25] to-[#0b0616]">
            <main className="px-4 py-6 sm:py-16 flex justify-center">
                <div className="w-full max-w-xl">

                    {/* Glass Card */}
                    <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

                        {/* Soft glow (safe, no overflow) */}
                        <div className="absolute inset-x-0 -top-32 h-64 bg-purple-500/10 blur-[120px] pointer-events-none" />

                        <div className="relative z-10 p-6 sm:p-10 space-y-8">

                            {/* Header */}
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="relative">
                                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-linear-to-br from-purple-500/30 to-pink-500/30 border border-white/15 flex items-center justify-center shadow-xl">
                                        <User className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
                                    </div>
                                    <span className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-emerald-500 border-2 border-[#0b0616] flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </span>
                                </div>

                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                                        Your <span className="text-purple-400">Profile</span>
                                    </h1>
                                    <p className="text-white/40 text-xs sm:text-sm font-bold uppercase tracking-widest mt-1">
                                        Manage your information
                                    </p>
                                </div>
                            </div>

                            {/* FORM */}
                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Name */}
                                <Field
                                    label="Full Name"
                                    icon={<User className="w-5 h-5" />}
                                    disabled={!isEditing}
                                    value={formData.name}
                                    onChange={(v) => setFormData({ ...formData, name: v })}
                                />

                                {/* Email */}
                                <Field
                                    label="Email Address"
                                    icon={<Mail className="w-5 h-5" />}
                                    disabled={!isEditing}
                                    value={formData.email}
                                    onChange={(v) => setFormData({ ...formData, email: v })}
                                    type="email"
                                />

                                {/* Meta Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <StaticField
                                        label="Account Role"
                                        icon={<Shield className="w-5 h-5" />}
                                        value={user?.role}
                                    />
                                    <StaticField
                                        label="Member Since"
                                        icon={<Calendar className="w-5 h-5" />}
                                        value={
                                            user?.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })
                                                : 'Recently'
                                        }
                                    />
                                </div>

                                {/* Actions */}
                                <div className="pt-4">
                                    {!isEditing ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="w-full rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 py-4 font-black text-white flex items-center justify-center gap-3 transition"
                                        >
                                            <Pencil className="w-5 h-5" />
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 py-4 font-black text-white transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-1 rounded-2xl bg-linear-to-r from-purple-600 to-pink-500 py-4 font-black text-white flex items-center justify-center gap-2 transition"
                                            >
                                                {loading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-5 h-5" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

/* ------------------ SUB COMPONENTS ------------------ */

const Field = ({ label, icon, value, onChange, disabled, type = 'text' }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">
            {label}
        </label>
        <div className="relative">
            <input
                type={type}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-14 rounded-2xl bg-white/10 border border-white/15 pl-14 pr-4 text-white font-bold outline-none focus:border-purple-400 disabled:opacity-50"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                {icon}
            </div>
        </div>
    </div>
);

const StaticField = ({ label, icon, value }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">
            {label}
        </label>
        <div className="relative h-14 rounded-2xl bg-white/5 border border-white/10 pl-14 pr-4 flex items-center font-bold text-white/70">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                {icon}
            </div>
            <span className="capitalize truncate">{value}</span>
        </div>
    </div>
);

export default Profile;
