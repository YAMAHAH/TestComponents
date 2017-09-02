import { NgModule, ModuleWithProviders } from '@angular/core';
import { ModalService, ModalModule } from './modal';
import { DialogService, XYZDialogModule } from './dialog';
import { XYZUIConfig } from './rebirth-ui.config';
import { COMMON_SERVICES } from './window-ref';
import { PositionService } from './position/positioning.service';

@NgModule({
  imports: [
    ModalModule,
    XYZDialogModule,

  ],
  exports: [
    ModalModule,
    XYZDialogModule,
  ],
  declarations: [],
  providers: [],
})
export class XYZUIModule {

  static forRoot(): ModuleWithProviders {

    return {
      ngModule: XYZUIModule,
      providers: [
        ...COMMON_SERVICES,
        XYZUIConfig,
        ModalService,
        DialogService,
        { provide: PositionService, useClass: PositionService }
      ]
    };
  }
}
