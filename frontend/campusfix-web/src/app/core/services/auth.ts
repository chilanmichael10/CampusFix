import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: number;
  nombreCompleto: string;
  email: string;
  codigoInstitucional: string;
  roles: string[];
}

export interface LoginResponse {
  token: string;
  user: LoginUser;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5253/api/Auth';

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          localStorage.setItem('campusfix_token', response.token);
          localStorage.setItem(
            'campusfix_user',
            JSON.stringify(response.user)
          );
        })
      );
  }

  logout(): void {
    localStorage.removeItem('campusfix_token');
    localStorage.removeItem('campusfix_user');
  }

  getToken(): string | null {
    return localStorage.getItem('campusfix_token');
  }

  getUser(): LoginUser | null {
    const user = localStorage.getItem('campusfix_user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as LoginUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}