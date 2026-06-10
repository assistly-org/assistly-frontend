export default function CTA() {
  return (
    <section className="bg-slate-950 text-white py-32">
      <div className="max-w-4xl mx-auto text-center px-6">

        <h2 className="text-5xl font-bold">
          Ready to upgrade your support stack?
        </h2>

        <p className="text-slate-400 mt-6">
          Join 2,000+ teams shipping better
          experiences with Assistly.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

          <button className="bg-indigo-600 px-8 py-4 rounded-xl">
            Start Free Trial
          </button>

          <button className="border border-slate-700 px-8 py-4 rounded-xl">
            Talk to Sales
          </button>

        </div>
      </div>
    </section>
  );
}