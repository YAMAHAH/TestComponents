
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(value: any[], callback: (value: any, index: number, array: any[]) => any) {
    return value.filter(callback);
  }
}
