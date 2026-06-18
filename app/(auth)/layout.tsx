import GuestRoute from "@/features/auth/routes/GuestRoute";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // ⚡ Wrap the entire Auth folder in our new reverse-lock!
    <GuestRoute>
      {children}
    </GuestRoute>
  );
}