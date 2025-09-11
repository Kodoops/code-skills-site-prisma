// lib/theme.ts
export const theme = {
    colors: {
        // Branding
        orangeFrom: "#FFA000",
        orangeTo: "#FF6F00",
        blueFrom: "#0288D1",
        blueTo: "#01579B",
        gray900: "#0B0F14",

        white: "#FFFFFF",
        black: "#000000",
    },

    gradients: {
        // Dégradé orange (clair → foncé)
        orange: "linear-gradient(90deg, #FFA000, #FF6F00)",

        // Dégradé bleu (clair → foncé)
        blue: "linear-gradient(90deg, #0288D1, #01579B)",

        // Dégradé foncé (gris foncé → noir profond)
        dark: "linear-gradient(90deg, #0B0F14, #000000)",
    },
} as const;
