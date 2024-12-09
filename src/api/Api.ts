/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Product {
  /** Id */
  id?: number;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name?: string;
  /**
   * Part number
   * @minLength 1
   * @maxLength 50
   */
  part_number?: string;
  /**
   * Price
   * @format decimal
   */
  price?: string;
  /**
   * Model info
   * @minLength 1
   * @maxLength 100
   */
  model_info?: string;
  /**
   * Year
   * @min 0
   * @max 2147483647
   */
  year?: number;
  /**
   * Model
   * @minLength 1
   * @maxLength 50
   */
  model?: string;
  /**
   * Article number
   * @minLength 1
   * @maxLength 50
   */
  article_number?: string;
  /**
   * Brand
   * @minLength 1
   * @maxLength 50
   */
  brand?: string;
  /** Note */
  note?: string | null;
  /**
   * Image
   * @maxLength 255
   */
  image?: string;
}

export interface OrderProduct {
  /** Id */
  id?: number;
  product: Product;
  /**
   * Quantity
   * @min 0
   * @max 2147483647
   */
  quantity: number;
}

export interface Order {
  /** Id */
  id?: number;
  /**
   * Order number
   * @maxLength 20
   */
  order_number?: string;
  /**
   * Creation date
   * @format date-time
   */
  creation_date?: string;
  /**
   * Order date
   * @format date-time
   */
  order_date: string;
  /**
   * Ship date
   * @format date-time
   */
  ship_date?: string | null;
  /**
   * Factory
   * @minLength 1
   * @maxLength 255
   */
  factory: string;
  /**
   * Total cost
   * @format decimal
   */
  total_cost?: string;
  /** Creator */
  creator: number;
  /** Moderator */
  moderator?: number | null;
  /** Status */
  status?: "draft" | "pending" | "shipped" | "delivered" | "cancelled";
  order_products?: OrderProduct[];
}

