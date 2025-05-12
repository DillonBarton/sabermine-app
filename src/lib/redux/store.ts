import {combineReducers, configureStore} from "@reduxjs/toolkit"
import documentsReducer from "./features/documents/documentsSlice"
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";
import regexPatternsReducer from "./features/regexPatterns/regexPatternsSlice"
import {patternExtractor} from "./middleware/patternExtractor";

const rootReducer = combineReducers({
    documents: documentsReducer,
    regexPatterns: regexPatternsReducer
})

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
    return configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }).concat(patternExtractor)
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"]
