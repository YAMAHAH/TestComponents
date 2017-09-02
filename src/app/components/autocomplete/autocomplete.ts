import { NgModule, Component, ViewChild, ElementRef, AfterViewInit, AfterContentInit, AfterViewChecked, DoCheck, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef, IterableDiffers, Renderer, forwardRef, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from '../inputtext/inputtext';
import { ButtonModule } from '../button/button';
// import { SharedModule, PrimeTemplate } from '../common/shared';
import { DomHandler } from '../dom/domhandler';
import { ObjectUtils } from '../utils/ObjectUtils';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { UISharedModule, PrimeTemplate } from "../../common/shared/shared";
import { OverlayPanelModule, OverlayPanel } from '../overlaypanel/overlaypanel';

export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutoComplete),
    multi: true
};

@Component({
    selector: 'jy-autoComplete',
    templateUrl: './autocomplete.html',
    host: {
        '[class.ui-inputwrapper-filled]': 'filled',
        '[class.ui-inputwrapper-focus]': 'focus'
    },
    providers: [DomHandler, ObjectUtils, AUTOCOMPLETE_VALUE_ACCESSOR]
})
export class AutoComplete implements AfterViewInit, DoCheck, AfterViewChecked, ControlValueAccessor {

    @Input() minLength: number = 1;

    @Input() delay: number = 300;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() inputStyle: any;

    @Input() inputStyleClass: string;

    @Input() placeholder: string;

    @Input() readonly: boolean;

    @Input() disabled: boolean;

    @Input() maxlength: number;

    @Input() size: number;

    _suggestions: any[];
    @Input() set suggestions(value: any) {
        this._suggestions = value;
        this.showDropdownForm$.emit(true);
    };

    get suggestions() {
        return this._suggestions;
    }

    @Input() appendTo: any;

    @Output() completeMethod: EventEmitter<any> = new EventEmitter();

    @Output() onSelect: EventEmitter<any> = new EventEmitter();

    @Output() onUnselect: EventEmitter<any> = new EventEmitter();

    @Output() onFocus: EventEmitter<any> = new EventEmitter();

    @Output() onDropdownClick: EventEmitter<any> = new EventEmitter();
    // @Output() onShow: EventEmitter<any> = new EventEmitter();
    // @Output() onHide: EventEmitter<any> = new EventEmitter();
    // @Output() onKeydown: EventEmitter<any> = new EventEmitter();

    @Input() field: string;

    @Input() scrollHeight: string = '200px';

    @Input() dropdown: boolean;

    @Input() multiple: boolean;

    @Input() tabindex: number;

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    public itemTemplate: TemplateRef<any>;

    public selectedItemTemplate: TemplateRef<any>;

    value: any;

    onModelChange: Function = () => { };

    onModelTouched: Function = () => { };

    timeout: any;

    differ: any;

    panel: any;

    input: any;

    multipleContainer: any;

    panelVisible: boolean = false;

    documentClickListener: any;

    suggestionsUpdated: boolean;

    highlightOption: any;

    highlightOptionChanged: boolean;

    focus: boolean = false;

    dropdownFocus: boolean = false;

    filled: boolean;


    @ViewChild('in') inputEL: ElementRef;

    constructor(public el: ElementRef, public domHandler: DomHandler,
        differs: IterableDiffers, public renderer: Renderer, public objectUtils: ObjectUtils) {

        this.differ = differs.find([]).create(null);
        this.showDropdownForm$.subscribe((res: any) => {

            // let changes = this.differ.diff(this.suggestions);
            // if (changes && this.panel) {
            if (this.suggestions && this.suggestions.length) {

                if (this.componentOutlet || this.componentRef) {
                    let e: any = { currentTarget: null, target: null };
                    this.overlayPanel.show(e, this.multiple ? this.multipleContainer : this.input);
                    this.registerDocumentClick();
                } else {
                    this.show();
                }
                this.suggestionsUpdated = true;
            }
            else {
                if (this.componentOutlet || this.componentRef) {
                    this.overlayPanel.hide();
                } else {
                    this.hide();
                }
            }
        });

    }


