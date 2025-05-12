import {createSlice} from "@reduxjs/toolkit";
import {faker} from "@faker-js/faker"
import {createAppSelector} from "../../utils";
import {RootState} from "../../store";

type document = {
    content: string;
    approved: boolean;
}

function getInitialState(): document[] {
    return Array.from({length: faker.number.int({min: 5, max: 9})}).map(() => {
        return {
            content: faker.lorem.paragraphs({min: 1, max: 4}),
            approved: false
        }
    })
}

const initialState: document[] = getInitialState()

const documentsSlice = createSlice({
    name: "documents",
    initialState,
    reducers: {

    }
})

const selectApprovedDocuments = (store: RootState)=> store.documents.filter(({approved}) => !approved)
const approvedDocumentsSelector = createAppSelector([selectApprovedDocuments], (documents) => documents)


export {selectApprovedDocuments, approvedDocumentsSelector}
export default documentsSlice.reducer