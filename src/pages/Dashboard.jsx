import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import {
    Trophy,
    Target,
    BookOpen,
    Users,
    ArrowRight,
    TrendingUp,
    Calendar,
    Zap,
    BarChart3,
    Sparkles
} from 'lucide-react';
import { mockAPI, softSkillsAPI } from '../services/api';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalMocks: 0,
        avgPercentile: 0,
        highestPercentile: 0,
        avgScores: { varc: 0, lrdi: 0, qa: 0 },
        softSkillsCount: 0,
    });

    const [chartData, setChartData] = useState([]);
    const [animatedStats, setAnimatedStats] = useState({
        totalMocks: 0,
        avgPercentile: 0,
        highestPercentile: 0,
        softSkillsCount: 0,
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (!loading) {
            const duration = 1500;
            const steps = 60;
            const interval = duration / steps;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;

                setAnimatedStats({
                    totalMocks: Math.floor(stats.totalMocks * progress),
                    avgPercentile: Math.floor(stats.avgPercentile * progress),
                    highestPercentile: Math.floor(stats.highestPercentile * progress),
                    softSkillsCount: Math.floor(stats.softSkillsCount * progress),
                });

                if (currentStep >= steps) {
                    clearInterval(timer);
                    setAnimatedStats({
                        totalMocks: stats.totalMocks,
                        avgPercentile: stats.avgPercentile,
                        highestPercentile: stats.highestPercentile,
                        softSkillsCount: stats.softSkillsCount,
                    });
                }
            }, interval);

            return () => clearInterval(timer);
        }
    }, [loading, stats]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const mockStatsRes = await mockAPI.getStats({ limit: 5 });
            const mockStats = mockStatsRes.data.data;

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const softSkillsRes = await softSkillsAPI.getAll({
                startDate: sevenDaysAgo.toISOString(),
                limit: 100,
            });

            setStats({
                totalMocks: mockStats.totalMocks || 0,
                avgPercentile: parseFloat(mockStats.averagePercentile || 0),
                highestPercentile: parseFloat(mockStats.highestPercentile || 0),
                avgScores: mockStats.averageScores || { varc: 0, lrdi: 0, qa: 0 },
                softSkillsCount: softSkillsRes.data.count || 0,
            });

            setChartData([
                { name: 'VARC', score: mockStats.averageScores?.varc || 0, color: '#a855f7' },
                { name: 'LRDI', score: mockStats.averageScores?.lrdi || 0, color: '#3b82f6' },
                { name: 'QA', score: mockStats.averageScores?.qa || 0, color: '#ec4899' },
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { to: '/daily-tracker', label: 'Daily Tracker', desc: 'Log preparation & mood', icon: Calendar, color: 'blue' },
        { to: '/mock-tracker', label: 'Mock Tracker', desc: 'Record test results', icon: Trophy, color: 'purple' },
        { to: '/mock-analysis', label: 'Analysis Hub', desc: 'Visualize performance', icon: TrendingUp, color: 'pink' },
        { to: '/soft-skills', label: 'Soft Skills', desc: 'Track verbal & GD prep', icon: Users, color: 'cyan' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen gradient-mesh-bg flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="glass-panel p-16 text-center max-w-sm">
                        <div className="spinner-lg mx-auto mb-8" />
                        <h2 className="text-2xl font-black text-white mb-2">Syncing Data...</h2>
                        <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Generating Insights</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-mesh-bg">

            <main className="page-container">
                {/* HERO */}
                <header className="reveal flex flex-col items-center text-center gap-6 max-w-4xl mx-auto px-2">
                    <div className="glass-badge">
                        <Zap className="w-3 h-3 text-purple-400 fill-purple-400" />
                        Ecosystem Overview
                    </div>
                    <h1 className="text-4xl xs:text-5xl sm:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                        PREP<span className="text-gradient-purple">TRACK</span>
                    </h1>
                    <p className="text-white/40 text-sm sm:text-xl font-medium max-w-2xl leading-relaxed">
                        Precision tracking for CAT aspirants. Transform consistent effort into extraordinary results with data-driven preparation.
                    </p>
                </header>

                {/* KPI GRID */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 reveal animate-delay-100">
                    {[
                        { label: 'Total Mocks', value: animatedStats.totalMocks, icon: Trophy, color: 'purple' },
                        { label: 'Avg Percentile', value: `${animatedStats.avgPercentile}%`, icon: Target, color: 'blue' },
                        { label: 'Best Percentile', value: `${animatedStats.highestPercentile}%`, icon: TrendingUp, color: 'emerald' },
                        { label: 'Total Practice', value: animatedStats.softSkillsCount, icon: Users, color: 'cyan' },
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

                {/* CONTENT LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start reveal animate-delay-200">
                    {/* VISUALIZATION */}
                    <div className="lg:col-span-3 glass-card p-6 sm:p-10!">
                        <div className="flex items-center justify-between mb-8 sm:mb-12">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-1.5 sm:w-2 h-8 sm:h-10 bg-purple-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white">Sectional Analysis</h2>
                                    <p className="text-white/30 text-[8px] sm:text-xs font-bold uppercase tracking-widest leading-none mt-1">Avg performance per section</p>
                                </div>
                            </div>
                            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white/10" />
                        </div>

                        <div className="h-[250px] sm:h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
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
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 12 }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="glass-card p-4! border-white/20 shadow-2xl rounded-2xl!">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">{payload[0].payload.name}</p>
                                                        <p className="text-xl font-black text-white">{payload[0].value}%</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="score" radius={[10, 10, 2, 2]} barSize={50} animationDuration={2000}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-4 mb-4 sm:mb-2">
                            <div className="w-1.5 sm:w-2 h-8 sm:h-10 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-white">Quick Start</h2>
                                <p className="text-white/30 text-[8px] sm:text-xs font-bold uppercase tracking-widest mt-0.5">Jump into preparation</p>
                            </div>
                        </div>

                        {/* AI Mentor Featured Card */}
                        <Link
                            to="/ai-mentor"
                            className="group block glass-card p-6! border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="w-24 h-24 text-emerald-400 rotate-12" />
                            </div>
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-white">AI Mentor</h3>
                                    <p className="text-emerald-400/60 text-xs font-bold uppercase tracking-widest">Personalized Strategy</p>
                                    <p className="text-white/30 text-[10px] font-medium mt-1">Chat with your specialized CAT coach</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-emerald-400/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {quickActions.map((action, idx) => (
                                <Link
                                    key={idx}
                                    to={action.to}
                                    className="group block glass-card p-6! border-white/5 hover:border-white/20"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl bg-${action.color}-500/10 flex items-center justify-center text-${action.color}-400 group-hover:scale-110 transition-transform`}>
                                            <action.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-black text-white">{action.label}</h3>
                                            <p className="text-white/30 text-[10px] font-bold">{action.desc}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
