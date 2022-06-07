import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import { 
    getAllLedgersByEmail, 
    createLedger,
    loginLedger,
    updateLedger
} from "../services/reduxServices";

const initialState = {
    ledger: null,
}

export const getUserLedgers = createAsyncThunk('GET_LEDGER', getAllLedgersByEmail)
export const saveLedger = createAsyncThunk('SAVE_LEDGER', createLedger)
export const updateLedgerData = createAsyncThunk('UPDATE_LEDGER', updateLedger)
export const logLedger = createAsyncThunk('LOGIN_LEDGER', loginLedger)

const movementReducer = createReducer(initialState, {
  [getUserLedgers.fulfilled]: (state, action) => action.payload,
  [saveLedger.fulfilled]: (state, action) => action.payload,
  [updateLedgerData.fulfilled]: (state, action) => action.payload,
  [logLedger.fulfilled]: (state, action) => action.payload
});

export default movementReducer;