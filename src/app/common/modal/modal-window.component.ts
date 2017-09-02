import {
  Component,
  Input,
  ViewChild,
  HostListener,
  EventEmitter,
  ChangeDetectionStrategy,
  ElementRef
} from '@angular/core';
import { ModalContentComponent } from './modal-content.component';
import { ModalOptions } from './modal-options.model';
import { ModalDismissReasons } from './modal-dismiss-reasons.model';

@Component({
  selector: 'x-modal-window',
  templateUrl: './modal-window.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalWindowComponent {
  @Input() isOpen: boolean = false;
  @Input() instanceCount = 0;
  @Input() minWidth = 0;
  @Input() minHeight = 0;
  @ViewChild(ModalContentComponent) modalContent: ModalContentComponent;
  dismiss: EventEmitter<any>;
  modalOptions: ModalOptions;

  constructor(private elementRef: ElementRef) {

  }


  @HostListener('click', ['$event'])
  onBackdropClick($event: Event) {
    if (!this.modalOptions.modal && this.elementRef.nativeElement === $event.target) {
      this.dismiss.error(ModalDismissReasons.BACKDROP_CLICK);
    }
  }

  @HostListener('keyup.esc', ['$event'])
  onEscKeyUp($event: KeyboardEvent) {
    if (this.modalOptions.keyboard !== false) {
      this.dismiss.error(ModalDismissReasons.ESC_KEY);
    }
  }

  addContent<T>(options: ModalOptions, dismiss: EventEmitter<T>): EventEmitter<T> {
    this.modalOptions = options;
    this.dismiss = dismiss;
    this.modalContent.addContent(options, this.dismiss);
    return this.dismiss;
  }

  getStyle() {
    let styleObject;
    if (this.minWidth == 0) {
      styleObject = { "flex": '1 0 auto' };
    } else {
      styleObject = {
        "flex": '0 0 ' + this.minWidth.toString() + 'px'
      };
    }
    if (this.minHeight !== 0) {
      styleObject['min-height'] = this.minHeight;
    }
    return styleObject;
  }
}
