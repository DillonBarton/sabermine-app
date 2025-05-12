import { Middleware } from "@reduxjs/toolkit";
import {
    createRegexPattern,
    updateRegexPattern,
    updateExtractions,
    CreateRegexPatternPayload, Extraction, UpdateRegexPatternPayload,
} from "@/lib/redux/features/regexPatterns/regexPatternsSlice";
import {RootState} from "../store";
import {faker} from "@faker-js/faker";

function extractRegexMatches(input: string, patternString: string): string[] {
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

export const patternExtractor: Middleware<unknown, RootState> = store => next => action => {

    if(action && typeof action === "object" && "type" in action && typeof action.type === "string") {
        const state = store.getState();
        const firstDoc = state.documents[0];
        switch (action.type as string) {
            case createRegexPattern.type:
                const createAction = action as { type: typeof createRegexPattern.type, payload: CreateRegexPatternPayload }
                const createExtractions = extractRegexMatches(firstDoc.content, createAction.payload.pattern)
                createAction.payload.extractions = createExtractions.map((extraction) => ({content: extraction, id: faker.string.uuid(), approved: false} as Extraction));
                return next(createAction)

            case updateRegexPattern.type:
                const updateAction = action as { type: typeof updateExtractions.type, payload: UpdateRegexPatternPayload }
                const extractions = extractRegexMatches(firstDoc.content, updateAction.payload.pattern)
                store.dispatch(updateExtractions({
                    id: updateAction.payload.id,
                    extractions: extractions.map((extraction) =>
                        ({content: extraction, id: faker.string.uuid(), approved: false} as Extraction))
                }));
                return next(updateAction)
        }
    }

    return next(action);
};