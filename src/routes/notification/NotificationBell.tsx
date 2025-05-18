// src/components/notification/NotificationBell.tsx
import React from "react";

interface NotificationBellProps {
  hasUnread?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  hasUnread = false,
  onClick,
  className = "",
}) => (
  <button onClick={onClick} className={`relative ${className}`}>
    <svg
      className="w-6 h-6 text-gray-700 hover:text-purple-600 transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
    {hasUnread && (
      <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500" />
    )}
  </button>
);
