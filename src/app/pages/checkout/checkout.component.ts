import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart/cart.service';
import { ErrorMessageComponent } from "../../shared/components/ui/error-message/error-message.component";

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, ErrorMessageComponent, TranslatePipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  errorMsg: WritableSignal<string> = signal('');
  currentId: WritableSignal<string> = signal('');
  payment: WritableSignal<string> = signal('');
  subscriptions: Subscription[] = [];
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  checkoutForm!: FormGroup;
  ngOnInit(): void {
    this.checkoutForm = this.formBuilder.group({
      details: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city: [null, [Validators.required]]
    });
    this.activatedRoute.queryParamMap.subscribe({
      next: (params) => {
        this.payment.set(params.get('payment')!);
      }
    });
    this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        this.currentId.set(paramMap.get('id')!);
      }
    });
  }
  checkoutOnline(): void {
    if (this.checkoutForm.valid) {
      this.subscriptions.push(this.cartService.checkoutOnline(this.currentId(), this.checkoutForm.value).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.checkoutForm.reset();
            this.toastrService.success('order has been done!');
            open(res.session.url, '_self');
          }
        },
        error: (err) => {
          this.errorMsg.set(err);
        }
      }))
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
  checkoutCash(): void {
    if (this.checkoutForm.valid) {
      this.subscriptions.push(this.cartService.checkoutCash(this.currentId(), this.checkoutForm.value).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.checkoutForm.reset();
            this.toastrService.success('order has been done!');
            this.router.navigateByUrl(`/allorders`);
          }
        },
        error: (err) => {
          this.errorMsg.set(err);
        }
      }))
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
  get details() {
    return this.checkoutForm.get('details');
  }
  get phone() {
    return this.checkoutForm.get('phone');
  }
  get city() {
    return this.checkoutForm.get('city');
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
