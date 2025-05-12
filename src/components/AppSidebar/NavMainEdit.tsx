import {SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem} from "../shadcn/sidebar";
import {ChangeEvent, useState} from "react";
import {cn} from "@/lib/utils";
import {Icon} from "../Icon";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "../shadcn/collapsible";
import {Separator} from "../shadcn/separator";
import {
    activeRegexPatternsUnapprovedExtractionsSelector,
    createRegexPattern, deleteRegexPattern, Extraction,
    RegexPattern, selectActiveRegexPatterns,
    selectRegexPatterns, toggleRegexPattern,
    updateRegexPattern
} from "@/lib/redux/features/regexPatterns/regexPatternsSlice";
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";
import {Input} from "../shadcn/input";
import {Button} from "../shadcn/button";
import {Popover, PopoverContent, PopoverTrigger} from "../shadcn/popover";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../shadcn/card";

const RegexPatternItem = ({id, pattern, active}: RegexPattern) => {

    const [newPattern, setNewPattern] = useState(pattern);
    const [isEditMode, setIsEditMode] = useState(false);
    const dispatch = useAppDispatch()

    const handleToggleActive = () => {
        dispatch(toggleRegexPattern(id))
    }

    const handleEditToggle = () => {
        setIsEditMode((isEditMode) => !isEditMode)
        setNewPattern(pattern)
    }

    const handleDelete = () => {
        dispatch(deleteRegexPattern(id))
    }

    const handlePatternChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPattern(e.target.value)
    }

    const handleUpdatePattern = () => {
        dispatch(updateRegexPattern({id, pattern: newPattern}))
        setIsEditMode(false)
    }

    return (
        <div className="flex gap-1 items-center">
            <Input key={id} disabled={!isEditMode} type="text" placeholder="Pattern..." value={newPattern} onChange={handlePatternChange}/>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleToggleActive}>
                        <Icon name="EllipsisVertical"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                    <ul className="flex flex-col gap-2">
                        <li className="flex gap-2 items-center">
                            <Button variant="secondary" size="icon" onClick={handleToggleActive}>
                                {active ? <Icon name="Power" className="text-red-500"/> : <Icon name="PowerOff" className="text-gray-500"/>}
                            </Button>
                            <span className="text-sm font-semibold">{active ? "Disable" : "Enable"}</span>
                        </li>
                        <li className="flex gap-2 items-center">
                            <Button variant="secondary" size="icon" onClick={handleEditToggle}>
                                {isEditMode ? <Icon name="PencilOff"/> : <Icon name="Pencil"/>}
                            </Button>
                            <span className="text-sm font-semibold">Edit</span>
                        </li>
                        <li className="flex gap-2 items-center">
                            <Button variant="secondary" size="icon" onClick={handleDelete}>
                                <Icon name="Trash2" className="text-red-500"/>
                            </Button>
                            <span className="text-sm font-semibold">Delete</span>
                        </li>
                    </ul>
                </PopoverContent>
            </Popover>
            {newPattern !== pattern &&
            <Button variant="default" size="icon" onClick={handleUpdatePattern}>
                <Icon name="Check" className="text-green-500"/>
            </Button>}
        </div>

    )
}

const AddNewRegexPatternItem = () => {

    const [pattern, setPattern] = useState("");
    const [error, setError] = useState(false);
    const dispatch = useAppDispatch()

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if(e.key === "Enter") {
            try {
                new RegExp(pattern)
                dispatch(createRegexPattern({pattern: pattern}))
                setError(false)
                setPattern("")
            } catch (e) {
                console.error(e)
                setError(true)
            }
        }
    }

    return (
        <div className="flex flex-col gap-1">
            <Input
                type="text"
                placeholder="Add new pattern..."
                className={cn(error ? "border-red-500" : "")}
                value={pattern}
                onKeyDown={handleKeyDown}
                onChange={(e) => setPattern(e.target.value)}
            />
            {error ? <p className="text-red-500 text-xs font-semibold pl-2">please enter a valid regular expression</p> : ""}
        </div>
    )
}

const ExtractionPreview = ({content, approved, id, pattern}: Extraction & {pattern: RegexPattern["pattern"]}) => {

    return(
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-sm">
                    Extracted from: <span className="font-normal">{pattern}</span>
                </CardTitle>
                <CardDescription className="text-xs">{id}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm font-bold">
                {content}
            </CardContent>
        </Card>
    )
}

const RegexPatternsSidebarSection = () => {

    const [isOpen, setIsOpen] = useState(true)

    const handleOpenClick = () => {
        setIsOpen((open) => !open)
    }

    const regexPatterns = useAppSelector(selectRegexPatterns)

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
                        <AddNewRegexPatternItem/>
                        <CollapsibleContent className="flex flex-col gap-2">
                            {
                                regexPatterns.map( (regexPattern) => (
                                    <RegexPatternItem key={regexPattern.id} {...regexPattern} />
                                ))
                            }
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

const ExtractionsPreviewSidebarSection = () => {

    const [isOpen, setIsOpen] = useState(true)

    const handleOpenClick = () => {
        setIsOpen((open) => !open)
    }

    const extractions = useAppSelector((store) => activeRegexPatternsUnapprovedExtractionsSelector(store))

    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                <div className="flex gap-2 items-center">
                    <Icon name="LetterText" />
                    <span>Preview Extractions</span>
                </div>
            </SidebarGroupLabel>
            <SidebarMenu>
                <Collapsible asChild defaultOpen={true} open={isOpen}>
                    <SidebarMenuItem className="flex flex-col gap-2">
                        <CollapsibleContent className="flex flex-col gap-2">
                            {
                                extractions.map( (extraction) => (
                                    <ExtractionPreview key={extraction.id} {...extraction}/>
                                ))
                            }
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

export function NavMainEdit() {

    return (
        <div>
            <RegexPatternsSidebarSection/>
            <ExtractionsPreviewSidebarSection/>
        </div>
    )
}