import { ShowTypeEnum } from './show-type-enum';
import { Observable } from 'rxjs/Observable';
export interface FormExtras {
    /**
     * 显示模式
     */
    showType?: ShowTypeEnum;
    /**
     * 解析数据
     */
    resolve?: Promise<any> | Observable<any> | any;
    /**
     * 导航树中是否可见
     */
    visibleInNavTree?: boolean;
}
