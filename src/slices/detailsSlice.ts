import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { T_Detail, T_DetailsListResponse } from '../utils/types';
import { api } from '../api';
import { AxiosResponse } from 'axios';
import { saveCarOrder } from './carOrder';



interface T_DetailsSlice {
    details: T_Detail[];
    selectedDetail: null | T_Detail;
    title?: string;
    new_detail: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
        nextPage: string | null;
        prevPage: string | null;
    };
    filterByIndex: boolean;  // Состояние для фильтрации по индексу
}

const initialState: T_DetailsSlice = {
    details: [],
    title: '',
    selectedDetail: null,
    new_detail: false,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        nextPage: null,
        prevPage: null,
    },
    filterByIndex: false,  // Начальное значение фильтрации
};





// Функция для получения данных с пагинацией и фильтрацией по индексу
export const fetchDetails = createAsyncThunk<T_Detail[], void, { state: RootState }>(
    'fetch_details',
    async (_, thunkAPI) => {
      const state = thunkAPI.getState();



      const filterByIndex = state.details.filterByIndex; // Из состояния Redux получаем, нужно ли фильтровать по индексу
     
      const startTime = performance.now(); // Начало замера времени
  
      try {
    
        
        // Делаем запрос, добавляя фильтрацию по индексу
        const response = await api.api.apiDetailsList({
          name: state.details.title,
          page: state.details.pagination.currentPage,
          filterByIndex: filterByIndex ? 0 : 1,  // Передаем флаг фильтрации
        }) as AxiosResponse<T_DetailsListResponse>;

  
        const endTime = performance.now(); // Конец замера времени
        console.log(`Запрос выполнен за ${endTime - startTime} мс`); // Логируем время выполнения запроса
  
        // Диспатчим данные заказа
        thunkAPI.dispatch(saveCarOrder({
          car_order_id: response.data.results.car_order_id,
          count_details: response.data.results.count_details,
        }));
  
        // Обновляем состояние с деталями и пагинацией
        thunkAPI.dispatch(setPagination({
          currentPage: state.details.pagination.currentPage,
          totalPages: Math.ceil(response.data.count / 12), // Например, если 12 элементов на странице
          nextPage: response.data.next,
          prevPage: response.data.previous,
        }));
  
        return response.data.results.details;
      } catch (error) {
        console.error("Error in fetchDetails:", error);
        return thunkAPI.rejectWithValue(error);
      }
    }
  );
  

export const fetchDetail = createAsyncThunk<T_Detail, string, AsyncThunkConfig>(
    "fetch_detail",
    async (id, thunkAPI) => {
        try {
            const response: AxiosResponse<T_Detail | void> = await api.api.apiDetailsRead(id);
            return response.data as T_Detail;  
        } catch (error) {
            console.error('Error fetching detail:', error);
            return thunkAPI.rejectWithValue("detail not found");
        }
    }
)


export const AddToCarOrder = createAsyncThunk<void, string, AsyncThunkConfig>(
    "details/add",
    async function(id) {
        await api.details.detailsDraftCreate(id)
    }
)


export const deleteDetail = createAsyncThunk<void, string, AsyncThunkConfig>(
    "activities/delete",
    async function(id) {
        await api.details.detailsDelete(id)
    }
)



export const EditDetail = createAsyncThunk<void, { id: string, data: { 
    name: string;
    part_number: string;
    price: string;
    model_info: string;
    year: number;
    model: string;
    article_number: string;
    brand: string;
    note: string | null;
    image?: File; // image field is optional
  } }, AsyncThunkConfig>(
    "activities/update",
    async function({ id, data }) {
      const formData = new FormData();
      
      // Appending the fields to FormData
      formData.append('name', data.name);
      formData.append('part_number', data.part_number);
      formData.append('price', data.price);
      formData.append('model_info', data.model_info);
      formData.append('year', data.year.toString());  // Ensure year is a string
      formData.append('model', data.model);
      formData.append('article_number', data.article_number);
      formData.append('brand', data.brand);
      formData.append('note', data.note || ''); // Handle null values for note
  
      // If there is an image, append it to FormData
      if (data.image) {
        formData.append('image', data.image);
      }
  
      // Perform the update request
      await api.details.detailsUpdate(id, formData);
    }
  );
  

  export const AddDetail = createAsyncThunk<void, { data: { 
    name: string;
    part_number: string;
    price: string;
    model_info: string;
    year: number;
    model: string;
    article_number: string;
    brand: string;
    note: string | null;
    image?: File; // image is optional
  } }, AsyncThunkConfig>(
    "activities/add",
    async function({ data }) {
      const formData = new FormData();
      
      // Appending the fields to FormData
      formData.append('name', data.name);
      formData.append('part_number', data.part_number);
      formData.append('price', data.price);
      formData.append('model_info', data.model_info);
      formData.append('year', data.year.toString()); // Ensure year is a string
      formData.append('model', data.model);
      formData.append('article_number', data.article_number);
      formData.append('brand', data.brand);
      formData.append('note', data.note || ''); // Handle null values for note
  
      // If there is an image, append it to FormData
      if (data.image) {
        formData.append('image', data.image);
      }
  
      // Perform the create request
      await api.details.detailsCreate(formData);
    }
  );
  










const detailsSlice = createSlice({
    name: 'details',
    initialState,
    reducers: {
        setTitle(state: T_DetailsSlice, action: PayloadAction<string>) {
            state.title = action.payload;
        },
        setNewDetail(state, action: PayloadAction<boolean>) {
            state.new_detail = action.payload;
        },
        clearDetail(state){
            state.selectedDetail=null;
        },
        setFilterByIndex(state, action: PayloadAction<boolean>) {
            state.filterByIndex = action.payload;
        },
        clearNewDetail(state){
            state.new_detail=false;
        },
        setPagination(state, action: PayloadAction<{
            currentPage: number;
            totalPages: number;
            nextPage: string | null;
            prevPage: string | null;
        }>) {
            state.pagination = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDetails.fulfilled, (state:T_DetailsSlice, action: PayloadAction<T_Detail[]>) => {
            state.details = action.payload
        });
        builder.addCase(fetchDetail.fulfilled, (state:T_DetailsSlice, action: PayloadAction<T_Detail>) => {
            state.selectedDetail = action.payload
        });
       
    }
});

export const useTitle = () => useSelector((state: RootState) => state.details.title);
export const useDetails = () => useSelector((state: RootState) => state.details.details);
export const useDetail = () => useSelector((state: RootState) => state.details.selectedDetail);
export const usePagination = () => useSelector((state: RootState) => state.details.pagination);


export const {
    setTitle,
    setNewDetail,
    clearDetail,
    clearNewDetail,
    setFilterByIndex,  // Экспортируем action
    setPagination,


} = detailsSlice.actions;

export default detailsSlice.reducer;
