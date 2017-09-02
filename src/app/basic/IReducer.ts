import { ISubject } from '../Models/IAction';
export interface reducer {
    subject: ISubject;
    subjectActions: any;
    reducer(): any;
}