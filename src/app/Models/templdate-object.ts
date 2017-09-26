export class TemplateObject {

    constructor(id: string) {
        this.objectId = id;
    }
    /**
     * 模块ID
     */
    moduleId: string;
    /**
     * 模板ID
     */
    templateId: string;
    /**
     * 对象ID
     */
    objectId: string;
    /**
     * 对象名称
     */
    name: string;
    /**
     * 对象别名
     */
    objectAlias: string;
    /**
     * 对象前缀
     */
    prefix: string;
    /**
     * 可查
     */
    queryable: boolean;
    /**
     * 必须
     */
    required: boolean;
    /**
     * 可视
     */
    visible: boolean;
    /**
     * 可编
     */
    editable: boolean;
    /**
     * 标题
     */
    text: string;
    /**
     * 默认值
     */
    default: string;
    /**
     * 数据类型
     */
    dataType: string;
    /**
     * 组件类型
     */
    componentType: string;
}