    registerDocumentClick() {
        this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
            if (this.panelVisible || this.componentRef || this.componentOutlet) {
                this.hide();
            }
        });
    }
    showDropdownForm$: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('op') overlayPanel: OverlayPanel;
    @Input() panelStyle: string;
    @Input() componentOutlet: Type<any>;
    @Input() componentRef: any;
    get context() {
        let self = this;
        return { get suggestions() { return self.suggestions } }
    };

    selectResult(event: any) {
        if (event && event.value) {
            this.selectItem(event.value);
        }
    }
    ngDoCheck() {
        // console.log(new Date().getTime());
        // let changes = this.differ.diff(this.suggestions);
        // if (changes && this.panel) {
        //     if (this.suggestions && this.suggestions.length) {
        //         this.show();
        //         this.suggestionsUpdated = true;
        //     }
        //     else {
        //         this.hide();
        //     }
        // }
    }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;

                case 'selectedItem':
                    this.selectedItemTemplate = item.template;
                    break;

                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }

    ngAfterViewInit() {
        this.input = this.domHandler.findSingle(this.el.nativeElement, 'input');
        this.panel = this.domHandler.findSingle(this.el.nativeElement, 'div.ui-autocomplete-panel');

        if (this.multiple) {
            this.multipleContainer = this.domHandler.findSingle(this.el.nativeElement, 'ul.ui-autocomplete-multiple-container');
        }

        // this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
        //     if (this.panelVisible || this.componentRef || this.componentOutlet) {
        //         this.hide();
        //     }
        // });

        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.panel);
            else
                this.domHandler.appendChild(this.panel, this.appendTo);
        }
    }

    ngAfterViewChecked() {
        if (this.suggestionsUpdated) {
            this.align();
            this.suggestionsUpdated = false;
        }

        if (this.highlightOptionChanged) {
            let listItem = this.domHandler.findSingle(this.panel, 'li.ui-state-highlight');
            if (listItem) {
                this.domHandler.scrollInView(this.panel, listItem);
            }
            this.highlightOptionChanged = false;
        }
    }

    writeValue(value: any): void {
        this.value = value;
        this.filled = this.value && this.value != '';
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

    onInput(event: any) {
        let value = event.target.value;
        if (!this.multiple) {
            this.value = value;
            this.onModelChange(value);
        }

        if (value.length === 0) {
            this.hide();
        }

        if (value.length >= this.minLength) {
            //Cancel the search request if user types within the timeout
            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => {
                this.search(event, value);
            }, this.delay);
        }
        else {
            this.suggestions = null;
        }
        this.updateFilledState();
    }

    search(event: any, query: string) {
        //allow empty string but not undefined or null
        if (query === undefined || query === null) {
            return;
        }

        this.completeMethod.emit({
            originalEvent: event,
            query: query
        });
    }

    selectItem(option: any) {
        if (this.multiple) {
            this.input.value = '';
            this.value = this.value || [];
            if (!this.isSelected(option)) {
                this.value.push(option);
                this.onModelChange(this.value);
            }
        }
        else {
            this.input.value = this.field ? this.objectUtils.resolveFieldData(option, this.field) : option;
            this.value = option;
            this.onModelChange(this.value);
        }

        this.onSelect.emit(option);

        this.input.focus();
    }

    show() {
        if (!this.panelVisible && (this.focus || this.dropdownFocus)) {

            this.panelVisible = true;
            this.panel.style.zIndex = ++DomHandler.zindex;
            this.domHandler.fadeIn(this.panel, 200);
            // this.onShow.emit('show');
            this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
                if (this.panelVisible || this.componentRef || this.componentOutlet) {
                    this.hide();
                }
            });
        }
    }

    align() {
        if (this.appendTo)
            this.domHandler.absolutePosition(this.panel, (this.multiple ? this.multipleContainer : this.input));
        else
            this.domHandler.relativePosition(this.panel, (this.multiple ? this.multipleContainer : this.input));
    }

    hide() {
        if (this.componentOutlet || this.componentRef)
            this.overlayPanel.hide();
        else
            this.panelVisible = false;
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
        // this.onHide.emit('hide');
    }

    handleDropdownClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.onDropdownClick.emit({
            originalEvent: event,
            query: this.input.value
        });
    }

    removeItem(item: any) {
        let itemIndex = this.domHandler.index(item);
        let removedValue = this.value.splice(itemIndex, 1)[0];
        this.onUnselect.emit(removedValue);
        this.onModelChange(this.value);
    }

    keydownHandler(event: any) {
        // event.preventDefault();
        // event.stopPropagation();
        // this.onKeydown.emit(event);


        if (this.panelVisible) {
            let highlightItemIndex = this.findOptionIndex(this.highlightOption);

            switch (event.which) {
                //down
                case 40:
                    if (highlightItemIndex != -1) {
                        var nextItemIndex = highlightItemIndex + 1;
                        if (nextItemIndex != (this.suggestions.length)) {
                            this.highlightOption = this.suggestions[nextItemIndex];
                            this.highlightOptionChanged = true;
                        }
                    }
                    else {
                        this.highlightOption = this.suggestions[0];
                    }

                    event.preventDefault();
                    break;

                //up
                case 38:
                    if (highlightItemIndex > 0) {
                        let prevItemIndex = highlightItemIndex - 1;
                        this.highlightOption = this.suggestions[prevItemIndex];
                        this.highlightOptionChanged = true;
                    }

                    event.preventDefault();
                    break;

                //enter
                case 13:
                    if (this.highlightOption) {
                        this.selectItem(this.highlightOption);
                        this.hide();
                    }
                    event.preventDefault();
                    break;

                //escape
                case 27:
                    this.hide();
                    event.preventDefault();
                    break;


                //tab
                case 9:
                    if (this.highlightOption) {
                        this.selectItem(this.highlightOption);
                    }
                    this.hide();
                    break;
            }
        } else if (this.componentRef || this.componentOutlet) {
            switch (event.which) {
                case 27:
                    this.overlayPanel.hide();
                    break;
                default:
                    break;
            }
        } else {
            if (event.which === 40 && this.suggestions) {
                this.search(event, event.target.value);
            }
        }

        if (this.multiple) {
            switch (event.which) {
                //backspace
                case 8:
                    if (this.value && this.value.length && !this.input.value) {
                        let removedValue = this.value.pop();
                        this.onUnselect.emit(removedValue);
                        this.onModelChange(this.value);
                    }
                    break;
            }
        }
    }


    onInputFocus(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.focus = true;
        this.onFocus.emit(event);
    }

    onBlur() {
        this.focus = false;
        this.onModelTouched();
    }

    onDropdownFocus() {
        this.dropdownFocus = true;
        this.inputEL.nativeElement.focus();
    }

    onDropdownBlur() {
        this.dropdownFocus = false;
    }

    isSelected(val: any): boolean {
        let selected: boolean = false;
        if (this.value && this.value.length) {
            for (let i = 0; i < this.value.length; i++) {
                if (this.objectUtils.equals(this.value[i], val)) {
                    selected = true;
                    break;
                }
            }
        }
        return selected;
    }

    findOptionIndex(option: any): number {
        let index: number = -1;
        if (this.suggestions) {
            for (let i = 0; i < this.suggestions.length; i++) {
                if (this.objectUtils.equals(option, this.suggestions[i])) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    updateFilledState() {
        this.filled = this.input && this.input.value != '';
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }

        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.panel);
        }
    }
}

@NgModule({
    imports: [CommonModule, InputTextModule, ButtonModule, UISharedModule, OverlayPanelModule],
    exports: [AutoComplete, UISharedModule],
    declarations: [AutoComplete]
})
export class AutoCompleteModule { }