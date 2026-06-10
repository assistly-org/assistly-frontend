import ThreeScene from "./ThreeScene";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-12 items-center">

        <div>
          <span className="text-indigo-400 font-semibold">
            Enterprise AI Engine 2.0
          </span>

          <h1 className="text-6xl font-bold mt-6">
            One AI Agent.
            <br />
            <span className="text-indigo-400">
              Multiple Channels.
            </span>
            <br />
            Real Business Actions.
          </h1>

          <p className="mt-6 text-slate-400 text-lg">
            Assistly unifies your customer intelligence.
            A single RAG-trained model that handles
            Telegram, Instagram, and Web interactions.
          </p>

          <div className="flex gap-4 mt-8">
            <button className="bg-indigo-600 px-6 py-3 rounded-lg">
              Deploy Now
            </button>

            <button className="border border-slate-700 px-6 py-3 rounded-lg">
              Watch Demo
            </button>
          </div>
        </div>

        <div className="relative h-[600px]">
          <ThreeScene />
        </div>

      </div>
    </section>
  );
}