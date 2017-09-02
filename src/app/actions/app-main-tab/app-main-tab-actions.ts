import { IAction, ActionBase, IMessageData } from '../../Models/IAction';
import { ActionsBase } from '../actions-base';
export class AppTaskBarActions extends ActionsBase {
    static primaryKey: string = "app-task-bar";
    key: string;
    constructor(key: string = 'app-task-bar') {
        super(key);
        this.key = key || AppTaskBarActions.primaryKey;
    }
    addTabAction(data: IMessageData): IAction {
        return new AddTabAction(this.key, data);
    }
    removeTabAction(data: IMessageData): IAction {
        return new RemoveTabAction(this.key, data);
    }
    selectTabAction(data: IMessageData): IAction {
        return new SelectTabAction(this.key, data);
    }
    existTabAction(data: IMessageData): IAction {
        return new ExistTabAction(this.key, data);
    }
    createTabAction(data: IMessageData): IAction {
        return new CreateTabAction(this.key, data);
    }
    showFormModalAction(data: IMessageData): IAction {
        return new ShowFormModalAction(this.key, data);
    }
    showFormAction(data: IMessageData): IAction {
        return new ShowFormAction(this.key, data);
    }
}

export class AddTabAction extends ActionBase { }
export class RemoveTabAction extends ActionBase { }
export class SelectTabAction extends ActionBase { }
export class ExistTabAction extends ActionBase { }
export class CreateTabAction extends ActionBase { }
export class ShowFormModalAction extends ActionBase { }
export class ShowFormAction extends ActionBase { }