import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-wishlist',
  imports: [TranslatePipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit, OnDestroy {
  products: WritableSignal<IProduct[]> = signal([]);
  subscriptions: Subscription[] = []
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  ngOnInit(): void {
    this.getAllWishlistProducts();
  }
  getAllWishlistProducts(): void {
    this.subscriptions.push(this.wishlistService.getAllWishlistProducts().subscribe({
      next: (res) => {
        if (res.status === "success") {
          this.wishlistService.wishlistCount.set(res.count);
          this.products.set(res.data);
        }
      }
    }))
  }
  removeProductFromWishlist(id: string): void {
    this.subscriptions.push(this.wishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        if (res.status === "success") {
          let productIds: string[] = res.data;
          localStorage.setItem('productIds', JSON.stringify(productIds));
          this.toastrService.success(res.message);
          this.getAllWishlistProducts();
        }
      }
    }))
  }
  addToCart(id: string): void {
    this.subscriptions.push(this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartService.cartCount.set(res.numOfCartItems);
          this.toastrService.success(res.message);
          this.removeProductFromWishlist(id);
          this.getAllWishlistProducts();
        }
      }
    }))
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
