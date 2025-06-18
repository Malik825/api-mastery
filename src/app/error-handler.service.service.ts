import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      console.error('Server Error:', error);
      if (!navigator.onLine) {
        return throwError(() => new Error('No Internet Connection.'));
      }

      switch (error.status) {
        case 404:
          return throwError(() => new Error('Resource not found.'));
        case 500:
          return throwError(() => new Error('Server error occurred.'));
        default:
          return throwError(() => new Error(error.message || 'An error occurred.'));
      }
    } else {
      console.error('Client Error:', error);
      return throwError(() => new Error('Unexpected error occurred.'));
    }
  }
}
