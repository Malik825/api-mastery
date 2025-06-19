import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ApiService } from './core/services/api.service';

describe('AuthService', () => {
  let service: AuthService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['clearCache']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear(); // Clean up
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true and store token on successful login', () => {
    const result = service.login('test@example.com', 'password');
    expect(result).toBeTrue();
    expect(localStorage.getItem('authToken')).toBe('mocked-jwt-token');
  });

  it('should return false if login credentials are missing', () => {
    expect(service.login('', '')).toBeFalse();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('should remove token and clear cache on logout', () => {
    localStorage.setItem('authToken', 'mocked-jwt-token');
    service.logout();
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(apiServiceSpy.clearCache).toHaveBeenCalled();
  });

  it('should detect logged in user correctly', () => {
    localStorage.setItem('authToken', 'mocked-jwt-token');
    expect(service.isLoggedIn()).toBeTrue();
    localStorage.removeItem('authToken');
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should return token from localStorage', () => {
    localStorage.setItem('authToken', '12345');
    expect(service.getToken()).toBe('12345');
  });
});
