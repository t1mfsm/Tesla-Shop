import { combineReducers, configureStore } from "@reduxjs/toolkit";

import detailsReducer from './slices/detailsSlice';


const rootReducer = combineReducers({

    details: detailsReducer,

});

const store = configureStore({
    reducer: rootReducer,
    
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;