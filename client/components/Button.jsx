export default function Button({ icon, children, onClick, className }) {
  return (
    <button
      className={`bg-gray-800 text-white rounded-full p-3 md:p-4 flex items-center justify-center gap-1 hover:opacity-90 transition-opacity min-h-[44px] ${className}`}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}
