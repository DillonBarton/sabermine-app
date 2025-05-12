import {SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem} from "../shadcn/sidebar";
import {useState} from "react";
import {cn} from "../../lib/utils";
import {Icon} from "../Icon";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "../shadcn/collapsible";
import {Separator} from "../shadcn/separator";

export function NavMainEdit() {

    const [isOpen, setIsOpen] = useState(true)

    const handleOpenClick = () => {
        setIsOpen((open) => !open)
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                <div className="flex gap-2 items-center">
                    <Icon name="Regex" />
                    <span>Regex Patterns</span>
                </div>
            </SidebarGroupLabel>
            <SidebarMenu>
                <Collapsible asChild defaultOpen={true} open={isOpen}>
                    <SidebarMenuItem className="flex flex-col gap-2">

                        <CollapsibleContent className="flex flex-col gap-2">
                        </CollapsibleContent>
                        <CollapsibleTrigger asChild>
                            <div className="w-full flex flex-col items-center pt-2">
                                <Icon name="ChevronDown" className={cn("transition-all", isOpen ? "" : "rotate-180")} onClick={handleOpenClick}/>
                                <Separator orientation="horizontal"/>
                            </div>
                        </CollapsibleTrigger>
                    </SidebarMenuItem>

                </Collapsible>
            </SidebarMenu>
        </SidebarGroup>
    )
}