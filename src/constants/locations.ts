export const DEFAULT_CITY = "Casablanca";

export const CASABLANCA_NEIGHBORHOODS = [
    "Maârif",
    "Gauthier",
    "Racine",
    "Palmier",
    "Bourgogne",
    "Derb Ghallef",
    "Hôpitaux",
    "Belvédère",
    "Roches Noires",
    "Anfa",
    "Aïn Diab",
    "Californie",
    "L'Oasis",
    "Polo",
    "CIL (Hay El Hanaa)",
    "Sidi Maârouf",
    "Casablanca Finance City (CFC)",
    "Habous (Nouvelle Médina)",
    "Ancienne Médina",
    "Mers Sultan",
    "Derb Sultan",
    "Hay Mohammadi",
    "Al Fida",
    "Aïn Chock",
    "Hay Hassani",
    "Sbata",
    "Ben M'sik",
    "Sidi Othmane",
    "Moulay Rachid",
    "Aïn Sebaâ",
    "Sidi Bernoussi",
    "Sidi Moumen",
    "Lissasfa",
    "Bouskoura (périphérie sud)",
    "Dar Bouazza (périphérie côtière ouest)"
];

export const CITIES = [
    "Casablanca",
    "Rabat",
    "Bouskoura",
    "Dar Bouazza",
    "Mansouria",
    "Almaz",
    "Sidi Rahal",
    "Benslimane",
    "Mohammédia",
    "Ville Verte"
];

export const SURCHARGE_CITIES = [
    "Bouskoura",
    "Dar Bouazza",
    "Mansouria",
    "Almaz",
    "Sidi Rahal",
    "Benslimane",
    "Mohammédia",
    "Ville Verte"
];

export const NEIGHBORHOODS_BY_CITY: Record<string, string[]> = {
    Casablanca: CASABLANCA_NEIGHBORHOODS,
    Rabat: [
        "Agdal", "Hassan", "Hay Riad", "Souissi", "L'Océan", "Les Orangers", 
        "Quartier des Ministères", "Yacoub El Mansour", "Médina", "Akkari", "Diour Jamaa"
    ],
    Bouskoura: [
        "Ville Verte", "Victoria", "CGI", "Golf", "Centre-ville", "Quartier Industriel"
    ],
    "Dar Bouazza": [
        "Tamaris", "Oued Merzeg", "Jack Beach", "Centre-ville", "Dar Bouazza Plage"
    ],
    Mansouria: ["Centre", "Plage", "Résidences Côtières"],
    Almaz: ["Almaz", "Centre"],
    "Sidi Rahal": ["Sidi Rahal Chatai", "Centre", "Plage"],
    Benslimane: ["Centre-ville", "Quartier Administratif", "Quartier Industriel", "Oasis"],
    Mohammédia: [
        "Parc", "Alia", "Rachidia", "Mannesmann", "Plage", "Centre-ville", "Yasmina", "Wafaa"
    ],
    "Ville Verte": ["Ville Verte (Bouskoura)", "Centre"]
};
