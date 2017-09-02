import { EventEmitter, Input } from '@angular/core';
export abstract class ModalBase {
    modalResult: EventEmitter<any> = null;
    context: any = null;
    @Input() tag: any = null;
}