import { Terminal } from 'lucide-react';

const EmptyState = ({ icon, title, message, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-reveal">
            {/* ICON CONTAINER */}
            <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 group overflow-hidden relative">
                <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                {icon ? (
                    <div className="relative z-10 text-white/20 group-hover:text-white/40 group-hover:scale-110 transition-all duration-500">
                        {icon}
                    </div>
                ) : (
                    <Terminal className="w-10 h-10 text-white/10 relative z-10" />
                )}
            </div>

            {/* CONTENT */}
            <div className="max-w-xs space-y-4">
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{title}</h3>
                <p className="text-white/30 text-sm font-bold leading-relaxed">
                    {message}
                </p>
            </div>

            {/* ACTION */}
            {action && (
                <div className="mt-10 animate-reveal animate-delay-200">
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
