"use client"

import {FunctionComponent} from "react"
import {SidebarInset, SidebarProvider} from "../shadcn/sidebar";
import {AppSidebar} from "../AppSidebar/AppSidebar";

interface SidebarProviderProps {
    children: React.ReactNode;
}

const SidebarProviderWrapper: FunctionComponent<SidebarProviderProps> = ({children}) => {

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default SidebarProviderWrapper;