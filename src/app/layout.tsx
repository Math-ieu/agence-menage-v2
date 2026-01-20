import { Metadata } from "next";
import { Inter, Work_Sans } from "next/font/google";
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
    title: "Agence de Ménage - Services de nettoyage professionnels",
    description: "Services de ménage et nettoyage pour particuliers et entreprises. Professionnalisme et satisfaction garantis.",
    openGraph: {
        title: "Agence de Ménage - Services de nettoyage professionnels",
        description: "Services de ménage et nettoyage pour particuliers et entreprises.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={`${workSans.variable}`} suppressHydrationWarning>
            <body className="antialiased min-h-screen flex flex-col overflow-x-hidden">
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
