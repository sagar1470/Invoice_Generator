
import { ProtectedPage } from "@/components/CheckAuth";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./_component/DashSidebar";
import UserProfileDropdownPage from "./_component/UserProfileDrop";
import DashboardHeaderPage from "./_component/DashboardHeader";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <SidebarProvider >
            {/* {sidebar} */}
            <DashboardSidebar>
                <UserProfileDropdownPage
                    isArrowUp
                    isFullName
                />
            </DashboardSidebar>
            <main className="w-full relative ">
                <DashboardHeaderPage />
                <Suspense fallback={<p>Loading...</p>}>
                    {children}
                </Suspense>
                <ProtectedPage />
            </main>
        </SidebarProvider>
    )
}