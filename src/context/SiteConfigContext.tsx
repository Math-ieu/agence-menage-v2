"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteConfig, DEFAULT_SITE_CONFIG } from "@/lib/site-config";

interface SiteConfigContextValue {
  config: SiteConfig;
  refreshConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextValue>({
  config: DEFAULT_SITE_CONFIG,
  refreshConfig: async () => {},
});

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export function SiteConfigProvider({
  children,
  initialConfig,
}: {
  children: React.ReactNode;
  initialConfig?: SiteConfig;
}) {
  const [config, setConfig] = useState<SiteConfig>(initialConfig || DEFAULT_SITE_CONFIG);

  const fetchFreshConfig = async () => {
    try {
      const res = await fetch(`${API_URL}/api/public/site-config/`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setConfig((prev) => ({
          ...prev,
          ...data,
        }));
      }
    } catch {
      // Ignorer silencieusement et conserver la configuration actuelle
    }
  };

  useEffect(() => {
    // Si initialConfig n'a pas été fourni côté serveur, tenter une récupération côté client
    if (!initialConfig) {
      fetchFreshConfig();
    }
  }, [initialConfig]);

  return (
    <SiteConfigContext.Provider value={{ config, refreshConfig: fetchFreshConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
