import { Component, OnInit, ViewChild, Input, OnDestroy, EventEmitter } from '@angular/core';
import { ToastyService } from '../common/toasty/toasty.service';
import { PanelComponent } from '../common/panel/panel.component';
import { AppStoreService } from '../services/app.store.service';
import { IFormModel } from '../basic/IFormModel';
import { IComponentBase } from '../basic/IComponentBase';
import { FormOptions } from '../components/form/FormOptions';
import { NavTreeNode } from '../components/nav-tree-view/nav-tree-node';

@Component({
    moduleId: module.id,
    selector: 'panel-test',
    templateUrl: 'panel.test.component.html'
})
export class PanelTestComponent implements IComponentBase, OnInit, OnDestroy {
    setOtherParent(godFather: IFormModel): IFormModel {
        if (godFather) {
            godFather.childs.push(this.formModel);
            this.formModel.godFather = godFather;
            if(this.formModel.tag){
                //设置关联的结点在导航树不可见,关闭TAB时也要考虑这种情况
                let nd =  this.formModel.tag  as NavTreeNode;
                nd.showNode = false;
                nd.getParents().forEach(val=>val.showNode = false);
            }
        }
        return this.formModel;
    }

    formModel: IFormModel;
    show(modalOptions?: FormOptions) {
        return this.appStore.taskManager.show(this.formModel, modalOptions);
    }
    showModal(modalOptions?: FormOptions) {
        return this.appStore.taskManager.showModal(this.formModel, modalOptions);
    }
    closeBeforeCheckFn: Function;
    closeAfterFn: Function;
    @Input() title: string = "测试组件";
    modalResult: EventEmitter<any>;
    context: any;
    tag: any;

    constructor(private toastyService: ToastyService,
        private appStore: AppStoreService) {
        // super();
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