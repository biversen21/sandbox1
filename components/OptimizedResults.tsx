"use client";

import { useState } from "react";

export interface OptimizedResult {
  optimizedResume: string;
  matchScore: number;
  fullImprovements: string[];
  missingKeywords: string[];
  interviewPrep: {
    likelyQuestions: string[];
    talkingPoints: string[];
    companyResearchAngles: string[];
  };
}

// ─── small utilities ────────────────────────────────────────────────────────

function scoreColors(score: number) {
  if (score >= 70)
    return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", bar: "bg-green-500" };
  if (score >= 40)
    return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", bar: "bg-amber-500" };
  return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", bar: "bg-red-500" };
}

function ScoreCard({ score }: { score: number }) {
  const c = scoreColors(score);
  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-5 text-center max-w-xs`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${c.text}`}>
        Match Score After Optimization
      </p>
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 px-3 py-1.5 rounded-md transition-colors"
    >
      {copied ? (
        <>
          <CheckIcon className="w-3.5 h-3.5" />
          Copied!
        </>
      ) : (
        <>
          <ClipboardIcon className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

function DownloadButton({ text }: { text: string }) {
  function handleDownload() {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized-resume.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-1.5 text-xs border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 px-3 py-1.5 rounded-md transition-colors"
    >
      <DownloadIcon className="w-3.5 h-3.5" />
      Download .txt
    </button>
  );
}

function NumberedList({ items, accentBg = "bg-indigo-100", accentText = "text-indigo-600" }: {
  items: string[];
  accentBg?: string;
  accentText?: string;
}) {
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm text-gray-700">
          <span
            className={`flex-shrink-0 w-5 h-5 rounded-full ${accentBg} ${accentText} text-xs font-bold flex items-center justify-center mt-0.5`}
          >
            {i + 1}
          </span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function SectionCard({ title, count, children }: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
        {count !== undefined && (
          <span className="text-xs text-gray-400 font-medium">{count} {count === 1 ? "item" : "items"}</span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── tiny inline SVG icons ───────────────────────────────────────────────────

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function OptimizedResults({
  result,
  onReset,
}: {
  result: OptimizedResult;
  onReset?: () => void;
}) {
  const { optimizedResume, matchScore, fullImprovements, missingKeywords, interviewPrep } = result;

  return (
    <div className="mt-10 border-t border-gray-100 pt-10 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-bold text-gray-900">Your Optimized Package</h3>
        <span className="text-xs font-mono bg-yellow-100 text-yellow-700 border border-yellow-300 px-2 py-0.5 rounded">
          DEV ONLY
        </span>
      </div>

      {/* Match score */}
      <ScoreCard score={matchScore} />

      {/* Optimized resume */}
      <SectionCard title="Optimized Resume">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CopyButton text={optimizedResume} />
            <DownloadButton text={optimizedResume} />
          </div>

          <div className="border border-gray-200 rounded-lg bg-white p-5">
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-sans">
              {optimizedResume || "No optimized resume was returned."}
            </p>
          </div>

          {/* Accuracy disclaimer */}
          <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-amber-700 leading-relaxed">
              Review all changes for accuracy before submitting. This system improves phrasing and
              ATS alignment but does not invent experience or credentials. Any{" "}
              <code className="font-mono bg-amber-100 px-1 rounded">[add metric]</code> placeholders
              should be replaced with real figures from your own work history.
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Full improvement plan */}
      {fullImprovements.length > 0 && (
        <SectionCard title="Full Improvement Plan" count={fullImprovements.length}>
          <NumberedList items={fullImprovements} />
        </SectionCard>
      )}

      {/* Missing keywords */}
      {missingKeywords.length > 0 && (
        <SectionCard title="Keywords to Add" count={missingKeywords.length}>
          <div className="space-y-3">
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
            <p className="text-xs text-gray-400">
              These keywords appear in the job description but are not yet in your resume. Add them
              only if they accurately reflect your experience.
            </p>
          </div>
        </SectionCard>
      )}

      {/* Interview prep */}
      <div className="border border-indigo-100 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-indigo-100 bg-indigo-50">
          <h4 className="text-sm font-semibold text-gray-800">Interview Prep</h4>
        </div>
        <div className="divide-y divide-gray-100">

          {interviewPrep.likelyQuestions.length > 0 && (
            <div className="p-5 space-y-3">
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
                Likely Questions
              </p>
              <NumberedList
                items={interviewPrep.likelyQuestions}
                accentBg="bg-indigo-100"
                accentText="text-indigo-600"
              />
            </div>
          )}

          {interviewPrep.talkingPoints.length > 0 && (
            <div className="p-5 space-y-3">
              <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide">
                Talking Points
              </p>
              <NumberedList
                items={interviewPrep.talkingPoints}
                accentBg="bg-violet-100"
                accentText="text-violet-600"
              />
            </div>
          )}

          {interviewPrep.companyResearchAngles.length > 0 && (
            <div className="p-5 space-y-3">
              <p className="text-xs font-semibold text-teal-500 uppercase tracking-wide">
                Research Angles
              </p>
              <NumberedList
                items={interviewPrep.companyResearchAngles}
                accentBg="bg-teal-100"
                accentText="text-teal-600"
              />
            </div>
          )}

        </div>
      </div>

      {/* Reset */}
      {onReset && (
        <div className="pt-2">
          <button
            onClick={onReset}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 transition-colors"
          >
            Start another optimization
          </button>
        </div>
      )}

    </div>
  );
}
