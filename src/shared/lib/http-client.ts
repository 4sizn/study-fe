import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { API_BASE_URL, STORAGE_KEYS } from '../config';

export class HttpClient {
  private static instance: HttpClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          sessionStorage.clear();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.get<T>(url, config)).pipe(
      map((response: AxiosResponse<T>) => response.data),
      retry(2),
      catchError((error) => {
        console.error('HTTP GET Error:', error);
        return throwError(() => error);
      })
    );
  }

  public post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.post<T>(url, data, config)).pipe(
      map((response: AxiosResponse<T>) => response.data),
      retry(1),
      catchError((error) => {
        console.error('HTTP POST Error:', error);
        return throwError(() => error);
      })
    );
  }

  public put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.put<T>(url, data, config)).pipe(
      map((response: AxiosResponse<T>) => response.data),
      retry(1),
      catchError((error) => {
        console.error('HTTP PUT Error:', error);
        return throwError(() => error);
      })
    );
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.delete<T>(url, config)).pipe(
      map((response: AxiosResponse<T>) => response.data),
      retry(1),
      catchError((error) => {
        console.error('HTTP DELETE Error:', error);
        return throwError(() => error);
      })
    );
  }
}

export const httpClient = HttpClient.getInstance();