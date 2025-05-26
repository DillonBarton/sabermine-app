import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {faker} from "@faker-js/faker"
import {createAppSelector} from "../../utils";
import {RootState} from "../../store";

type document = {
    id: string;
    content: string;
    approved: boolean;
    extractions: Extraction[];
}

export type Extraction = {
    id: string;
    content: string;
    approved: boolean;
}


function getInitialState(): document[] {
    return Array.from({length: faker.number.int({min: 5, max: 9})}).map(() => {
        return {
            id: faker.string.uuid(),
            content: faker.lorem.paragraphs({min: 5, max: 10}),
            approved: false,
            extractions: []
        }
    })
}

const initialState: document[] = getInitialState()

const documentsSlice = createSlice({
    name: "documents",
    initialState,
    reducers: {
        updateExtractions: (state, action: PayloadAction<{id: document["id"], extractions: Extraction[] }>) => {
            const {id, extractions} = action.payload;
            return state.map((document) => document.id === id ? {...document, extractions} : document)
        },
        approveDocument: (state, action: PayloadAction<document["id"]>) => {
            return state
                .map((document) =>
                    document.id === action.payload ?
                        {...document,
                            approved: true,
                            extractions: document.extractions
                                .map((extraction) =>
                                    ({...extraction, approved: true}))}
                        :
                        document
                )
        },
    }
})

const selectUnapprovedDocument = (store: RootState): document | undefined => store.documents.filter(({approved}) => !approved)[0]
const unapprovedDocumentSelector = createAppSelector([selectUnapprovedDocument], (document) => document)
const unapprovedDocumentContentSelector = createAppSelector([selectUnapprovedDocument], (document) => document?.content)
const unapprovedExtractionsSelector = createAppSelector([selectUnapprovedDocument], (document) => document?.extractions)

export {selectUnapprovedDocument, unapprovedDocumentContentSelector, unapprovedExtractionsSelector, unapprovedDocumentSelector}
export const {updateExtractions, approveDocument} = documentsSlice.actions
export default documentsSlice.reducer
