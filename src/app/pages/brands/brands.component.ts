import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { IBrand } from '../../shared/interfaces/ibrand';
import { BrandsService } from '../../core/services/brands/brands.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit, OnDestroy {
  brands: WritableSignal<IBrand[]> = signal([]);
  subscription: Subscription = new Subscription();
  private readonly brandsService = inject(BrandsService);
  ngOnInit(): void {
    this.getAllBrands();
  }
  getAllBrands(): void {
    this.subscription = this.brandsService.getAllBrands().subscribe({
      next: (res) => {
        this.brands.set(res.data);
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
