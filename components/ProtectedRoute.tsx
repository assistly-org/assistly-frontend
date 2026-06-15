// "use client";

// import { useEffect, useState } from "react";

// export default function ProtectedRoute({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isAuthorized, setIsAuthorized] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");

//     if (!token) {
//       window.location.replace("/auth/login");
//       return;
//     }

//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const now = Math.floor(Date.now() / 1000);

//       if (payload.exp && payload.exp < now) {
//         localStorage.removeItem("access_token");
//         window.location.replace("/auth/login");
//         return;
//       }

//       // They are logged in!
//       setIsAuthorized(true);
//     } catch (error) {
//       localStorage.removeItem("access_token");
//       window.location.replace("/auth/login");
//     }
//   }, []);

//   if (!isAuthorized) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">
//             Verifying Session
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }