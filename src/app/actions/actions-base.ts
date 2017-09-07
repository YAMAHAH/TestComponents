import { ActionBase, IMessageData, IAction } from '../Models/IAction';
import { IComponentFactoryType } from '../basic/IComponentFactoryType';
import { IComponentFactoryContainer } from '../basic/IComponentFactoryContainer';
import { IComponentType } from '../basic/IComponentType';



export class ActionsBase {
    constructor(public key: string, public componentFactoryRef: IComponentFactoryContainer = null) {
    }
    addAction(data: IMessageData): IAction {
        return new AddAction(this.key, data);
    }
    removeAction(data: IMessageData): IAction {
        return new RemoveAction(this.key, data);
    }
    setCurrentAction(data: IMessageData): IAction {
        return new SetCurrentAction(this.key, data);
    }
    getformModelArrayAction(data: IMessageData): IAction {
        return new GetformModelArrayAction(this.key, data);
    }
    closeTaskGroupAction(data: IMessageData): IAction {
        return new CloseTaskGroupAction(this.key, data);
    }
    closeAllTaskGroupAction(data: IMessageData): IAction {
        return new CloseAllTaskGroupAction(this.key, data);
    }
    getTaskGroupModalAction(data: IMessageData): IAction {
        return new GetTaskGroupModalAction(this.key, data);
    }

}

export class AddAction extends ActionBase { }
export class RemoveAction extends ActionBase { }
export class GetformModelArrayAction extends ActionBase { }
export class CloseTaskGroupAction extends ActionBase { }
export class CloseAllTaskGroupAction extends ActionBase { }
export class GetTaskGroupModalAction extends ActionBase { }
export class SetCurrentAction extends ActionBase { }

export abstract class ComponentFactoryType implements IComponentFactoryType {
    constructor(public key: string, public componentFactoryRef: IComponentFactoryContainer = null) {
    }
}
export abstract class ComponentTypeBase implements IComponentType {
}

export class PurComponentFactoryType extends ComponentFactoryType {
    constructor(public key: string = "pur", public componentFactoryRef: IComponentFactoryContainer = null) {
        super(key, componentFactoryRef);
    }
}

export class PurchaseListComponentType extends ComponentTypeBase {
}

export class PurchaseEditComponentType extends ComponentTypeBase {
}

export class PurchaseQueryComponentType extends ComponentTypeBase {
}
export class SaleComponentFactoryType extends ComponentFactoryType {
    constructor(public key: string = "sale", public componentFactoryRef: IComponentFactoryContainer = null) {
        super(key, componentFactoryRef);
    }
}

