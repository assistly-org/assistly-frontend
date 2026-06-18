import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export const useGoogleAuth = (onSuccess: (credential: string) => void) => {
  const isGoogleInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkGoogle = setInterval(() => {
      if (window.google?.accounts?.id) {
        if (isGoogleInitialized.current) {
          clearInterval(checkGoogle);
          return;
        }

        isGoogleInitialized.current = true;
        clearInterval(checkGoogle);

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: (response: any) => onSuccess(response.credential),
          auto_select: false,
          cancel_on_tap_outside: false,
          use_fedcm_for_prompt: true,
        });

        const buttonContainer = document.getElementById("google-button-container");
        if (buttonContainer) {
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: "outline",
            size: "large",
            width: 300,
          });
        }

        window.google.accounts.id.prompt();
      }
    }, 100);

    return () => clearInterval(checkGoogle);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};