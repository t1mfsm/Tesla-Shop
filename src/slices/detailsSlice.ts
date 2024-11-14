import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Описание состояния
interface DetailsState {
    title?: string;
}

// Начальное состояние с типом DetailsState
const initialState: DetailsState = {
    title: '',
};

// Создаем слайс с типизацией состояния
const detailsSlice = createSlice({
    name: 'details',
    initialState,
    reducers: {
        setTitle(state: DetailsState, action: PayloadAction<string>) {
            state.title = action.payload;
        },
        clearTitle(state: DetailsState) {
            state.title = '';
        },
    },
});

// Хук для получения title из состояния
export const useTitle = () => useSelector((state: RootState) => state.details.title);

// Экспортируем actions и reducer
export const {
    setTitle,
    clearTitle,
} = detailsSlice.actions;

export default detailsSlice.reducer;
