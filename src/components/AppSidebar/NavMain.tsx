import {SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem} from "../shadcn/sidebar";
import {ChangeEvent, useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import {Icon} from "../Icon";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "../shadcn/collapsible";
import {Separator} from "../shadcn/separator";
import {
    createRegexPattern,
    deleteRegexPattern,
    RegexPattern, regexPatternsSelector,
    selectRegexPatterns,
    updateRegexPattern
} from "@/lib/redux/features/regexPatterns/regexPatternsSlice";
import {useAppDispatch, useAppSelector} from "@/lib/redux/hooks";
import {Input} from "../shadcn/input";
import {Button} from "../shadcn/button";
import {Popover, PopoverContent, PopoverTrigger} from "../shadcn/popover";
import {
    approveDocument, Extraction,
    unapprovedDocumentSelector,
    unapprovedExtractionsSelector, updateExtractions
} from "../../lib/redux/features/documents/documentsSlice";
import {ExtractionCard} from "../ExtractionCard";
import {LOCAL_STORAGE_KEYS} from "../../registry/localStorageKeys";
import {ToggleGroup, ToggleGroupItem} from "../shadcn/toggle-group";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../shadcn/tooltip";
import {extractRegexMatches} from "../../lib/redux/utils";
import {faker} from "@faker-js/faker";

const RegexPatternItem = ({id, pattern, mode}: RegexPattern & {mode: Mode}) => {

    const [newPattern, setNewPattern] = useState(pattern);
    const [isEditMode, setIsEditMode] = useState(false);
    const dispatch = useAppDispatch()

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
                    <Button variant="outline" size="icon" disabled={mode === "approval"}>
                        <Icon name="EllipsisVertical"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                    <ul className="flex flex-col gap-2">
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

const AddNewRegexPatternItem = ({mode}: {mode: Mode}) => {

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

    useEffect(() => {
        if(mode === "approval") {
            setError(false)
            setPattern("")
        }
    }, [mode]);

    return (

        <div className="flex flex-col gap-1">
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Add new pattern..."
                    className={cn(error ? "border-red-500" : "")}
                    value={pattern}
                    onKeyDown={handleKeyDown}
                    disabled={mode === "approval"}
                    onChange={(e) => setPattern(e.target.value)}
                />
                {
                    !!pattern &&
                    <Button variant="outline" className="text-green-500" size="icon">
                        <Icon name="Plus"/>
                    </Button>
                }

            </div>
            {error ?
                <p className="text-red-500 text-xs font-semibold pl-2">please enter a valid regular expression</p> : ""}
        </div>
    )
}

const RegexPatternsSidebarSection = ({mode}: {mode: Mode}) => {

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
                        <AddNewRegexPatternItem mode={mode}/>
                        <CollapsibleContent className="flex flex-col gap-2">
                            {
                                regexPatterns.map( (regexPattern) => (
                                    <RegexPatternItem key={regexPattern.id} mode={mode} {...regexPattern} />
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

const ExtractionsSidebarSection = () => {

    const [isOpen, setIsOpen] = useState(true)

    const handleOpenClick = () => {
        setIsOpen((open) => !open)
    }

    const extractions = useAppSelector((store) => unapprovedExtractionsSelector(store))

    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                <div className="flex gap-2 items-center">
                    <Icon name="LetterText" />
                    <span>Extractions</span>
                </div>
            </SidebarGroupLabel>
            <SidebarMenu>
                <Collapsible asChild defaultOpen={true} open={isOpen}>
                    <SidebarMenuItem className="flex flex-col gap-2">
                        <CollapsibleContent className="flex flex-col gap-2">
                            {
                                extractions?.map( (extraction) => (
                                    <ExtractionCard key={extraction.id} {...extraction}/>
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

type Mode = "edit" | "approval"

export function NavMain() {

    const [mode, setMode] = useState<Mode>((localStorage.getItem(LOCAL_STORAGE_KEYS.MODE) ?? "approval") as Mode)
    const dispatch = useAppDispatch()
    const document = useAppSelector((store) => unapprovedDocumentSelector(store))
    const allPatterns = useAppSelector((store) => regexPatternsSelector(store))

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.MODE, mode)
    }, [mode]);

    const handleApproveDocument = () => {
        if(!document) return;
        dispatch(approveDocument(document?.id))
    }

    useEffect(() => {
        if(!document) return;
        dispatch(updateExtractions({
            id: document.id,
            extractions: allPatterns
                .map((regexPattern) => regexPattern.pattern)
                .flatMap((pattern) =>
                    extractRegexMatches(document.content, pattern)
                        .map((extraction) =>
                            ({content: extraction, id: faker.string.uuid(), approved: false} as Extraction)))}))
    }, [document?.id]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between">
                <TooltipProvider>
                <ToggleGroup type="single" value={mode}>
                    <Tooltip>
                    <ToggleGroupItem value="edit" aria-label="Toggle edit mode" onClick={() => setMode("edit")} asChild>
                        <TooltipTrigger>
                            <Icon name="Pencil"/>
                        </TooltipTrigger>
                    </ToggleGroupItem>
                    <TooltipContent>
                        Edit mode
                    </TooltipContent>
                </Tooltip>
                    <Tooltip>
                    <ToggleGroupItem value="approval" aria-label="Toggle approval mode" onClick={() => setMode("approval")} asChild>

                            <TooltipTrigger>
                                <Icon name="Check"/>
                            </TooltipTrigger>

                    </ToggleGroupItem>
                    <TooltipContent>
                        Approval
                    </TooltipContent>
                </Tooltip>
                </ToggleGroup>
                </TooltipProvider>
                {mode === "approval" &&
                    <Button variant="outline" className="text-green-500" onClick={handleApproveDocument}>
                        Approve
                    </Button>
                }

            </div>
            <RegexPatternsSidebarSection mode={mode}/>
            <ExtractionsSidebarSection/>

        </div>
    )
}