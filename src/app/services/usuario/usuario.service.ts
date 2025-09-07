import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  cadastrarUsuario(dados: any) {
    return this.http.post(`${this.api}/usuario/registrar`, dados, {
      withCredentials: true,
    });
  }

  logarUsuario(dados: any) {
    return this.http.post(`${this.api}/usuario/login`, dados, {
      withCredentials: true,
    });
  }

  atualizarUsuario(dados: any) {
    return this.http.post(`${this.api}/usuario/atualizar-usuario`, dados, {
      withCredentials: true,
    });
  }

  buscarUsuario(id: any) {
    return this.http.post(
      `${this.api}/usuario/encontrar-usuario-id`,
      { id },
      {
        withCredentials: true,
      }
    );
  }

  alterarSenha(dados: any) {
    return this.http.post(`${this.api}/usuario/alterar-senha`, dados, {
      withCredentials: true,
    });
  }

  logout() {
    return this.http.post(
      `${this.api}/usuario/logout`,
      {},
      { withCredentials: true }
    );
  }
}
