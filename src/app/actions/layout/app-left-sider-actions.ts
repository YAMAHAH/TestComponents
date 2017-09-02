import { IAction, ActionBase } from '../../Models/IAction';
export class AppLeftSiderActions {
    static primaryKey: string = "app-left-sider";
    key: string;
    constructor(key: string = 'app-left-sider') {
        this.key = key || AppLeftSiderActions.primaryKey;
    }
    showLeftSiderAction(data: any): IAction {
        return new ShowAppLeftSiderAction(this.key, data);
    }
    hideLeftSiderAction(data: any): IAction {
        return new HideAppLeftSiderAction(this.key, data);
    }
    expandLeftSiderAction(data: any): IAction {
        return new ExpandAppLeftSiderAction(this.key, data);
    }
}

export class ShowAppLeftSiderAction extends ActionBase { }
export class HideAppLeftSiderAction extends ActionBase { }
export class ExpandAppLeftSiderAction extends ActionBase { }