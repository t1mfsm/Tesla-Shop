import { combineReducers, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import detailsReducer from './slices/detailsSlice';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux"
import userReducer from "./slices/userSlice.ts"



const persistConfig = {
    key: 'auth',
    storage,
    whitelist: ['id', "email"]
}

export const store = configureStore({
    reducer: {
        user: persistReducer(persistConfig, userReducer),

        details: detailsReducer,
        // selfEmployed: selfEmployedReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunkDispatch = ThunkDispatch<RootState, never, never>

export const persister = persistStore(store)

export const useAppDispatch = () => useDispatch<AppDispatch>(); 
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
