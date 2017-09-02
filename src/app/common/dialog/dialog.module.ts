import { NgModule } from '@angular/core';
import { AlertDialogComponent } from './alert-dialog.component';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { PromptDialogComponent } from './prompt-dialog.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared-module';
import { UISharedModule } from '../shared/shared';


@NgModule({
  imports: [
    CommonModule, FormsModule, SharedModule
  ],
  exports: [UISharedModule],
  declarations: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent,
  ],
  providers: [],
  entryComponents: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent
  ]
})
export class XYZDialogModule {
}