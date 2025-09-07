import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApartamentosService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarApartamentos(): Observable<any> {
    return this.http.get(`${this.api}/listar-apartamentos`);
  }
}
