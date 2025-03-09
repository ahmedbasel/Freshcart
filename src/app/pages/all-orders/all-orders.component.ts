import { IOrder } from './../../shared/interfaces/iorder';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-orders',
  imports: [DatePipe, TranslatePipe],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent implements OnInit, OnDestroy {
  products: WritableSignal<IOrder[]> = signal([]);
  subscription: Subscription = new Subscription();
  private readonly cartService = inject(CartService);
  userId = localStorage.getItem('userId')?.toString()!;
  ngOnInit(): void {
    this.subscription = this.cartService.getUserOrders(this.userId).subscribe({
      next: (res) => {
        this.cartService.cartCount.set(0);
        this.products.set(res);
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
