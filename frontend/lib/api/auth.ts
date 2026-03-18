import { apiClient } from "@/lib/api/client";
import type { UserSession } from "@/lib/types";

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

type SignInPayload = {
  email: string;
  password: string;
};

type SocialSignInResponse = {
  url: string;
  redirect: boolean;
};

export async function signUpWithEmail(payload: SignUpPayload) {
  const { data } = await apiClient.post("/api/auth/sign-up/email", payload);
  return data;
}

export async function signInWithEmail(payload: SignInPayload) {
  const { data } = await apiClient.post("/api/auth/sign-in/email", payload);
  return data;
}

export async function signInWithGoogle(callbackURL?: string) {
  const { data } = await apiClient.post<SocialSignInResponse>("/api/auth/sign-in/social", {
    provider: "google",
    callbackURL,
    disableRedirect: true,
  });

  return data;
}

export async function signOutSession() {
  const { data } = await apiClient.post("/api/auth/sign-out", {});
  return data;
}

export async function getSession() {
  const { data } = await apiClient.get<UserSession | null>("/api/auth/get-session");
  return data;
}
