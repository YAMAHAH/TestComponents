import { IAction, ActionBase } from '../../Models/IAction';
export class AppRightSiderActions {
    static primaryKey: string = "app-right-sider";
    key: string;
    constructor(key: string = 'app-right-sider') {
        this.key = key || AppRightSiderActions.primaryKey;
    }
    showRightSiderAction(data: any): IAction {
        return new ShowAppRightSiderAction(this.key, data);
    }
    hideRightSiderAction(data: any): IAction {
        return new HideAppRightSiderAction(this.key, data);
    }
}

export class ShowAppRightSiderAction extends ActionBase { }
export class HideAppRightSiderAction extends ActionBase { }