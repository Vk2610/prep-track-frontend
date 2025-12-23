// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import AuthBackground from "../components/AuthBackground";

export default function Register({ isNested = false }) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: 'bg-white/10', textColor: 'text-white/20' };
        if (password.length < 6) return { strength: 33, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-400' };
        if (password.length < 10) return { strength: 66, label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
        return { strength: 100, label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.name || !formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password too short (min 6)');
            return;
        }
        setLoading(true);
        try {
            const response = await authAPI.register(formData);
            const { token, user } = response.data;
            login(token, user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authorization failed');
        } finally {
            setLoading(false);
        }
    };

    const content = (
        <div className="relative z-10 w-full rounded-[2.5rem] bg-white/10 backdrop-blur-xl shadow-glass border border-white/20 px-8 py-10 text-white">

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 shadow-glow flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold tracking-tight">P</span>
                </div>
                <h1 className="text-xl font-black tracking-tight">PrepTrack</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Track. Analyze. Improve.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-1">Create Account</h2>
                <p className="text-sm text-white/50">
                    Start your preparation command center today.
                </p>
            </div>

            {/* ERROR BOX */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-shake">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-200 text-xs font-medium leading-relaxed">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Full Name"
                        className="w-full rounded-full bg-white/5 border border-white/10 pl-12 pr-6 py-3 text-sm outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                    />
                </div>

                {/* Email */}
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Email Address"
                        className="w-full rounded-full bg-white/5 border border-white/10 pl-12 pr-6 py-3 text-sm outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                    />
                </div>

                {/* Password */}
                <div className="space-y-3">
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create Password"
                            className="w-full rounded-full bg-white/5 border border-white/10 pl-12 pr-6 py-3 text-sm outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                        />
                    </div>

                    {/* DYNAMIC STRENGTH METER */}
                    {formData.password && (
                        <div className="px-2 animate-reveal">
                            <div className="flex justify-between items-center mb-1.5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Strength</p>
                                <p className={`text-[9px] font-black uppercase tracking-widest ${passwordStrength.textColor}`}>{passwordStrength.label}</p>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${passwordStrength.color} transition-all duration-700`}
                                    style={{ width: `${passwordStrength.strength}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-linear-to-r from-purple-500 to-pink-500 py-3 text-sm font-black uppercase tracking-widest shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Establishing...</span>
                        </>
                    ) : (
                        <>
                            <UserPlus className="w-4 h-4" />
                            <span>Register</span>
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-xs text-white/40 mt-8 font-medium">
                Already have an account?{" "}
                <Link to="/login" className="text-purple-400 font-bold hover:text-purple-300 transition-colors ml-1">
                    Log In
                </Link>
            </p>
        </div>
    );

    if (isNested) return content;

    return (
        <AuthBackground>
            {content}
        </AuthBackground>
    );
}
