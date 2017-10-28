import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Form } from './form';
import { CoreModule } from '../../common/shared/shared-module';
import { FormService } from './FormService';

@NgModule({
  imports: [
    CommonModule, CoreModule
  ],
  exports: [Form],
  declarations: [
    Form
  ],
  entryComponents: [Form]
})
export class WebFormModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: WebFormModule,
      providers: [FormService]
    };
  }
}