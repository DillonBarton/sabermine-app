import {createSelector} from "reselect";
import {RootState} from "./store";

export const createAppSelector = createSelector.withTypes<RootState>()