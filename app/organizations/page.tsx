// app/auth/login/page.tsx

import OrganizationsPage from "@/components/auth/OrganizationsPage";
import GuestRoute from "@/components/GuestRoute";

export default function LoginPage() {
  return (
    <GuestRoute>
    <OrganizationsPage />
    </GuestRoute> 
  );
}
