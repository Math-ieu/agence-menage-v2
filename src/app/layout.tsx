import { Metadata } from "next";
import { Inter, Work_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import QueryProvider from "@/components/QueryProvider";
import WhatsAppSidebar from "@/components/WhatsAppSidebar";
import ScrollToTop from "@/components/ScrollToTop";
import WhyChooseUs from "@/components/WhyChooseUs";

const workSans = Work_Sans({
    subsets: ["latin"],
    variable: "--font-work-sans",
    weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    title: {
        default: "Agence de Ménage Casablanca | Nettoyage Professionnel & Fiable",
        template: "%s",
    },
    description: "Services de ménage et nettoyage pour particuliers et entreprises à Casablanca. Professionnalisme, discrétion et satisfaction garantis.",
    openGraph: {
        title: "Agence de Ménage - Services de nettoyage professionnels",
        description: "Services de ménage et nettoyage pour particuliers et entreprises à Casablanca.",
        type: "website",
        url: "https://www.agencemenage.ma",
        images: [
            {
                url: "/og-main.png",
                width: 1200,
                height: 630,
                alt: "Agence de Ménage Casablanca",
            },
        ],
    },
    metadataBase: new URL("https://www.agencemenage.ma"),
    alternates: {
        canonical: "./",
    },
    robots: {
        index: true,
        follow: true,
    },
    verification: {
        google: [
            "XlhIPJ8VqqCVLwwxTxrfm5aLsAt0N4PPgFu7U1apY_0",
            "aIvUpt-vH6Kct-44tIJYPYciubL4YDEMnoc24z0MrJA",
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={`${workSans.variable}`} suppressHydrationWarning>
            <head>
                <Script id="google-tag-manager-init" strategy="afterInteractive">
                    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-MCPC5PJJ');`}
                </Script>
                <Script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=AW-17907112455"
                    strategy="afterInteractive"
                />
                <Script id="google-tag-manager" strategy="afterInteractive">
                    {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());

                      gtag('config', 'AW-17907112455');
                    `}
                </Script>
            </head>
            <body className="antialiased min-h-screen flex flex-col overflow-x-hidden">
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-MCPC5PJJ"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    ></iframe>
                </noscript>
                {/* End Google Tag Manager (noscript) */}
                <QueryProvider>
                    <TooltipProvider>
                        <ScrollToTop />
                        <WhatsAppSidebar />
                        <div className="flex-1 w-full relative">
                            {children}
                        </div>
                        <Toaster />
                        <Sonner />
                        <Analytics />
                    </TooltipProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
