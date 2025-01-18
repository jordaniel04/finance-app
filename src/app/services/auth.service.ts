import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { from, throwError } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly allowedEmails = [
    'jordaniel04@gmail.com',
    'becerrasotoleydivanesa@gmail.com'
  ];

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

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap(credential => {
        const email = credential.user.email;
        if (!email || !this.allowedEmails.includes(email.toLowerCase())) {
          return throwError(() => new Error('Usuario no autorizado'));
        }
        return from(Promise.resolve(credential));
      }),
      tap(() => this.router.navigate(['/dashboard']))
    );
  }

  register(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }

  logout() {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        localStorage.clear();
        window.location.href = '/auth/login';
      })
    );
  }
}
