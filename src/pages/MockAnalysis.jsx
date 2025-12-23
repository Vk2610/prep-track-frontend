import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import {
    BarChart3,
    TrendingUp,
    Zap,
    Trophy,
    Target,
    Activity,
    Database,
    ArrowUpRight,
    PieChart,
    ChevronRight,
    Clock,
    Sparkles
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { mockAPI } from '../services/api';

const MockAnalysis = () => {
    const [mocks, setMocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchAnalysisData();
    }, []);

    const fetchAnalysisData = async () => {
        setLoading(true);
        try {
            const [mocksRes, statsRes] = await Promise.all([
                mockAPI.getAll({ limit: 20 }),
                mockAPI.getStats({ limit: 20 }),
            ]);

            const mocksData = mocksRes.data.data || [];
            setMocks([...mocksData].reverse());
            setStats(statsRes.data.data);
        } catch (error) {
            console.error('Error fetching analysis data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPercentileChartData = () => {
        return mocks.map((mock, index) => ({
            name: `M${index + 1}`,
            percentile: mock.percentile,
            total: mock.total,
        }));
    };

    const getSectionWiseData = () => {
        if (!mocks.length) return [];
        return mocks.slice(-5).map((mock, index) => ({
            name: `M${mocks.length - 4 + index}`,
            VARC: mock.scores.varc,
            LRDI: mock.scores.lrdi,
            QA: mock.scores.qa,
        }));
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-4! border-white/20 shadow-2xl scale-105 transition-transform">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-8 mb-2 last:mb-0">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></div>
                                <span className="text-xs font-bold text-white/60">{entry.name}</span>
                            </div>
                            <span className="text-sm font-black text-white">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen gradient-mesh-bg flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="glass-panel p-16 text-center max-w-sm">
                        <div className="spinner-lg mx-auto mb-8" />
                        <h2 className="text-2xl font-black text-white mb-2">Loading...</h2>
                        <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Getting Analysis</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-mesh-bg">

            <main className="page-container">
                {/* HERO */}
                <header className="reveal flex flex-col items-center text-center gap-6 max-w-4xl mx-auto px-4">
                    <div className="glass-badge">
                        <BarChart3 className="w-3 h-3 text-purple-400 fill-purple-400" />
                        Performance Analysis
                    </div>
                    <h1 className="text-4xl xs:text-5xl sm:text-6xl font-black text-white tracking-tighter leading-tight uppercase">
                        Mock<span className="text-gradient-purple">Analysis</span>
                    </h1>
                    <p className="text-white/40 text-sm sm:text-lg font-medium max-w-2xl leading-relaxed">
                        A detailed look at your scores. Find patterns, see your progress, and get better at your prep.
                    </p>

                    {mocks.length > 0 && (
                        <Link to="/ai-mentor" className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 glass-card border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 transition-all group reveal animate-delay-100">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs sm:text-sm font-black text-white uppercase tracking-tighter">Ask AI Mentor</p>
                                <p className="text-emerald-400/60 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest leading-none">Get personalized advice</p>
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400/20 group-hover:text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all ml-2 sm:ml-4" />
                        </Link>
                    )}
                </header>

                {!mocks.length ? (
                    <div className="glass-card py-32 flex flex-col items-center text-center gap-8 reveal animate-delay-200 lg:col-span-12">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group animate-pulse">
                            <PieChart className="w-10 h-10 text-white/10" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-white">No data yet</h3>
                            <p className="text-white/30 text-sm max-w-md mx-auto">You need to record some mocks to see your analysis.</p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                                <a href="/mock-tracker" className="btn-primary group w-full sm:w-auto">
                                    Go to Mock Tracker
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <Link to="/ai-mentor" className="glass-card flex items-center gap-3 px-6 py-3.5 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40 transition-all font-bold text-sm w-full sm:w-auto">
                                    <Sparkles className="w-4 h-4" />
                                    Talk to AI Mentor
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* KPI GRID */}
                        {stats && (
                            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 reveal animate-delay-100">
                                {[
                                    { label: 'Total Mocks', value: stats.totalMocks, icon: Trophy, color: 'purple' },
                                    { label: 'Avg Percentile', value: `${stats.averagePercentile}%`, icon: Target, color: 'blue' },
                                    { label: 'Best Score', value: `${stats.highestPercentile}%`, icon: TrendingUp, color: 'emerald' },
                                    { label: 'Avg Total', value: stats.averageTotal, icon: Zap, color: 'pink' },
                                ].map((kpi, idx) => (
                                    <div key={idx} className="glass-card group flex flex-col items-center gap-3 sm:gap-5 text-center p-5! sm:p-8!">
                                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-${kpi.color}-500/10 flex items-center justify-center text-${kpi.color}-400 group-hover:scale-110 group-hover:bg-${kpi.color}-500/20 transition-all`}>
                                            <kpi.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/30 truncate">{kpi.label}</p>
                                            <p className="text-2xl sm:text-4xl font-black text-white tracking-tight">{kpi.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* CHARTS GRID */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* PERCENTILE TREND */}
                            <div className="glass-card p-6 sm:p-10! reveal animate-delay-200">
                                <div className="flex items-center justify-between mb-8 sm:mb-12">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-1.5 sm:w-2 h-8 sm:h-10 bg-purple-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-black text-white">Score Trend</h2>
                                            <p className="text-white/30 text-[8px] sm:text-xs font-bold uppercase tracking-widest leading-none mt-1">Percentile progress</p>
                                        </div>
                                    </div>
                                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white/10" />
                                </div>

                                <div className="h-[250px] sm:h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={getPercentileChartData()} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                                            <defs>
                                                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700 }}
                                                dy={15}
                                            />
                                            <YAxis
                                                domain={[0, 100]}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                                            <Line
                                                type="monotone"
                                                dataKey="percentile"
                                                stroke="url(#lineGradient)"
                                                strokeWidth={5}
                                                dot={{ fill: '#a855f7', strokeWidth: 3, r: 6, stroke: '#000' }}
                                                activeDot={{ r: 10, strokeWidth: 0, fill: '#fff' }}
                                                animationDuration={2500}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* SECTION STABILITY */}
                            <div className="glass-card p-6 sm:p-10! reveal animate-delay-300">
                                <div className="flex items-center justify-between mb-8 sm:mb-12">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-1.5 sm:w-2 h-8 sm:h-10 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-black text-white">Section Breakdown</h2>
                                            <p className="text-white/30 text-[8px] sm:text-xs font-bold uppercase tracking-widest leading-none mt-1">Performance per section</p>
                                        </div>
                                    </div>
                                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white/10" />
                                </div>

                                <div className="h-[250px] sm:h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={getSectionWiseData()} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 700 }}
                                                dy={15}
                                            />
                                            <YAxis
                                                domain={[0, 100]}
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 12 }} />
                                            <Bar dataKey="VARC" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} animationDuration={1500} />
                                            <Bar dataKey="LRDI" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} animationDuration={2000} />
                                            <Bar dataKey="QA" fill="#a855f7" radius={[6, 6, 0, 0]} barSize={20} animationDuration={2500} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </section>

                        {/* DATA GRID */}
                        <section className="reveal animate-delay-400">
                            <div className="flex items-center gap-4 mb-6 sm:mb-8 px-2">
                                <div className="w-1.5 sm:w-2 h-8 sm:h-10 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white">Score Table</h2>
                                    <p className="text-white/30 text-[8px] sm:text-xs font-bold uppercase tracking-widest mt-0.5">Detailed mock data</p>
                                </div>
                            </div>

                            <div className="glass-card p-0! overflow-hidden border-none sm:border-solid bg-transparent sm:bg-white/5">
                                {/* Desktop Table View */}
                                <div className="hidden sm:block overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-white/5 border-b border-white/10">
                                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mock Name</th>
                                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Date</th>
                                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-center">VARC</th>
                                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-center">LRDI</th>
                                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-center">QA</th>
                                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-center">Total</th>
                                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">Rating</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {[...mocks].reverse().slice(0, 10).map((mock) => (
                                                <tr key={mock._id} className="group hover:bg-white/5 transition-colors">
                                                    <td className="py-6 px-8">
                                                        <span className="text-sm font-black text-white group-hover:text-purple-400 transition-colors uppercase">{mock.name}</span>
                                                    </td>
                                                    <td className="py-6 px-8">
                                                        <span className="text-xs font-bold text-white/30">{new Date(mock.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                    </td>
                                                    <td className="py-6 px-8 text-center">
                                                        <span className="text-sm font-bold text-blue-400">{mock.scores.varc}</span>
                                                    </td>
                                                    <td className="py-6 px-8 text-center">
                                                        <span className="text-sm font-bold text-emerald-400">{mock.scores.lrdi}</span>
                                                    </td>
                                                    <td className="py-6 px-8 text-center">
                                                        <span className="text-sm font-bold text-purple-400">{mock.scores.qa}</span>
                                                    </td>
                                                    <td className="py-6 px-8 text-center">
                                                        <span className="text-sm font-bold text-blue-400">{mock.scores.varc + mock.scores.lrdi + mock.scores.qa}</span>
                                                    </td>
                                                    <td className="py-6 px-8 text-right">
                                                        <span className="text-lg font-black text-gradient-purple tracking-tighter">
                                                            {mock.percentile}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="flex flex-col gap-4 sm:hidden">
                                    {[...mocks].reverse().slice(0, 10).map((mock) => (
                                        <div key={mock._id} className="glass-card p-6 flex flex-col gap-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none mb-1">{mock.name}</h3>
                                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{new Date(mock.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5">Percentile</p>
                                                    <p className="text-2xl font-black text-gradient-purple tracking-tighter">{mock.percentile}%</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-4 gap-2 py-4 border-y border-white/5">
                                                <div className="text-center">
                                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">VARC</p>
                                                    <p className="text-sm font-black text-blue-400">{mock.scores.varc}</p>
                                                </div>
                                                <div className="border-l border-white/5 text-center">
                                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">LRDI</p>
                                                    <p className="text-sm font-black text-emerald-400">{mock.scores.lrdi}</p>
                                                </div>
                                                <div className="border-l border-white/5 text-center">
                                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">QA</p>
                                                    <p className="text-sm font-black text-purple-400">{mock.scores.qa}</p>
                                                </div>
                                                <div className="border-l border-white/5 text-center">
                                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Total</p>
                                                    <p className="text-sm font-black text-white">{mock.scores.varc + mock.scores.lrdi + mock.scores.qa}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {mocks.length > 10 && (
                                <p className="text-center mt-8 text-[10px] font-black uppercase tracking-widest text-white/20">Showing top 10 entries</p>
                            )}
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MockAnalysis;
