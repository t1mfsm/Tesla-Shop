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
  
  export type  T_CarOrder={
    id: number;
    order_number: string;
    creation_date: string;
    order_date: string;
    ship_date: string | null;
    factory: string;
    total_cost: string;
    creator: number;
    moderator: number | null;
    status: "draft" | "pending" | "shipped" | "delivered" | "cancelled";
    order_products: OrderProduct[];
  }

  export type T_CarOrderFilters = {
    date_from: string
    date_to: string
    status: string
  }
  
  interface Product {
    id: number
    name: string;
    price: string;
    image: string;
  }
  
  interface OrderProduct {
    product: Product;
    quantity: number;
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


