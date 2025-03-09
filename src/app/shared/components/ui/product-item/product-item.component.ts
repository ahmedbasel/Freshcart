import { Component, inject, input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CartService } from '../../../../core/services/cart/cart.service';
import { WishlistService } from '../../../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../../interfaces/iproduct';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-item',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent implements OnInit,OnDestroy {
  product = input.required<IProduct>();
  icon!: boolean;
  productIds: string[] = [];
  subscriptions: Subscription[] = [];
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const ids = localStorage.getItem("productIds");
      if(ids) {
        this.productIds = JSON.parse(ids);
      }
    }
  }
  addToCart(id: string): void {
    this.subscriptions.push(this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartService.cartCount.set(res.numOfCartItems);
          this.toastrService.success(res.message);
        }
      }
    }))
  }
  addToFavorite(id: string): void {
    this.subscriptions.push(this.wishlistService.addProductToWishlist(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.wishlistService.wishlistCount.set(res.data.length);
          this.productIds = res.data || [];
          localStorage.setItem('productIds', JSON.stringify(this.productIds));
          this.toastrService.success(res.message);
        }
      }
    }))
  }
  removeProductFromWishlist(id: string): void {
    this.subscriptions.push(this.wishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        if (res.status === "success") {
          this.wishlistService.wishlistCount.set(res.data.length);
          this.productIds = res.data || [];
          localStorage.setItem('productIds', JSON.stringify(this.productIds));
          this.toastrService.success(res.message);
        }
      }
    }))
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
