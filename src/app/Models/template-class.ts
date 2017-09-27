import { TemplateClassObject } from './template-class-object';
export abstract class TemplateClassBase {
    ModuleId: string;
    ModuleName: string;
    TemplateId: string;
    TempName: string;
    /** 数据字段 */
    dataFields: { [key: string]: TemplateClassObject }
    /** 功能 */
    actions: { [key: string]: TemplateClassObject }
    /** 过滤器 */
    filters: { [key: string]: TemplateClassObject }
}