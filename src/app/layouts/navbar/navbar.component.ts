import { Component, computed, inject, input, Input, InputSignal, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { TranslationService } from '../../core/services/translation/translation.service';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isOpen: boolean = false;
  cartCounter: Signal<number> = computed(() => this.cartService.cartCount());
  wishlistCounter: Signal<number> = computed(() => this.wishlistService.wishlistCount());
  isLogin: InputSignal<boolean> = input(true);
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);
  readonly translationService = inject(TranslationService);
  ngOnInit(): void {
    this.cartService.getAllCartProducts().subscribe({
      next: (res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
      }
    })
    this.wishlistService.getAllWishlistProducts().subscribe({
      next: (res) => {
        this.wishlistService.wishlistCount.set(res.count);
      }
    })
  }
  changeLang(lang: string) {
    this.translationService.changeLang(lang);
  }
  selectOption(): void | boolean {
    if (typeof localStorage !== 'undefined') {
      const lang = localStorage.getItem('lang')!;
      return lang === 'en' ? true : false;
    }
  }
  toggle(): void {
    this.isOpen = !this.isOpen;
  }
  closeMenu(): void {
    this.isOpen = false;
  }
}
