"use client"

import * as React from "react"
import {
    IconDashboard, IconFileText,
    IconHelp, IconPlayerPlay,
    IconSearch,
    IconSettings,
} from "@tabler/icons-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import AppLogoShape from "@/components/custom-ui/AppLogoShape";
import AppLogoText from "@/components/custom-ui/AppLogoText";
import {RouteIcon} from "lucide-react";

const data = {

    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
        },
        {
            title: "My LEarning paths",
            url: "/dashboard/learning-paths",
            icon: RouteIcon,
        },
        {
            title: "My Courses",
            url: "/dashboard/courses",
            icon: IconPlayerPlay,
        },
        {
            title: "My Invoices",
            url: "/dashboard/invoices",
            icon: IconFileText,
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp,
        },
        {
            title: "Search",
            url: "#",
            icon: IconSearch,
        },
    ],
}

export function DashboardAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href="/" >
                                <AppLogoShape
                                    logo="/logo/code&skills-transparent.png"
                                    width={80}
                                    height={80}
                                    priority={ true}
                                />
                                <AppLogoText
                                    logo="/logo/CODE_SKILLS_cropped.png"
                                    alt="code and skills text"
                                    width={120}
                                    height={50}
                                    priority
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser  />
            </SidebarFooter>
        </Sidebar>
    )
}
