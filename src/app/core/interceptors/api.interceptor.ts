import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Add Basic Auth credentials to every request
    const username = 'Admin';
    const password = 'Mouride@2024';
    const basicAuth = 'Basic ' + btoa(username + ':' + password);

    // Clone the request and add the authorization header
    const authReq = request.clone({
      setHeaders: {
        Authorization: basicAuth
      }
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur est survenue';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Erreur: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 0) {
            errorMessage = 'Impossible de communiquer avec le serveur';
          } else if (error.status === 404) {
            errorMessage = 'Ressource non trouvée';
          } else if (error.status === 400) {
            errorMessage = 'Données invalides';

            // Handle validation errors
            if (error.error && error.error.errors) {
              const validationErrors = error.error.errors;
              errorMessage = Object.keys(validationErrors)
                .map(key => `${key}: ${validationErrors[key]}`)
                .join(', ');
            }
          } else if (error.status === 401) {
            errorMessage = 'Non autorisé - Problème d\'authentification';
          } else if (error.status === 403) {
            errorMessage = 'Accès refusé - Vous n\'avez pas les permissions nécessaires';
          } else if (error.status >= 500) {
            errorMessage = 'Erreur serveur';
          }
        }

        this.snackBar.open(errorMessage, 'Fermer', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
