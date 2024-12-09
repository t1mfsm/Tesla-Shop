import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { T_Detail, T_DetailsListResponse } from '../utils/types';
import { api } from '../api';
import { AxiosResponse } from 'axios';
import { saveCarOrder } from './carOrder';



interface T_DetailsSlice {
    details: T_Detail[];
    selectedDetail: null | T_Detail
    title?: string;
    new_detail: boolean;

}

const initialState: T_DetailsSlice = {
    details: [],
    title: '',
    selectedDetail: null,
    new_detail:false
};





export const fetchDetails = createAsyncThunk<T_Detail[], void, { state: RootState }>(
    'fetch_details',
    async function (_, thunkAPI) {
        const state = thunkAPI.getState(); // Получаем состояние из Redux
        console.log("Current state:", state); 
        console.log("Current state title:", state.details.title); // Логируем значение title

        try {
            // Передаем параметр `name` в запрос API
            const response = await api.api.apiDetailsList({
                name: state.details.title,  // Параметр name будет передан из состояния Redux
            }) as AxiosResponse<T_DetailsListResponse>;


            
            thunkAPI.dispatch(saveCarOrder({
                car_order_id: response.data.car_order_id,
                count_details: response.data.count_details
            }))

            console.log("Response data:", response.data); 
            console.log("rrrr:", response.data.car_order_id,response.data.count_details); 

            // Возвращаем данные, полученные от API
            return response.data.details;  
        } catch (error) {
            console.error("Error in fetchDetails:", error); 
            // В случае ошибки отклоняем запрос с сообщением об ошибке
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
        clearNewDetail(state){
            state.new_detail=false;
        }
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

export const {
    setTitle,
    setNewDetail,
    clearDetail,
    clearNewDetail


} = detailsSlice.actions;

export default detailsSlice.reducer;
