interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

export default function ResumeInput({ value, onChange, onBlur, error }: ResumeInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="resume" className="text-sm font-semibold text-gray-700">
        Your Resume
      </label>
      <p className="text-xs text-gray-400">Paste your current resume as plain text.</p>
      <textarea
        id="resume"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={16}
        placeholder="Paste your resume here..."
        className={`w-full border rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 resize-y ${
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 focus:ring-indigo-500"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
