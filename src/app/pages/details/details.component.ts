import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [CarouselModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy {
  product: IProduct | null = null;
  productIds: string[] = [];
  subscriptions: Subscription[] = [];
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    autoplayTimeout: 2000,
    margin: 15,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 4
      }
    },
    nav: true
  }
  private readonly productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const ids = localStorage.getItem("productIds");
      if(ids) {
        this.productIds = JSON.parse(ids);
      }
    }
    this.getProduct();
  }
  getProduct() {
    this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        let currentId: string = String(paramMap.get('id'));
        this.subscriptions.push(this.productsService.getProductById(currentId).subscribe({
          next: (res) => {
            this.product = res.data;
          }
        }))
      }
    })
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
