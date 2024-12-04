import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { api } from '../api';
import { RootState } from '../store';
import { T_CarOrder, T_CarOrderFilters } from '../utils/types';
import { NEXT_YEAR, PREV_YEAR } from '../utils/consts';
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import { useSelector } from 'react-redux';

interface T_CarOrderSlice {
    car_order_id: number | null;
    count_details: number;
    car_order: T_CarOrder | null;
    car_orders: T_CarOrder[];
    filters: T_CarOrderFilters;
}

const initialState: T_CarOrderSlice = {
    car_order_id: null,
    car_order: null,
    count_details: 0,
    car_orders: [],
    filters: {
        status: 'draft',
        date_from: '',
        date_to:''
    },
};

export const fetchCarOrder = createAsyncThunk<T_CarOrder, string>(
    'car-order/id',
    async (car_order_id) => {
        const response = await api.carOrders.carOrdersRead(car_order_id) ;
        console.log('get car', response.data)
        return response.data;
    }
);

export const fetchCarOrders = createAsyncThunk<T_CarOrder[], void, { state: RootState }>(
    "car-order/fetchAll",
    async (_, thunkAPI) => {
      // Извлекаем фильтры из состояния
      const { filters } = thunkAPI.getState().carOrder;
  
      console.log('Фильтры для запроса:', filters);

      const query = {
        status: filters.status,
        date_from: filters.date_from,
        date_to: filters.date_to,
      };
      

      
  
      // Выполняем запрос с фильтрами
      const response = await api.carOrders.carOrdersList({
        query: query,  // или просто { query } — если ключ и переменная одинаковы
      });
  
      console.log('Ответ от API:', response.data);
  
      // Возвращаем данные ответа
      return response.data;
    }
  );
  

export const deleteCarOrder = createAsyncThunk<void, string, AsyncThunkConfig>(
    "car-order/delete_draft",
    async (id) => {
        await api.carOrders.carOrdersDelete(id); 
    
    }
  );
  
  
export const formCarOrder = createAsyncThunk<void, string, AsyncThunkConfig>(
    "car-order/form",
    async (id) => {
         await api.carOrders.carOrdersFormUpdate(id); 
    }
  );
  
  
  export const deleteDetailFromCarOrder = createAsyncThunk<
  void, // возвращаемый тип
  { car_order_id: string, product_id: string }, // тип параметров
  AsyncThunkConfig
>(
  'car-order/delete_activity',
  async ({ car_order_id, product_id }) => {
  

    const response = await api.carOrders.carOrdersDetailsDelete(
        car_order_id, 
        product_id
      );


      console.log('delete 1', response.data)

      

    
  }
);



export const updateQuantity = createAsyncThunk< 
void, // возвращаемый тип
{ car_order_id: string, product_id: string, quantity: number }, // тип параметров
AsyncThunkConfig
>(
'car-order/update_importance', // исправленный тип действия
async ({ car_order_id, product_id, quantity }) => {
  
  const data = { quantity };

  const response = await api.carOrders.carOrdersDetailsUpdate(
    car_order_id, 
    product_id, 
    data, // передаем объект данных
  );

}
);


  
  




const CarOrderSlice = createSlice({
    name: 'car_order',
    initialState,
    reducers: {
        saveCarOrder: (state, action: PayloadAction<{ car_order_id: number, count_details: number }>) => {
            state.car_order_id = action.payload.car_order_id;
            state.count_details = action.payload.count_details;
        },
        updateFilters: (state, action: PayloadAction<T_CarOrderFilters>) => {
            state.filters = action.payload; // Обновляем фильтры в состоянии
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCarOrder.fulfilled, (state, action: PayloadAction<T_CarOrder>) => {
            state.car_order = action.payload;
        });
        builder.addCase(fetchCarOrders.fulfilled, (state, action: PayloadAction<T_CarOrder[]>) => {
            state.car_orders = action.payload;
        });
    },
});


export const useCarOrderID= () => useSelector((state: RootState) => state.carOrder.car_order_id);
export const useDetailCount= () => useSelector((state: RootState) => state.carOrder.count_details);
export const { saveCarOrder, updateFilters } = CarOrderSlice.actions;

export default CarOrderSlice.reducer;
