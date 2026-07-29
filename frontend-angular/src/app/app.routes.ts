import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {path: "login", component: LoginComponent},
  {
    path: "dashboard",
    canActivate: [authGuard],
    loadComponent: () =>
      import ("./features/dashboard/dashboard.component").then((m)=> m.DashboardComponent),
  },
  {
    path: "leads",
    canActivate: [authGuard],
    loadComponent: () =>
      import ("./features/leads/leads.component").then((m)=> m.LeadsComponent),
  },
  {
    path: "leads/new",
    canActivate: [authGuard],
    loadComponent: () =>
      import ("./features/leads/lead-new/lead-new.component").then((m)=> m.LeadNewComponent)
  },
  {
  path: "leads/:id",
  canActivate: [authGuard],
  loadComponent: () =>
    import("./features/leads/lead-detail/lead-detail.component").then(
      (m) => m.LeadDetailComponent
    ),
},
  {path:"", redirectTo: "/login", pathMatch: "full"}
];
