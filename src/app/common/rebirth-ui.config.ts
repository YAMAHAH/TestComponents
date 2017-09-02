import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable()
export class XYZUIConfig {

  rootContainer: ViewContainerRef;
  alertBox = {
    type: 'info',
    closable: false,
  };

  accordion = {
    type: '',
    keepOneItem: true,
    closable: false
  };
  panel = {
    type: 'default',
    closable: false,
    collapsable: false,
  };
}
