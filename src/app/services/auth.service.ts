import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private readonly auth: Auth,
    private readonly router: Router
  ) {}

  getUser() {
    const user = this.auth.currentUser;
    return {
      firstName: user?.displayName?.split(' ')[0] ?? 'Usuario',
      lastName: user?.displayName?.split(' ')[1] ?? ''
    };
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password))
      .pipe(
        tap(() => this.router.navigate(['/dashboard']))
      );
  }

  register(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password))
      .pipe(
        tap(() => this.router.navigate(['/auth/login']))
      );
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider))
      .pipe(
        tap(() => this.router.navigate(['/dashboard']))
      );
  }
}
