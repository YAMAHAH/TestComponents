import {
    NgModule, Component, ElementRef, OnInit, AfterViewInit, AfterContentInit, AfterViewChecked, DoCheck, OnDestroy, Input, Output, Renderer, EventEmitter, ContentChildren,
    QueryList, ViewChild, TemplateRef, IterableDiffers, forwardRef, trigger, state, style, transition, animate, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectItem } from '../common/api';
// import { SharedModule, PrimeTemplate } from '../common/shared';
import { ObjectUtils } from '../utils/ObjectUtils';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DomHandler } from '../../common/dom/domhandler';
import { PrimeTemplate, UISharedModule } from '../../common/shared/shared';

export const DROPDOWN_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Dropdown),
    multi: true
};

@Component({
    selector: 'jy-dropdown',
    templateUrl: './dropdown.html',
    animations: [
        trigger('panelState', [
            state('hidden', style({
                opacity: 0
            })),
            state('visible', style({
                opacity: 1
            })),
            transition('visible => hidden', animate('400ms ease-in')),
            transition('hidden => visible', animate('400ms ease-out'))
        ])
    ],
    providers: [DomHandler, ObjectUtils, DROPDOWN_VALUE_ACCESSOR]
})
export class Dropdown implements OnInit, AfterViewInit, AfterContentInit, AfterViewChecked, DoCheck, OnDestroy, ControlValueAccessor {

    @Input() options: SelectItem[];

    @Input() scrollHeight: string = '200px';

    @Input() filter: boolean;

    @Input() style: any;

    @Input() panelStyle: any;

    @Input() styleClass: string;

    @Input() panelStyleClass: string;

    @Input() disabled: boolean;

    @Input() readonly: boolean;

    @Input() autoWidth: boolean = true;

    @Input() required: boolean;

    @Input() editable: boolean;

    @Input() appendTo: any;

    @Input() tabindex: number;

    @Input() placeholder: string;
    @Input() inputId:string;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    @Output() onFocus: EventEmitter<any> = new EventEmitter();

    @Output() onBlur: EventEmitter<any> = new EventEmitter();

    @Output() onKeydown: EventEmitter<any> = new EventEmitter();

    @ViewChild('container') containerViewChild: ElementRef;

    @ViewChild('panel') panelViewChild: ElementRef;

    @ViewChild('itemswrapper') itemsWrapperViewChild: ElementRef;

    @ViewChild('filter') filterViewChild: ElementRef;

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    public itemTemplate: TemplateRef<any>;

    selectedOption: SelectItem;

    value: any;

    onModelChange: Function = () => { };

    onModelTouched: Function = () => { };

    optionsToDisplay: SelectItem[];

    hover: boolean;

    focus: boolean;

    differ: any;

    public panelVisible: boolean = false;

    public documentClickListener: any;

    public optionsChanged: boolean;

    public panel: HTMLDivElement;

    public container: HTMLDivElement;

    public itemsWrapper: HTMLDivElement;

    public initialized: boolean;

    public selfClick: boolean;

    public itemClick: boolean;

    public hoveredItem: any;

    public selectedOptionUpdated: boolean;

