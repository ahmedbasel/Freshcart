import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../../interfaces/iproduct';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(arr: IProduct[], text: string): any {
    if (!arr || !text) {
      return arr || [];
    }
    return arr.filter((item) => item.title.toLowerCase().includes(text.toLowerCase()));
  }
}
