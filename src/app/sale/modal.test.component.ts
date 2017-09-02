import { Component, ComponentFactoryResolver, EventEmitter, ViewContainerRef } from '@angular/core';
import { Modal } from '../common/modal/modal.model';
import { ModalService } from '../common/modal/modal.service';
import { AppStoreService } from '../services/app.store.service';
import { SaleComponentFactoryType } from '../actions/actions-base';



@Component({
    selector: 'x-modal-test',
    templateUrl: './modal.test.comp.html'
})

export class ModalTestComponent implements Modal {
    context: { text: string };
    dismiss: EventEmitter<string>;
    showTitle: boolean = false;

    constructor(
        private appStore: AppStoreService,
        private modalService: ModalService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private vcRef: ViewContainerRef) {
    }

    async show() {

        let factory = await this.appStore.getComponentFactoryRef(SaleComponentFactoryType);
        this.modalService.showModal<string>({
            component: ModalTestComponent,
            componentFactoryResolver: factory.componentFactoryResolver,
            resolve: {
                text: 'inner modal'
            },
            size: 'sm'
        }).subscribe(data => {
            console.log('Rebirth Modal -> Get ok with result:', data);
        }, error => {
            console.error('Rebirth Modal -> Get cancel with result:', error);
        });
    }

    ok() {
        this.dismiss.emit(this.context.text);
    }

    cancel() {
        this.dismiss.error(this.context.text);
    }
}