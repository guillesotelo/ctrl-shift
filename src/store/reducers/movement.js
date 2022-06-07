import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import { 
    getAllMovements, 
    createMovement, 
    deleteMovement
} from "../services/reduxServices";

const initialState = {
    movement: null,
}

export const getMovements = createAsyncThunk('GET_MOVEMENTS', getAllMovements)
export const saveMovement = createAsyncThunk('SAVE_MOVEMENT', createMovement)
export const removeMovement = createAsyncThunk('SAVE_MOVEMENT', deleteMovement)

const movementReducer = createReducer(initialState, {
  [getMovements.fulfilled]: (state, action) => action.payload,
  [saveMovement.fulfilled]: (state, action) => action.payload,
  [removeMovement.fulfilled]: (state, action) => action.payload
});

export default movementReducer;