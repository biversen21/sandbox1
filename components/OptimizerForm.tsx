"use client";

import { useState } from "react";
import ResumeInput from "./ResumeInput";
import JobInput from "./JobInput";
import AnalyzeButton from "./AnalyzeButton";
import ResultsPlaceholder from "./ResultsPlaceholder";

interface FormErrors {
  resume?: string;
  job?: string;
}

interface Touched {
  resume: boolean;
  job: boolean;
}

interface NormalizedPayload {
  resumeText: string;
  jobText: string;
  jobUrl: string | null;
  company: string | null;
  role: string | null;
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
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(resume, jobDescription, jobUrl);
  const isValid = Object.keys(errors).length === 0;
  const visibleErrors: FormErrors = {
    resume: touched.resume ? errors.resume : undefined,
    job: touched.job ? errors.job : undefined,
  };

  async function handleAnalyze() {
    if (!isValid || loading) return;

    setLoading(true);
    setExtractionError(null);

    let finalJobText = jobDescription.trim();
    let company: string | null = null;
    let role: string | null = null;

    if (!finalJobText && jobUrl.trim()) {
      try {
        const res = await fetch("/api/extract-job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobUrl: jobUrl.trim() }),
        });
        const data = await res.json();
        if (!data.success) {
          setExtractionError(data.error ?? "Could not extract job text. Please paste the description manually.");
          setLoading(false);
          return;
        }
        finalJobText = data.jobText;
        company = data.company;
        role = data.role;
      } catch {
        setExtractionError("Could not reach the extraction service. Please paste the job description manually.");
        setLoading(false);
        return;
      }
    }

    const payload: NormalizedPayload = {
      resumeText: resume.trim(),
      jobText: finalJobText,
      jobUrl: jobUrl.trim() || null,
      company,
      role,
    };

    console.log("Payload:", payload);
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyze your resume</h2>
      <p className="text-gray-500 mb-8 text-sm">
        Paste your resume and the job description — or drop in a job posting URL.
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
          onJobDescriptionChange={(v) => {
            setJobDescription(v);
            if (extractionError) setExtractionError(null);
          }}
          jobUrl={jobUrl}
          onJobUrlChange={(v) => {
            setJobUrl(v);
            if (extractionError) setExtractionError(null);
          }}
          onBlur={() => setTouched((t) => ({ ...t, job: true }))}
          error={visibleErrors.job}
          extractionError={extractionError ?? undefined}
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
