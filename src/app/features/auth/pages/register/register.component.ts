import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { passwordMatchValidator } from '../../../../validators/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.authService.register(email, password).subscribe({
        next: () => {
          console.log('Registro exitoso');
          // El redireccionamiento lo maneja el servicio
        },
        error: (err) => {
          console.error('Error en registro', err);
          this.errorMessage = 'Error al registrarse';
        }
      });
    }
  }

  onGoogleRegister() {
    this.authService.loginWithGoogle().subscribe({
      next: () => {
        console.log('Registro con Google exitoso');
        // El redireccionamiento lo maneja el servicio
      },
      error: (err) => {
        console.error('Error en registro con Google', err);
        this.errorMessage = 'Error al registrarse con Google';
      }
    });
  }
}
