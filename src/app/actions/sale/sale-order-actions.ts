import { IAction, ActionBase, IMessageData } from '../../Models/IAction';
import { ActionsBase } from '../actions-base';
export class SaleOrderActions extends ActionsBase {
    static primaryKey: string = "sale";

    constructor(key: string = 'sale') {
        super(key);
    }
    addSaleOrderAction(data: IMessageData): IAction {
        return new AddSaleOrderAction(this.key, data);
    }
    removeSaleOrderAction(data: IMessageData): IAction {
        return new RemoveSaleOrderAction(this.key, data);
    }
}

export class AddSaleOrderAction extends ActionBase { }
export class RemoveSaleOrderAction extends ActionBase { }