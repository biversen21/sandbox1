interface AnalyzeButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}

export default function AnalyzeButton({
  onClick,
  disabled = false,
  loading = false,
  loadingLabel = "Analyzing...",
}: AnalyzeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-10 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base"
    >
      {loading ? loadingLabel : "Analyze My Resume"}
    </button>
  );
}
