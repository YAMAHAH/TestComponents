import { ShowTypeEnum } from './show-type-enum';
import { Observable } from 'rxjs/Observable';
export interface FormExtras {
    showType: ShowTypeEnum;
    resolve?: Promise<any> | Observable<any> | any;
}
