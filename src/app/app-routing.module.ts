import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyComponent } from './components/verify/verify.component';
import { LoginComponentModule } from './components/login/login.component-module';
import { RegisterComponentModule } from './components/register/register.component-module';
import { VerifyComponentModule } from './components/verify/verify.component-module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LeadsComponent } from './components/leads/leads.component';
import { LeadsComponentModule } from './components/leads/leads.component-module';
import { EmailVerifiedGuard } from './guards/email-verified/email-verified.guard';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { CompleteProfileComponentModule } from './components/complete-profile/complete-profile.component-module';
import { AuthGuard } from './guards/auth/auth.guard';
import { AlreadyLoggedGuard } from './guards/already-logged/already-logged.guard';

const routes: Routes = [
  { path: 'auth',
  children: [
    {
      path: 'login',
      component: LoginComponent,
    },
    {
      path: 'register',
      component: RegisterComponent
    }
  ],
  canActivate: [AlreadyLoggedGuard],
  data: {
    redirectLeads: '/leads',
  }
 },
  { path: 'verify', component: VerifyComponent },
  { path: 'leads', component: LeadsComponent,
  canActivate: [
    AuthGuard,
    EmailVerifiedGuard,
  ],data: {
    redirectUrlEmail: '/verify',
    redirectLogIn: '/auth/login'
  }, },
  {
    path: 'complete-profile',
    component: CompleteProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), LoginComponentModule, RegisterComponentModule, VerifyComponentModule, LeadsComponentModule, CompleteProfileComponentModule],
  exports: [RouterModule],
})
export class AppRoutingModule { }
