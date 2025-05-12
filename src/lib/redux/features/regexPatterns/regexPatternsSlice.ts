import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import {faker} from "@faker-js/faker"
import {RootState} from "../../store";


export type RegexPattern = {
    id: string;
    pattern: string;
    active: boolean;
}

const initialState: RegexPattern[] = []

const regexPatternsSlice = createSlice({
    name: 'regexPatterns',
    initialState,
    reducers: {
        createRegexPattern(state, action: PayloadAction<Omit<RegexPattern, "id" | "active">>) {
            const {pattern} = action.payload;
            state.push({pattern, active: true, id: faker.string.uuid()})
        },
        toggleRegexPattern(state, action: PayloadAction<RegexPattern["id"]>) {
            return state.map((pattern) => pattern.id === action.payload ? {...pattern, active: !pattern.active} : pattern)
        },
        deleteRegexPattern(state, action: PayloadAction<RegexPattern["id"]>) {
            state = state.filter((pattern) => pattern.id !== action.payload)
        }
    }
})


const selectRegexPatterns = (store: RootState) => store.regexPatterns

const selectActiveRegexPatterns = (store: RootState) => store.regexPatterns.filter(pattern => pattern.active)

export {selectRegexPatterns, selectActiveRegexPatterns}
export const {createRegexPattern, toggleRegexPattern, deleteRegexPattern} = regexPatternsSlice.actions
export default regexPatternsSlice.reducer