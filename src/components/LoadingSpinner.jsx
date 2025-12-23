import { Terminal } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', message = 'Synchronizing...' }) => {
    const sizeMap = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-20 h-20'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 animate-reveal">
            <div className="relative">
                {/* SPINNER OUTER */}
                <div className={`${sizeMap[size]} border-4 border-white/5 border-t-purple-500 rounded-full animate-spin shadow-[0_0_20px_rgba(168,85,247,0.2)]`}></div>

                {/* INNER ICON (only for larger sizes) */}
                {size !== 'sm' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Terminal className="w-1/3 h-1/3 text-white/10 animate-pulse" />
                    </div>
                )}
            </div>

            {message && (
                <div className="mt-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 animate-pulse">{message}</p>
                </div>
            )}
        </div>
    );
};

export default LoadingSpinner;
