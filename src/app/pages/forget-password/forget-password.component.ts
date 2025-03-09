import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessageComponent } from "../../shared/components/ui/error-message/error-message.component";
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, ErrorMessageComponent, TranslatePipe],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  errorMsg:WritableSignal<string> = signal('');
  step: WritableSignal<number> = signal(1);
  toggleInput: WritableSignal<boolean> = signal(false);
  subscriptions: Subscription[] = [];
  verifyEmailForm!: FormGroup;
  verifyCodeForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  ngOnInit(): void {
    this.verifyEmailForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
    this.verifyCodeForm = this.formBuilder.group({
      resetCode: [null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });
    this.resetPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      newPassword: [null, [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{7,}$/)]]
    });
  }
  submitVerifyEmail() {
    if (this.verifyEmailForm.valid) {
      const emailValue = this.verifyEmail?.value;
      this.resetEmail?.patchValue(emailValue);
      this.errorMsg.set('');
      this.subscriptions.push(this.authService.verifyEmail(this.verifyEmailForm.value).subscribe({
        next: (res) => {
          if (res.statusMsg === 'success') {
            this.step.set(2);
          }
        },
        error: (err) => {
          this.errorMsg.set(err.split(" ", 9).join(" "));
        }
      }))
    } else {
      this.verifyEmailForm.markAllAsTouched();
    }
  }
  submitVerifyCode() {
    if (this.verifyCodeForm.valid) {
      this.errorMsg.set('');
      this.subscriptions.push(this.authService.verifyCode(this.verifyCodeForm.value).subscribe({
        next: (res) => {
          if (res.status === 'Success') {
            this.step.set(3);
          }
        },
        error: (err) => {
          this.errorMsg.set(err);
        }
      }))
    } else {
      this.verifyCodeForm.markAllAsTouched();
    }
  }
  submitResetPassword() {
    if (this.resetPasswordForm.valid) {
      this.errorMsg.set('');
      this.subscriptions.push(this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
        next: (res) => {
          localStorage.setItem("token", res.token);
          this.authService.getUserData();
          this.router.navigateByUrl('/home');
        }
      }))
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }
  toggle(): void {
    this.toggleInput.update((prev) => !prev);
  }
  selectedLang() {
    if (localStorage.getItem('lang') === 'en') {
      return true;
    } else {
      return false;
    }
  }
  get verifyEmail() {
    return this.verifyEmailForm.get('email');
  }
  get resetCode() {
    return this.verifyCodeForm.get('resetCode');
  }
  get resetEmail() {
    return this.resetPasswordForm.get('email');
  }
  get newPassword() {
    return this.resetPasswordForm.get('newPassword');
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
