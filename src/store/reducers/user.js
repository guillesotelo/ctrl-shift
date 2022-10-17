import { createReducer, createAsyncThunk } from "@reduxjs/toolkit"
import { 
    loginUser, 
    googleLogin,
    registerUser, 
    setUserVoid, 
    updateUser,
    resetPassord
} from "../services/reduxServices";

const initialState = {
    user: null,
}

export const logIn = createAsyncThunk('LOGIN_USER', loginUser)
export const googleAuth = createAsyncThunk('GOOGLE_LOGIN', googleLogin)
export const createUser = createAsyncThunk('CREATE_USER', registerUser)
export const logOut = createAsyncThunk('LOGOUT_USER', setUserVoid)
export const sendEmailResetPass = createAsyncThunk('SEND_EMAIL_RESET', resetPassord)
export const updateUserData = createAsyncThunk('UPDATE_USER', updateUser)

const userReducer = createReducer(initialState, {
  [logIn.fulfilled]: (state, action) => action.payload,
  [googleAuth.fulfilled]: (state, action) => action.payload,
  [createUser.fulfilled]: (state, action) => action.payload,
  [logOut.fulfilled]: (state, action) => action.payload,
  [sendEmailResetPass.fulfilled]: (state, action) => action.payload,
  [updateUserData.fulfilled]: (state, action) => action.payload
});

export default userReducer;