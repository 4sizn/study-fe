import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, StorageService } from '../../../shared/lib';
import { ENDPOINTS, STORAGE_KEYS } from '../../../shared/config';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User, 
  ApiResponse 
} from '../../../shared/types';

export class AuthService {
  private static instance: AuthService;
  private httpClient: HttpClient;
  private storageService: StorageService;
  private currentUserSubject: BehaviorSubject<User | null>;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;

  private constructor() {
    this.httpClient = HttpClient.getInstance();
    this.storageService = StorageService.getInstance();
    
    const savedUser = this.storageService.getItem<User>(STORAGE_KEYS.USER);
    const hasToken = this.storageService.hasItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    this.currentUserSubject = new BehaviorSubject<User | null>(savedUser);
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(hasToken);
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  public get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  public login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.httpClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.LOGIN, credentials).pipe(
      map((response) => response.data),
      tap((authResponse) => {
        this.setAuthData(authResponse);
      }),
      catchError((error) => {
        this.logout();
        throw error;
      })
    );
  }

  public register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.httpClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.REGISTER, userData).pipe(
      map((response) => response.data),
      tap((authResponse) => {
        this.setAuthData(authResponse);
      }),
      catchError((error) => {
        this.logout();
        throw error;
      })
    );
  }

  public logout(): void {
    this.storageService.clear();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  public refreshToken(): Observable<AuthResponse> {
    return this.httpClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH.REFRESH).pipe(
      map((response) => response.data),
      tap((authResponse) => {
        this.setAuthData(authResponse);
      }),
      catchError((error) => {
        this.logout();
        throw error;
      })
    );
  }

  public checkAuthStatus(): Observable<boolean> {
    if (!this.storageService.hasItem(STORAGE_KEYS.ACCESS_TOKEN)) {
      this.logout();
      return of(false);
    }

    return this.refreshToken().pipe(
      map(() => true),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  private setAuthData(authResponse: AuthResponse): void {
    this.storageService.setItem(STORAGE_KEYS.ACCESS_TOKEN, authResponse.accessToken);
    this.storageService.setItem(STORAGE_KEYS.USER, authResponse.user);
    
    this.currentUserSubject.next(authResponse.user);
    this.isAuthenticatedSubject.next(true);
  }
}