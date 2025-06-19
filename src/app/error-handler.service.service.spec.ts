import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService } from './error-handler.service.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle 404 error', (done) => {
    const error = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });

    service.handleError(error).subscribe({
      error: (err) => {
        expect(err.message).toBe('Resource not found.');
        done();
      }
    });
  });

  it('should handle 500 error', (done) => {
    const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });

    service.handleError(error).subscribe({
      error: (err) => {
        expect(err.message).toBe('Server error occurred.');
        done();
      }
    });
  });

 

  it('should handle client-side error', (done) => {
    const clientError = new Error('Client broke it');

    service.handleError(clientError).subscribe({
      error: (err) => {
        expect(err.message).toBe('Unexpected error occurred.');
        done();
      }
    });
  });

  it('should detect offline status', (done) => {
    spyOnProperty(navigator, 'onLine').and.returnValue(false);

    const error = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });

    service.handleError(error).subscribe({
      error: (err) => {
        expect(err.message).toBe('No Internet Connection.');
        done();
      }
    });
  });
});
