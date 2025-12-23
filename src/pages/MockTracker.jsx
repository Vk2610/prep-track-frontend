import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { mockAPI } from '../services/api';
import {
    Trophy,
    Calendar,
    ChevronRight,
    Search,
    Filter,
    Pencil,
    Trash2,
    BookOpen,
    Zap,
    Target,
    Clock,
    PlusCircle,
    X
} from 'lucide-react';

const MockTracker = () => {
    const [formData, setFormData] = useState({
        name: '',
        date: new Date().toISOString().split('T')[0],
        slot: 'morning',
        scores: { varc: '', lrdi: '', qa: '' },
        percentile: '',
        mood: '',
    });
    const [mocks, setMocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isMoodOpen, setIsMoodOpen] = useState(false);
    const [isSlotOpen, setIsSlotOpen] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
    const toast = useToast();

    useEffect(() => {
        fetchMocks();
    }, []);

    const fetchMocks = async () => {
        setLoading(true);
        try {
            const response = await mockAPI.getAll({ limit: 50 });
            setMocks(response.data.data || []);
        } catch (error) {
            toast.error('Failed to fetch mocks');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('scores.')) {
            const scoreField = name.split('.')[1];
            setFormData({
                ...formData,
                scores: { ...formData.scores, [scoreField]: value },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const varc = parseFloat(formData.scores.varc);
        const lrdi = parseFloat(formData.scores.lrdi);
        const qa = parseFloat(formData.scores.qa);

        if (isNaN(varc) || isNaN(lrdi) || isNaN(qa)) {
            toast.error('Please provide valid scores');
            setSubmitting(false);
            return;
        }

        const payload = {
            ...formData,
            scores: { varc, lrdi, qa },
            percentile: parseFloat(formData.percentile),
        };

        try {
            if (editingId) {
                await mockAPI.update(editingId, payload);
                toast.success('Performance record updated');
                setEditingId(null);
            } else {
                await mockAPI.create(payload);
                toast.success('Mock saved');
            }

            resetForm();
            fetchMocks();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save entry');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (mock) => {
        setFormData({
            name: mock.name,
            date: mock.date.split('T')[0],
            slot: mock.slot,
            scores: mock.scores,
            percentile: mock.percentile,
            mood: mock.mood || '',
        });
        setEditingId(mock._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        setDeleteDialog({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        const id = deleteDialog.id;
        try {
            await mockAPI.delete(id);
            toast.success('Record erased');
            fetchMocks();
        } catch (error) {
            toast.error('Deletion failed');
        } finally {
            setDeleteDialog({ isOpen: false, id: null });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            date: new Date().toISOString().split('T')[0],
            slot: 'morning',
            scores: { varc: '', lrdi: '', qa: '' },
            percentile: '',
            mood: '',
        });
        setEditingId(null);
    };

    const moodEmoji = (mood) => {
        const moods = {
            excellent: '😄',
            good: '🙂',
            okay: '😐',
            bad: '😞',
            terrible: '😢'
        };
        return moods[mood] || '😶';
    };

    return (
        <div className="min-h-screen gradient-mesh-bg">

            <main className="page-container">
                {/* HERO */}
                <header className="reveal flex flex-col items-center text-center gap-6 max-w-4xl mx-auto px-4">
                    <div className="glass-badge">
                        <Trophy className="w-3 h-3 text-emerald-400" />
                        Score Tracker
                    </div>
                    <h1 className="text-4xl xs:text-5xl sm:text-6xl font-black text-white tracking-tighter leading-tight">
                        MOCK<span className="text-gradient-purple">TRACKER</span>
                    </h1>
                    <p className="text-white/40 text-sm sm:text-lg font-medium max-w-2xl leading-relaxed">
                        Keep a log of your mock test scores and analysis. Identify your strengths and areas for improvement.
                    </p>
                </header>

                <div className="flex flex-col gap-10 sm:gap-16 reveal animate-delay-100">
                    {/* INPUT FORM */}
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="glass-card p-6 sm:p-10! overflow-visible!">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-4">
                                    {editingId ? <Pencil className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" /> : <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />}
                                    {editingId ? 'Edit Mock' : 'New Mock'}
                                </h2>
                                {editingId && (
                                    <button onClick={resetForm} className="text-white/20 hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Mock Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="input-premium font-bold"
                                        placeholder="e.g. SIMCAT 1"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                            className="input-premium text-sm font-bold h-14"
                                        />
                                    </div>
                                    <div className="space-y-2 relative">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Slot</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setIsSlotOpen(!isSlotOpen)}
                                                className="input-premium w-full flex items-center justify-between font-bold text-sm h-14"
                                            >
                                                <span className="text-white capitalize">
                                                    {formData.slot}
                                                </span>
                                                <ChevronRight className={`w-4 h-4 transition-transform ${isSlotOpen ? 'rotate-90' : 'rotate-0'}`} />
                                            </button>

                                            {isSlotOpen && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] border border-white/20 rounded-2xl p-2! z-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden">
                                                    {['morning', 'afternoon', 'evening', 'night'].map((sl) => (
                                                        <button
                                                            key={sl}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, slot: sl });
                                                                setIsSlotOpen(false);
                                                            }}
                                                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all text-sm font-bold capitalize active:scale-[0.98]"
                                                        >
                                                            {sl}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Sectional Scores</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['varc', 'lrdi', 'qa'].map((sec) => (
                                            <input
                                                key={sec}
                                                type="number"
                                                name={`scores.${sec}`}
                                                value={formData.scores[sec]}
                                                onChange={handleChange}
                                                required
                                                className="input-premium text-center p-3 font-black text-lg!"
                                                placeholder={sec.toUpperCase()}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Percentile</label>
                                        <input
                                            type="number"
                                            name="percentile"
                                            value={formData.percentile}
                                            onChange={handleChange}
                                            required
                                            step="0.01"
                                            className="input-premium font-black text-lg text-gradient-purple h-14"
                                            placeholder="99.00"
                                        />
                                    </div>
                                    <div className="space-y-2 relative">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Mood / Status</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setIsMoodOpen(!isMoodOpen)}
                                                className="input-premium w-full flex items-center justify-between font-bold h-14"
                                            >
                                                <span className={formData.mood ? 'text-white' : 'text-white/30'}>
                                                    {formData.mood ? (
                                                        <span className="flex items-center gap-2">
                                                            {moodEmoji(formData.mood)} {formData.mood.charAt(0).toUpperCase() + formData.mood.slice(1)}
                                                        </span>
                                                    ) : 'Select Status'}
                                                </span>
                                                <ChevronRight className={`w-4 h-4 transition-transform ${isMoodOpen ? 'rotate-90' : 'rotate-0'}`} />
                                            </button>

                                            {isMoodOpen && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] border border-white/20 rounded-2xl p-2! z-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden">
                                                    {[
                                                        { id: 'excellent', label: 'Excellent', emo: '😄' },
                                                        { id: 'good', label: 'Good', emo: '🙂' },
                                                        { id: 'okay', label: 'Neutral', emo: '😐' },
                                                        { id: 'bad', label: 'Stressed', emo: '😞' },
                                                        { id: 'terrible', label: 'Exhausted', emo: '😢' }
                                                    ].map((m) => (
                                                        <button
                                                            key={m.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, mood: m.id });
                                                                setIsMoodOpen(false);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all text-sm font-bold active:scale-[0.98]"
                                                        >
                                                            <span className="text-lg">{m.emo}</span>
                                                            {m.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    disabled={submitting}
                                    className="w-full btn-primary rounded-3xl! py-6! group"
                                >
                                    <Zap className="w-5 h-5 group-hover:fill-black transition-all" />
                                    {submitting ? 'Saving...' : (editingId ? 'Update Mock' : 'Save Mock')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* HISTORY LIST */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-10 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">Mock History</h2>
                                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Your past performances</p>
                                </div>
                            </div>
                            <div className="text-white/20 text-[10px] font-black uppercase tracking-widest">
                                {mocks.length} Entries
                            </div>
                        </div>

                        {loading ? (
                            <div className="glass-card py-32 flex flex-col items-center">
                                <LoadingSpinner size="lg" />
                                <p className="text-white/20 text-xs font-bold mt-4 animate-pulse uppercase tracking-[0.2em]">Loading...</p>
                            </div>
                        ) : mocks.length === 0 ? (
                            <div className="glass-card py-32 flex flex-col items-center text-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                                    <Target className="w-10 h-10 text-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-white">No mocks yet</h3>
                                    <p className="text-white/30 text-sm max-w-xs mx-auto">Start recording your scores.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {mocks.map((mock) => (
                                    <div
                                        key={mock._id}
                                        className="glass-card hover:bg-white/10! transition-all group p-6 sm:p-8!"
                                    >
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
                                            <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
                                                <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 text-center shrink-0">
                                                    <span className="text-[8px] sm:text-[10px] font-black text-purple-400 uppercase leading-none">{new Date(mock.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                    <span className="text-xl sm:text-2xl font-black text-white leading-none mt-1">{new Date(mock.date).getDate()}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                                        <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight truncate">{mock.name}</h3>
                                                        <span className="text-lg">{moodEmoji(mock.mood)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-1.5 overflow-hidden">
                                                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/20 whitespace-nowrap">{mock.slot}</span>
                                                        <div className="w-1 h-1 rounded-full bg-white/10 shrink-0"></div>
                                                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/20 whitespace-nowrap">{new Date(mock.date).getFullYear()}</span>
                                                    </div>
                                                </div>
                                                {/* Mobile Actions */}
                                                <div className="flex md:hidden items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={() => handleEdit(mock)}
                                                        className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-1 items-center justify-between w-full md:w-auto gap-4 sm:gap-12 pt-4 sm:pt-0 border-t border-white/5 md:border-t-0">
                                                <div className="grid grid-cols-4 gap-2 sm:gap-6 flex-1">
                                                    {[
                                                        { label: 'VARC', val: mock.scores.varc },
                                                        { label: 'LRDI', val: mock.scores.lrdi },
                                                        { label: 'QA', val: mock.scores.qa },
                                                        { label: 'Total', val: mock.scores.varc + mock.scores.lrdi + mock.scores.qa, isTotal: true },
                                                    ].map((s) => (
                                                        <div key={s.label}>
                                                            <p className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5 sm:mb-1">{s.label}</p>
                                                            <p className={`text-sm sm:text-lg font-black ${s.isTotal ? 'text-blue-400' : 'text-white/80'}`}>{s.val}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="text-right min-w-[80px] sm:min-w-[100px]">
                                                    <p className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5 sm:mb-1">Percentile</p>
                                                    <p className="text-2xl sm:text-3xl font-black text-gradient-purple tracking-tighter">{mock.percentile}%</p>
                                                </div>

                                                <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => handleEdit(mock)}
                                                        className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-all active:scale-95"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(mock._id)}
                                                        className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all active:scale-95"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Mobile Delete (Separate line to prevent clutter) */}
                                            <div className="md:hidden w-full">
                                                <button
                                                    onClick={() => handleDelete(mock._id)}
                                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/5 text-red-500 font-bold text-xs border border-red-500/10 mt-2"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Erase Performance Record
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false, id: null })}
                onConfirm={confirmDelete}
                title="Erase Record"
                message="Are you sure you want to erase this performance record? This action cannot be undone."
                confirmText="Erase"
                confirmColor="red"
            />
        </div>
    );
};

export default MockTracker;
