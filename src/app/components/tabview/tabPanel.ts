import { Input, Component } from '@angular/core';
@Component({
    selector: 'jy-tabPanel',
    templateUrl: './tabPanel.html'
})
export class TabPanel {

    @Input() header: string;

    @Input() selected: boolean;

    @Input() disabled: boolean;

    @Input() closable: boolean;

    @Input() headerStyle: any;

    @Input() headerStyleClass: string;

    @Input() leftIcon: string;

    @Input() rightIcon: string;

    public closed: boolean;

    public lazy: boolean;
}