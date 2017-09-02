import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'x-panel-body,[x-panel-body],x-accordion-body,[x-accordion-body]',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelBodyComponent {

}
