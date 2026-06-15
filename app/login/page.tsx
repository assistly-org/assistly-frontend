// app/auth/login/page.tsx

import LoginForm from "@/components/auth/LoginForm";
import GuestRoute from "@/components/GuestRoute";

export default function LoginPage() {
  return (
    <GuestRoute>
      <LoginForm />
    </GuestRoute>
  );
}
