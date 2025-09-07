import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface CriarContratoResponse {
  url: string;
  message?: string;
  path?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MoradorService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  cadastrarImovel(dados: any) {
    return this.http.post(`${this.api}/imoveis/add`, dados, {
      withCredentials: true,
    });
  }

  cadastrarMorador(dados: any) {
    return this.http.post(`${this.api}/imoveis/add/morador`, dados, {
      withCredentials: true,
    });
  }

  criarContrato(dados: any) {
    return this.http.post<CriarContratoResponse>(
      `${this.api}/imoveis/criar/contrato`,
      dados,
      {
        withCredentials: true,
      }
    );
  }

  cadastrarUnidade(dados: any) {
    return this.http.post(`${this.api}/imoveis/add/unidade`, dados, {
      withCredentials: true,
    });
  }

  enviarBoleto(dados: any) {
    return this.http.post(`${this.api}/enviar-boleto`, dados);
  }

  listarApartamentos(): Observable<any> {
    return this.http.get(`${this.api}/listar-apartamentos`);
  }

  listarImoveis(): Observable<any> {
    return this.http.get(`${this.api}/imoveis/buscar`, {
      withCredentials: true,
    });
  }

  listarUnidades(imovelId: number): Observable<any> {
    return this.http.post(
      `${this.api}/imoveis/buscar/unidades`,
      { imovelId },
      { withCredentials: true }
    );
  }

  listarMorador(unidadeId: number, imovelId: number): Observable<any> {
    return this.http.post(
      `${this.api}/imoveis/buscar/unidades/morador`,
      { unidadeId, imovelId },
      { withCredentials: true }
    );
  }

  buscarMoradorporId(moradorId: number): Observable<any> {
    return this.http.get(
      `${this.api}/imoveis/buscar/unidades/morador/${moradorId}`,
      { withCredentials: true }
    );
  }

  listarPagamentos(moradorId: number): Observable<any> {
    return this.http.post(
      `${this.api}/pagamentos/buscar`,
      { moradorId },
      { withCredentials: true }
    );
  }

  listarTodosPagamentos(): Observable<any> {
    return this.http.get(`${this.api}/pagamentos/buscar/todos`, {
      withCredentials: true,
    });
  }

  registrarPagamento(dados: any): Observable<any> {
    return this.http.put(`${this.api}/pagamentos/registrar`, dados, {
      withCredentials: true,
    });
  }

  detalharUnidade(id: number): Observable<any> {
    return this.http.get(`${this.api}/imoveis/consultar/${id}`, {
      withCredentials: true,
    });
  }

  deletarMorador(moradorId: number, unidadeId: number): Observable<any> {
    return this.http.post(
      `${this.api}/imoveis/deletar/morador`,
      { moradorId, unidadeId },
      { withCredentials: true }
    );
  }

  deletarUnidade(unidadeId: number): Observable<any> {
    return this.http.post(
      `${this.api}/imoveis/deletar/unidade`,
      { unidadeId },
      { withCredentials: true }
    );
  }

  atualizarUnidade(dados: any): Observable<any> {
    return this.http.put(`${this.api}/imoveis/atualizar/unidade`, dados, {
      withCredentials: true,
    });
  }
}
