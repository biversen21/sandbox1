export interface AnalysisResult {
  matchScore: number;
  summary: string;
  previewImprovements: string[];
  missingKeywords: string[];
  locked: true;
}

function scoreColors(score: number) {
  if (score >= 70) return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", bar: "bg-green-500" };
  if (score >= 40) return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", bar: "bg-amber-500" };
  return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", bar: "bg-red-500" };
}

function ScoreCard({ score }: { score: number }) {
  const c = scoreColors(score);
  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-5 text-center`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${c.text}`}>Match Score</p>
      <div className={`flex items-end justify-center gap-0.5 ${c.text}`}>
        <span className="text-5xl font-extrabold leading-none">{score}</span>
        <span className="text-lg font-semibold mb-1">/100</span>
      </div>
      <div className="mt-3 h-2 bg-white/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${c.bar} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) {
  return (
    <div className={`${colorClass} rounded-xl p-5 text-center`}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-3">{label}</p>
      <span className="text-4xl font-extrabold leading-none">{value}</span>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

interface AnalysisResultsProps {
  result: AnalysisResult;
  onUnlock?: () => void;
  optimizing?: boolean;
}

export default function AnalysisResults({ result, onUnlock, optimizing }: AnalysisResultsProps) {
  const { matchScore, summary, previewImprovements, missingKeywords } = result;

  return (
    <div className="mt-10 border-t border-gray-100 pt-10 space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Your Analysis</h3>

      {/* Score row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScoreCard score={matchScore} />
        <StatCard
          label="Missing Keywords"
          value={missingKeywords.length}
          colorClass="bg-amber-50 border border-amber-200 text-amber-700"
        />
        <StatCard
          label="Quick Wins"
          value={previewImprovements.length}
          colorClass="bg-indigo-50 border border-indigo-200 text-indigo-700"
        />
      </div>

      {/* Summary */}
      <div className="border border-gray-200 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Summary</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
      </div>

      {/* Top improvements */}
      <div className="border border-gray-200 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Top Improvements{" "}
          <span className="text-gray-400 font-normal">(free preview)</span>
        </h4>
        <ol className="space-y-3">
          {previewImprovements.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Missing keywords */}
      <div className="border border-gray-200 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Missing Keywords</h4>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((kw, i) => (
            <span
              key={i}
              className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Locked CTA */}
      <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 bg-indigo-50/50 text-center">
        <div className="flex items-center justify-center gap-2 text-indigo-600 mb-2">
          <LockIcon />
          <span className="text-base font-semibold">Unlock optimized resume + interview prep</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Get a fully rewritten resume tailored to this role, a complete improvement plan, and
          interview prep with company-specific talking points.
        </p>
        <button
          disabled
          className="bg-indigo-600 text-white font-semibold px-8 py-2.5 rounded-lg opacity-50 cursor-not-allowed text-sm"
        >
          Unlock Full Analysis — Coming Soon
        </button>
      </div>

      {/* Dev-only bypass */}
      {onUnlock && (
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs font-mono bg-yellow-100 text-yellow-700 border border-yellow-300 px-2 py-0.5 rounded">
            DEV ONLY
          </span>
          <button
            onClick={onUnlock}
            disabled={optimizing}
            className="text-sm text-gray-500 hover:text-gray-800 underline underline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {optimizing ? "Generating full result..." : "Generate Full Result"}
          </button>
        </div>
      )}
    </div>
  );
}
