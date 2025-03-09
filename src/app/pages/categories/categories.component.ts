import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoryItemComponent } from "../../shared/components/ui/category-item/category-item.component";
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [CategoryItemComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: WritableSignal<ICategory[]> = signal([]);
  subscription: Subscription = new Subscription();
  private readonly categoriesService = inject(CategoriesService);
  ngOnInit(): void {
    this.getAllCategories()
  }
  getAllCategories(): void {
    this.subscription = this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
