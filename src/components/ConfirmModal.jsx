import React from 'react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger" // 'danger' or 'primary'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-[400px] p-8 flex flex-col items-center text-center animate-in zoom-in duration-300">

                {/* Warning Icon */}
                <div className={`w-20 h-20 ${variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'} rounded-full flex items-center justify-center mb-6`}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {variant === 'danger' ? (
                            <path d="M12 9V14M12 17.01L12.01 16.9989M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                            <path d="M12 9V12M12 15.01L12.01 14.9989M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                    </svg>
                </div>

                <h3 className="text-2xl font-bold mb-3">{title}</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    {message}
                </p>

                <div className="flex flex-col w-full gap-3">
                    <button
                        onClick={onConfirm}
                        className={`w-full py-4 rounded-xl text-xs font-black tracking-[0.2em] uppercase transition-all active:scale-95 ${variant === 'danger'
                                ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200'
                                : 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-gray-200'
                            }`}
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-4 rounded-xl text-xs font-black tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-colors"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
