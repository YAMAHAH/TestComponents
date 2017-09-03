import {
    NgModule, Component, ElementRef, AfterContentInit, AfterViewInit, AfterViewChecked, OnInit, OnDestroy, DoCheck, Input, ViewContainerRef, ViewChild,
    Output, SimpleChange, EventEmitter, ContentChild, ContentChildren, Renderer, IterableDiffers, QueryList, TemplateRef, ChangeDetectorRef, Inject, forwardRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { UISharedModule } from '../../common/shared/shared';
import { PaginatorModule } from '../paginator/paginator';
import { InputTextModule } from '../inputtext/inputtext';
import { Column, Header, Footer, HeaderColumnGroup, FooterColumnGroup, PrimeTemplate } from '../../common/shared/shared';
import { LazyLoadEvent, FilterMetadata, SortMeta } from '../common/api';
import { DomHandler } from '../dom/domhandler';
import { ObjectUtils } from '../utils/ObjectUtils';
import { Subscription } from 'rxjs/Subscription';
import { BlockableUI } from '../common/api';
import { SharedModule } from '../../common/shared/shared-module';
import { Type } from '@angular/core';

@Component({
    selector: 'x-dtRadioButton',
    template: `
        <div class="ui-radiobutton ui-widget">
            <div class="ui-helper-hidden-accessible">
                <input type="radio" [checked]="checked">
            </div>
            <div class="ui-radiobutton-box ui-widget ui-radiobutton-relative ui-state-default" (click)="handleClick($event)"
                        (mouseenter)="hover=true" (mouseleave)="hover=false"
                        [ngClass]="{'ui-state-hover':hover,'ui-state-active':checked}">
                <span class="ui-radiobutton-icon" [ngClass]="{'fa fa-circle':checked}"></span>
            </div>
        </div>
    `
})
export class DTRadioButton {

    @Input() checked: boolean;

    @Output() onClick: EventEmitter<any> = new EventEmitter();

    public hover: boolean;

    handleClick(event: any) {
        this.onClick.emit(event);
    }
}

@Component({
    selector: 'x-dtCheckbox',
    template: `
        <div class="ui-chkbox ui-widget">
            <div class="ui-helper-hidden-accessible">
                <input type="checkbox" [checked]="checked">
            </div>
            <div class="ui-chkbox-box ui-widget ui-corner-all ui-state-default" (click)="handleClick($event)"
                        (mouseover)="hover=true" (mouseout)="hover=false" 
                        [ngClass]="{'ui-state-hover':hover&&!disabled,'ui-state-active':checked&&!disabled,'ui-state-disabled':disabled}">
                <span class="ui-chkbox-icon ui-c" [ngClass]="{'fa fa-check':checked}"></span>
            </div>
        </div>
    `
})
export class DTCheckbox {

    @Input() checked: boolean;

    @Input() disabled: boolean;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    public hover: boolean;

    handleClick(event: any) {
        if (!this.disabled) {
            this.onChange.emit({ originalEvent: event, checked: !this.checked });
        }
    }
}

@Component({
    selector: 'x-rowExpansionLoader',
    template: ``
})
export class RowExpansionLoader {

    @Input() template: TemplateRef<any>;

    @Input() rowData: any;

    constructor(public viewContainer: ViewContainerRef) { }

    ngOnInit() {
        let view = this.viewContainer.createEmbeddedView(this.template, {
            '\$implicit': this.rowData
        });
    }
}

@Component({
    selector: '[jyColumnHeaders]',
    templateUrl: './columnHeaders.html'

})
export class ColumnHeaders {

    constructor( @Inject(forwardRef(() => DataTable)) public dt: DataTable) { }

    @Input("jyColumnHeaders") columns: Column[];
}

@Component({
    selector: '[jyColumnFooters]',
    templateUrl: './columnFooters.html'
})
export class ColumnFooters {

    constructor( @Inject(forwardRef(() => DataTable)) public dt: DataTable) { }

    @Input("jyColumnFooters") columns: Column[];
}

@Component({
    selector: '[jyTableBody]',
    templateUrl: './tableBody.html'
})
export class TableBody {

    constructor( @Inject(forwardRef(() => DataTable)) public dt: DataTable) { }

    @Input("jyTableBody") columns: Column[];

    visibleColumns() {
        return this.columns ? this.columns.filter(c => !c.hidden) : [];
    }
}

@Component({
    selector: '[jyScrollableView]',
    template: `
        <div #scrollHeader class="ui-widget-header ui-datatable-scrollable-header" [ngStyle]="{'width': width}">
            <div #scrollHeaderBox  class="ui-datatable-scrollable-header-box">
                <table [class]="dt.tableStyleClass" [ngStyle]="dt.tableStyle">
                    <thead class="ui-datatable-thead">
                        <tr *ngIf="!dt.headerColumnGroup" class="ui-state-default" [jyColumnHeaders]="columns"></tr>
                        <ng-template [ngIf]="dt.headerColumnGroup">
                            <tr *ngFor="let headerRow of dt.headerColumnGroup.rows" class="ui-state-default" [jyColumnHeaders]="headerRow.columns"></tr>
                        </ng-template>
                    </thead>
                </table>
            </div>
        </div>
        <div #scrollBody class="ui-datatable-scrollable-body" [ngStyle]="{'width': width,'max-height':dt.scrollHeight}">
            <div #scrollTableWrapper style="position:relative" [ngStyle]="{'height':virtualTableHeight}">
                <table #scrollTable [class]="dt.tableStyleClass" [ngStyle]="dt.tableStyle" [ngClass]="{'ui-datatable-virtual-table':virtualScroll}" style="top:0px">
                    <colgroup class="ui-datatable-scrollable-colgroup">
                        <col *ngFor="let col of dt.visibleColumns()" />
                    </colgroup>
                    <tbody [ngClass]="{'ui-datatable-data ui-widget-content': true, 'ui-datatable-hoverable-rows': (dt.rowHover||dt.selectionMode)}" [jyTableBody]="columns"></tbody>
                </table>
            </div>
            <div class="ui-widget-overlay ui-datatable-load-status" *ngIf="loading"></div>
        </div>
        <div #scrollFooter class="ui-widget-header ui-datatable-scrollable-footer" [ngStyle]="{'width': width}" *ngIf="dt.hasFooter()">
            <div #scrollFooterBox  class="ui-datatable-scrollable-footer-box">
                <table [class]="dt.tableStyleClass" [ngStyle]="dt.tableStyle">
                    <tfoot class="ui-datatable-tfoot">
                        <tr *ngIf="!footerColumnGroup" [jyColumnFooters]="columns" class="ui-state-default"></tr>
                        <ng-template [ngIf]="footerColumnGroup">
                            <tr *ngFor="let footerRow of footerColumnGroup.rows" [jyColumnFooters]="footerRow.columns"></tr>
                        </ng-template>
                    </tfoot>
                </table>
            </div>
        </div>
    `
})
export class ScrollableView implements AfterViewInit, AfterViewChecked, OnDestroy {

    constructor( @Inject(forwardRef(() => DataTable)) public dt: DataTable, public domHandler: DomHandler, public el: ElementRef, public renderer: Renderer) { }

    @Input("jyScrollableView") columns: Column[];

    @ViewChild('scrollHeader') scrollHeaderViewChild: ElementRef;

    @ViewChild('scrollHeaderBox') scrollHeaderBoxViewChild: ElementRef;

    @ViewChild('scrollBody') scrollBodyViewChild: ElementRef;

    @ViewChild('scrollTable') scrollTableViewChild: ElementRef;

    @ViewChild('scrollTableWrapper') scrollTableWrapperViewChild: ElementRef;

    @ViewChild('scrollFooter') scrollFooterViewChild: ElementRef;

    @ViewChild('scrollFooterBox') scrollFooterBoxViewChild: ElementRef;

    @Input() frozen: boolean;

    @Input() width: string;

    @Input() virtualScroll: boolean;

    @Output() onVirtualScroll: EventEmitter<any> = new EventEmitter();

    @Input() loading: boolean;

    public scrollBody: HTMLDivElement;

    public scrollHeader: HTMLDivElement

    public scrollHeaderBox: HTMLDivElement;

    public scrollTable: HTMLDivElement;

    public scrollTableWrapper: HTMLDivElement;

    public scrollFooter: HTMLDivElement

    public scrollFooterBox: HTMLDivElement;

    public bodyScrollListener: Function;

    public headerScrollListener: Function;

    public scrollBodyMouseWheelListener: Function;

    public scrollFunction: Function;

    public rowHeight: number;

    public scrollTimeout: any;

    ngAfterViewInit() {
        this.initScrolling();
    }

    ngAfterViewChecked() {
        if (this.virtualScroll && !this.rowHeight) {
            let row = this.domHandler.findSingle(this.scrollTable, 'tr.ui-widget-content');
            if (row) {
                this.rowHeight = this.domHandler.getOuterHeight(row);
            }
        }
    }

    initScrolling() {
        this.scrollHeader = <HTMLDivElement>this.scrollHeaderViewChild.nativeElement;
        this.scrollHeaderBox = <HTMLDivElement>this.scrollHeaderBoxViewChild.nativeElement;
        this.scrollBody = <HTMLDivElement>this.scrollBodyViewChild.nativeElement;
        this.scrollTable = <HTMLDivElement>this.scrollTableViewChild.nativeElement;
        this.scrollTableWrapper = <HTMLDivElement>this.scrollTableWrapperViewChild.nativeElement;
        this.scrollFooter = this.scrollFooterViewChild ? <HTMLDivElement>this.scrollFooterViewChild.nativeElement : null;
        this.scrollFooterBox = this.scrollFooterBoxViewChild ? <HTMLDivElement>this.scrollFooterBoxViewChild.nativeElement : null;

        if (!this.frozen) {
            let frozenView = this.el.nativeElement.previousElementSibling;
            if (frozenView) {
                var frozenScrollBody = this.domHandler.findSingle(frozenView, '.ui-datatable-scrollable-body');
            }

            this.bodyScrollListener = this.renderer.listen(this.scrollBody, 'scroll', (event: any) => {
                this.scrollHeaderBox.style.marginLeft = -1 * this.scrollBody.scrollLeft + 'px';
                if (this.scrollFooterBox) {
                    this.scrollFooterBox.style.marginLeft = -1 * this.scrollBody.scrollLeft + 'px';
                }
                if (frozenScrollBody) {
                    frozenScrollBody.scrollTop = this.scrollBody.scrollTop;
                }

                if (this.virtualScroll) {
                    clearTimeout(this.scrollTimeout);
                    this.scrollTimeout = setTimeout(() => {
                        let viewport = this.domHandler.getOuterHeight(this.scrollBody);
                        let tableHeight = this.domHandler.getOuterHeight(this.scrollTable);
                        let pageHeight = this.rowHeight * this.dt.rows;
                        let virtualTableHeight = parseFloat(this.virtualTableHeight);
                        let pageCount = (virtualTableHeight / pageHeight) || 1;

                        if (this.scrollBody.scrollTop + viewport > parseFloat(this.scrollTable.style.top) + tableHeight || this.scrollBody.scrollTop < parseFloat(this.scrollTable.style.top)) {
                            let page = Math.floor((this.scrollBody.scrollTop * pageCount) / (this.scrollBody.scrollHeight)) + 1;
                            this.onVirtualScroll.emit({
                                page: page
                            });
                            this.scrollTable.style.top = ((page - 1) * pageHeight) + 'px';
                        }
                    }, 200);
                }
            });

            //to trigger change detection
            this.scrollBodyMouseWheelListener = this.renderer.listen(this.scrollBody, 'mousewheel', (event: any) => { });

            this.headerScrollListener = this.renderer.listen(this.scrollHeader, 'scroll', () => {
                this.scrollHeader.scrollLeft = 0;
            });
        }

        let scrollBarWidth = this.domHandler.calculateScrollbarWidth();
        if (!this.frozen) {
            this.scrollHeaderBox.style.marginRight = scrollBarWidth + 'px';
            if (this.scrollFooterBox) {
                this.scrollFooterBox.style.marginRight = scrollBarWidth + 'px';
            }
        }
        else {
            this.scrollBody.style.paddingBottom = scrollBarWidth + 'px';
        }
    }

    get virtualTableHeight(): string {
        let totalRecords = this.dt.lazy ? this.dt.totalRecords : (this.dt.value ? this.dt.value.length : 0);
        return (totalRecords * this.rowHeight) + 'px';
    }

    ngOnDestroy() {
        if (this.bodyScrollListener) {
            this.bodyScrollListener();
        }

        if (this.scrollBodyMouseWheelListener) {
            this.scrollBodyMouseWheelListener();
        }

        if (this.headerScrollListener) {
            this.headerScrollListener();
        }
    }
}

@Component({
    selector: 'x-dataTable',
    templateUrl: './datatable.html',
    providers: [DomHandler, ObjectUtils]
})
export class DataTable implements AfterViewChecked, AfterViewInit, AfterContentInit, OnInit, DoCheck, OnDestroy, BlockableUI {

    @Input() value: any[];

    @Input() paginator: boolean;

    @Input() rows: number;

    @Input() totalRecords: number;

    @Input() pageLinks: number = 5;

    @Input() rowsPerPageOptions: number[];

    @Input() responsive: boolean;

    @Input() stacked: boolean;

    @Input() selectionMode: string;

    @Input() selection: any;

    @Output() selectionChange: EventEmitter<any> = new EventEmitter();

    @Input() editable: boolean;

    @Output() onRowClick: EventEmitter<any> = new EventEmitter();

    @Output() onRowSelect: EventEmitter<any> = new EventEmitter();

    @Output() onRowUnselect: EventEmitter<any> = new EventEmitter();

    @Output() onRowDblclick: EventEmitter<any> = new EventEmitter();

    @Output() onHeaderCheckboxToggle: EventEmitter<any> = new EventEmitter();

    @Output() onContextMenuSelect: EventEmitter<any> = new EventEmitter();

    @Input() filterDelay: number = 300;

    @Input() lazy: boolean;

    @Output() onLazyLoad: EventEmitter<any> = new EventEmitter();

    @Input() resizableColumns: boolean;

    @Input() columnResizeMode: string = 'fit';

    @Output() onColResize: EventEmitter<any> = new EventEmitter();

    @Input() reorderableColumns: boolean;

    @Output() onColReorder: EventEmitter<any> = new EventEmitter();

    @Input() scrollable: boolean;

    @Input() virtualScroll: boolean;

    @Input() scrollHeight: any;

    @Input() scrollWidth: any;

    @Input() frozenWidth: any;

    @Input() unfrozenWidth: any;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() tableStyle: any;

    @Input() tableStyleClass: string;

    @Input() globalFilter: any;

    @Input() sortMode: string = 'single';

    @Input() sortField: string;

    @Input() sortOrder: number = 1;

    @Input() groupField: string;

    @Input() multiSortMeta: SortMeta[];

    @Input() contextMenu: any;

    @Input() csvSeparator: string = ',';

    @Input() exportFilename: string = 'download';

    @Input() emptyMessage: string = 'No records found';

    @Input() paginatorPosition: string = 'bottom';

    @Input() metaKeySelection: boolean = true;

    @Output() onEditInit: EventEmitter<any> = new EventEmitter();

    @Output() onEditComplete: EventEmitter<any> = new EventEmitter();

    @Output() onEdit: EventEmitter<any> = new EventEmitter();

    @Output() onEditCancel: EventEmitter<any> = new EventEmitter();

    @Output() onPage: EventEmitter<any> = new EventEmitter();

    @Output() onSort: EventEmitter<any> = new EventEmitter();

    @Output() onFilter: EventEmitter<any> = new EventEmitter();

    @ContentChild(Header) header: Header;

    @ContentChild(Footer) footer: Footer;

    @Input() expandableRows: boolean;

    @Input() expandedRows: any[];

    @Input() expandableRowGroups: boolean;

    @Input() rowExpandMode: string = 'multiple';

    @Input() public expandedRowsGroups: any[];

    @Input() tabindex: number = 1;

    @Input() rowStyleClass: Function;

    @Input() rowGroupMode: string;

    @Input() sortableRowGroup: boolean = true;

    @Input() sortFile: string;

    @Input() rowHover: boolean;

    @Input() first: number = 0;

    @Input() public filters: { [s: string]: FilterMetadata; } = {};

    @Output() onRowExpand: EventEmitter<any> = new EventEmitter();

    @Output() onRowCollapse: EventEmitter<any> = new EventEmitter();

    @Output() onRowGroupExpand: EventEmitter<any> = new EventEmitter();

    @Output() onRowGroupCollapse: EventEmitter<any> = new EventEmitter();

    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate>;

    @ContentChildren(Column) cols: QueryList<Column>;

    @ContentChild(HeaderColumnGroup) headerColumnGroup: HeaderColumnGroup;

    @ContentChild(FooterColumnGroup) footerColumnGroup: FooterColumnGroup;

    public dataToRender: any[];

    public page: number = 0;

    public filterTimeout: any;

    public filteredValue: any[];

    public columns: Column[];

    public frozenColumns: Column[];

    public scrollableColumns: Column[];

    public columnsChanged: boolean = false;

    public dataChanged: boolean = false;

    public stopSortPropagation: boolean;

    public sortColumn: Column;

    public columnResizing: boolean;

    public lastResizerHelperX: number;

    public documentColumnResizeListener: Function;

    public documentColumnResizeEndListener: Function;

    public resizerHelper: any;

    public resizeColumn: any;

    public reorderIndicatorUp: any;

    public reorderIndicatorDown: any;

    public draggedColumn: any;

    public dropPosition: number;

    public tbody: any;

    public rowTouched: boolean;

    public rowGroupToggleClick: boolean;

    public editingCell: any;

    public stopFilterPropagation: boolean;

    public rowGroupMetadata: any;

    public rowGroupHeaderTemplate: TemplateRef<any>;

    public rowGroupHeaderComponent: Type<any>;

    public rowGroupFooterComponent: Type<any>;
    public rowGroupFooterTemplate: TemplateRef<any>;

    public rowExpansionTemplate: TemplateRef<any>;
    public rowExpansionComponent: Type<any>;

    public scrollBarWidth: number;

    public loading: boolean;

    differ: any;

    globalFilterFunction: any;

    columnsSubscription: Subscription;

    constructor(public el: ElementRef, public domHandler: DomHandler, differs: IterableDiffers,
        public renderer: Renderer, public changeDetector: ChangeDetectorRef, public objectUtils: ObjectUtils) {
        this.differ = differs.find([]).create(null);
    }

    ngOnInit() {
        if (this.lazy) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
    }

    ngAfterContentInit() {
        this.initColumns();

        this.columnsSubscription = this.cols.changes.subscribe(_ => {
            this.initColumns();
            this.changeDetector.markForCheck();
        });

        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'rowexpansion':
                    this.rowExpansionTemplate = item.template;
                    break;

                case 'rowgroupheader':
                    this.rowGroupHeaderTemplate = item.template;
                    break;

                case 'rowgroupfooter':
                    this.rowGroupFooterTemplate = item.template;
                    break;
            }
        });
    }

    ngAfterViewChecked() {
        if (this.columnsChanged && this.el.nativeElement.offsetParent) {
            if (this.resizableColumns) {
                this.initResizableColumns();
            }

            if (this.reorderableColumns) {
                this.initColumnReordering();
            }

            this.columnsChanged = false;
        }

        if (this.dataChanged) {
            this.dataChanged = false;
        }
    }

    ngAfterViewInit() {
        if (this.globalFilter) {
            this.globalFilterFunction = this.renderer.listen(this.globalFilter, 'keyup', () => {
                this.filterTimeout = setTimeout(() => {
                    this._filter();
                    this.filterTimeout = null;
                }, this.filterDelay);
            });
        }
    }

    ngDoCheck() {
        let changes = this.differ.diff(this.value);
        if (changes) {
            this.dataChanged = true;
            if (this.paginator) {
                this.updatePaginator();
            }

            if (this.hasFilter()) {
                if (this.lazy) {
                    //prevent loop
                    if (this.stopFilterPropagation)
                        this.stopFilterPropagation = false;
                    else
                        this._filter();
                }
                else {
                    this._filter();
                }
            }

            if (this.stopSortPropagation) {
                this.stopSortPropagation = false;
            }
            else if (!this.lazy && (this.sortField || this.multiSortMeta)) {
                if (!this.sortColumn && this.columns) {
                    this.sortColumn = this.columns.find(col => col.field === this.sortField && col.sortable === 'custom');
                }

                if (this.sortMode == 'single')
                    this.sortSingle();
                else if (this.sortMode == 'multiple')
                    this.sortMultiple();
            }

            this.updateDataToRender(this.filteredValue || this.value);
        }
    }

    initColumns(): void {
        this.columns = this.cols.toArray();

        if (this.scrollable) {
            this.scrollableColumns = [];
            this.cols.forEach((col) => {
                if (col.frozen) {
                    this.frozenColumns = this.frozenColumns || [];
                    this.frozenColumns.push(col);
                }
                else {
                    this.scrollableColumns.push(col);
                }
            });
        }

        this.columnsChanged = true;
    }

    resolveFieldData(data: any, field: string): any {
        if (data && field) {
            if (field.indexOf('.') == -1) {
                return data[field];
            }
            else {
                let fields: string[] = field.split('.');
                let value = data;
                for (var i = 0, len = fields.length; i < len; ++i) {
                    if (value == null) {
                        return null;
                    }
                    value = value[fields[i]];
                }
                return value;
            }
        }
        else {
            return null;
        }
    }

    updateRowGroupMetadata() {
        this.rowGroupMetadata = {};
        if (this.dataToRender) {
            for (let i = 0; i < this.dataToRender.length; i++) {
                let rowData = this.dataToRender[i];
                let group = this.resolveFieldData(rowData, this.sortField);
                if (i == 0) {
                    this.rowGroupMetadata[group] = { index: 0, size: 1 };
                }
                else {
                    let previousRowData = this.dataToRender[i - 1];
                    let previousRowGroup = this.resolveFieldData(previousRowData, this.sortField);
                    if (group === previousRowGroup) {
                        this.rowGroupMetadata[group].size++;
                    }
                    else {
                        this.rowGroupMetadata[group] = { index: i, size: 1 };
                    }
                }
            }
        }
    }

    updatePaginator() {
        //total records
        this.totalRecords = this.lazy ? this.totalRecords : (this.value ? this.value.length : 0);

        //first
        if (this.totalRecords && this.first >= this.totalRecords) {
            let numberOfPages = Math.ceil(this.totalRecords / this.rows);
            this.first = Math.max((numberOfPages - 1) * this.rows, 0);
        }
    }

    paginate(event: any) {
        this.first = event.first;
        this.rows = event.rows;

        if (this.lazy) {
            this.stopFilterPropagation = true;
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        else {
            this.updateDataToRender(this.filteredValue || this.value);
        }

        this.onPage.emit({
            first: this.first,
            rows: this.rows
        });
    }

    updateDataToRender(datasource: any) {
        if ((this.paginator || this.virtualScroll) && datasource) {
            this.dataToRender = [];
            let startIndex: number = this.lazy ? 0 : this.first;
            let endIndex: number = this.virtualScroll ? this.first + this.rows * 2 : startIndex + this.rows;

            for (let i = startIndex; i < endIndex; i++) {
                if (i >= datasource.length) {
                    break;
                }

                this.dataToRender.push(datasource[i]);
            }
        }
        else {
            this.dataToRender = datasource;
        }

        if (this.rowGroupMode) {
            this.updateRowGroupMetadata();
        }

        this.loading = false;
    }

    onVirtualScroll(event: any) {
        this.loading = true;
        this.first = (event.page - 1) * this.rows;

        if (this.lazy) {
            this.stopFilterPropagation = true;
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        else {
            this.updateDataToRender(this.filteredValue || this.value);
        }
    }

    onHeaderKeydown(event: any, column: Column) {
        if (event.keyCode == 13) {
            this.sort(event, column);
            event.preventDefault();
        }
    }

    onHeaderMousedown(event: any, header: any) {
        if (this.reorderableColumns) {
            if (event.target.nodeName !== 'INPUT') {
                header.draggable = true;
            } else if (event.target.nodeName === 'INPUT') {
                header.draggable = false;
            }
        }
    }

    sort(event: any, column: Column) {
        if (!column.sortable) {
            return;
        }

        let targetNode = event.target.nodeName;
        if (targetNode == 'TH' || (targetNode == 'SPAN' && !this.domHandler.hasClass(event.target, 'ui-c'))) {
            let columnSortField = column.sortField || column.field;
            this.sortOrder = (this.sortField === columnSortField) ? this.sortOrder * -1 : 1;
            this.sortField = columnSortField;
            this.sortColumn = column;
            let metaKey = event.metaKey || event.ctrlKey;

            if (this.lazy) {
                this.stopFilterPropagation = true;
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            }
            else {
                if (this.sortMode == 'multiple') {
                    if (!this.multiSortMeta || !metaKey) {
                        this.multiSortMeta = [];
                    }

                    this.addSortMeta({ field: this.sortField, order: this.sortOrder });
                    this.sortMultiple();
                }
                else {
                    this.sortSingle();
                }
            }

            this.onSort.emit({
                field: this.sortField,
                order: this.sortOrder,
                multisortmeta: this.multiSortMeta
            });
        }
    }

    sortSingle() {
        if (this.value) {
            if (this.sortColumn && this.sortColumn.sortable === 'custom') {
                this.sortColumn.sortFunction.emit({
                    field: this.sortField,
                    order: this.sortOrder
                });
            }
            else {
                this.value.sort((data1, data2) => {
                    let value1 = this.resolveFieldData(data1, this.sortField);
                    let value2 = this.resolveFieldData(data2, this.sortField);
                    let result = null;

                    if (value1 == null && value2 != null)
                        result = -1;
                    else if (value1 != null && value2 == null)
                        result = 1;
                    else if (value1 == null && value2 == null)
                        result = 0;
                    else if (typeof value1 === 'string' && typeof value2 === 'string')
                        result = value1.localeCompare(value2);
                    else
                        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

                    return (this.sortOrder * result);
                });
            }

            this.first = 0;

            if (this.hasFilter()) {
                this._filter();
            }
        }

        //prevent resort at ngDoCheck
        this.stopSortPropagation = true;
    }

    sortMultiple() {
        if (this.value) {
            this.value.sort((data1, data2) => {
                return this.multisortField(data1, data2, this.multiSortMeta, 0);
            });

            if (this.hasFilter()) {
                this._filter();
            }
        }

        //prevent resort at ngDoCheck
        this.stopSortPropagation = true;
    }

    multisortField(data1: any, data2: any, multiSortMeta: any, index: any): any {
        let value1 = this.resolveFieldData(data1, multiSortMeta[index].field);
        let value2 = this.resolveFieldData(data2, multiSortMeta[index].field);
        let result = null;

        if (typeof value1 == 'string' || value1 instanceof String) {
            if (value1.localeCompare && (value1 != value2)) {
                return (multiSortMeta[index].order * value1.localeCompare(value2));
            }
        }
        else {
            result = (value1 < value2) ? -1 : 1;
        }

        if (value1 == value2) {
            return (multiSortMeta.length - 1) > (index) ? (this.multisortField(data1, data2, multiSortMeta, index + 1)) : 0;
        }

        return (multiSortMeta[index].order * result);
    }

    addSortMeta(meta: any) {
        var index = -1;
        for (var i = 0; i < this.multiSortMeta.length; i++) {
            if (this.multiSortMeta[i].field === meta.field) {
                index = i;
                break;
            }
        }

        if (index >= 0)
            this.multiSortMeta[index] = meta;
        else
            this.multiSortMeta.push(meta);
    }

    isSorted(column: Column) {
        if (!column.sortable) {
            return false;
        }

        let columnSortField = column.sortField || column.field;

        if (this.sortMode === 'single') {
            return (this.sortField && columnSortField === this.sortField);
        }
        else if (this.sortMode === 'multiple') {
            let sorted = false;
            if (this.multiSortMeta) {
                for (let i = 0; i < this.multiSortMeta.length; i++) {
                    if (this.multiSortMeta[i].field == columnSortField) {
                        sorted = true;
                        break;
                    }
                }
            }
            return sorted;
        }
    }

    getSortOrder(column: Column) {
        let order = 0;
        let columnSortField = column.sortField || column.field;

        if (this.sortMode === 'single') {
            if (this.sortField && columnSortField === this.sortField) {
                order = this.sortOrder;
            }
        }
        else if (this.sortMode === 'multiple') {
            if (this.multiSortMeta) {
                for (let i = 0; i < this.multiSortMeta.length; i++) {
                    if (this.multiSortMeta[i].field == columnSortField) {
                        order = this.multiSortMeta[i].order;
                        break;
                    }
                }
            }
        }
        return order;
    }

    onRowGroupClick(event: any) {
        if (this.rowGroupToggleClick) {
            this.rowGroupToggleClick = false;
            return;
        }

        if (this.sortableRowGroup) {
            let targetNode = event.target.nodeName;
            if ((targetNode == 'TD' || (targetNode == 'SPAN' && !this.domHandler.hasClass(event.target, 'ui-c')))) {
                if (this.sortField != this.groupField) {
                    this.sortField = this.groupField;
                    this.sortSingle();
                }
                else {
                    this.sortOrder = -1 * this.sortOrder;
                    this.sortSingle();
                }
            }
        }
    }

    handleRowClick(event: any, rowData: any) {
        let targetNode = event.target.nodeName;
        if (targetNode == 'TD' || (targetNode == 'SPAN' && !this.domHandler.hasClass(event.target, 'ui-c'))) {
            this.onRowClick.next({ originalEvent: event, data: rowData });

            if (!this.selectionMode) {
                return;
            }

            let selected = this.isSelected(rowData);
            let metaSelection = this.rowTouched ? false : this.metaKeySelection;

            if (metaSelection) {
                let metaKey = event.metaKey || event.ctrlKey;

                if (selected && metaKey) {
                    if (this.isSingleSelectionMode()) {
                        this.selection = null;
                        this.selectionChange.emit(null);
                    }
                    else {
                        this.selection.splice(this.findIndexInSelection(rowData), 1);
                        this.selectionChange.emit(this.selection);
                    }

                    this.onRowUnselect.emit({ originalEvent: event, data: rowData, type: 'row' });
                }
                else {
                    if (this.isSingleSelectionMode()) {
                        this.selection = rowData;
                        this.selectionChange.emit(rowData);
                    }
                    else if (this.isMultipleSelectionMode()) {
                        if (metaKey)
                            this.selection = this.selection || [];
                        else
                            this.selection = [];

                        this.selection.push(rowData);
                        this.selectionChange.emit(this.selection);
                    }

                    this.onRowSelect.emit({ originalEvent: event, data: rowData, type: 'row' });
                }
            }
            else {
                if (this.isSingleSelectionMode()) {
                    if (selected) {
                        this.selection = null;
                        this.onRowUnselect.emit({ originalEvent: event, data: rowData, type: 'row' });
                    }
                    else {
                        this.selection = rowData;
                        this.onRowSelect.emit({ originalEvent: event, data: rowData, type: 'row' });
                    }
                }
                else {
                    if (selected) {
                        this.selection.splice(this.findIndexInSelection(rowData), 1);
                        this.onRowUnselect.emit({ originalEvent: event, data: rowData, type: 'row' });
                    }
                    else {
                        this.selection = this.selection || [];
                        this.selection.push(rowData);
                        this.onRowSelect.emit({ originalEvent: event, data: rowData, type: 'row' });
                    }
                }

                this.selectionChange.emit(this.selection);
            }
        }

        this.rowTouched = false;
    }

    handleRowTouchEnd(event: any) {
        this.rowTouched = true;
    }

    selectRowWithRadio(event: any, rowData: any) {
        if (this.selection != rowData) {
            this.selection = rowData;
            this.selectionChange.emit(this.selection);
            this.onRowSelect.emit({ originalEvent: event, data: rowData, type: 'radiobutton' });
        }
    }

    toggleRowWithCheckbox(event: any, rowData: any) {
        let selectionIndex = this.findIndexInSelection(rowData);
        this.selection = this.selection || [];

        if (selectionIndex != -1) {
            this.selection.splice(selectionIndex, 1);
            this.onRowUnselect.emit({ originalEvent: event, data: rowData, type: 'checkbox' });
        }

        else {
            this.selection.push(rowData);
            this.onRowSelect.emit({ originalEvent: event, data: rowData, type: 'checkbox' });
        }

        this.selectionChange.emit(this.selection);
    }

    toggleRowsWithCheckbox(event: any) {
        if (event.checked)
            this.selection = this.dataToRender.slice(0);
        else
            this.selection = [];

        this.selectionChange.emit(this.selection);

        this.onHeaderCheckboxToggle.emit({ originalEvent: event, checked: event.checked });
    }

    onRowRightClick(event: any, rowData: any) {
        if (this.contextMenu) {
            let selectionIndex = this.findIndexInSelection(rowData);
            let selected = selectionIndex != -1;

            if (!selected) {
                if (this.isSingleSelectionMode()) {
                    this.selection = rowData;
                    this.selectionChange.emit(rowData);
                }
                else if (this.isMultipleSelectionMode()) {
                    this.selection = [];
                    this.selection.push(rowData);
                    this.selectionChange.emit(this.selection);
                }
            }

            this.contextMenu.show(event);
            this.onContextMenuSelect.emit({ originalEvent: event, data: rowData });
        }
    }

    rowDblclick(event: any, rowData: any) {
        this.onRowDblclick.emit({ originalEvent: event, data: rowData });
    }

    isSingleSelectionMode() {
        return this.selectionMode === 'single';
    }

    isMultipleSelectionMode() {
        return this.selectionMode === 'multiple';
    }

    findIndexInSelection(rowData: any) {
        let index: number = -1;
        if (this.selection) {
            for (let i = 0; i < this.selection.length; i++) {
                if (this.objectUtils.equals(rowData, this.selection[i])) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    isSelected(rowData: any) {
        return ((rowData && this.objectUtils.equals(rowData, this.selection)) || this.findIndexInSelection(rowData) != -1);
    }

    get allSelected() {
        let val = true;
        if (this.dataToRender && this.selection && (this.dataToRender.length <= this.selection.length)) {
            for (let data of this.dataToRender) {
                if (!this.isSelected(data)) {
                    val = false;
                    break;
                }
            }
        }
        else {
            val = false;
        }
        return val;
    }

    onFilterKeyup(value: any, field: any, matchMode: any) {
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }

        this.filterTimeout = setTimeout(() => {
            this.filter(value, field, matchMode);
            this.filterTimeout = null;
        }, this.filterDelay);
    }

    filter(value: any, field: any, matchMode: any) {
        if (!this.isFilterBlank(value))
            this.filters[field] = { value: value, matchMode: matchMode };
        else if (this.filters[field])
            delete this.filters[field];

        this._filter();
    }

    isFilterBlank(filter: any): boolean {
        if (filter !== null && filter !== undefined) {
            if ((typeof filter === 'string' && filter.trim().length == 0) || (filter instanceof Array && filter.length == 0))
                return true;
            else
                return false;
        }
        return true;
    }

    _filter() {
        this.first = 0;

        if (this.lazy) {
            this.stopFilterPropagation = true;
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        else {
            this.filteredValue = [];

            for (let i = 0; i < this.value.length; i++) {
                let localMatch = true;
                let globalMatch = false;

                for (let j = 0; j < this.columns.length; j++) {
                    let col = this.columns[j],
                        filterMeta = this.filters[col.field];

                    //local
                    if (filterMeta) {
                        let filterValue = filterMeta.value,
                            filterField = col.field,
                            filterMatchMode = filterMeta.matchMode || 'startsWith',
                            dataFieldValue = this.resolveFieldData(this.value[i], filterField);
                        let filterConstraint = this.filterConstraints[filterMatchMode];

                        if (!filterConstraint(dataFieldValue, filterValue)) {
                            localMatch = false;
                        }

                        if (!localMatch) {
                            break;
                        }
                    }

                    //global
                    if (this.globalFilter && !globalMatch) {
                        globalMatch = this.filterConstraints['contains'](this.resolveFieldData(this.value[i], col.field), this.globalFilter.value);
                    }
                }

                let matches = localMatch;
                if (this.globalFilter) {
                    matches = localMatch && globalMatch;
                }

                if (matches) {
                    this.filteredValue.push(this.value[i]);
                }
            }

            if (this.filteredValue.length === this.value.length) {
                this.filteredValue = null;
            }

            if (this.paginator) {
                this.totalRecords = this.filteredValue ? this.filteredValue.length : this.value ? this.value.length : 0;
            }

            this.updateDataToRender(this.filteredValue || this.value);
        }

        this.onFilter.emit({
            filters: this.filters
        });
    }

    hasFilter() {
        let empty = true;
        for (let prop in this.filters) {
            if (this.filters.hasOwnProperty(prop)) {
                empty = false;
                break;
            }
        }

        return !empty || (this.globalFilter && this.globalFilter.value && this.globalFilter.value.trim().length);
    }

    onFilterInputClick(event: any) {
        event.stopPropagation();
    }

    filterConstraints = {

        startsWith(value: any, filter: any): boolean {
            if (filter === undefined || filter === null || filter.trim() === '') {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            let filterValue = filter.toLowerCase();
            return value.toString().toLowerCase().slice(0, filterValue.length) === filterValue;
        },

        contains(value: any, filter: any): boolean {
            if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            return value.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        },

        endsWith(value: any, filter: any): boolean {
            if (filter === undefined || filter === null || filter.trim() === '') {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            let filterValue = filter.toString().toLowerCase();
            return value.toString().toLowerCase().indexOf(filterValue, value.toString().length - filterValue.length) !== -1;
        },

        equals(value: any, filter: any): boolean {
            if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            return value.toString().toLowerCase() == filter.toString().toLowerCase();
        },

        in(value: any, filter: any[]): boolean {
            if (filter === undefined || filter === null || filter.length === 0) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            for (let i = 0; i < filter.length; i++) {
                if (filter[i] === value)
                    return true;
            }

            return false;
        }
    }

    switchCellToEditMode(cell: any, column: Column, rowData: any) {
        if (!this.selectionMode && this.editable && column.editable) {
            if (cell != this.editingCell) {
                if (this.editingCell && this.domHandler.find(this.editingCell, '.ng-invalid.ng-dirty').length == 0) {
                    this.domHandler.removeClass(this.editingCell, 'ui-cell-editing');
                }

                this.editingCell = cell;
                this.onEditInit.emit({ column: column, data: rowData });
                this.domHandler.addClass(cell, 'ui-cell-editing');
                let focusable = this.domHandler.findSingle(cell, '.ui-cell-editor input');
                if (focusable) {
                    setTimeout(() => this.renderer.invokeElementMethod(focusable, 'focus'), 100);
                }
            }
        }
    }

    switchCellToViewMode(element: any) {
        this.editingCell = null;
        let cell = this.findCell(element);
        this.domHandler.removeClass(cell, 'ui-cell-editing');
    }

    onCellEditorKeydown(event: any, column: Column, rowData: any, colIndex: number) {
        if (this.editable) {
            this.onEdit.emit({ originalEvent: event, column: column, data: rowData });
            //enter
            if (event.keyCode == 13) {
                this.onEditComplete.emit({ column: column, data: rowData });
                this.renderer.invokeElementMethod(event.target, 'blur');
                this.switchCellToViewMode(event.target);
                event.preventDefault();
            }

            //escape
            else if (event.keyCode == 27) {
                this.onEditCancel.emit({ column: column, data: rowData });
                this.renderer.invokeElementMethod(event.target, 'blur');
                this.switchCellToViewMode(event.target);
                event.preventDefault();
            }

            //tab
            else if (event.keyCode == 9) {
                let currentCell = this.findCell(event.target);
                let row = currentCell.parentElement;
                let targetCell;

                if (event.shiftKey) {
                    if (colIndex == 0) {
                        let previousRow = row.previousElementSibling;
                        if (previousRow) {
                            targetCell = previousRow.lastElementChild;
                        }
                    }
                    else {
                        targetCell = row.children[colIndex - 1];
                    }
                }
                else {
                    if (colIndex == (row.children.length - 1)) {
                        let nextRow = row.nextElementSibling;
                        if (nextRow) {
                            targetCell = nextRow.firstElementChild;
                        }
                    }
                    else {
                        targetCell = row.children[colIndex + 1];
                    }
                }

                if (targetCell) {
                    this.renderer.invokeElementMethod(targetCell, 'click');
                    event.preventDefault();
                }
            }
        }
    }

    findCell(element: any) {
        let cell = element;
        while (cell.tagName != 'TD') {
            cell = cell.parentElement;
        }

        return cell;
    }

    initResizableColumns() {
        this.tbody = this.domHandler.findSingle(this.el.nativeElement, 'tbody.ui-datatable-data');
        this.resizerHelper = this.domHandler.findSingle(this.el.nativeElement, 'div.ui-column-resizer-helper');
        this.fixColumnWidths();

        this.documentColumnResizeListener = this.renderer.listenGlobal('body', 'mousemove', (event: any) => {
            if (this.columnResizing) {
                this.onColumnResize(event);
            }
        });

        this.documentColumnResizeEndListener = this.renderer.listenGlobal('body', 'mouseup', (event: any) => {
            if (this.columnResizing) {
                this.columnResizing = false;
                this.onColumnResizeEnd(event);
            }
        });
    }

    initColumnResize(event: any) {
        let container = this.el.nativeElement.children[0];
        let containerLeft = this.domHandler.getOffset(container).left;
        this.resizeColumn = event.target.parentElement;
        this.columnResizing = true;
        this.lastResizerHelperX = (event.pageX - containerLeft);
    }

    onColumnResize(event: any) {
        let container = this.el.nativeElement.children[0];
        let containerLeft = this.domHandler.getOffset(container).left;
        this.domHandler.addClass(container, 'ui-unselectable-text');
        this.resizerHelper.style.height = container.offsetHeight + 'px';
        this.resizerHelper.style.top = 0 + 'px';
        if (event.pageX > containerLeft && event.pageX < (containerLeft + container.offsetWidth)) {
            this.resizerHelper.style.left = (event.pageX - containerLeft) + 'px';
        }

        this.resizerHelper.style.display = 'block';
    }

    onColumnResizeEnd(event: any) {
        let delta = this.resizerHelper.offsetLeft - this.lastResizerHelperX;
        let columnWidth = this.resizeColumn.offsetWidth;
        let newColumnWidth = columnWidth + delta;
        let minWidth = this.resizeColumn.style.minWidth || 15;

        if (columnWidth + delta > parseInt(minWidth)) {
            if (this.columnResizeMode === 'fit') {
                let nextColumn = this.resizeColumn.nextElementSibling;
                let nextColumnWidth = nextColumn.offsetWidth - delta;

                if (newColumnWidth > 15 && nextColumnWidth > 15) {
                    this.resizeColumn.style.width = newColumnWidth + 'px';
                    if (nextColumn) {
                        nextColumn.style.width = nextColumnWidth + 'px';
                    }

                    if (this.scrollable) {
                        let colGroup = this.domHandler.findSingle(this.el.nativeElement, 'colgroup.ui-datatable-scrollable-colgroup');
                        let resizeColumnIndex = this.domHandler.index(this.resizeColumn);
                        colGroup.children[resizeColumnIndex].style.width = newColumnWidth + 'px';

                        if (nextColumn) {
                            colGroup.children[resizeColumnIndex + 1].style.width = nextColumnWidth + 'px';
                        }
                    }
                }
            }
            else if (this.columnResizeMode === 'expand') {
                this.tbody.parentElement.style.width = this.tbody.parentElement.offsetWidth + delta + 'px';
                this.resizeColumn.style.width = newColumnWidth + 'px';
                let containerWidth = this.tbody.parentElement.style.width;

                if (this.scrollable) {
                    this.scrollBarWidth = this.scrollBarWidth || this.domHandler.calculateScrollbarWidth();
                    this.el.nativeElement.children[0].style.width = parseFloat(containerWidth) + this.scrollBarWidth + 'px';
                    let colGroup = this.domHandler.findSingle(this.el.nativeElement, 'colgroup.ui-datatable-scrollable-colgroup');
                    let resizeColumnIndex = this.domHandler.index(this.resizeColumn);
                    colGroup.children[resizeColumnIndex].style.width = newColumnWidth + 'px';
                }
                else {
                    this.el.nativeElement.children[0].style.width = containerWidth;
                }
            }

            this.onColResize.emit({
                element: this.resizeColumn,
                delta: delta
            });
        }

        this.resizerHelper.style.display = 'none';
        this.resizeColumn = null;
        this.domHandler.removeClass(this.el.nativeElement.children[0], 'ui-unselectable-text');
    }

    fixColumnWidths() {
        let columns = this.domHandler.find(this.el.nativeElement, 'th.ui-resizable-column');

        for (let col of columns) {
            col.style.width = col.offsetWidth + 'px';
        }
    }

    onColumnDragStart(event: any) {
        if (this.columnResizing) {
            event.preventDefault();
            return;
        }

        this.draggedColumn = this.findParentHeader(event.target);
        event.dataTransfer.setData('text', 'b'); // Firefox requires this to make dragging possible
    }

    onColumnDragover(event: any) {
        if (this.reorderableColumns && this.draggedColumn) {
            event.preventDefault();
            let iconWidth = this.domHandler.getHiddenElementOuterWidth(this.reorderIndicatorUp);
            let iconHeight = this.domHandler.getHiddenElementOuterHeight(this.reorderIndicatorUp);
            let dropHeader = this.findParentHeader(event.target);
            let container = this.el.nativeElement.children[0];
            let containerOffset = this.domHandler.getOffset(container);
            let dropHeaderOffset = this.domHandler.getOffset(dropHeader);

            if (this.draggedColumn != dropHeader) {
                let targetLeft = dropHeaderOffset.left - containerOffset.left;
                let targetTop = containerOffset.top - dropHeaderOffset.top;
                let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;

                this.reorderIndicatorUp.style.top = dropHeaderOffset.top - containerOffset.top - (iconHeight - 1) + 'px';
                this.reorderIndicatorDown.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + 'px';

                if (event.pageX > columnCenter) {
                    this.reorderIndicatorUp.style.left = (targetLeft + dropHeader.offsetWidth - Math.ceil(iconWidth / 2)) + 'px';
                    this.reorderIndicatorDown.style.left = (targetLeft + dropHeader.offsetWidth - Math.ceil(iconWidth / 2)) + 'px';
                    this.dropPosition = 1;
                }
                else {
                    this.reorderIndicatorUp.style.left = (targetLeft - Math.ceil(iconWidth / 2)) + 'px';
                    this.reorderIndicatorDown.style.left = (targetLeft - Math.ceil(iconWidth / 2)) + 'px';
                    this.dropPosition = -1;
                }

                this.reorderIndicatorUp.style.display = 'block';
                this.reorderIndicatorDown.style.display = 'block';
            }
            else {
                event.dataTransfer.dropEffect = 'none';
            }
        }
    }

    onColumnDragleave(event: any) {
        if (this.reorderableColumns && this.draggedColumn) {
            event.preventDefault();
            this.reorderIndicatorUp.style.display = 'none';
            this.reorderIndicatorDown.style.display = 'none';
        }
    }

    onColumnDrop(event: any) {
        event.preventDefault();
        if (this.draggedColumn) {
            let dragIndex = this.domHandler.index(this.draggedColumn);
            let dropIndex = this.domHandler.index(this.findParentHeader(event.target));
            let allowDrop = (dragIndex != dropIndex);
            if (allowDrop && ((dropIndex - dragIndex == 1 && this.dropPosition === -1) || (dragIndex - dropIndex == 1 && this.dropPosition === 1))) {
                allowDrop = false;
            }

            if (allowDrop) {
                this.columns.splice(dropIndex, 0, this.columns.splice(dragIndex, 1)[0]);

                this.onColReorder.emit({
                    dragIndex: dragIndex,
                    dropIndex: dropIndex,
                    columns: this.columns
                });
            }

            this.reorderIndicatorUp.style.display = 'none';
            this.reorderIndicatorDown.style.display = 'none';
            this.draggedColumn.draggable = false;
            this.draggedColumn = null;
            this.dropPosition = null;
        }
    }

    initColumnReordering() {
        this.reorderIndicatorUp = this.domHandler.findSingle(this.el.nativeElement.children[0], 'span.ui-datatable-reorder-indicator-up');
        this.reorderIndicatorDown = this.domHandler.findSingle(this.el.nativeElement.children[0], 'span.ui-datatable-reorder-indicator-down');
    }

    findParentHeader(element: any) {
        if (element.nodeName == 'TH') {
            return element;
        }
        else {
            let parent = element.parentElement;
            while (parent.nodeName != 'TH') {
                parent = parent.parentElement;
            }
            return parent;
        }
    }

    hasFooter() {
        if (this.footerColumnGroup) {
            return true;
        }
        else {
            if (this.columns) {
                for (let i = 0; i < this.columns.length; i++) {
                    if (this.columns[i].footer) {
                        return true;
                    }
                }
            }

        }
        return false;
    }

    isEmpty() {
        return !this.dataToRender || (this.dataToRender.length == 0);
    }

    createLazyLoadMetadata(): LazyLoadEvent {
        return {
            first: this.first,
            rows: this.virtualScroll ? this.rows * 2 : this.rows,
            sortField: this.sortField,
            sortOrder: this.sortOrder,
            filters: this.filters,
            globalFilter: this.globalFilter ? this.globalFilter.value : null,
            multiSortMeta: this.multiSortMeta
        };
    }

    toggleRow(row: any, event?: Event) {
        if (!this.expandedRows) {
            this.expandedRows = [];
        }

        let expandedRowIndex = this.findExpandedRowIndex(row);

        if (expandedRowIndex != -1) {
            this.expandedRows.splice(expandedRowIndex, 1);
            this.onRowCollapse.emit({
                originalEvent: event,
                data: row
            });
        }
        else {
            if (this.rowExpandMode === 'single') {
                this.expandedRows = [];
            }

            this.expandedRows.push(row);
            this.onRowExpand.emit({
                originalEvent: event,
                data: row
            });
        }

        if (event) {
            event.preventDefault();
        }
    }

    findExpandedRowIndex(row: any): number {
        let index = -1
        if (this.expandedRows) {
            for (let i = 0; i < this.expandedRows.length; i++) {
                if (this.expandedRows[i] == row) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    isRowExpanded(row: any): boolean {
        return this.findExpandedRowIndex(row) != -1;
    }

    findExpandedRowGroupIndex(row: any): number {
        let index = -1;
        if (this.expandedRowsGroups && this.expandedRowsGroups.length) {
            for (let i = 0; i < this.expandedRowsGroups.length; i++) {
                let group = this.expandedRowsGroups[i];
                let rowGroupField = this.resolveFieldData(row, this.groupField);
                if (rowGroupField === group) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    isRowGroupExpanded(row: any): boolean {
        return this.findExpandedRowGroupIndex(row) != -1;
    }

    toggleRowGroup(event: Event, row: any): void {
        this.rowGroupToggleClick = true;
        let index = this.findExpandedRowGroupIndex(row);
        let rowGroupField = this.resolveFieldData(row, this.groupField);
        if (index >= 0) {
            this.expandedRowsGroups.splice(index, 1);
            this.onRowGroupCollapse.emit({
                originalEvent: event,
                group: rowGroupField
            });
        }
        else {
            this.expandedRowsGroups = this.expandedRowsGroups || [],
                this.expandedRowsGroups.push(rowGroupField);
            this.onRowGroupExpand.emit({
                originalEvent: event,
                group: rowGroupField
            });
        }
        event.preventDefault();
    }

    public reset() {
        this.sortField = null;
        this.sortOrder = 1;

        this.filteredValue = null;
        this.filters = {};

        if (this.paginator) {
            this.paginate({
                first: 0,
                rows: this.rows
            });
        }
        else {
            this.updateDataToRender(this.value);
        }
    }

    public exportCSV() {
        let data = this.value;
        let csv = '';

        //headers
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].field) {
                csv += this.columns[i].header || this.columns[i].field;

                if (i < (this.columns.length - 1)) {
                    csv += this.csvSeparator;
                }
            }
        }

        //body        
        this.value.forEach((record, i) => {
            csv += '\n';
            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i].field) {
                    csv += this.resolveFieldData(record, this.columns[i].field);

                    if (i < (this.columns.length - 1)) {
                        csv += this.csvSeparator;
                    }
                }
            }
        });

        let blob = new Blob([csv], {
            type: 'text/csv;charset=utf-8;'
        });

        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, this.exportFilename + '.csv');
        }
        else {
            let link = document.createElement("a");
            link.style.display = 'none';
            document.body.appendChild(link);
            if (link.download !== undefined) {
                link.setAttribute('href', URL.createObjectURL(blob));
                link.setAttribute('download', this.exportFilename + '.csv');
                document.body.appendChild(link);
                link.click();
            }
            else {
                csv = 'data:text/csv;charset=utf-8,' + csv;
                window.open(encodeURI(csv));
            }
            document.body.removeChild(link);
        }
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    getRowStyleClass(rowData: any, rowIndex: number) {
        let styleClass = 'ui-widget-content';
        if (this.rowStyleClass) {
            let rowClass = this.rowStyleClass.call(this, rowData, rowIndex);
            if (rowClass) {
                styleClass += ' ' + rowClass;
            }
        }
        return styleClass;
    }

    visibleColumns() {
        return this.columns ? this.columns.filter(c => !c.hidden) : [];
    }

    get containerWidth() {
        if (this.scrollable) {
            if (this.scrollWidth) {
                return this.scrollWidth;
            }
            else if (this.frozenWidth && this.unfrozenWidth) {
                return parseFloat(this.frozenWidth) + parseFloat(this.unfrozenWidth) + 'px';
            }
        }
        else {
            return this.style ? this.style.width : null;
        }
    }

    ngOnDestroy() {
        //remove event listener
        if (this.globalFilterFunction) {
            this.globalFilterFunction();
        }

        if (this.resizableColumns && this.documentColumnResizeListener && this.documentColumnResizeEndListener) {
            this.documentColumnResizeListener();
            this.documentColumnResizeEndListener();
        }

        if (this.columnsSubscription) {
            this.columnsSubscription.unsubscribe();
        }
    }
}

@NgModule({
    imports: [
        CommonModule,
        UISharedModule,
        PaginatorModule,
        FormsModule, SharedModule,
        InputTextModule],
    exports: [DataTable, UISharedModule],
    declarations: [DataTable,
        DTRadioButton,
        DTCheckbox,
        ColumnHeaders,
        ColumnFooters,
        TableBody,
        ScrollableView,
        RowExpansionLoader]
})
export class DataTableModule { }
