import { cn } from "../lib/utils"
import dynamic from "next/dynamic"
import { ForwardedRef, Suspense } from "react"
import { Skeleton } from "./shadcn/skeleton"

export const ICON_SIZE = 16

export const ICON_SIZE_SMALL = 14

export const dynamicIcons = {
    Regex: dynamic(() => import("lucide-react").then((m) => ({ default: m.Regex }))),
    ChevronDown: dynamic(() => import("lucide-react").then((m) => ({ default: m.ChevronDown }))),
    Power: dynamic(() => import("lucide-react").then((m) => ({ default: m.Power }))),
    PowerOff: dynamic(() => import("lucide-react").then((m) => ({ default: m.PowerOff }))),
    EllipsisVertical: dynamic(() => import("lucide-react").then((m) => ({ default: m.EllipsisVertical }))),
    Trash2: dynamic(() => import("lucide-react").then((m) => ({ default: m.Trash2 }))),
    Pencil: dynamic(() => import("lucide-react").then((m) => ({ default: m.Pencil }))),
    PencilOff: dynamic(() => import("lucide-react").then((m) => ({ default: m.PencilOff }))),
    Check: dynamic(() => import("lucide-react").then((m) => ({ default: m.Check }))),
    LetterText: dynamic(() => import("lucide-react").then((m) => ({ default: m.LetterText }))),
    Plus: dynamic(() => import("lucide-react").then((m) => ({ default: m.Plus }))),

} as const

type KnownIcons = typeof dynamicIcons

export type KnownIcon = keyof KnownIcons

type LazyIconProps = React.ComponentProps<KnownIcons[KnownIcon]>

export type IconProps = Pick<LazyIconProps, "className" | "fill" | "stroke" | "strokeWidth" | "style" | "onClick"> & {
    name: KnownIcon
    size?: "default" | "small" | number
    ref?: ForwardedRef<SVGSVGElement>
}

export const Icon = ({ name, size = "default", ...rest }: IconProps) => {
    const KnownIcon = dynamicIcons[name]

    return (
        <Suspense
            fallback={
                <Skeleton
                    className={(() => {
                        switch (size) {
                            case "small": {
                                return cn("h-3 w-3")
                            }
                            case "default":
                            default: {
                                return cn("h-4 w-4")
                            }
                        }
                    })()}
                />
            }
        >
            <KnownIcon
                {...rest}
                size={(() => {
                    switch (size) {
                        case "small": {
                            return ICON_SIZE_SMALL
                        }
                        case "default": {
                            return ICON_SIZE
                        }
                        default: {
                            return size
                        }
                    }
                })()}
            />
        </Suspense>
    )
}