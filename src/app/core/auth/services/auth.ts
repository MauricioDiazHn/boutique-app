import { Injectable, inject } from '@angular/core';
import { AppStore, UserModel } from '../../state/app.store';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly store = inject(AppStore);

  // Mock login method
  login(credentials: {email: string, pass: string}): Observable<boolean> {
    // Simulate a real API call for the owner
    if (credentials.email === 'owner@boutique.com' && credentials.pass === 'password') {
      const mockUser: UserModel = { name: 'Shop Owner', role: 'dueña' };
      const mockToken = 'jwt-token-for-owner';

      return of(true).pipe(
        delay(1000), // Simulate network latency
        tap(() => this.store.loginSuccess({ user: mockUser, token: mockToken }))
      );
    }
    // Simulate a real API call for the employee
    else if (credentials.email === 'employee@boutique.com' && credentials.pass === 'password') {
      const mockUser: UserModel = { name: 'Shop Employee', role: 'empleada' };
      const mockToken = 'jwt-token-for-employee';

      return of(true).pipe(
        delay(1000),
        tap(() => this.store.loginSuccess({ user: mockUser, token: mockToken }))
      );
    }

    // If credentials don't match, return an error
    return throwError(() => new Error('Invalid credentials'));
  }

  // Logout method
  logout(): void {
    this.store.logout();
    // In a real app, you might also want to call a backend endpoint to invalidate the token
  }
}
