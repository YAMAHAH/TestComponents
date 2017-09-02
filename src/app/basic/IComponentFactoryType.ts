import { IComponentFactoryContainer } from './IComponentFactoryContainer';
export interface IComponentFactoryType {
    key: string;
    componentFactoryRef: IComponentFactoryContainer;
    outlet?: string;
    path?: string;
}