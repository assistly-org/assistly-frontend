import RegisterForm from "@/components/auth/RegisterForm";
import GuestRoute from "@/components/GuestRoute";

export default function RegisterPage() {
  return (
    <GuestRoute>
      <RegisterForm />
    </GuestRoute>
  );
}
