import { Injectable } from "@angular/core";
import { ApiService } from './core/services/api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';

  constructor(private apiService: ApiService) {}

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
    this.apiService.clearCache(); // ✅ Clear cache on logout
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