    constructor(public el: ElementRef,
        public domHandler: DomHandler,
        public renderer: Renderer,
        differs: IterableDiffers,
        private cd: ChangeDetectorRef,
        public objectUtils: ObjectUtils) {
        this.differ = differs.find([]).create(null);
    }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;

                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }

    ngOnInit() {
        this.optionsToDisplay = this.options;
        this.updateSelectedOption(null);
    }

    ngDoCheck() {
        let changes = this.differ.diff(this.options);

        if (changes && this.initialized) {
            this.optionsToDisplay = this.options;
            this.updateSelectedOption(this.value);
            this.optionsChanged = true;
        }
    }

    ngAfterViewInit() {
        this.container = <HTMLDivElement>this.containerViewChild.nativeElement;
        this.panel = <HTMLDivElement>this.panelViewChild.nativeElement;
        this.itemsWrapper = <HTMLDivElement>this.itemsWrapperViewChild.nativeElement;

        this.updateDimensions();
        this.initialized = true;

        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.panel);
            else
                this.domHandler.appendChild(this.panel, this.appendTo);
        }
    }

    get selectItemValue() {
        return this.selectedOption;
    }
    @Input() set selectItemValue(value: any) {
        this.value = value;
        this.updateSelectedOption(value);
        this.cd.markForCheck();
    }
    get label(): string {
        return (this.selectedOption ? this.selectedOption.label : this.placeholder);
    }


    get editableLabel(): string {
        if (this.value instanceof Object) {
            return this.selectedOption ? this.selectedOption.label : null;
        }
        return this.value || (this.selectedOption ? this.selectedOption.label : null);
    }

    onItemClick(event: any, option: any) {
        this.itemClick = true;
        this.selectItem(event, option);

        this.hide();
    }

    selectItem(event: any, option: any) {
        this.selectedOption = option;
        this.value = option.value;

        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        });
    }

    ngAfterViewChecked() {
        if (this.optionsChanged) {
            this.domHandler.relativePosition(this.panel, this.container);
            this.optionsChanged = false;
        }

        if (this.selectedOptionUpdated && this.itemsWrapper) {
            let selectedItem = this.domHandler.findSingle(this.panel, 'li.ui-state-highlight');
            if (selectedItem) {
                this.domHandler.scrollInView(this.itemsWrapper, this.domHandler.findSingle(this.panel, 'li.ui-state-highlight'));
            }
            this.selectedOptionUpdated = false;
        }
    }

    writeValue(value: any): void {
        this.value = value;
        this.updateSelectedOption(value);
        this.cd.markForCheck();
    }

    updateSelectedOption(val: any): void {
        this.selectedOption = this.findOption(val, this.optionsToDisplay);
        if (!this.placeholder && !this.selectedOption && this.optionsToDisplay && this.optionsToDisplay.length && !this.editable) {
            this.selectedOption = this.optionsToDisplay[0];
        }
        if (this.selectedOption !== val && this.optionsToDisplay && this.optionsToDisplay.length === 0) {
            this.selectedOption = val;
        }
        this.selectedOptionUpdated = true;
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean): void {
        this.disabled = val;
    }

    updateDimensions() {
        if (this.autoWidth) {
            let select = this.domHandler.findSingle(this.el.nativeElement, 'select');
            if (!this.style || (!this.style['width'] && !this.style['min-width'])) {
                this.el.nativeElement.children[0].style.width = select.offsetWidth + 30 + 'px';
            }
        }
    }

    onMouseclick(event: any, input: any) {
        if (this.disabled || this.readonly) {
            return;
        }
        this.selfClick = true;

        if (!this.itemClick) {
            input.focus();

            if (this.panelVisible)
                this.hide();
            else {
                this.show(this.panel, this.container);
                if (this.filterViewChild != undefined) {
                    setTimeout(() => {
                        this.filterViewChild.nativeElement.focus();
                    }, 200);
                }
            }
        }
    }

    onEditableInputClick(event: any) {
        this.itemClick = true;
        this.bindDocumentClickListener();
    }

    onEditableInputFocus(event: any) {
        this.focus = true;
        this.hide();
    }

    onEditableInputChange(event: any) {
        this.value = event.target.value;
        this.updateSelectedOption(this.value);
        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        });
    }
    OnEditableInputKeydown(event: any) {
        this.onKeydown.emit(event);
    }
    show(panel: any, container: any) {
        if (this.options && this.options.length) {
            this.panelVisible = true;
            panel.style.zIndex = ++DomHandler.zindex;

            if (this.appendTo)
                this.domHandler.absolutePosition(panel, container);
            else
                this.domHandler.relativePosition(panel, container);

            this.bindDocumentClickListener();
        }
    }

    hide() {
        this.panelVisible = false;
    }

    onInputFocus(event: any) {
        this.focus = true;
        this.onFocus.emit(event);
    }

    onInputBlur(event: any) {
        this.focus = false;
        this.onModelTouched();
        this.onBlur.emit(event);
    }

    onKeydownHandler(event: any) {
        if (this.readonly) {
            return;
        }

        let selectedItemIndex = this.selectedOption ? this.findOptionIndex(this.selectedOption.value, this.optionsToDisplay) : -1;

        switch (event.which) {
            //down
            case 40:
                if (!this.panelVisible && event.altKey) {
                    this.show(this.panel, this.container);
                }
                else {
                    if (selectedItemIndex != -1) {
                        let nextItemIndex = selectedItemIndex + 1;
                        if (nextItemIndex != (this.optionsToDisplay.length)) {
                            this.selectedOption = this.optionsToDisplay[nextItemIndex];
                            this.selectedOptionUpdated = true;
                            this.selectItem(event, this.selectedOption);
                        }
                    }
                    else if (this.optionsToDisplay) {
                        this.selectedOption = this.optionsToDisplay[0];
                    }
                }

                event.preventDefault();

                break;

            //up
            case 38:
                if (selectedItemIndex > 0) {
                    let prevItemIndex = selectedItemIndex - 1;
                    this.selectedOption = this.optionsToDisplay[prevItemIndex];
                    this.selectedOptionUpdated = true;
                    this.selectItem(event, this.selectedOption);
                }

                event.preventDefault();
                break;

            //space
            case 32:
                if (this.optionsToDisplay && this.optionsToDisplay.length) {
                    this.panelVisible = !this.panelVisible;
                }


                event.preventDefault();
                break;

            //enter
            case 13:
                this.hide();

                event.preventDefault();
                break;

            //escape and tab
            case 27:
            case 9:
                this.panelVisible = false;
                break;
        }
        this.onKeydown.emit(event);
    }

    findListItem(element: any) {
        if (element.nodeName == 'LI') {
            return element;
        }
        else {
            let parent = element.parentElement;
            while (parent.nodeName != 'LI') {
                parent = parent.parentElement;
            }
            return parent;
        }
    }

    findOptionIndex(val: any, opts: SelectItem[]): number {
        let index: number = -1;
        if (opts) {
            for (let i = 0; i < opts.length; i++) {
                if ((val == null && opts[i].value == null) || this.objectUtils.equals(val, opts[i].value)) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    findOption(val: any, opts: SelectItem[]): SelectItem {
        let index: number = this.findOptionIndex(val, opts);
        return (index != -1) ? opts[index] : null;
    }

    onFilter(event: any): void {
        if (this.options && this.options.length) {
            let val = event.target.value.toLowerCase();
            this.optionsToDisplay = [];
            for (let i = 0; i < this.options.length; i++) {
                let option = this.options[i];
                if (option.label.toLowerCase().indexOf(val) > -1) {
                    this.optionsToDisplay.push(option);
                }
            }
            this.optionsChanged = true;
        }

    }

    applyFocus(): void {
        if (this.editable)
            this.domHandler.findSingle(this.el.nativeElement, '.ui-dropdown-label.ui-inputtext').focus();
        else
            this.domHandler.findSingle(this.el.nativeElement, 'input[readonly]').focus();
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
                if (!this.selfClick && !this.itemClick) {
                    this.panelVisible = false;
                    this.unbindDocumentClickListener();
                }

                this.selfClick = false;
                this.itemClick = false;
            });
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }

    ngOnDestroy() {
        this.initialized = false;

        this.unbindDocumentClickListener();

        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.panel);
        }
    }
}

@NgModule({
    imports: [CommonModule, UISharedModule],
    exports: [Dropdown, UISharedModule],
    declarations: [Dropdown]
})
export class DropdownModule { }
