export default function Stats() {
  return (
    <section className="bg-slate-900 py-24 text-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-10">

        <div>
          <h2 className="text-5xl font-bold text-indigo-400">
            &lt;2s
          </h2>
          <p className="mt-3">P99 Latency</p>
        </div>

        <div>
          <h2 className="text-5xl font-bold text-orange-400">
            85%+
          </h2>
          <p className="mt-3">
            Resolution Accuracy
          </p>
        </div>

        <div>
          <h2 className="text-5xl font-bold">
            15M+
          </h2>
          <p className="mt-3">
            Tasks Automated
          </p>
        </div>

        <div>
          <h2 className="text-5xl font-bold">
            Zero
          </h2>
          <p className="mt-3">
            Cold Starts
          </p>
        </div>

      </div>
    </section>
  );
}