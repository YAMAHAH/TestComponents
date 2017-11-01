export interface NavTabModel {
    /**
     * 顺序号
     */
    order?: number;
    /**
     * 主键
     */
    key: string;
    /**
     * 名称
     */
    name?: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 图标路径
     */
    favicon: string;
    /**
     * 组件入口
     */
    outlet: string;
    /**
     * 相对访问路径
     */
    path?: string;
    /**
     *  指示是否活动
     */
    active?: boolean;
    /**
     * Tab方式显示
     */
    showTabContent?: boolean;
    /**
     * 后台运行
     */
    daemon?: boolean;
}