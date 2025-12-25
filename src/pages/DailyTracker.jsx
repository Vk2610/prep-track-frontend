import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Calendar,
    CheckCircle2,
    Heart,
    Dumbbell,
    Gamepad2,
    Brain,
    Trash2,
    Smile,
    Frown,
    Meh,
    Zap,
    ChevronRight,
    Activity,
    Target,
    Flame,
    ChevronDown,
    X
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { trackerAPI } from '../services/api';

const DailyTracker = () => {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    const [formData, setFormData] = useState({
        quant: false,
        lrdi: false,
        varc: false,
        softSkill: false,
        exercise: false,
        gaming: false,
        mood: '',
    });

    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isMoodOpen, setIsMoodOpen] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, date: null });
    const [viewingDetails, setViewingDetails] = useState(null);

    const toast = useToast();

    useEffect(() => {
        fetchEntries();
    }, []);

    useEffect(() => {
        fetchEntryByDate(selectedDate);
    }, [selectedDate]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        const root = document.documentElement;
        if (viewingDetails || deleteDialog.isOpen) {
            root.classList.add('no-scroll');
        } else {
            root.classList.remove('no-scroll');
        }
        return () => {
            root.classList.remove('no-scroll');
        };
    }, [viewingDetails, deleteDialog.isOpen]);

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const res = await trackerAPI.getAll({ limit: 30 });
            setEntries(res.data.data || []);
        } catch {
            toast.error('Failed to load past entries');
        } finally {
            setLoading(false);
        }
    };

    const fetchEntryByDate = async (date) => {
        try {
            const res = await trackerAPI.getByDate(date);
            const data = res.data.data;
            setFormData({
                quant: data.quant || false,
                lrdi: data.lrdi || false,
                varc: data.varc || false,
                softSkill: data.softSkill || false,
                exercise: data.exercise || false,
                gaming: data.gaming || false,
                mood: data.mood || '',
            });
        } catch {
            setFormData({
                quant: false,
                lrdi: false,
                varc: false,
                softSkill: false,
                exercise: false,
                gaming: false,
                mood: '',
            });
        }
    };

    const toggle = (field) =>
        setFormData((p) => ({ ...p, [field]: !p[field] }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await trackerAPI.createOrUpdate({ date: selectedDate, ...formData });
            toast.success('Entry saved');
            fetchEntries();
        } catch {
            toast.error('Save failed');
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        try {
            await trackerAPI.delete(deleteDialog.date);
            toast.success('Entry deleted');
            fetchEntries();
        } catch {
            toast.error('Delete failed');
        }
    };

    const completionCount = (e) =>
        [e.quant, e.lrdi, e.varc, e.softSkill, e.exercise, e.gaming].filter(Boolean)
            .length;

    const moodIcons = {
        excellent: { icon: Smile, color: 'emerald', label: 'Excellent' },
        good: { icon: Smile, color: 'blue', label: 'Good' },
        okay: { icon: Meh, color: 'yellow', label: 'Okay' },
        bad: { icon: Frown, color: 'orange', label: 'Bad' },
        terrible: { icon: Frown, color: 'red', label: 'Terrible' },
    };

    return (
        <div className="min-h-screen gradient-mesh-bg">

            <main className="page-container">
                {/* HERO */}
                <header className="reveal flex flex-col items-center text-center gap-6 max-w-4xl mx-auto px-4">
                    <div className="glass-badge">
                        <Activity className="w-3 h-3 text-purple-400" />
                        Habit Tracker
                    </div>
                    <h1 className="text-4xl xs:text-5xl sm:text-6xl font-black text-white tracking-tighter leading-tight">
                        DAILY<span className="text-gradient-purple">TRACKER</span>
                    </h1>
                    <p className="text-white/40 text-sm sm:text-lg font-medium max-w-2xl leading-relaxed">
                        Log your studies and wellness activities. Consistency is the key to cracking the exam.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 reveal animate-delay-100 items-start">

                    {/* TRACKING MODULE */}
                    <div className={`lg:col-span-12 xl:col-span-7 transition-all duration-300 ${isMoodOpen ? 'relative z-20' : 'relative z-10'}`}>
                        <div className="glass-panel p-6 sm:p-10! relative overflow-visible! group">
                            {/* Accent Glow */}
                            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sm:mb-12 relative z-10">
                                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-4">
                                    <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                                    New Entry
                                </h2>
                                <div className="relative group/date">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 z-10" />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="input-premium pl-12! py-3! rounded-xl! font-bold bg-black/40 border-purple-500/20 h-14"
                                    />
                                </div>
                            </div>
                            historical, replacement chunks for better touch target and vertical stacking

                            <form onSubmit={handleSubmit} className="space-y-12 relative z-10">

                                {/* ACTIVITY GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* PREP SECTION */}
                                    <div className="space-y-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">CAT Core Pillars</p>
                                        <div className="space-y-3">
                                            {[
                                                { f: 'quant', l: 'Quantitative Ability', icon: Brain, color: 'purple' },
                                                { f: 'lrdi', l: 'LR & Data Interpretation', icon: Zap, color: 'blue' },
                                                { f: 'varc', l: 'Verbal Ability & RC', icon: Activity, color: 'emerald' },
                                            ].map(({ f, l, icon: Icon, color }) => (
                                                <button
                                                    key={f}
                                                    type="button"
                                                    onClick={() => toggle(f)}
                                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all group/item ${formData[f]
                                                        ? `bg-${color}-500/10 border-${color}-500/40 text-${color}-400 shadow-[0_0_20px_rgba(0,0,0,0.2)]`
                                                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <Icon className={`w-5 h-5 ${formData[f] ? `text-${color}-400` : 'text-white/20'}`} />
                                                        <span className="text-sm font-black uppercase tracking-tight">{l}</span>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData[f] ? `bg-${color}-500 border-transparent` : 'border-white/10'
                                                        }`}>
                                                        {formData[f] && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* WELLNESS SECTION */}
                                    <div className="space-y-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Personal Velocity</p>
                                        <div className="space-y-3">
                                            {[
                                                { f: 'softSkill', l: 'Soft Skills Training', icon: Heart, color: 'pink' },
                                                { f: 'exercise', l: 'Physical Exercise', icon: Dumbbell, color: 'orange' },
                                                { f: 'gaming', l: 'Gaming & Recreation', icon: Gamepad2, color: 'cyan' },
                                            ].map(({ f, l, icon: Icon, color }) => (
                                                <button
                                                    key={f}
                                                    type="button"
                                                    onClick={() => toggle(f)}
                                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all group/item ${formData[f]
                                                        ? `bg-${color}-500/10 border-${color}-500/40 text-${color}-400 shadow-[0_0_20px_rgba(0,0,0,0.2)]`
                                                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <Icon className={`w-5 h-5 ${formData[f] ? `text-${color}-400` : 'text-white/20'}`} />
                                                        <span className="text-sm font-black uppercase tracking-tight">{l}</span>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData[f] ? `bg-${color}-500 border-transparent` : 'border-white/10'
                                                        }`}>
                                                        {formData[f] && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* MOOD & SUBMIT */}
                                <div className="flex flex-col md:flex-row gap-6 items-end relative overflow-visible">
                                    <div className="flex-1 w-full space-y-2 relative">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">How are you feeling? (Mood)</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setIsMoodOpen(!isMoodOpen)}
                                                className="input-premium w-full flex items-center justify-between font-bold text-sm bg-black/40 h-14"
                                            >
                                                <span className="text-white capitalize">
                                                    {formData.mood ? (
                                                        <span className="flex items-center gap-2">
                                                            {formData.mood === 'excellent' && '😄 Excellent'}
                                                            {formData.mood === 'good' && '🙂 Good'}
                                                            {formData.mood === 'okay' && '😐 Okay'}
                                                            {formData.mood === 'bad' && '😞 Bad'}
                                                            {formData.mood === 'terrible' && '😢 Terrible'}
                                                        </span>
                                                    ) : 'Select Mood'}
                                                </span>
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isMoodOpen ? 'rotate-180' : 'rotate-0'}`} />
                                            </button>

                                            {isMoodOpen && (
                                                <div className="absolute top-full left-0 right-0 mt-3 bg-[#1a1a2e] border border-white/20 rounded-4xl p-3 z-100 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-3xl overflow-hidden reveal">
                                                    {[
                                                        { val: 'excellent', lbl: '😄 Excellent' },
                                                        { val: 'good', lbl: '🙂 Good' },
                                                        { val: 'okay', lbl: '😐 Okay' },
                                                        { val: 'bad', lbl: '😞 Bad' },
                                                        { val: 'terrible', lbl: '😢 Terrible' },
                                                    ].map((m) => (
                                                        <button
                                                            key={m.val}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, mood: m.val });
                                                                setIsMoodOpen(false);
                                                            }}
                                                            className="w-full text-left px-5 py-4 rounded-2xl hover:bg-white/10 text-white/70 hover:text-white transition-all text-sm font-bold active:scale-[0.98] flex items-center justify-between group/item"
                                                        >
                                                            {m.lbl}
                                                            {formData.mood === m.val && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        disabled={submitting}
                                        className="btn-primary py-5! px-12! rounded-2xl! group bg-linear-to-r! from-purple-600! to-pink-500! text-white! w-full md:w-auto"
                                    >
                                        <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        {submitting ? 'Saving...' : 'Save Entry'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* HISTORY MODULE */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-10 bg-pink-500 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)]"></div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">Past Entries</h2>
                                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Your daily history</p>
                                </div>
                            </div>
                            <div className="text-pink-400 group flex items-center gap-2">
                                <Flame className="w-4 h-4 fill-pink-400" />
                                <span className="text-sm font-black tracking-tighter">STREAK: {entries.filter(e => completionCount(e) > 0).length}</span>
                            </div>
                        </div>

                        <div className="glass-panel p-6! max-h-[720px] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="py-24 flex flex-col items-center">
                                    <LoadingSpinner size="md" />
                                    <p className="mt-4 text-[10px] font-black text-white/20 uppercase tracking-widest animate-pulse">Loading tracker data</p>
                                </div>
                            ) : entries.length === 0 ? (
                                <div className="py-32">
                                    <EmptyState title="No entries" message="Start tracking your studies today." />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {entries.map((entry, idx) => {
                                        const count = completionCount(entry);
                                        const moodInfo = moodIcons[entry.mood];
                                        const MoodIcon = moodInfo?.icon || Meh;

                                        return (
                                            <div
                                                key={entry._id}
                                                onClick={() => setViewingDetails(entry)}
                                                className="glass-card p-5! group hover:bg-white/10! transition-all relative overflow-hidden cursor-pointer active:scale-[0.98]"
                                                style={{ animationDelay: `${idx * 50}ms` }}
                                            >
                                                {/* Progress indicator gradient line */}
                                                <div
                                                    className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                                                    style={{ width: `${(count / 6) * 100}%` }}
                                                ></div>

                                                <div className="flex items-center justify-between relative z-10">
                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${moodInfo ? `text-${moodInfo.color}-400` : 'text-white/20'}`}>
                                                            <MoodIcon className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-white group-hover:text-purple-400 transition-colors">
                                                                {new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="flex gap-0.5">
                                                                    {[...Array(6)].map((_, i) => (
                                                                        <div key={i} className={`w-2 h-1 rounded-full ${i < count ? 'bg-purple-400' : 'bg-white/10'}`}></div>
                                                                    ))}
                                                                </div>
                                                                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{count}/6 DONE</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteDialog({ isOpen: true, date: entry.date });
                                                        }}
                                                        className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 active:scale-95"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            {/* DETAILS MODAL - Using Portal for perfect centering */}
            {viewingDetails && createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/85 backdrop-blur-md animate-fade-in"
                        onClick={() => setViewingDetails(null)}
                    ></div>
                    <div className="relative w-full max-w-sm sm:max-w-md glass-panel p-7! sm:p-12! reveal overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-6 sm:mb-10 shrink-0">
                            <div>
                                <h3 className="text-xl font-black text-white">Daily Summary</h3>
                                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">
                                    {new Date(viewingDetails.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <button
                                onClick={() => setViewingDetails(null)}
                                className="relative z-10 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-5 sm:space-y-8">
                            {/* Mood Section - Ultra Compact */}
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 sm:py-5">
                                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-white/5 flex items-center justify-center ${moodIcons[viewingDetails.mood] ? `text-${moodIcons[viewingDetails.mood].color}-400` : 'text-white/20'}`}>
                                    {(() => {
                                        const MoodIcon = moodIcons[viewingDetails.mood]?.icon || Meh;
                                        return <MoodIcon className="w-5 h-5 sm:w-7 sm:h-7" />;
                                    })()}
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] leading-none mb-1 sm:mb-2">Feeling</p>
                                    <p className="text-white text-xs sm:text-sm font-bold capitalize">{viewingDetails.mood || 'Not recorded'}</p>
                                </div>
                            </div>

                            {/* Tasks Grid - Forced 2 columns for space efficiency */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                {[
                                    { f: 'quant', l: 'Quant', icon: Brain, color: 'purple' },
                                    { f: 'lrdi', l: 'LRDI', icon: Zap, color: 'blue' },
                                    { f: 'varc', l: 'VARC', icon: Activity, color: 'emerald' },
                                    { f: 'softSkill', l: 'Soft Skills', icon: Heart, color: 'pink' },
                                    { f: 'exercise', l: 'Exercise', icon: Dumbbell, color: 'orange' },
                                    { f: 'gaming', l: 'Gaming', icon: Gamepad2, color: 'cyan' },
                                ].map(({ f, l, icon: Icon, color }) => (
                                    <div
                                        key={f}
                                        className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${viewingDetails[f]
                                            ? `bg-${color}-500/10 border-${color}-500/20 text-${color}-400`
                                            : 'bg-white/5 border-white/5 text-white/20'
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5 shrink-0" />
                                        <span className="text-[9px] font-black uppercase tracking-tight leading-none truncate">{l}</span>
                                        {viewingDetails[f] && <CheckCircle2 className="w-3 h-3 ml-auto shrink-0" />}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2">
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                                        style={{ width: `${(completionCount(viewingDetails) / 6) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-center text-[9px] font-black text-white/20 uppercase tracking-widest mt-2">
                                    {completionCount(viewingDetails)} / 6 COMPLETED
                                </p>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false, date: null })}
                onConfirm={confirmDelete}
                title="Delete Entry"
                message="Are you sure you want to delete this entry?"
                confirmText="Delete"
                confirmColor="red"
            />
        </div>
    );
};

export default DailyTracker;
