import {
  Component, Input, ChangeDetectionStrategy,
  forwardRef, Output, EventEmitter
} from '@angular/core';
import { PanelComponent, PanelGroup } from '../panel';
import { XYZUIConfig } from '../rebirth-ui.config';

@Component({
  selector: 'x-accordion',
  templateUrl: './accordion.component.html',
  exportAs: 'accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: PanelGroup, useExisting: forwardRef(() => AccordionComponent) }],
})
export class AccordionComponent extends PanelGroup {
  @Input() keepOneItem: boolean;
  @Input() closable: boolean;
  @Output() close = new EventEmitter<PanelComponent>();

  constructor(private rebirthUIConfig: XYZUIConfig) {
    super();
    this.keepOneItem = rebirthUIConfig.accordion.keepOneItem;
    this.closable = rebirthUIConfig.accordion.closable;
    this.type = <any>rebirthUIConfig.accordion.type;
  }

  protected initPanel(panel: PanelComponent) {
    panel.collapsable = true;
    panel.isCollapsed = true;
    panel.closable = this.closable;
    panel.close.subscribe((item: PanelComponent) => this.close.emit(item));
    panel.collapse.subscribe((collapse: boolean) => {
      if (!collapse) {
        this.keepOnePanelOpen(panel);
      }
    });
  }

  toggleById(id: PanelComponent) {
    const panel = this.panels.find(item => item.id === id);
    this.toggle(panel);
  }

  toggle(panel: PanelComponent) {
    if (panel) {
      panel.onCollapse();
    }
  }

  private keepOnePanelOpen(panel: PanelComponent) {
    if (this.keepOneItem) {
      this.panels.forEach(item => {
        if (item !== panel) {
          item.isCollapsed = true;
        }
      });
    }
  }
}
