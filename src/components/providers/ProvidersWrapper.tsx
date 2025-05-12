import {FunctionComponent} from "react"
import SidebarProviderWrapper from "./SidebarProviderWrapper";

interface ProvidersWrapperProps {
    children: React.ReactNode;
}

const ProvidersWrapper: FunctionComponent<ProvidersWrapperProps> = ({children}) => {

    return (
        <SidebarProviderWrapper>
            {children}
        </SidebarProviderWrapper>
    );
};

export default ProvidersWrapper;