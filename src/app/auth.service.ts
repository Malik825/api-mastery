import { Injectable } from "@angular/core";

// src/app/core/services/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';

  login(email: string, password: string): boolean {
    if (email && password) {
      const mockToken = 'mocked-jwt-token';
      localStorage.setItem(this.TOKEN_KEY, mockToken);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
