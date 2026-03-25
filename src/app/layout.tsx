import { Metadata } from "next";
import { Inter, Work_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import QueryProvider from "@/components/QueryProvider";
import WhyChooseUs from "@/components/WhyChooseUs";
import dynamic from "next/dynamic";

const WhatsAppSidebar = dynamic(() => import("@/components/WhatsAppSidebar"));
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"));

const workSans = Work_Sans({
    subsets: ["latin"],
    variable: "--font-work-sans",
    weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    authors: [{ name: "Agence Ménage" }],
    title: {
        default: "Agence de Ménage Casablanca | Nettoyage Professionnel & Fiable",
        template: "%s",
    },
    description: "Agence Ménage — femmes de ménage qualifiées pour particuliers et entreprises au Maroc. Nettoyage standard, grand ménage, Airbnb et post-chantier. Disponible 7j/7.",
    openGraph: {
        title: "Agence de Ménage - Services de nettoyage professionnels",
        description: "Agence Ménage — femmes de ménage qualifiées pour particuliers et entreprises au Maroc. Nettoyage standard, grand ménage, Airbnb et post-chantier. Disponible 7j/7.",
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
        google: "XlhIPJ8VqqCVLwwxTxrfm5aLsAt0N4PPgFu7U1apY_0",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr-MA" className={`${workSans.variable}`} suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="alternate" hrefLang="fr-MA" href="https://www.agencemenage.ma/" />
                <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="Agence Menage" />
                <link rel="manifest" href="/site.webmanifest" />
            </head>
            <body className="antialiased min-h-screen flex flex-col overflow-x-hidden" suppressHydrationWarning>
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-MCPC5PJJ"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    />
                </noscript>
                <Script
                    id="gtm-script"
                    strategy="lazyOnload"
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
                <Script
                    id="ga-script"
                    strategy="lazyOnload"
                    src={`https://www.googletagmanager.com/gtag/js?id=AW-17907112455`}
                />
                <Script
                    id="ga-config"
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
