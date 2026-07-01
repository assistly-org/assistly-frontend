import ProtectedRoute from "@/features/auth/routes/ProtectedRoute";
import { OrganizationNavbar } from "@/features/organizations/components/OrganizationNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // ⚡ Everything inside this folder is now protected by the gatekeeper
    <ProtectedRoute>
      {/* 1. Stack everything top-to-bottom vertically */}
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        
        {/* 2. Top Navbar sits at the top, spanning full width */}
        <OrganizationNavbar />

        {/* 3. Create a new horizontal row for the Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Later on, you can drop your global Sidebar component here! */}
          {/* <Sidebar /> */}

          {/* 4. Main content takes up the remaining space */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          
        </div>
      </div>
    </ProtectedRoute>
  );
}