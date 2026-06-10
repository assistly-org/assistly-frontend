export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Assistly
        </h1>

        <div className="hidden md:flex items-center gap-6 text-slate-300">
          <a href="#">Features</a>
          <a href="#">Solutions</a>
          <a href="#">Pricing</a>
          <a href="#">Docs</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-300 hover:text-white">
            Sign In
          </button>

          <button className="bg-indigo-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-indigo-500">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}