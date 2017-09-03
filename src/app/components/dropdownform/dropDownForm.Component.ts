import { Component, Input, Type } from '@angular/core';
import { SelectItem } from '../common/api';
import { OverlayPanel } from '../overlaypanel/overlaypanel';

@Component({
    moduleId: module.id,
    selector: 'x-dropdownform',
    templateUrl: './dropDownForm.Component.html',
    styleUrls: ['./dropDownForm.Component.css']
})
export class DropdownFormComponent {

    selectedOption: any;
    @Input() editable: boolean = false;
    @Input() options: SelectItem[] = [];
    @Input() dropdownStyle: any = { 'width': '250px' };
    @Input() panelStyle: any = { 'width': '250px' };
    @Input() componentOutlet: Type<any>;
    get context() {
        let self = this;
        return { get data() { return self.selectedOption } }
    };
    selectResult(event: any) {
        if (event && event.label) {
            this.options = [];
            this.selectedOption = {
                label: event.label,
                value: event.value ? event.value : null
            };
        }
    }

    focusHandler(event: any, overlayPanel: OverlayPanel, target: any) {
        overlayPanel.toggle(event, target);
    }
    keydownHandler(event: any, overlayPanel: OverlayPanel, target: any) {
        switch (event.which) {
            //down
            case 40:
            //up
            case 38:
            //space
            case 32:
                overlayPanel.show(event, target);
                event.preventDefault();
                break;
            //enter
            case 13:
            //escape and tab
            case 27:
            case 9:
                // overlayPanel.toggle(event, target);
                overlayPanel.hide();
                event.preventDefault();
                break;
        }
    }
}
