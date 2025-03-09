import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { ErrorMessageComponent } from "../../shared/components/ui/error-message/error-message.component";
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, ErrorMessageComponent, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit,OnDestroy {
  errorMsg: WritableSignal<string> = signal('');
  toggleInput: WritableSignal<boolean> = signal(false);
  subscription: Subscription = new Subscription();
  loginForm!: FormGroup;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{7,}$/)]]
    });
  }
  login() {
    if (this.loginForm.valid) {
      this.subscription = this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if(res.message === 'success') {
            localStorage.setItem('token', res.token);
            this.authService.getUserData();
            this.router.navigateByUrl(`/home`);
          }
        },
        error: (err: any) => {
          this.errorMsg.set(err);
        }
      })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  toggle(): void {
    this.toggleInput.update((prev) => !prev);
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  selectedLang() {
    if (localStorage.getItem('lang') === 'en') {
      return true;
    } else {
      return false;
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
