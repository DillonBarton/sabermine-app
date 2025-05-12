import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import {faker} from "@faker-js/faker"
import {RootState} from "../../store";
import {createAppSelector} from "../../utils";


export type CreateRegexPatternPayload = Pick<RegexPattern, "pattern"> & {extractions?: Extraction[]}
export type UpdateRegexPatternPayload = Pick<RegexPattern, "id" | "pattern">

export type RegexPattern = {
    id: string;
    pattern: string;
    extractions: Extraction[];
    active: boolean;
}

export type Extraction = {
    id: string;
    content: string;
    approved: boolean;
}

const initialState: RegexPattern[] = []

const regexPatternsSlice = createSlice({
    name: 'regexPatterns',
    initialState,
    reducers: {
        createRegexPattern(state, action: PayloadAction<CreateRegexPatternPayload>) {
            const {pattern, extractions} = action.payload;
            state.push({pattern, active: true, id: faker.string.uuid(), extractions: extractions ?? []});
        },
        toggleRegexPattern(state, action: PayloadAction<RegexPattern["id"]>) {
            return state.map((pattern) =>
                pattern.id === action.payload ? {...pattern, active: !pattern.active} : pattern)
        },
        updateRegexPattern(state, action: PayloadAction<UpdateRegexPatternPayload>) {
            const {pattern: newPattern, id} = action.payload;
            return state.map((pattern) =>
                pattern.id === id ? {...pattern, pattern: newPattern} : pattern)
        },
        deleteRegexPattern(state, action: PayloadAction<RegexPattern["id"]>) {
            return state.filter((pattern) => pattern.id !== action.payload)
        },

        updateExtractions(state, action: PayloadAction<Pick<RegexPattern, "id" | "extractions">>) {
            const {extractions, id} = action.payload;
            return state.map((pattern) =>
                pattern.id === id ? {...pattern, extractions} : pattern)
        }
    }
})


const selectRegexPatterns = (store: RootState) => store.regexPatterns

const selectActiveRegexPatterns = (store: RootState) => store.regexPatterns.filter(pattern => pattern.active)


const activeRegexPatternsUnapprovedExtractionsSelector =
    createAppSelector(
        [selectActiveRegexPatterns],
        (patterns) =>
            patterns
                .flatMap(({extractions, pattern}) => extractions.map((extraction) => ({...extraction, pattern} as Extraction & {pattern: RegexPattern["pattern"]})))
                .filter((extraction) => !extraction.approved))


export {selectRegexPatterns, selectActiveRegexPatterns, activeRegexPatternsUnapprovedExtractionsSelector}
export const {createRegexPattern, toggleRegexPattern, deleteRegexPattern, updateRegexPattern, updateExtractions} = regexPatternsSlice.actions
export default regexPatternsSlice.reducer