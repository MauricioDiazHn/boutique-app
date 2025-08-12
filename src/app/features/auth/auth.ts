import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  hide = true;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      console.log('Invalid form');
      return;
    }

    try {
      const { email, password } = this.loginForm.value;
      console.log('Logging in with:', { email, password });
      await this.authService.login({ email: email!, pass: password! });
      // The onAuthStateChange listener in AuthService will handle the redirect via the guard
      // but we can navigate preemptively for a better user experience.
      this.router.navigate(['/sales']);
    } catch (error: any) {
      console.error('Login error:', error);
      this.snackBar.open(error.message || 'Error en el inicio de sesión', 'Cerrar', {
        duration: 3000,
      });
    }
  }
}
