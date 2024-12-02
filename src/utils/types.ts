// export interface T_SelfEmployed {
//     self_employed:{
//       id: number;
//     user_username: string;
//     fio: string;
//     inn: string | null;
//     created_date: string;
//     modification_date: string;
//     completion_date: string | null;
//     moderator_username: string;
//     status: "draft" | "deleted" | "formed" | "completed" | "rejected";
//     }
//     activities: T_Activity_M[]
//   }




//   export interface T_Activity_M {
//     id: number;
//     title: string;
//     img_url: string;
//     importance:boolean
//   }
  

//   export type T_SelfEmployedFilters = {
//     start_date: string
//     end_date: string
//     status: string
// }
  
  export type T_Activities = {

    id: number;
    title: string;
    description: string;
    img_url: string;
    category: string;
    status: "active" | "deleted";
  }


  export interface T_Detail {
    id: number;
    name: string;
    part_number: string;
    price: string;
   
    model_info: string;
  
    year: number;
   
    model: string;
   
    article_number: string;
   
    brand: string;
   
    note: string | null;
    
    image: string;
  }
  
  




  export type T_DetailsListResponse = {
    details: T_Detail[],
    car_order_id: number | null,
    count_details: number
}






export type T_LoginCredentials = {
  email: string
  password: string
}

// Типы данных для обновления
export interface T_UpdateUserData {
  email: string
  password: string
}




export type T_RegisterCredentials = {
  email: string
  password: string
}


export type T_User = {
  id: number
  email: string
  password: string
  is_authenticated: boolean
  validation_error: boolean
  validation_success: boolean
  checked: boolean
}


