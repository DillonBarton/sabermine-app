import {FunctionComponent} from "react"
import SidebarProviderWrapper from "./SidebarProviderWrapper";
import StoreProvider from "./StoreProvider";

interface ProvidersWrapperProps {
    children: React.ReactNode;
}

const ProvidersWrapper: FunctionComponent<ProvidersWrapperProps> = ({children}) => {

    return (
        <StoreProvider>
            <SidebarProviderWrapper>
                {children}
            </SidebarProviderWrapper>
        </StoreProvider>
    );
};

export default ProvidersWrapper;