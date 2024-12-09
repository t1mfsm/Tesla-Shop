import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {T_LoginCredentials, T_RegisterCredentials, T_User} from "src/utils/types.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AxiosResponse} from "axios";
import { api } from "../api";
import { useSelector } from 'react-redux';
import { RootState } from "../../self/src-self/store";
import { T_UpdateUserData } from "../utils/types";
import { getCsrfToken } from "../utils/token";





const initialState: T_User = {
	id: -1,
	email: "",
    password:"",
	is_authenticated: false,
    validation_error: false,
    validation_success: false,
    checked: false,
    is_staff: false
}

export const handleCheck = createAsyncThunk<T_User, void, { rejectValue: string }>(
    'user/check',
    async () => {

        const response = await api.login.loginCreate({}) as AxiosResponse<T_User>;
        return response.data;
    }
  );

export const handleLogin = createAsyncThunk<T_User, object, AsyncThunkConfig>(
    "login",
    async function({ email, password }: T_LoginCredentials) {



        const response = await api.login.loginCreate(
            {
                email,
                password
            },
          
        ) as AxiosResponse<T_User>;
        console.log('uefsdrfh', response.data.user)


        return response.data.user;
    }
);

export const handleRegister = createAsyncThunk<T_User, object, AsyncThunkConfig>(
    "register",
    async function({email, password}:T_RegisterCredentials) {
        const response = await api.users.usersAuthCreate({
            email,
            password
        }) as AxiosResponse<T_User>

        console.log('useeeee', response.data)

        return response.data.user
    }
)

export const handleLogout = createAsyncThunk<void, object, AsyncThunkConfig>(
    "logout",
    async function() {
        await api.user.userLogoutCreate()

    }
)


export function updateUserInLocalStorage(updatedUserData: T_UpdateUserData) {
    // Получаем данные пользователя из localStorage
    const storedUser = localStorage.getItem('user');

    // Если пользователь есть в localStorage
    if (storedUser) {
        // Парсим данные пользователя
        const user: T_User = JSON.parse(storedUser);

    
        user.email = updatedUserData.email || user.email;
        user.password = updatedUserData.password || user.password;

        // Перезаписываем данные пользователя в localStorage
        localStorage.setItem('user', JSON.stringify(user));
        console.log('local', localStorage.getItem('user'));
        
    } else {
        console.error("Пользователь не найден в localStorage.");
    }
}


export const handleUpdateProfile = createAsyncThunk<T_User, object, AsyncThunkConfig>(
    "updateProfile",
    async function(userData:T_RegisterCredentials, thunkAPI) {
        const state = thunkAPI.getState()
        const {email,password} = userData

        const response = await api.users.usersProfile( {
            email,
            password
        }) as AxiosResponse<T_User>

        return response.data
    }
)


const userlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {
        setValidationError: (state, action) => {
            state.validation_error = action.payload
        }
	},
    extraReducers: (builder) => {
        builder.addCase(handleLogin.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.is_authenticated = true
            state.id = action.payload.id
            state.email = action.payload.email
            state.password = action.payload.password
            state.is_staff= action.payload.is_staff
        });
        builder.addCase(handleRegister.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.is_authenticated = true
            state.id = action.payload.id
            state.email = action.payload.email
            state.password = action.payload.password
            
         
        });
        builder.addCase(handleLogout.fulfilled, (state:T_User) => {
            state.is_authenticated = false
            state.id = -1
            state.email = ""
            state.password = ""
            state.validation_error = false
        });
        builder.addCase(handleCheck.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.is_authenticated = true
            state.id = action.payload.id
            state.email = action.payload.email
            state.password = action.payload.password
            state.checked = true
        });
        builder.addCase(handleCheck.rejected, (state:T_User) => {
            state.is_authenticated = false
            state.id = -1
            state.email = ""
            state.password = ""
            state.validation_error = false
            state.checked = true
        });
        builder.addCase(handleUpdateProfile.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.id = action.payload.id
            state.email = action.payload.email
            state.password = action.payload.password
            state.validation_error = false
            state.validation_success = true
        });
        builder.addCase(handleUpdateProfile.rejected, (state:T_User) => {
            state.validation_error = true
            state.validation_success = false
        });
    }
})




export const {setValidationError} = userlice.actions

export default userlice.reducer