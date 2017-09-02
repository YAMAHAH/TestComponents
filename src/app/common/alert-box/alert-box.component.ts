import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { XYZUIConfig } from '../rebirth-ui.config';

@Component({
  selector: 'x-alert-box',
  templateUrl: 'alert-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertBoxComponent {
  @Input() type: 'success' | 'info' | 'warning' | 'danger';
  @Input() closable: boolean;
  @Output() close = new EventEmitter<any>();

  constructor(private rebirthUIConfig: XYZUIConfig) {
    this.type = <any>rebirthUIConfig.alertBox.type;
    this.closable = rebirthUIConfig.alertBox.closable;
  }

  @Input()
  set disappearTime(time: number) {
    if (time) {
      setTimeout(() => this.onCloseBox(), time);
    }
  }

  closeBox() {
    this.onCloseBox();
  }

  private onCloseBox() {
    this.close.emit(this);
  }
}
