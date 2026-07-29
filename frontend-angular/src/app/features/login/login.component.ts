import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
private fb = inject(FormBuilder);
private authService = inject(AuthService);
private router = inject(Router);

isLoading = false;
serverError: string | null = null

loginForm = this.fb.group({
  email: ["", [Validators.required, Validators.email]],
  password: ["", [Validators.required, Validators.minLength(6)]]
});

onSubmit(){
  if(this.loginForm.invalid){
    this.loginForm.markAllAsTouched();
    return;
  }

  this.serverError = null;
  this.isLoading = true;

  const { email, password } = this.loginForm.value;

  this.authService.login({email: email!, password: password!}).subscribe({
    next: () => {
      this.isLoading = false;
      this.router.navigate(["/dashboard"])
    },
  })
}

get email(){
  return this.loginForm.get("email")!
}

get password(){
  return this.loginForm.get("password")!
}
}
