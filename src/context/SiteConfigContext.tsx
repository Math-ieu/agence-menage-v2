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
    const endpoints = [
      `${API_URL}/api/public/site-config/`,
      `${API_URL}/api/site/public/config/`
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setConfig((prev) => ({
            ...prev,
            ...data,
          }));
          return;
        }
      } catch {
        // Continuer vers l'URL suivante si échec
      }
    }
  };

  useEffect(() => {
    fetchFreshConfig();
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, refreshConfig: fetchFreshConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