export interface User {
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 254
   */
  email: string;
  /**
   * Пароль
   * @minLength 1
   */
  password: string;
  /**
   * Is staff
   * @default false
   */
  is_staff?: boolean;
  /**
   * Is superuser
   * @default false
   */
  is_superuser?: boolean;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";
import { getCsrfToken } from "../utils/token";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
    this.instance.interceptors.request.use(
      (config) => {
        // Добавляем CSRF токен в заголовки
        const csrfToken = getCsrfToken();
        if (csrfToken) {
          config.headers = {
            ...config.headers,
            'X-CSRFToken': csrfToken,  // Добавляем CSRF токен
          };
        }

        
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags api
     * @name ApiDetailsList
     * @request GET:/api/details/
     * @secure
     */
    apiDetailsList: (
      query?: {
        /** Фильтр по title */
        name?: string;
      },
      params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/details/`,
        method: "GET",
        secure: true,
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiDetailsCreate
     * @request POST:/api/details/
     * @secure
     */
    apiDetailsCreate: (data: Product, params: RequestParams = {}) =>
      this.request<Product, any>({
        path: `/details/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiDetailsRead
     * @request GET:/api/details/{id}/
     * @secure
     */
    apiDetailsRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/details/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiDetailsCreate2
     * @request POST:/api/details/{id}/
     * @originalName apiDetailsCreate
     * @duplicate
     * @secure
     */
    apiDetailsCreate2: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/details/${id}/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiDetailsUpdate
     * @request PUT:/api/details/{id}/
     * @secure
     */
    apiDetailsUpdate: (id: string, data: Product, params: RequestParams = {}) =>
      this.request<Product, any>({
        path: `/api/details/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiDetailsDelete
     * @request DELETE:/api/details/{id}/
     * @secure
     */
    apiDetailsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/details/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  carOrders = {
    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersList
     * @request GET:/car_orders/
     * @secure
     */

    
    carOrdersList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/car_orders/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersRead
     * @request GET:/car_orders/{id}/
     * @secure
     */
    carOrdersRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/car_orders/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersUpdate
     * @request PUT:/car_orders/{id}/
     * @secure
     */
    carOrdersUpdate: (id: string, data: Order, params: RequestParams = {}) =>
      this.request<Order, any>({
        path: `/car_orders/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersDelete
     * @request DELETE:/car_orders/{id}/
     * @secure
     */
    carOrdersDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/car_orders/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersCompleteList
     * @request GET:/car_orders/{id}/complete/
     * @secure
     */
    carOrdersCompleteList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/car_orders/${id}/complete/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersCompleteUpdate
     * @request PUT:/car_orders/{id}/complete/
     * @secure
     */
    carOrdersCompleteUpdate: (id: string, data: Order, params: RequestParams = {}) =>
      this.request<Order, any>({
        path: `/car_orders/${id}/complete/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersCompleteDelete
     * @request DELETE:/car_orders/{id}/complete/
     * @secure
     */
    carOrdersCompleteDelete: (id: string,data: {
      status: "delivered" | "cancelled";
    }, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/car_orders/${id}/complete/`,
        method: "PUT",
        secure: true,
        body: data,
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersEditList
     * @request GET:/car_orders/{id}/edit/
     * @secure
     */
    carOrdersEditList: (id: string, params: RequestParams = {}) =>
      this.request<{
        status: "delivered" | "cancelled";
      }, any>({
        path: `/car_orders/${id}/edit/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersEditUpdate
     * @request PUT:/car_orders/{id}/edit/
     * @secure
     */
    carOrdersEditUpdate: (id: string, data: Order, params: RequestParams = {}) =>
      this.request<Order, any>({
        path: `/car_orders/${id}/edit/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersEditDelete
     * @request DELETE:/car_orders/{id}/edit/
     * @secure
     */
    carOrdersEditDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/car_orders/${id}/edit/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersFormList
     * @request GET:/car_orders/{id}/form/
     * @secure
     */
    carOrdersFormList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/car_orders/${id}/form/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersFormUpdate
     * @request PUT:/car_orders/{id}/form/
     * @secure
     */
    carOrdersFormUpdate: (id: string, params: RequestParams = {}) =>
      this.request<Order, any>({
        path: `/car_orders/${id}/form/`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersFormDelete
     * @request DELETE:/car_orders/{id}/form/
     * @secure
     */
    carOrdersFormDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/car_orders/${id}/form/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersDetailsUpdate
     * @request PUT:/car_orders/{order_id}/details/{product_id}/
     * @secure
     */
    carOrdersDetailsUpdate: (orderId: string, productId: string, data: OrderProduct, params: RequestParams = {}) =>
      this.request<OrderProduct, any>({
        path: `/car_orders/${orderId}/details/${productId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags car_orders
     * @name CarOrdersDetailsDelete
     * @request DELETE:/car_orders/{order_id}/details/{product_id}/
     * @secure
     */
    carOrdersDetailsDelete: (orderId: string, productId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/car_orders/${orderId}/details/${productId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  details = {
    /**
     * No description
     *
     * @tags details
     * @name DetailsDraftList
     * @request GET:/details/{id}/draft/
     * @secure
     */
    detailsDraftList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/details/${id}/draft/`,
        method: "GET",
        secure: true,
        ...params,
      }),
    detailsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/details/${id}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),


    detailsUpdate: (
      detailId: string,
      data: {
        name?: string;
        part_number?: string;
        price?: string;
        model_info?: string;
        year?: number;
        model?: string;
        article_number?: string;
        brand?: string;
        note?: string | null;
        image?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          name?: string;
          part_number?: string;
          price?: string;
          model_info?: string;
          year?: number;
          model?: string;
          article_number?: string;
          brand?: string;
          note?: string | null;
          image?: File;
        },
        any
      >({
        path: `/details/${detailId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),




    detailsCreate: (
      data: {
          name?: string;
          part_number?: string;
          price?: string;
          model_info?: string;
          year?: number;
          model?: string;
          article_number?: string;
          brand?: string;
          note?: string | null;
          image?: File;

      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          name?: string;
          part_number?: string;
          price?: string;
          model_info?: string;
          year?: number;
          model?: string;
          article_number?: string;
          brand?: string;
          note?: string | null;
          image?: File;
        },
        any
      >({
        path: `/details/create/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),


    /**
     * No description
     *
     * @tags details
     * @name DetailsDraftCreate
     * @request POST:/details/{id}/draft/
     * @secure
     */
    detailsDraftCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/details/${id}/draft/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags details
     * @name DetailsDraftUpdate
     * @request PUT:/details/{id}/draft/
     * @secure
     */
    detailsDraftUpdate: (id: string, data: Product, params: RequestParams = {}) =>
      this.request<Product, any>({
        path: `/details/${id}/draft/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags details
     * @name DetailsDraftDelete
     * @request DELETE:/details/{id}/draft/
     * @secure
     */
    detailsDraftDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/details/${id}/draft/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags details
     * @name DetailsImageList
     * @request GET:/details/{id}/image/
     * @secure
     */
    detailsImageList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/details/${id}/image/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags details
     * @name DetailsImageCreate
     * @request POST:/details/{id}/image/
     * @secure
     */
    detailsImageCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/details/${id}/image/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags details
     * @name DetailsImageUpdate
     * @request PUT:/details/{id}/image/
     * @secure
     */
    detailsImageUpdate: (id: string, data: Product, params: RequestParams = {}) =>
      this.request<Product, any>({
        path: `/details/${id}/image/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags details
     * @name DetailsImageDelete
     * @request DELETE:/details/{id}/image/
     * @secure
     */
    detailsImageDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/details/${id}/image/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  login = {
    /**
     * No description
     *
     * @tags login
     * @name LoginCreate
     * @request POST:/login/
     * @secure
     */
    loginCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/login/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags user
     * @name UserList
     * @request GET:/user/
     * @secure
     */
    userList: (params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/user/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCreate
     * @request POST:/user/
     * @secure
     */
    userCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserProfile
     * @request PUT:/user/profile/
     * @secure
     */
    userProfile: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/profile/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserRead
     * @request GET:/user/{id}/
     * @secure
     */
    userRead: (id: number, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserUpdate
     * @request PUT:/user/{id}/
     * @secure
     */
    userUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserPartialUpdate
     * @request PATCH:/user/{id}/
     * @secure
     */
    userPartialUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserDelete
     * @request DELETE:/user/{id}/
     * @secure
     */
    userDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

      userLogoutCreate: (params: RequestParams = {}) =>
        this.request<void, any>({
          path: `/logout/`,
          method: "POST",
          secure: true,
          ...params,
        }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersAuthCreate
     * @request POST:/users/auth/
     * @secure
     */
    usersAuthCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/auth/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersProfile
     * @request PUT:/users/profile/
     * @secure
     */
    usersProfile: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/profile/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
