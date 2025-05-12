import {FunctionComponent} from "react"
import {SidebarInset} from "../shadcn/sidebar";

interface SidebarProviderProps {
    children: React.ReactNode;
}

const SidebarProvider: FunctionComponent<SidebarProviderProps> = ({children}) => {

    return (
        <SidebarProvider>
            <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default SidebarProvider;