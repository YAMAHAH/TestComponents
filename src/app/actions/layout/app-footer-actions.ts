import { IAction, ActionBase } from '../../Models/IAction';
export class AppFooterActions {
    static primaryKey: string = "app-footer";
    key: string;
    constructor(key: string = 'app-footer') {
        this.key = key || AppFooterActions.primaryKey;
    }
    showAppFooterAction(data: any): IAction {
        return new ShowAppFooterAction(this.key, data);
    }
    hideAppFooterAction(data: any): IAction {
        return new HideAppFooterAction(this.key, data);
    }
    showFooterAction(data: any): IAction {
        return new ShowFooterAction(this.key, data);
    }
}

export class ShowAppFooterAction extends ActionBase { }
export class HideAppFooterAction extends ActionBase { }
export class ShowFooterAction extends ActionBase { }