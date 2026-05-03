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
      className="text-xs border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 px-3 py-1 rounded-md transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 space-y-3">
      <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
      {children}
    </div>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm text-gray-700">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ol>
  );
}

export default function OptimizedResults({ result }: { result: OptimizedResult }) {
  const { optimizedResume, fullImprovements, missingKeywords, interviewPrep } = result;

  return (
    <div className="mt-8 space-y-5">
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-bold text-gray-900">Full Result</h3>
        <span className="text-xs font-mono bg-yellow-100 text-yellow-700 border border-yellow-300 px-2 py-0.5 rounded">
          DEV ONLY
        </span>
      </div>

      {/* Optimized resume */}
      <Section title="Optimized Resume">
        <div className="flex justify-end">
          <CopyButton text={optimizedResume} />
        </div>
        <pre className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-wrap leading-relaxed overflow-auto max-h-[500px]">
          {optimizedResume}
        </pre>
      </Section>

      {/* Full improvements */}
      {fullImprovements.length > 0 && (
        <Section title="All Improvements Made">
          <NumberedList items={fullImprovements} />
        </Section>
      )}

      {/* Still-missing keywords */}
      {missingKeywords.length > 0 && (
        <Section title="Keywords Still Missing">
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
        </Section>
      )}

      {/* Interview prep */}
      <div className="border border-indigo-100 bg-indigo-50/30 rounded-xl p-5 space-y-5">
        <h4 className="text-sm font-semibold text-gray-800">Interview Prep</h4>

        {interviewPrep.likelyQuestions.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Likely Questions
            </p>
            <NumberedList items={interviewPrep.likelyQuestions} />
          </div>
        )}

        {interviewPrep.talkingPoints.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Talking Points
            </p>
            <NumberedList items={interviewPrep.talkingPoints} />
          </div>
        )}

        {interviewPrep.companyResearchAngles.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Research Angles
            </p>
            <NumberedList items={interviewPrep.companyResearchAngles} />
          </div>
        )}
      </div>
    </div>
  );
}
