import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CadastrarPredioComponent } from './pages/cadastrar-predio/cadastrar-predio.component';
import { CadastrarUnidadeComponent } from './pages/cadastrar-unidade/cadastrar-unidade.component';
import { CadastrarMoradorComponent } from './pages/cadastrar-morador/cadastrar-morador.component';
import { ConsultarComponent } from './pages/consultar/consultar.component';
import { ApartamentoComponent } from './pages/consultar/apartamento/apartamento.component';
import { RegistrarPagamentoComponent } from './pages/registrar-pagamento/registrar-pagamento.component';
import { EnviarBoletoComponent } from './pages/enviar-boleto/enviar-boleto.component';
import { TabelaPagamentosComponent } from './pages/tabela-pagamentos/tabela-pagamentos.component';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password.component';
import { RegisterComponent } from './auth/register/register.component';
import { ConfigComponent } from './pages/config/config.component';
import { ConfiguracoesApartamentoComponent } from './pages/consultar/apartamento/configuracoes-apartamento/configuracoes-apartamento.component';
import { AuthGuard } from './guards/auth.guard';
import { AlugueisAVencerComponent } from './pages/alugueis-a-vencer/alugueis-a-vencer.component';
import { EstatisticasComponent } from './pages/estatisticas/estatisticas.component';
import { ReajustarAluguelComponent } from './pages/reajustar-aluguel/reajustar-aluguel.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastrar', component: RegisterComponent },
  { path: 'recuperar-senha', component: RecoverPasswordComponent },

  {
    path: 'dashboard/configuracoes',
    component: ConfigComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/cadastrar-imovel',
    component: CadastrarPredioComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/cadastrar-unidade',
    component: CadastrarUnidadeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/cadastrar-morador',
    component: CadastrarMoradorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/consultar',
    component: ConsultarComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/registrar-pagamento',
    component: RegistrarPagamentoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/alugueis-a-vencer',
    component: AlugueisAVencerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/reajustar-aluguel',
    component: ReajustarAluguelComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/estatisticas',
    component: EstatisticasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard/enviar-boleto',
    component: EnviarBoletoComponent,
    canActivate: [AuthGuard],
  },

  {
    path: `dashboard/consultar/:id`,
    component: ApartamentoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: `dashboard/consultar/editar/:id`,
    component: ConfiguracoesApartamentoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: `dashboard/consultar/:name/:id/configurar`,
    component: ConfiguracoesApartamentoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: `dashboard/consultar/pagamentos/:moradorId`,
    component: TabelaPagamentosComponent,
    canActivate: [AuthGuard],
  },
];
