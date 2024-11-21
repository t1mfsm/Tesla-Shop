import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface DetailsState {
    title?: string;
}

const initialState: DetailsState = {
    title: '',
};

const detailsSlice = createSlice({
    name: 'details',
    initialState,
    reducers: {
        setTitle(state: DetailsState, action: PayloadAction<string>) {
            state.title = action.payload;
        },
    },
});

export const useTitle = () => useSelector((state: RootState) => state.details.title);

export const {
    setTitle,
} = detailsSlice.actions;

export default detailsSlice.reducer;
