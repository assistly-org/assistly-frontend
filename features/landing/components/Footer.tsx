export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">

        <div>
          <h3 className="font-bold text-xl">
            Assistly
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            © 2024 Assistly AI
          </p>
        </div>

        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
          <a href="#">Status</a>
        </div>

      </div>
    </footer>
  );
}