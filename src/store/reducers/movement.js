import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import { 
    getAllMovements, 
    createMovement, 
} from "../services/reduxServices";

const initialState = {
    movement: null,
}

export const getMovements = createAsyncThunk('GET_MOVEMENT', getAllMovements)
export const saveMovement = createAsyncThunk('SAVE_MOVEMENT', createMovement)

const movementReducer = createReducer(initialState, {
  [getMovements.fulfilled]: (state, action) => action.payload,
  [saveMovement.fulfilled]: (state, action) => action.payload,
});

export default movementReducer;