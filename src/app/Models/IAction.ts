import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export interface IActionOperator {
    add(): any;
    remove(): any;
}
export interface IAction {
    target: string;
    actionType?: string;
    data?: IMessageData;
}

export interface IMessageData {
    sender?: string | Observable<any> | any;
    state?: any;
}

export class ActionBase implements IAction {
    constructor(public target: string, public data: IMessageData) {
    }
}

export interface ISubject {
    key: string;
    subject: Subject<IAction>;
}