import { configureStore } from "@reduxjs/toolkit"
import logger from 'redux-logger'
import movementReducer from "./reducers/movement"
import userReducer from "./reducers/user"

const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(logger),
    reducer: {
        user: userReducer,
        movement: movementReducer
    }
})

export default store