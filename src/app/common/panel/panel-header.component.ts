import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'x-panel-header,[x-panel-header],x-accordion-header,[x-accordion-header]',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelHeaderComponent {

}
