import OptimizerForm from "@/components/OptimizerForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">JobCopilot</span>
          <span className="text-sm text-gray-400 hidden sm:block">AI-powered resume optimizer</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-wide">
            Free analysis — no account needed
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Turn any job posting into a tailored resume and interview prep plan.
          </h1>
          <p className="text-lg text-gray-500 mb-10">
            Paste your resume and a job description. Get a match score, keyword gaps, and targeted
            improvement suggestions.
          </p>
          <a
            href="#analyze"
            className="inline-block bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg shadow-sm"
          >
            Analyze My Resume
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            {
              step: "1",
              title: "Paste your resume",
              desc: "Copy and paste your current resume as plain text.",
            },
            {
              step: "2",
              title: "Add the job posting",
              desc: "Paste the job description directly from the listing.",
            },
            {
              step: "3",
              title: "Get your analysis",
              desc: "Receive a match score, keyword gaps, and improvement suggestions.",
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-lg mb-3">
                {step}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main form */}
      <section id="analyze" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <OptimizerForm />
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} JobCopilot &mdash; Results are AI-generated suggestions
          and do not guarantee employment outcomes.
        </div>
      </footer>
    </main>
  );
}
