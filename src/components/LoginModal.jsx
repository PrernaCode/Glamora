import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-[400px] p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
                        <path d="M16.5 10.5V6.75C16.5 4.26472 14.4853 2.25 12 2.25C9.51472 2.25 7.5 4.26472 7.5 6.75V10.5M16.5 10.5H7.5M16.5 10.5V11.25C16.5 11.25 16.5 11.25 16.5 11.25M7.5 10.5V11.25C7.5 11.25 7.5 11.25 7.5 11.25M6.75 10.5C5.92157 10.5 5.25 11.1716 5.25 12V19.5C5.25 20.3284 5.92157 21 6.75 21H17.25C18.0784 21 18.75 20.3284 18.75 19.5V12C18.75 11.1716 18.0784 10.5 17.25 10.5H6.75ZM12 14.25V17.25M12 14.25C12.4142 14.25 12.75 14.5858 12.75 15C12.75 15.4142 12.4142 15.75 12 15.75C11.5858 15.75 11.25 15.4142 11.25 15C11.25 14.5858 11.5858 14.25 12 14.25Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-[#1a1c2e] mb-3">Login Required</h2>
                <p className="text-[#6b7280] text-sm leading-relaxed mb-8 px-4">
                    Please sign in to save items to your wishlist and sync them across your devices.
                </p>

                <div className="w-full space-y-3">
                    <button
                        onClick={() => {
                            navigate('/login');
                            onClose();
                        }}
                        className="w-full bg-[#0f172a] text-white py-4 rounded-xl font-bold hover:bg-[#1a2c4e] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-white text-[#1a1c2e] py-4 rounded-xl font-bold border border-gray-100 hover:bg-gray-50 transition-all transform active:scale-[0.98]"
                    >
                        Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
