interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ResumeInput({ value, onChange }: ResumeInputProps) {
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
        rows={16}
        placeholder="Paste your resume here..."
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
      />
    </div>
  );
}
