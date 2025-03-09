import { Component, input, InputSignal } from '@angular/core';
import { ICategory } from '../../../interfaces/icategory';

@Component({
  selector: 'app-category-item',
  imports: [],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss'
})
export class CategoryItemComponent {
  category: InputSignal<ICategory> = input.required<ICategory>();
}
