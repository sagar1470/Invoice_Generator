"use client"
import Logo from "@/components/Logo";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BookAIcon, LayoutDashboardIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function DashboardSidebar({children} : {children : React.ReactNode}) {
     const pathname = usePathname()
    return (

        <Sidebar>
            <SidebarHeader className="p-4">
                <Logo />
            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarMenu>
                    <SidebarMenuItem>

                        <SidebarMenuButton asChild>
                            <Link href={"/dashboard"} className={cn(pathname === "/dashboard" && "bg-purple-100" )}>
                                <LayoutDashboardIcon/>
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={"/invoice"} className={cn(pathname === "/invoice" && "bg-purple-100" )}>
                                <BookAIcon/>
                                <span>Invoice</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={"/settings"} className={cn(pathname === "/settings" && "bg-purple-100" )}>
                                <SettingsIcon/>
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
      
                </SidebarMenu>

                {children}
            </SidebarFooter>
        </Sidebar>
    )
}