"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/api/auth";
import type { UserSession } from "@/lib/types";

let cachedSession: UserSession | null = null;
let sessionRequest: Promise<UserSession | null> | null = null;

export function clearSessionCache() {
  cachedSession = null;
  sessionRequest = null;
}

export function useRequireSession() {
  const router = useRouter();
  const [loading, setLoading] = useState(!cachedSession);
  const [session, setSession] = useState<UserSession | null>(cachedSession);

  useEffect(() => {
    let active = true;

    async function verify() {
      try {
        if (cachedSession) {
          setSession(cachedSession);
          return;
        }

        if (!sessionRequest) {
          sessionRequest = getSession().finally(() => {
            sessionRequest = null;
          });
        }

        const result = await sessionRequest;

        if (!active) return;

        if (!result) {
          clearSessionCache();
          router.replace("/login");
          return;
        }

        cachedSession = result;
        setSession(result);
      } catch {
        if (!active) return;
        clearSessionCache();
        router.replace("/login");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void verify();

    return () => {
      active = false;
    };
  }, [router]);

  return { loading, session };
}
