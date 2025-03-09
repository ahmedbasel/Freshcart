import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';

@Component({
  selector: 'app-cart',
  imports: [DatePipe, RouterLink, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  cartProducts: WritableSignal<ICart | null> = signal(null);
  cartCounter: Signal<number> = computed(() => this.cartService.cartCount())
  dicount: WritableSignal<number> = signal(10);
  payment: WritableSignal<string> = signal('online');
  date: Date = new Date();
  subscriptions: Subscription[] = [];
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  ngOnInit(): void {
    this.getAllCartProducts();
  }
  getAllCartProducts(): void {
    this.subscriptions.push(this.cartService.getAllCartProducts().subscribe({
      next: (res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
        this.cartProducts.set(res.data);
      }
    }))
  }
  updateQuantity(id: string, quantity: number): void {
    this.subscriptions.push(this.cartService.updateCartProductQuantity(id, quantity).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartProducts.set(res.data);
          this.toastrService.success('quantity updated successfully');
        }
      }
    }))
  }
  removeProduct(id: string): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscriptions.push(this.cartService.removeProductFromCart(id).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.cartService.cartCount.set(res.numOfCartItems);
              this.cartProducts.set(res.data);
              Swal.fire({
                title: "Deleted!",
                text: "Your product has been deleted.",
                icon: "success"
              });
            }
          }
        }))
      }
    });
  }
  clearCart(): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscriptions.push(this.cartService.clearCart().subscribe({
          next: (res) => {
            if (res.message === 'success') {
              this.cartService.cartCount.set(0);
              this.cartProducts.set(null);
              Swal.fire({
                title: "Deleted!",
                text: "Your All Products has been deleted.",
                icon: "success"
              });
            }
          }
        }))
      }
    });
  }
  paymentMethod(event: Event): void {
    let e = (event.target as HTMLSelectElement).value;
    this.payment.set(e);
  }
  calculateDiscount() {
    return ((this.cartProducts()?.totalCartPrice ?? 0) / 100 * (this.dicount() ?? 0)).toFixed(2);
  }
  calculateTotal() {
    return ((this.cartProducts()?.totalCartPrice ?? 0) - ((this.cartProducts()?.totalCartPrice ?? 0 ) / 100) * this.dicount()).toFixed(2);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
