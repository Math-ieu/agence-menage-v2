export const SERVICE_COLORS = {
    // Particulier Services
    STANDARD: {
        hex: "#0B7F7A",
        hsl: "178 84% 27%"
    },
    GRAND_MENAGE: {
        hex: "#04969e",
        hsl: "183 95% 32%"
    },
    AIRBNB: {
        hex: "#f78458",
        hsl: "17 91% 66%"
    },
    DEMENAGEMENT: {
        hex: "#f8c170",
        hsl: "36 92% 70%"
    },
    CHANTIER_P: {
        hex: "#d9bf12",
        hsl: "52 85% 46%"
    },
    GARDE_MALADE: {
        hex: "#50bfcb",
        hsl: "186 52% 55%"
    },
    URGENCE_P: {
        hex: "#4f8130",
        hsl: "97 46% 35%"
    },

    // Entreprise Services
    BUREAUX: {
        hex: "#c7dd54",
        hsl: "70 66% 60%"
    },
    PLACEMENT: {
        hex: "#f1db08",
        hsl: "54 94% 49%"
    },
    CHANTIER_E: {
        hex: "#88d89d",
        hsl: "136 52% 69%"
    },
    URGENCE_E: {
        hex: "#74a12d",
        hsl: "84 56% 41%"
    }
} as const;

export type ServiceColorKey = keyof typeof SERVICE_COLORS;
