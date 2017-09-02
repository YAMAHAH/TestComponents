import { Type, ComponentFactoryResolver, Injector, ViewContainerRef } from '@angular/core';
import { ModalPosition } from './modal.position.enum';

export interface ModalOptions {
  component: Type<any>;
  componentFactoryResolver?: ComponentFactoryResolver;
  injector?: Injector;
  resolve?: any;
  backdrop?: boolean;
  backdropClass?: string;
  keyboard?: boolean;
  modal?: boolean;
  modalClass?: string;
  size?: 'sm' | 'lg';
  rootContainer?: ViewContainerRef;
  modalPosition?: ModalPosition
  minWidth?: number;
  minHeight?: number;

}

