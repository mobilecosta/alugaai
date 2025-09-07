import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = environment.apiUrl;
  private readonly TOKEN_KEY = 'token';

  constructor(private router: Router, private http: HttpClient) {}

  isAuthenticated(): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.api}/usuario/verificar-sessao`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  buscarUsuario(email: string) {
    const headers = {
      'Content-Type': 'application/json',
    };
    return this.http.post(
      `${this.api}/usuario/buscar-usuario`,
      { email },
      { headers, withCredentials: true }
    );
  }

  logout() {
    this.http
      .post(`${this.api}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }
}
