import { Metadata } from "next";
import { Inter, Work_Sans } from "next/font/google";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
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
            </head>
            <body className="antialiased min-h-screen flex flex-col overflow-x-hidden" suppressHydrationWarning>
                <GoogleTagManager gtmId="GTM-MCPC5PJJ" />
                <GoogleAnalytics gaId="AW-17907112455" />
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
