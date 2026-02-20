interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function SwapButton({ onClick, disabled = false }: SwapButtonProps) {
  return (
    <button
      className="swap-button"
      onClick={onClick}
      disabled={disabled}
      title="Swap languages"
      aria-label="Swap languages"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 16l-4-4 4-4" />
        <path d="M17 8l4 4-4 4" />
        <path d="M3 12h18" />
      </svg>
    </button>
  );
}
