export function MessageButton({ onClick, size = 6 }: { onClick: () => void, size?: number }) {
    return (
      <button onClick={onClick}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          stroke="currentColor" 
          className={`size-${size}`}
        >
          {/* Icon path */}
        </svg>
      </button>
    );
  }