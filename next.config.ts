import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        optimizeCss: true,
        optimizePackageImports: [
            "lucide-react",
            "recharts",
            "date-fns",
            "embla-carousel-react",
            "embla-carousel-autoplay",
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                ],
            },
        ];
    },
    async redirects() {
        return [
            {
                source: "/services/particulier/menage-demenagement",
                destination: "/",
                permanent: false,
            },
            {
                source: "/services/particulier/menage-airbnb",
                destination: "/services/menage-airbnb",
                permanent: true,
            },
            {
                source: "/services/airbnb",
                destination: "/services/menage-airbnb",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
