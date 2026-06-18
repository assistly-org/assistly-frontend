import ProtectedRoute from "@/features/auth/routes/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // ⚡ Everything inside this folder is now protected by the gatekeeper
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex">
        
        {/* Later on, you can drop your global Sidebar component here! */}
        {/* <Sidebar /> */}

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
      </div>
    </ProtectedRoute>
  );
}