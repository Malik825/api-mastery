import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './app/auth.interceptor';
import { importProvidersFrom } from '@angular/core';
import { provideToastr } from 'ngx-toastr';
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideToastr({
  positionClass: 'toast-bottom-right',
  timeOut: 3000,
  toastClass: 'ngx-toastr crazy-toast', // 👈 Add custom animation class
  progressBar: true,
  closeButton: true,
}),
    provideRouter(routes),    importProvidersFrom(HttpClientModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
});
