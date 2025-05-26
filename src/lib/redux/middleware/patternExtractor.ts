import {Middleware} from "@reduxjs/toolkit";
import {
    createRegexPattern,
    CreateRegexPatternPayload,
    deleteRegexPattern,
    RegexPattern,
    updateRegexPattern,
    UpdateRegexPatternPayload,
} from "@/lib/redux/features/regexPatterns/regexPatternsSlice";
import {RootState} from "../store";
import {faker} from "@faker-js/faker";
import {Extraction, updateExtractions} from "../features/documents/documentsSlice";
import {extractRegexMatches} from "../utils";

export const patternExtractor: Middleware<unknown, RootState> = store => next => action => {

    if(action && typeof action === "object" && "type" in action && typeof action.type === "string") {
        const state = store.getState();
        const doc = state.documents.find((document) => !document.approved);
        if(!doc) return next(action);
        switch (action.type as string) {
            case createRegexPattern.type:
                const createAction = action as { type: typeof createRegexPattern.type, payload: CreateRegexPatternPayload }
                const patternsForCreate = state.regexPatterns.map((regexPattern) => regexPattern.pattern).concat(createAction.payload.pattern)
                store.dispatch(updateExtractions({
                    id: doc.id,
                    extractions: patternsForCreate.flatMap((pattern) => extractRegexMatches(doc.content, pattern).map((extraction) =>
                        ({content: extraction, id: faker.string.uuid(), approved: false} as Extraction)))}))
                return next(createAction)

            case updateRegexPattern.type:
                const updateAction = action as { type: typeof updateExtractions.type, payload: UpdateRegexPatternPayload }
                const patternsForUpdate = state.regexPatterns.map((regexPattern) => regexPattern.pattern).concat(updateAction.payload.pattern)
                store.dispatch(updateExtractions({
                    id: doc.id,
                    extractions: patternsForUpdate.flatMap((pattern) => extractRegexMatches(doc.content, pattern).map((extraction) =>
                        ({content: extraction, id: faker.string.uuid(), approved: false} as Extraction)))}))
                return next(updateAction)

            case deleteRegexPattern.type:
                const deleteAction = action as { type: typeof deleteRegexPattern.type, payload: RegexPattern["id"] }
                const patternsForDelete = state.regexPatterns
                    .filter((regexPattern) => regexPattern.id !== deleteAction.payload)
                    .map((regexPattern) => regexPattern.pattern)
                store.dispatch(updateExtractions({
                    id: doc.id,
                    extractions: patternsForDelete.flatMap((pattern) => extractRegexMatches(doc.content, pattern).map((extraction) =>
                        ({content: extraction, id: faker.string.uuid(), approved: false} as Extraction)))}))
                return next(deleteAction)
        }
    }

    return next(action);
};