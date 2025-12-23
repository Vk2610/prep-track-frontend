import { createContext, useContext, useState, useEffect } from 'react';
import {
    CheckCircle2,
    AlertCircle,
    Info,
    AlertTriangle,
    X,
    Bell
} from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const success = (message) => showToast(message, 'success');
    const error = (message) => showToast(message, 'error');
    const info = (message) => showToast(message, 'info');
    const warning = (message) => showToast(message, 'warning');

    const getToastConfig = (type) => {
        const configs = {
            success: {
                icon: CheckCircle2,
                color: 'emerald',
                title: 'Success',
                glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            },
            error: {
                icon: AlertCircle,
                color: 'red',
                title: 'Error',
                glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]'
            },
            warning: {
                icon: AlertTriangle,
                color: 'orange',
                title: 'Warning',
                glow: 'shadow-[0_0_20px_rgba(249,115,22,0.2)]'
            },
            info: {
                icon: Info,
                color: 'blue',
                title: 'Info',
                glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]'
            }
        };
        return configs[type] || configs.info;
    };

    return (
        <ToastContext.Provider value={{ success, error, info, warning }}>
            {children}

            {/* TOAST CONTAINER */}
            <div className="fixed top-24 right-6 z-[100] space-y-4 max-w-sm w-full pointer-events-none">
                {toasts.map((toast, index) => {
                    const config = getToastConfig(toast.type);
                    const Icon = config.icon;
                    return (
                        <div
                            key={toast.id}
                            className={`glass-card p-0! overflow-hidden pointer-events-auto animate-reveal ${config.glow} border-${config.color}-500/20!`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="p-5 flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-2xl bg-${config.color}-500/10 flex items-center justify-center text-${config.color}-400 shrink-0`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 pt-1">
                                    <p className={`text-[10px] font-black uppercase tracking-widest text-${config.color}-400 mb-1`}>
                                        {config.title}
                                    </p>
                                    <p className="text-sm font-bold text-white/80 leading-snug">
                                        {toast.message}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="p-1 text-white/20 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* PROGRESS BAR */}
                            <div className="h-0.5 bg-white/5 w-full relative">
                                <div
                                    className={`absolute inset-0 bg-${config.color}-500 animate-toastProgress`}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};
