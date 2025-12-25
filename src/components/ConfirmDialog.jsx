import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Erase', confirmColor = 'red' }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 animate-reveal">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/85 backdrop-blur-xl transition-all duration-500"
                onClick={onClose}
            ></div>

            {/* MODAL */}
            <div className="relative glass-card p-0! max-w-md w-full overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border-white/20!">
                {/* ACCENT GLOW */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-30 bg-${confirmColor}-500`}></div>

                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 p-10 flex flex-col items-center">
                    {/* ICON CONTAINER */}
                    <div className={`w-24 h-24 rounded-[2.5rem] bg-${confirmColor}-500/10 flex items-center justify-center border border-${confirmColor}-500/20 mb-8 group overflow-hidden relative`}>
                        <div className={`absolute inset-0 bg-${confirmColor}-500/10 animate-pulse`}></div>
                        <AlertTriangle className={`w-10 h-10 text-${confirmColor}-400 relative z-10`} />
                    </div>

                    {/* CONTENT */}
                    <div className="text-center mb-10 w-full">
                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">{title}</h3>
                        <p className="text-white/30 text-sm font-bold leading-relaxed">{message}</p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 btn-glass rounded-2xl! py-4! text-xs font-black uppercase tracking-widest text-white/40 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 rounded-2xl! py-4! text-xs font-black uppercase tracking-widest text-white transition-all duration-300 transform hover:-translate-y-1 ${confirmColor === 'red'
                                ? 'bg-red-600 shadow-[0_10px_30px_rgba(220,38,38,0.3)]'
                                : 'bg-orange-600 shadow-[0_10px_30px_rgba(234,88,12,0.3)]'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmDialog;
