import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import { 
    loginUser, 
    googleLogin,
    registerUser, 
    setUserVoid, 
} from "../services/reduxServices";

const initialState = {
    user: null,
}

export const logIn = createAsyncThunk('LOGIN_USER', loginUser)
export const googleAuth = createAsyncThunk('GOOGLE_LOGIN', googleLogin)
export const createUser = createAsyncThunk('CREATE_USER', registerUser)
export const logOut = createAsyncThunk('LOGOUT_USER', setUserVoid)

const userReducer = createReducer(initialState, {
  [logIn.fulfilled]: (state, action) => action.payload,
  [googleAuth.fulfilled]: (state, action) => action.payload,
  [createUser.fulfilled]: (state, action) => action.payload,
  [logOut.fulfilled]: (state, action) => action.payload,
});

export default userReducer;