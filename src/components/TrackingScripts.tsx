"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";

export default function TrackingScripts() {
    const [isProd, setIsProd] = useState(false);

    useEffect(() => {
        const hostname = window.location.hostname;
        if (hostname === "agencemenage.ma" || hostname === "www.agencemenage.ma") {
            setIsProd(true);
        }
    }, []);

    if (!isProd) {
        return null;
    }

    return (
        <>
            {/* Google Tag Manager loaded after hydration using @next/third-parties */}
            <GoogleTagManager gtmId="GTM-MCPC5PJJ" />

            {/* Google Ads (gtag) loaded with lazyOnload to not block the main thread */}
            <Script
                id="google-ads-gtag-src"
                strategy="lazyOnload"
                src="https://www.googletagmanager.com/gtag/js?id=AW-17907112455"
            />
            <Script
                id="google-ads-gtag-config"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'AW-17907112455');
                    `,
                }}
            />
        </>
    );
}

