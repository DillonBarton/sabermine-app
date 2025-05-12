import {combineReducers, configureStore} from "@reduxjs/toolkit"
import documentsReducer from "./features/documents/documentsSlice"

const rootReducer = combineReducers({
    documents: documentsReducer
})

export const makeStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]