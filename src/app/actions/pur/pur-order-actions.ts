import { IAction, ActionBase, IMessageData } from '../../Models/IAction';
import { ActionsBase } from '../actions-base';
import { IComponentFactoryContainer } from '../../basic/IComponentFactoryContainer';
export class PurOrderActions extends ActionsBase {
    static primaryKey: string = "pur";

    constructor(componentFactoryRef: IComponentFactoryContainer = null, key: string = 'pur', ) {
        super(key, componentFactoryRef);
    }
    addPurOrderAction(data: IMessageData): IAction {
        return new AddPurOrderAction(this.key, data);
    }
    removePurOrderAction(data: IMessageData): IAction {
        return new RemovePurOrderAction(this.key, data);
    }
}

export class AddPurOrderAction extends ActionBase { }
export class RemovePurOrderAction extends ActionBase { }

