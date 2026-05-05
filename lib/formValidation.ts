export interface FormErrors {
  resume?: string;
  job?: string;
}

export function validate(resumeText: string, jobText: string, jobUrl: string): FormErrors {
  const errors: FormErrors = {};
  if (!resumeText.trim()) errors.resume = "Please paste your resume before analyzing.";
  if (!jobText.trim() && !jobUrl.trim())
    errors.job = "Paste a job description or enter a job posting URL.";
  return errors;
}
