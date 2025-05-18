// src/components/icons/MessageButtonIcon.tsx
import React from "react";

interface MessageButtonIconProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const MessageButtonIcon: React.FC<MessageButtonIconProps> = ({
  size = 24,
  className = "",
  onClick,
}) => (
  <button onClick={onClick} className={`inline-flex ${className}`}>
    <svg
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863
           9.863 0 01-4-.8L3 20l1.8-4A7.963 7.963 0 013
           12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  </button>
);
