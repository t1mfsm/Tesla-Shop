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
        start_date: '',
        end_date:''
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

// export const fetchAllCarOrder = createAsyncThunk<T_CarOrder[], void, { state: RootState }>(
//     "car-order/fetchAll",
//     async (_, thunkAPI) => {
//         const { filters } = thunkAPI.getState().CarOrder; // Извлекаем фильтры из состояния

//         console.log('get all', filters  );
//         const response = await api.CarOrder.CarOrderList({
//             status: filters.status,
//             start_date: filters.start_date,
//             end_date: filters.end_date
//         })
//         console.log('get all', response.data.car_order  );
        
//         return response.data.car_order ;
//     }
// );

// export const updateCarOrder = createAsyncThunk<void, { id: string, fio: string }, AsyncThunkConfig>(
//     "car-order/update_car-order",
//     async ({ id, fio }) => {
//       console.log('car_order_id in updateCarOrder', id);
//       const response = await api.CarOrder.CarOrderUpdateUpdate(id, {
//         fio: fio,
//       });
//       console.log('result update', response.data);
//     }
//   );






// export const deleteCarOrder = createAsyncThunk<void, string, AsyncThunkConfig>(
//     "car-order/delete_draft",
//     async (id) => {
//         await api.CarOrder.CarOrderDeleteDelete(id); 
    
//     }
//   );
  
  
// export const formCarOrder = createAsyncThunk<void, string, AsyncThunkConfig>(
//     "car-order/delete_draft",
//     async (id) => {
//          await api.CarOrder.CarOrderUpdateByCreatorUpdate(id); 
//     }
//   );
  
  
//   export const deleteActivityFromCarOrder = createAsyncThunk<
//   void, // возвращаемый тип
//   { car_order_id: string, activity_id: string }, // тип параметров
//   AsyncThunkConfig
// >(
//   'car-order/delete_activity',
//   async ({ car_order_id, activity_id }) => {
  

//     const response = await api.CarOrderActivities.CarOrderActivitiesDeleteDelete(
//         car_order_id, 
//         activity_id
//       );
      

    
//   }
// );



// export const updateImportance = createAsyncThunk< 
// void, // возвращаемый тип
// { car_order_id: string, activity_id: string, importance: boolean }, // тип параметров
// AsyncThunkConfig
// >(
// 'car-order/update_importance', // исправленный тип действия
// async ({ car_order_id, activity_id, importance }) => {
  
//   const data = { importance };

//   const response = await api.CarOrderActivities.CarOrderActivitiesActivityUpdateUpdate(
//     car_order_id, 
//     activity_id, 
//     data, // передаем объект данных
//   );

// }
// );


  
  




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
        // builder.addCase(fetchAllCarOrder.fulfilled, (state, action: PayloadAction<T_CarOrder[]>) => {
        //     state.car_order = action.payload;
        // });
    },
});


export const useCarOrderID= () => useSelector((state: RootState) => state.carOrder.car_order_id);
export const useDetailCount= () => useSelector((state: RootState) => state.carOrder.count_details);
export const { saveCarOrder, updateFilters } = CarOrderSlice.actions;

export default CarOrderSlice.reducer;
