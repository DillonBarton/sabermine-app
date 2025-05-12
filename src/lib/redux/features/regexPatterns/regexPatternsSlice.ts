import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {faker} from "@faker-js/faker"
import {RootState} from "../../store";
import {createAppSelector} from "../../utils";


export type CreateRegexPatternPayload = Pick<RegexPattern, "pattern">
export type UpdateRegexPatternPayload = Pick<RegexPattern, "id" | "pattern">

export type RegexPattern = {
    id: string;
    pattern: string;
}

const initialState: RegexPattern[] = []

const regexPatternsSlice = createSlice({
    name: 'regexPatterns',
    initialState,
    reducers: {
        createRegexPattern(state, action: PayloadAction<CreateRegexPatternPayload>) {
            const {pattern} = action.payload;
            state.push({pattern, id: faker.string.uuid()});
        },
        updateRegexPattern(state, action: PayloadAction<UpdateRegexPatternPayload>) {
            const {pattern: newPattern, id} = action.payload;
            return state.map((pattern) =>
                pattern.id === id ? {...pattern, pattern: newPattern} : pattern)
        },
        deleteRegexPattern(state, action: PayloadAction<RegexPattern["id"]>) {
            return state.filter((pattern) => pattern.id !== action.payload)
        },
    }
})

const selectRegexPatterns = (store: RootState) => store.regexPatterns
const regexPatternsSelector = createAppSelector([selectRegexPatterns], (regexPatterns) => regexPatterns)


export {selectRegexPatterns, regexPatternsSelector}
export const {createRegexPattern, deleteRegexPattern, updateRegexPattern} = regexPatternsSlice.actions
export default regexPatternsSlice.reducer