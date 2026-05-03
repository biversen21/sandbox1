"use client";

import { useState } from "react";
import ResumeInput from "./ResumeInput";
import JobInput from "./JobInput";
import AnalyzeButton from "./AnalyzeButton";
import ResultsPlaceholder from "./ResultsPlaceholder";

interface FormPayload {
  resumeText: string;
  jobText: string;
  jobUrl: string | null;
}

interface FormErrors {
  resume?: string;
  job?: string;
}

interface Touched {
  resume: boolean;
  job: boolean;
}

function validate(resumeText: string, jobText: string, jobUrl: string): FormErrors {
  const errors: FormErrors = {};
  if (!resumeText.trim()) errors.resume = "Please paste your resume before analyzing.";
  if (!jobText.trim() && !jobUrl.trim()) errors.job = "Paste a job description or enter a job posting URL.";
  return errors;
}

export default function OptimizerForm() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [touched, setTouched] = useState<Touched>({ resume: false, job: false });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(resume, jobDescription, jobUrl);
  const visibleErrors: FormErrors = {
    resume: touched.resume ? errors.resume : undefined,
    job: touched.job ? errors.job : undefined,
  };
  const isValid = Object.keys(errors).length === 0;

  function normalize(): FormPayload {
    return {
      resumeText: resume.trim(),
      jobText: jobDescription.trim(),
      jobUrl: jobUrl.trim() || null,
    };
  }

  async function handleAnalyze() {
    if (!isValid) return;
    setLoading(true);
    const payload = normalize();
    console.log("Payload:", payload);
    // API call replaces this delay
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyze your resume</h2>
      <p className="text-gray-500 mb-8 text-sm">
        Paste your resume and the job description. We&apos;ll show how well you match and what to improve.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ResumeInput
          value={resume}
          onChange={setResume}
          onBlur={() => setTouched((t) => ({ ...t, resume: true }))}
          error={visibleErrors.resume}
        />
        <JobInput
          jobDescription={jobDescription}
          onJobDescriptionChange={setJobDescription}
          jobUrl={jobUrl}
          onJobUrlChange={setJobUrl}
          onBlur={() => setTouched((t) => ({ ...t, job: true }))}
          error={visibleErrors.job}
        />
      </div>

      <AnalyzeButton
        onClick={handleAnalyze}
        disabled={!isValid}
        loading={loading}
      />

      {submitted && <ResultsPlaceholder />}
    </div>
  );
}
