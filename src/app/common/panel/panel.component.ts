import {
  Component, Output, EventEmitter, ChangeDetectionStrategy, Optional, OnInit, Host,
  OnDestroy, ViewContainerRef, EmbeddedViewRef, TemplateRef, Input
} from '@angular/core';
import { PanelGroup } from './panel-group.model';
import { XYZUIConfig } from '../rebirth-ui.config';

@Component({
  selector: 'x-panel,x-accordion-item',
  templateUrl: './panel.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'panel'
})
export class PanelComponent implements OnInit, OnDestroy {
  @Input() id: any;
  closeMe: boolean = false;
  @Input() tag: any;
  @Input() type: 'default' | 'success' | 'info' | 'warning' | 'danger';
  @Input() headTextAlign: 'left' | 'center' | 'right' = 'left';
  @Input() closable: boolean;
  @Input() collapsable: boolean;
  @Input() isCollapsed = false;
  @Input() cssClass: string;
  @Output() close = new EventEmitter<PanelComponent>();
  @Output() collapse = new EventEmitter<boolean>();

  constructor( @Optional() @Host() private panelGroup: PanelGroup,
    private rebirthUIConfig: XYZUIConfig,
  ) {
    //     private vcRef: ViewContainerRef,
    // private templateRef: TemplateRef<PanelComponent>
    this.type = <any>rebirthUIConfig.panel.type;
    this.closable = rebirthUIConfig.panel.closable;
    this.collapsable = rebirthUIConfig.panel.collapsable;
  }

  ngOnInit(): void {
    if (this.panelGroup) {
      this.panelGroup.$addItem(this);
    }
  }

  onClose($event: Event) {
    $event.stopPropagation();
    this.close.emit(this);
  }

  onCollapse() {
    if (this.collapsable) {
      this.isCollapsed = !this.isCollapsed;
      this.collapse.emit(this.isCollapsed);
    }
  }

  ngOnDestroy(): void {
    if (this.panelGroup) {
      this.panelGroup.$removeItem(this);
    }
  }
}

// .panel-open
