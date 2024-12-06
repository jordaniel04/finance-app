import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage: string = '';

  constructor(
    private readonly fb: FormBuilder, 
    private readonly authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (user) => {
          console.log('Login exitoso', user);
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error en login', error);
          console.log(error.code);
          switch(error.code) {
            case 'auth/invalid-login-credentials':
              this.errorMessage = 'Correo o contraseña incorrectos';
              break;
            case 'auth/wrong-password':
              this.errorMessage = 'Contraseña incorrecta';
              break;
            default:
              this.errorMessage = 'Error al iniciar sesión';
          }
        }
      });
    }
  }

  onGoogleLogin() {
    this.authService.loginWithGoogle().subscribe({
      next: (user) => console.log('Login con Google exitoso', user),
      error: (err) => console.error('Error en login con Google', err)
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
