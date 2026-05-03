function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-gray-400 mx-auto mb-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-6V7a4 4 0 00-8 0v4"
      />
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    </svg>
  );
}

export default function ResultsPlaceholder() {
  return (
    <div className="mt-10 border-t border-gray-100 pt-10">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Your Analysis</h3>

      {/* Free preview stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 text-center">
          <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-3">
            Match Score
          </p>
          <div className="h-10 bg-indigo-200/50 rounded animate-pulse" />
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 text-center">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-3">
            Missing Keywords
          </p>
          <div className="h-10 bg-amber-200/50 rounded animate-pulse" />
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-5 text-center">
          <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-3">
            Improvements Found
          </p>
          <div className="h-10 bg-green-200/50 rounded animate-pulse" />
        </div>
      </div>

      {/* Free detail section */}
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-xl p-5">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-4/6" />
          </div>
        </div>

        {/* Locked paid section */}
        <div className="border border-gray-200 rounded-xl p-5 relative overflow-hidden">
          <div className="h-4 w-56 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-4/6" />
          </div>
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <div className="text-center px-4">
              <LockIcon />
              <p className="text-sm font-semibold text-gray-700">Full analysis — coming soon</p>
              <p className="text-xs text-gray-400 mt-1">
                Optimized resume, interview prep &amp; talking points
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
