import { buttonVariants} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface Feature {
    title: string;
    description: string;
    icon: string;
}

const features: Feature[] = [
    {
        title: "Interactive Learning",
        description: "Learn with our interactive learning platform",
        icon: '👍'
    },
    {
        title: "Comprehensive Courses",
        description: "Access a wide range of courses from our library designed by industry experts",
        icon: '📤'
    },
    {
        title: "Engaging Learning",
        description: "Learn with our engaging learning platform",
        icon: '😈'
    },
    {
        title: "High Quality Content",
        description: "Learn with our high quality content",
        icon: '🥗'
    },
    {
        title: "Progress Tracking",
        description: "Monitor your progress and achievements on detail with our progress tracking system and personalized dashboard",
        icon: '🍎'
    }
]

export default function Home() {

    return (
        <>
            <section className={"relative py-20"}>
                <div className={"flex flex-col items-center text-center space-y-8"}>
                    <Badge variant={"outline"}>
                        The Futur of Onlmien Education
                    </Badge>
                    <h1 className={"text-4xl md:text-6xl font-bold tracking-tight"}>Elevate your Learning
                        Experience</h1>
                    <p className={"max-w-[700px] text-muted-foreground md:text-xl"}>
                        Discover a new way to learn with our moder, interactive and engaging learning platform.
                        Access high quality content from our library of over 1000 courses any time, anywhere.
                    </p>
                    <div className={"flex flex-col sm:flex-row gap-4 mt-8"}>
                        <Link href={"/courses"}
                              className={buttonVariants({size: "lg"})}
                        >
                            Explore Courses
                        </Link>
                        <Link href={"/login"}
                              className={buttonVariants({size: "lg", variant: "outline"})}
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>
            <section className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 "}>
                {features.map((feature, index) => (
                    <Card key={index} className={"hover:shadow-lg transition-shadow"}>
                        <CardHeader>
                            <div className={"text-4xl  mb-4"}>{feature.icon}</div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className={"text-muted-foreground"}>
                            {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </>
    );
}
