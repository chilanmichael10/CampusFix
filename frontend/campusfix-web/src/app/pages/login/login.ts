import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  email = '';
  password = '';

  loading = false;
  errorMessage = '';
  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage =
        'Ingresa tu correo electrónico y contraseña.';
      return;
    }

    this.loading = true;

    this.auth.login({
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        this.loading = false;

        if (error.status === 401) {
          this.errorMessage =
            'El correo o la contraseña no son correctos.';
        } else {
          this.errorMessage =
            'No se pudo conectar con CampusFix. Intenta nuevamente.';
        }
      }
    });
  }
}