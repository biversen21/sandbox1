interface JobInputProps {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  jobUrl: string;
  onJobUrlChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  extractionError?: string;
}

export default function JobInput({
  jobDescription,
  onJobDescriptionChange,
  jobUrl,
  onJobUrlChange,
  onBlur,
  error,
  extractionError,
}: JobInputProps) {
  const borderClass = error
    ? "border-red-400 focus:ring-red-400"
    : "border-gray-300 focus:ring-indigo-500";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="job-url" className="text-sm font-semibold text-gray-700">
          Job Posting URL{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="job-url"
          type="url"
          value={jobUrl}
          onChange={(e) => onJobUrlChange(e.target.value)}
          onBlur={onBlur}
          placeholder="https://jobs.example.com/posting/123"
          className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${borderClass}`}
        />
        <p className="text-xs text-gray-400">
          We&apos;ll extract the job description from the URL automatically.
        </p>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <label htmlFor="job-description" className="text-sm font-semibold text-gray-700">
          Job Description
        </label>
        <p className="text-xs text-gray-400">Or paste the full job posting text directly.</p>
        <textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          onBlur={onBlur}
          rows={13}
          placeholder="Paste the job description here..."
          className={`w-full border rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 resize-y ${borderClass}`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {extractionError && (
          <p className="text-xs text-red-500">{extractionError}</p>
        )}
      </div>
    </div>
  );
}
