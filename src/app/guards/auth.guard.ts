import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable, tap, map } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      tap((isAuth) => {
        if (!isAuth) this.router.navigate(['/login']);
      }),
      map((isAuth) => isAuth)
    );
  }
}
