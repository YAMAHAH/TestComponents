export interface ITabManager {
    //关闭所有任务组(Tab组)
    closeAllTaskGroup(): void;
    /**
     * 关闭任务组(Tab组)
     */
    closeTaskGroup(key: string | Function): void;
}