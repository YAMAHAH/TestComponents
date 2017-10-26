export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';
export type FlexJustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
export type FlexAlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

export interface IFlexLayoutItem {

    width?: string;

    height?: string;

    class?: string;

    style?: string;

    gap?: number;

    fill?: boolean;

    direction?: FlexDirection;

    wrap?: FlexWrap;

    flow?: string;

    justifyContent?: FlexJustifyContent;

    alignItems?: FlexAlignItems;

    alignContent?: FlexAlignItems;

    gutter?: number

    gridColumns?: number;
}
export class FlexLayoutItem {
    static create(itemInit: IFlexLayoutItem) {
        let ins = new FlexLayoutItem();
        Object.assign(ins, itemInit);
        return ins;
    }

    constructor(itemInit?: IFlexLayoutItem) {
        if (itemInit) {
            Object.assign(this, itemInit);
        }
    }
    private _width: string;
    get width() {
        return this._width;
    }
    set width(value: string) {
        this._width = value;
    }
    private _height: string;
    get height() {
        return this._height;
    }
    set height(value: string) {
        this._height = value;
    }
    private _class: string;
    get class() {
        return this._class;
    }
    set class(value: string) {

    }
    private _style: string;
    get style() {
        return this._style;
    }
    set style(value: string) {
        this._style = value;
    }
    private _gap: number;
    set gGap(value: number) {
        this._gap = value;
    }
    get gap(): number {
        return this._gap;
    }

    private _fill: boolean;
    get fill() {
        return this._fill;
    }
    set fill(value: boolean) {
        this._fill = value;
    }
    private _direction: FlexDirection;
    get direction(): FlexDirection {
        return this._direction;
    }
    set direction(value: FlexDirection) {
        this._direction = value;
    }
    private _wrap: FlexWrap;
    get wrap(): FlexWrap {
        return this._wrap;
    }
    set wrap(value: FlexWrap) {
        this._wrap = value;
    }

    private _flow: string;
    get flow() { return this._flow; }
    set flow(value: string) { this._flow = value; }
    private _justifyContent: FlexJustifyContent;
    get justifyContent() {
        return this._justifyContent;
    }
    set justifyContent(value: FlexJustifyContent) {
        this._justifyContent = value;
    }

    private _alignItems: FlexAlignItems;
    get alignItems() {
        return this._alignItems;
    }
    set alignItems(value: FlexAlignItems) {
        this._alignItems = value;
    }

    private _alignContent: FlexAlignItems;
    get alignContent() {
        return this._alignContent;
    }
    set alignContent(value: FlexAlignItems) {
        this._alignContent = value;
    }
    private _gutter: number
    set gutter(value: number) {
        this._gutter = value;
    }
    get gutter() {
        return this._gutter;
    }

    private _gridColumns: number;
    get gridColumns() {
        return this._gridColumns;
    }
    set gridColumns(value: number) {
        this._gridColumns = value;
    }


}