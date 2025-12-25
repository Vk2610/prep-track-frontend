// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import AuthBackground from "../components/AuthBackground";

export default function Login({ isNested = false }) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.email || !formData.password) {
            setError('Please provide both email and password');
            return;
        }
        setLoading(true);
        try {
            const response = await authAPI.login(formData);
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
                <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
                <p className="text-sm text-white/50">
                    Log in to continue your preparation journey.
                </p>
            </div>

            {/* ERROR BOX */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-shake">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-200 text-xs font-medium leading-relaxed">{error}</p>
                    {console.log(error)}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="space-y-2">
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Password"
                            className="w-full rounded-full bg-white/5 border border-white/10 pl-12 pr-6 py-3 text-sm outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                        />
                    </div>
                    <div className="text-right px-2">
                        <button type="button" className="text-[10px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">Forgot Password?</button>
                    </div>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-linear-to-r from-purple-500 to-pink-500 py-3 text-sm font-black uppercase tracking-widest shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Syncing...</span>
                        </>
                    ) : (
                        <>
                            <LogIn className="w-4 h-4" />
                            <span>Log In</span>
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-xs text-white/40 mt-8 font-medium">
                Don’t have an account?{" "}
                <Link to="/register" className="text-purple-400 font-bold hover:text-purple-300 transition-colors ml-1">
                    Register →
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
