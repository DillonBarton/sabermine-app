import {createSlice} from "@reduxjs/toolkit";
import {faker} from "@faker-js/faker"

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


export default documentsSlice.reducer