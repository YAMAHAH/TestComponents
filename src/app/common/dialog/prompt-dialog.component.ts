import { Component, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Modal, ModalDismissReasons } from '../modal';
import { DialogOptions } from './dialog-options.model';

@Component({
    selector: 'x-prompt-dialog',
    templateUrl: './prompt-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptDialogComponent implements Modal {
    context: DialogOptions;
    // context: { content: string; text: string };
    dismiss: EventEmitter<any>;


    constructor() {

    }

    yes() {
        this.dismiss.emit(this.context.resolve.text);
    }

    no() {
        this.dismiss.error(null);
    }
}
