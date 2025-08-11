import React from 'react';

interface ButtonProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ icon, children, onClick, className = '', disabled = false }) => {
  return (
    <button
      className={`bg-black text-white rounded-lg px-6 py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;