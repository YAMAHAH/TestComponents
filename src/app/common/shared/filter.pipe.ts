
import { Pipe, PipeTransform } from '@angular/core';


/**
 * filter:enableComps
 */
@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(value: any[], predicate: (value: any, index: number, array: any[]) => any) {
    return value.filter(predicate);
  }
}
