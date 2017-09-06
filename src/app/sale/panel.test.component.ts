import { Component, OnInit, ViewChild, Input, OnDestroy, EventEmitter, Injector } from '@angular/core';
import { ToastyService } from '../common/toasty/toasty.service';
import { PanelComponent } from '../common/panel/panel.component';
import { AppStoreService } from '../services/app.store.service';
import { IPageModel } from '../basic/IFormModel';
import { IComponentBase } from '../basic/IComponentBase';
import { FormOptions } from '../components/form/FormOptions';
import { NavTreeNode } from '../components/nav-tree-view/nav-tree-node';
import { ComponentBase } from '../pur/pur-order/ComponentBase';

@Component({
    moduleId: module.id,
    selector: 'panel-test',
    templateUrl: 'panel.test.component.html'
})
export class PanelTestComponent extends ComponentBase implements OnInit, OnDestroy {


    // show(modalOptions?: FormOptions) {
    //     return this.appStore.taskManager.show(this.formModel, modalOptions);
    // }
    // showModal(modalOptions?: FormOptions) {
    //     return this.appStore.taskManager.showModal(this.formModel, modalOptions);
    // }
    @Input() title: string = "测试组件";

    constructor(private toastyService: ToastyService,
        protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        // this.modalResult.subscribe((result: any) => console.log(result));
    }
    ngOnDestroy() {

    }

    closePanel(event: any) {
        this.toastyService.clear(this.tag.id);
    }
    ok(event: any) {
        this.modalResult.emit({
            status: 'ok', modalResult: 'ok', label: new Date().getTime(),
            value: this.context && this.context.suggestions && this.context.suggestions[0] || event.currentTarget.tagName
        });
    }
    cancel(event: any) {
        this.modalResult.emit({
            status: 'cancel', modalResult: 'cancel', label: "status",
            value: this.context && this.context.suggestions && this.context.suggestions[0] || event.currentTarget.tagName
        });
    }

    onClose(event: any) {
        this.modalResult.emit({ status: 'close', modalResult: "ModalClose" });
    }
}