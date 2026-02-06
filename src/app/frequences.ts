export const FREQUENCES = [
    { value: "1foisParSemaine", label: "Une fois par semaine" },
    { value: "2foisParSemaine", label: "2 fois par semaine" },
    { value: "3foisParSemaine", label: "3 fois par semaine" },
    { value: "4foisParSemaine", label: "4 fois par semaine" },
    { value: "5foisParSemaine", label: "5 fois par semaine" },
    { value: "6foisParSemaine", label: "6 fois par semaine" },
    { value: "7foisParSemaine", label: "7 fois par semaine" },
    { value: "1foisParMois", label: "1 fois par mois" },
    { value: "2foisParMois", label: "2 fois par mois" },
    { value: "3foisParMois", label: "3 fois par mois" },
    { value: "4foisParMois", label: "4 fois par mois" },
];

export const visitsMap: Record<string, number> = {
    "1foisParSemaine": 1,
    "2foisParSemaine": 2,
    "3foisParSemaine": 3,
    "4foisParSemaine": 4,
    "5foisParSemaine": 5,
    "6foisParSemaine": 6,
    "7foisParSemaine": 7,
    "3foisParMois": 3 / 4,
    "2foisParMois": 0.5,
    "1foisParMois": 0.25,
    "4foisParMois": 1,
};