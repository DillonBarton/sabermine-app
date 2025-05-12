import {createSelector} from "reselect";
import {RootState} from "./store";

export const createAppSelector = createSelector.withTypes<RootState>()

export function extractRegexMatches(input: string, patternString: string): string[] {
    let pattern = patternString;
    let flags = '';

    const match = patternString.match(/^\/(.+)\/([gimsuy]*)$/);
    if (match) {
        pattern = match[1];
        flags = match[2];
    }

    try {
        const regex = new RegExp(pattern, flags);
        if (flags.includes('g')) {
            return Array.from(input.matchAll(regex), m => m[0]);
        } else {
            const singleMatch = input.match(regex);
            return singleMatch ? [singleMatch[0]] : [];
        }
    } catch (e) {
        console.error(e)
        return [];
    }
}