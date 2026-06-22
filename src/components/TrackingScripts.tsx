"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

export default function TrackingScripts() {
    const [isProd, setIsProd] = useState(false);
    const [loadScripts, setLoadScripts] = useState(false);

    useEffect(() => {
        const hostname = window.location.hostname;
        if (hostname === "agencemenage.ma" || hostname === "www.agencemenage.ma") {
            setIsProd(true);
        }
    }, []);

    useEffect(() => {
        if (!isProd || loadScripts) return;

        // Load scripts on first interaction
        const loadTracking = () => {
            setLoadScripts(true);
            cleanup();
        };

        const cleanup = () => {
            window.removeEventListener("scroll", loadTracking);
            window.removeEventListener("click", loadTracking);
            window.removeEventListener("mousemove", loadTracking);
            window.removeEventListener("touchstart", loadTracking);
            window.removeEventListener("keydown", loadTracking);
            clearTimeout(timeoutId);
        };

        window.addEventListener("scroll", loadTracking, { passive: true });
        window.addEventListener("click", loadTracking, { passive: true });
        window.addEventListener("mousemove", loadTracking, { passive: true });
        window.addEventListener("touchstart", loadTracking, { passive: true });
        window.addEventListener("keydown", loadTracking, { passive: true });

        // Failsafe: load after 4 seconds if no interaction occurs
        const timeoutId = setTimeout(loadTracking, 4000);

        return cleanup;
    }, [isProd, loadScripts]);

    if (!isProd || !loadScripts) {
        return null;
    }

    return (
        <>
            {/* Google Tag Manager initialized dynamically */}
            <Script
                id="gtm-script"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-MCPC5PJJ');
                    `,
                }}
            />

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

