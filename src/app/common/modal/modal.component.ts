import { Component, Input, ViewChild, EventEmitter, Output, ChangeDetectionStrategy, Renderer } from '@angular/core';
import { ModalOptions } from './modal-options.model';
import { ModalWindowComponent } from './modal-window.component';
import { DocumentRef } from '../window-ref';
import { ModalPosition } from './modal.position.enum';

@Component({
  selector: 'x-modal',
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  static MODEL_OPEN_CSS = 'modal-open';
  @Input() isOpen: boolean = false;
  @Output() dismiss = new EventEmitter<any>();
  @Input() modalOptions: ModalOptions;
  @ViewChild(ModalWindowComponent) modalWindowComponent: ModalWindowComponent;
  instanceCount = 0;

  constructor(private renderer: Renderer, private documentRef: DocumentRef) {

  }

  open() {
    this.isOpen = true;
    this.modalWindowComponent.isOpen = true;
    this.toggleBodyClass(true);
  }

  close() {
    this.isOpen = false;
  }

  cleanup() {
    this.toggleBodyClass(false);
  }
  minWidth: number = 0;
  minHeight: number = 0;
  addContent<T>(options: ModalOptions, instanceCount: number): EventEmitter<T> {
    this.modalOptions = options;
    this.minWidth = options.minWidth || 350;
    this.minHeight = options.minHeight || 216;
    this.instanceCount = instanceCount;
    this.modalWindowComponent.addContent(options, this.dismiss);
    return this.dismiss;
  }

  private toggleBodyClass(isAdd: boolean): void {
    this.renderer.setElementClass(this.documentRef.body, ModalComponent.MODEL_OPEN_CSS, isAdd);
  }
  getStyle() {
    let modalPosition = this.modalOptions.modalPosition || ModalPosition.topCenter;
    let styleObject = {
      'display': this.isOpen ? 'flex' : 'none',
      'z-index': 1050 + this.instanceCount * 10,
      'justify-content': 'center',
      'align-content': 'center',
      'align-items': 'center'
    };
    switch (modalPosition) {
      case ModalPosition.center:
        break;
      case ModalPosition.topCenter:
        styleObject['align-items'] = 'flex-start';
        break;
      case ModalPosition.bottomCenter:
        styleObject['align-items'] = 'flex-end';
        break;
      default:
        break;
    }
    return styleObject;
  }

}
