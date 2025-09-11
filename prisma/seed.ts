import { PrismaClient } from '../lib/generated/prisma';
const prisma = new PrismaClient();


const FEATURES = [
    {
        title: "Parcours guidés",
        desc: "Des chemins d’apprentissage adaptés à ton niveau avec déblocage progressif.",
        color: "primary",
        iconLib: "lucide",
        iconName: "Route",
    },
    {
        title: "Exercices & corrections",
        desc: "Pratique immédiate, corrections pas à pas.",
        color: "accent",
        iconLib: "lucide",
        iconName: "Activity",
    },
    {
        title: "Suivi de progression",
        desc: "Objectifs, badges et analytics.",
        color: "success",
        iconLib: "lucide",
        iconName: "TrendingUp",
    },
    {
        title: "Multilingue",
        desc: "FR/AR d’abord, EN ensuite.",
        color: "muted-foreground",
        iconLib: "lucide",
        iconName: "Earth",
    },
    {
        title: "Interactive Learning",
        desc: "Learn with our interactive learning platform",
        color: "primary",
        iconLib: "lucide",
        iconName: "Earth",
    },
    {
        title: "Comprehensive Courses",
        desc: "Access a wide range of courses from our library designed by industry experts",
        color: "orange",
        iconLib: "lucide",
        iconName: "Earth",
    },
    {
        title: "Engaging Learning",
        desc: "Learn with our engaging learning platform",
        color: "primary",
        iconLib: "fa",
        iconName: "FaReact",
    },
    {
        title: "High Quality Content !!!!",
        desc: "Learn with our high quality content",
        color: "destructive",
        iconLib: "lucide",
        iconName: "ChevronsRight",
    },
    {
        title: "Progress Tracking",
        desc: "Monitor your progress and achievements on detail with our progress tracking system and personalized dashboard",
        color: "muted-foreground",
        iconLib: "lucide",
        iconName: "Earth",
    }
];

async function main() {
    console.log("🌱 Seeding features...");
    for (const feature of FEATURES) {
        await prisma.feature.upsert({
            where: { title: feature.title },
            update: {},
            create: feature,
        });
    }
    console.log("✅ Seeding done.");
}

main()
    .then(() => {
        console.log('✅ Seeding complete');
        return prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        return prisma.$disconnect().then(() => process.exit(1));
    });
