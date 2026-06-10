export default function Features() {
  return (
    <section className="bg-slate-950 text-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold">
            Architected for Speed
          </h2>

          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Precision-engineered components that transform
            customer support from a cost center to a
            competitive advantage.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6">

          <div className="md:col-span-8 bg-slate-900 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">
              24/7 AI RAG Training
            </h3>

            <p className="text-slate-400">
              Continuous learning from your docs,
              support tickets and Slack channels.
            </p>
          </div>

          <div className="md:col-span-4 bg-slate-900 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">
              Multi Channel
            </h3>

            <p className="text-slate-400">
              Telegram, Instagram and Web Widget.
            </p>
          </div>

          <div className="md:col-span-4 bg-slate-900 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">
              Action Engine
            </h3>

            <p className="text-slate-400">
              Execute real business actions.
            </p>
          </div>

          <div className="md:col-span-8 bg-slate-900 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">
              Live Human Takeover
            </h3>

            <p className="text-slate-400">
              Seamlessly hand off conversations
              to support agents.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}