import {FunctionComponent} from "react"
import SidebarProvider from "./SidebarProvider";

interface ProvidersWrapperProps {
    children: React.ReactNode;
}

const ProvidersWrapper: FunctionComponent<ProvidersWrapperProps> = ({children}) => {

    return (
        <SidebarProvider>
            {children}
        </SidebarProvider>
    );
};

export default ProvidersWrapper;