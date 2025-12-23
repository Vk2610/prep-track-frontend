import { useState, useEffect } from 'react';
import {
    Users,
    MessageSquare,
    Mic2,
    MessageCircle,
    Video,
    Brain,
    Clock,
    Star,
    Calendar,
    PlusCircle,
    Pencil,
    Trash2,
    X,
    Zap,
    ChevronRight,
    Search,
    BookOpen,
    ChevronDown,
    CheckCircle2
} from 'lucide-react';
import { softSkillsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

const SoftSkillsTracker = () => {
    const [formData, setFormData] = useState({
        type: 'Essay',
        topic: '',
        duration: '',
        rating: '',
        note: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
    const toast = useToast();

    const skillTypes = ['Essay', 'GD', 'Extempore', 'Interview', 'Presentation', 'Structured Thinking'];

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        setLoading(true);
        try {
            const response = await softSkillsAPI.getAll({ limit: 50 });
            setSkills(response.data.data || []);
        } catch (error) {
            toast.error('Failed to fetch skills');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            ...formData,
            duration: parseInt(formData.duration),
            rating: parseInt(formData.rating),
        };

        try {
            if (editingId) {
                await softSkillsAPI.update(editingId, payload);
                toast.success('Entry updated');
                setEditingId(null);
            } else {
                await softSkillsAPI.create(payload);
                toast.success('Entry saved');
            }
            resetForm();
            fetchSkills();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Save failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (skill) => {
        setFormData({
            type: skill.type,
            topic: skill.topic,
            duration: skill.duration,
            rating: skill.rating,
            note: skill.note || '',
            date: skill.date.split('T')[0],
        });
        setEditingId(skill._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        setDeleteDialog({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        const id = deleteDialog.id;
        try {
            await softSkillsAPI.delete(id);
            toast.success('Session deleted');
            fetchSkills();
        } catch (error) {
            toast.error('Deletion failed');
        } finally {
            setDeleteDialog({ isOpen: false, id: null });
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'Essay',
            topic: '',
            duration: '',
            rating: '',
            note: '',
            date: new Date().toISOString().split('T')[0],
        });
        setEditingId(null);
    };

    const getTypeIcon = (type) => {
        const icons = {
            'Essay': BookOpen,
            'GD': Users,
            'Extempore': Mic2,
            'Interview': MessageCircle,
            'Presentation': Video,
            'Structured Thinking': Brain
        };
        return icons[type] || MessageSquare;
    };

    return (
        <div className="min-h-screen gradient-mesh-bg">

            <main className="page-container">
                {/* HERO */}
                <header className="reveal flex flex-col items-center text-center gap-6 max-w-4xl mx-auto px-4">
                    <div className="glass-badge">
                        <Users className="w-3 h-3 text-blue-400" />
                        Habit Tracker
                    </div>
                    <h1 className="text-4xl xs:text-5xl sm:text-6xl font-black text-white tracking-tighter leading-tight">
                        SKILL<span className="text-gradient-blue">TRACKER</span>
                    </h1>
                    <p className="text-white/40 text-sm sm:text-lg font-medium max-w-2xl leading-relaxed">
                        Practice your communication and soft skills. Log your progress and get better every day.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 reveal animate-delay-100 items-start">
                    {/* INPUT FORM */}
                    <div className="lg:col-span-12 xl:col-span-4">
                        <div className="glass-card p-6 sm:p-10 sticky top-28 overflow-visible!">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-4">
                                    {editingId ? <Pencil className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" /> : <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />}
                                    {editingId ? 'Edit Session' : 'New Session'}
                                </h2>
                                {editingId && (
                                    <button onClick={resetForm} className="text-white/20 hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2 relative">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Category</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsTypeOpen(!isTypeOpen)}
                                            className="input-premium w-full flex items-center justify-between font-bold text-sm bg-black/40"
                                        >
                                            <span className="text-white capitalize">
                                                {formData.type || 'Select Category'}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isTypeOpen ? 'rotate-180' : 'rotate-0'}`} />
                                        </button>

                                        {isTypeOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] border border-white/20 rounded-3xl p-2 z-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden reveal">
                                                {skillTypes.map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, type });
                                                            setIsTypeOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all text-sm font-bold active:scale-[0.98] flex items-center justify-between"
                                                    >
                                                        {type}
                                                        {formData.type === type && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Topic</label>
                                    <input
                                        type="text"
                                        name="topic"
                                        value={formData.topic}
                                        onChange={handleChange}
                                        required
                                        className="input-premium font-bold h-14"
                                        placeholder="e.g. Current Affairs"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Duration (min)</label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            required
                                            className="input-premium font-black text-lg h-14"
                                            placeholder="45"
                                        />
                                    </div>
                                    <div className="space-y-2 relative">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Self Rating</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setIsRatingOpen(!isRatingOpen)}
                                                className="input-premium w-full flex items-center justify-between font-bold text-sm bg-black/40 h-14"
                                            >
                                                <span className="text-white capitalize">
                                                    {formData.rating ? (
                                                        <span className="flex items-center gap-2">
                                                            {formData.rating === '5' && 'Exceptional'}
                                                            {formData.rating === '4' && 'Proficient'}
                                                            {formData.rating === '3' && 'Competent'}
                                                            {formData.rating === '2' && 'Developing'}
                                                            {formData.rating === '1' && 'Foundational'}
                                                            {typeof formData.rating === 'number' && (
                                                                <>
                                                                    {formData.rating === 5 && 'Exceptional'}
                                                                    {formData.rating === 4 && 'Proficient'}
                                                                    {formData.rating === 3 && 'Competent'}
                                                                    {formData.rating === 2 && 'Developing'}
                                                                    {formData.rating === 1 && 'Foundational'}
                                                                </>
                                                            )}
                                                        </span>
                                                    ) : 'Mastery'}
                                                </span>
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isRatingOpen ? 'rotate-180' : 'rotate-0'}`} />
                                            </button>

                                            {isRatingOpen && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] border border-white/20 rounded-3xl p-2 z-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden reveal">
                                                    {[
                                                        { val: '5', lbl: 'Exceptional' },
                                                        { val: '4', lbl: 'Proficient' },
                                                        { val: '3', lbl: 'Competent' },
                                                        { val: '2', lbl: 'Developing' },
                                                        { val: '1', lbl: 'Foundational' },
                                                    ].map((r) => (
                                                        <button
                                                            key={r.val}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, rating: r.val });
                                                                setIsRatingOpen(false);
                                                            }}
                                                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all text-sm font-bold active:scale-[0.98] flex items-center justify-between"
                                                        >
                                                            {r.lbl}
                                                            {String(formData.rating) === r.val && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Session Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="input-premium text-sm font-bold h-14"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Notes</label>
                                    <textarea
                                        name="note"
                                        value={formData.note}
                                        onChange={handleChange}
                                        rows="3"
                                        className="input-premium resize-none text-sm leading-relaxed"
                                        placeholder="Add your reflections here..."
                                    ></textarea>
                                </div>

                                <button
                                    disabled={submitting}
                                    className="w-full btn-primary rounded-3xl! py-6! group bg-linear-to-r! from-blue-600! to-cyan-500! text-white!"
                                >
                                    <Zap className="w-5 h-5 group-hover:fill-white transition-all" />
                                    {submitting ? 'Saving...' : (editingId ? 'Update Session' : 'Save Session')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* HISTORY LIST */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-10 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)]"></div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">History</h2>
                                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Your past sessions</p>
                                </div>
                            </div>
                            <div className="text-white/20 text-[10px] font-black uppercase tracking-widest">
                                {skills.length} Sessions
                            </div>
                        </div>

                        {loading ? (
                            <div className="glass-card py-32 flex flex-col items-center">
                                <LoadingSpinner size="lg" />
                                <p className="text-white/20 text-xs font-bold mt-4 animate-pulse uppercase tracking-[0.2em]">Loading...</p>
                            </div>
                        ) : skills.length === 0 ? (
                            <div className="glass-card py-32 flex flex-col items-center text-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                                    <Mic2 className="w-10 h-10 text-white/10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-white">No sessions yet</h3>
                                    <p className="text-white/30 text-sm max-w-xs mx-auto">Start practicing to track your progress.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {skills.map((skill, idx) => {
                                    const Icon = getTypeIcon(skill.type);
                                    return (
                                        <div
                                            key={skill._id}
                                            className="glass-card hover:bg-white/10! transition-all group p-6 sm:p-8!"
                                        >
                                            <div className="flex flex-col md:flex-row gap-8">
                                                <div className="flex items-center gap-4 sm:gap-6 flex-1">
                                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all shrink-0">
                                                        <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                                                    </div>
                                                    <div className="space-y-0.5 sm:space-y-1">
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-blue-400/60">{skill.type}</span>
                                                            <div className="w-1 h-1 rounded-full bg-white/10"></div>
                                                            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/20">{new Date(skill.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                        </div>
                                                        <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{skill.topic}</h3>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-12 shrink-0 pt-4 sm:pt-0 border-t border-white/5 md:border-t-0">
                                                    <div className="text-center">
                                                        <p className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5 sm:mb-1">Duration</p>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/20" />
                                                            <span className="text-base sm:text-lg font-black text-white/80 tracking-tighter">{skill.duration}m</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <p className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5 sm:mb-1">Mastery</p>
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star key={s} className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${s <= skill.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/5'}`} />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 transition-all">
                                                        <button
                                                            onClick={() => handleEdit(skill)}
                                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-all active:scale-95 border border-blue-500/10"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(skill._id)}
                                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all active:scale-95 border border-red-500/10"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {skill.note && (
                                                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/5">
                                                    <p className="text-xs sm:text-sm text-white/40 leading-relaxed font-medium">"{skill.note}"</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Session"
                message="Are you sure you want to delete this session? This action cannot be undone."
                confirmText="Delete"
                confirmColor="red"
            />
        </div>
    );
};

export default SoftSkillsTracker;
