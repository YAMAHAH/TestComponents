import { Injectable, ComponentFactoryResolver, ViewContainerRef, Injector, Type, ComponentFactory, ComponentRef } from '@angular/core';
import { ModalService } from '../modal/modal.service';
import { DialogOptions } from './dialog-options.model';
import { AlertDialogComponent } from './alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { Observable } from 'rxjs/Observable';
import { ModalPosition } from '../modal/modal.position.enum';
import { PromptDialogComponent } from './prompt-dialog.component';
import { _throw } from 'rxjs/observable/throw';

@Injectable()
export class DialogService {

  constructor(private modalService: ModalService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector) {

  }

  alert<T>(dialogOptions: DialogOptions): Observable<T> {
    return this.modalService.showModal<T>({
      component: AlertDialogComponent,
      componentFactoryResolver: this.componentFactoryResolver,
      resolve: dialogOptions,
      modalClass: dialogOptions.cssClass,
      modal: dialogOptions.modal || true,
      modalPosition: dialogOptions.modalPosition,
      backdrop: dialogOptions.backdrop
    });
  }

  confirm<T>(dialogOptions: DialogOptions): Observable<T> {
    return this.modalService.showModal<T>({
      component: ConfirmDialogComponent,
      componentFactoryResolver: this.componentFactoryResolver,
      resolve: dialogOptions,
      modalClass: dialogOptions.cssClass,
      modal: dialogOptions.modal,
      modalPosition: dialogOptions.modalPosition,
      backdrop: dialogOptions.backdrop
    });
  }

  confirmAsync<T>(dialogOptions: DialogOptions): Observable<T> {
    return this.modalService.showModal<T>({
      component: ConfirmDialogComponent,
      componentFactoryResolver: this.componentFactoryResolver,
      resolve: dialogOptions,
      modalClass: dialogOptions.cssClass,
      modal: dialogOptions.modal,
      modalPosition: dialogOptions.modalPosition,
      backdrop: dialogOptions.backdrop
    });
  }
  prompt<T>(dialogOptions: DialogOptions): Observable<T> {
    return this.modalService.showModal<T>({
      component: PromptDialogComponent,
      componentFactoryResolver: this.componentFactoryResolver,
      resolve: dialogOptions,
      modalClass: dialogOptions.cssClass,
      modal: dialogOptions.modal,
      modalPosition: dialogOptions.modalPosition,
      backdrop: dialogOptions.backdrop
    });
  }
}


