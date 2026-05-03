"use client";

import { useState } from "react";
import ResumeInput from "./ResumeInput";
import JobInput from "./JobInput";
import AnalyzeButton from "./AnalyzeButton";
import ResultsPlaceholder from "./ResultsPlaceholder";

export default function OptimizerForm() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleAnalyze() {
    if (!resume.trim() || !jobDescription.trim()) return;
    setSubmitted(true);
    // LLM call wired in next step
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyze your resume</h2>
      <p className="text-gray-500 mb-8 text-sm">
        Paste your resume and the job description. We&apos;ll show how well you match and what to improve.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ResumeInput value={resume} onChange={setResume} />
        <JobInput
          jobDescription={jobDescription}
          onJobDescriptionChange={setJobDescription}
          jobUrl={jobUrl}
          onJobUrlChange={setJobUrl}
        />
      </div>

      <AnalyzeButton
        onClick={handleAnalyze}
        disabled={!resume.trim() || !jobDescription.trim()}
      />

      {submitted && <ResultsPlaceholder />}
    </div>
  );
}
