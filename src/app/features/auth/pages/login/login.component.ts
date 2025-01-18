import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string = '';

  constructor(private readonly authService: AuthService) {}

  onGoogleLogin() {
    this.authService.loginWithGoogle().subscribe({
      next: () => {
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error en login con Google', err);
        if (err.message === 'Usuario no autorizado') {
          this.errorMessage = 'No tienes autorización para acceder a esta aplicación';
        } else {
          this.errorMessage = 'Error al iniciar sesión con Google';
        }
      }
    });
  }
}
