import type { ButtonProps } from "../types";

export default function Button({ icon, children, onClick, className = "", disabled = false, type = "button" }: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      className={`bg-black text-white rounded-lg px-6 py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
}
