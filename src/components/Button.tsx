interface ButtonProps {
  text: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Button({ text, icon, className = "", onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      {text}
      {icon}
    </button>
  );
}
