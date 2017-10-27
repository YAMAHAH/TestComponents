import { NgStyleType } from '../untils/style-transforms';

export type FlexItemAlignSelf = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

export interface IFlexItem {
    order?: number;
    offset?: number;
    span?: number;
    show?: boolean;
    width?: number;
    height?: number;
    class?: string | string[] | object;
    style?: NgStyleType;
    display?: string;
    flexGrow?: string;
    flexShrink?: string;
    flexBasis?: string;
    flex?: string;
    alignSelf?: FlexItemAlignSelf;
}
export class FlexItem {
    static create(itemInit?: IFlexItem) {
        let item = new FlexItem();
        if (itemInit) Object.assign(item, itemInit);
        return item;
    }
    constructor(itemInit?: IFlexItem) {
        if (itemInit) {
            Object.assign(this, itemInit);
        }
    }
    private _order?: number;
    get order() { return this._order; }
    set order(value: number) { this._order = value; }
    private _offset: number;
    get offset(): number {
        return this._offset;
    }
    set offset(value: number) {
        this._offset = value;
    }

    private _span?: number;
    get span(): number {
        return this._span;
    }
    set span(value: number) {
        this._span = value;
    }
    private _show: boolean;
    get show() {
        return this._show;
    }
    set show(value: boolean) {
        this._show = value;
    }
    private _width?: number;
    get width() {
        return this._width;
    }
    set width(value: number) {
        this._width = value;
    }

    private _height?: number;
    get height() {
        return this._height;
    }
    set height(value: number) {
        this._height = value;
    }

    private _class?: string | string[] | object;
    get class() { return this._class; }
    set class(value: string | string[] | object) { this._class = value; }
    private _style?: NgStyleType;
    get style() { return this._style; }
    set style(value: NgStyleType) { this._style = value; }
    private _dispaly?: string;
    get display() { return this._dispaly; }
    set display(value: string) { this._dispaly = value; }

    private _flexGrow?: string;
    get flexGrow() { return this._flexGrow; }
    set flexGrow(value: string) { this._flexGrow = value; }
    private _flexShrink?: string;
    get flexShrink() { return this._flexShrink; }
    set flexShrink(value: string) { this._flexShrink = value; }
    private _flexBasis?: string;
    get flexBasis() { return this._flexBasis; }
    set flexBasis(value: string) { this._flexBasis = value; }
    private _flex?: string;
    get flex() { return this._flex; }
    set flex(value: string) { this._flex = value; }
    private _alignSelf?: FlexItemAlignSelf;
    get alignSelf() { return this._alignSelf; }
    set alignSelf(value: FlexItemAlignSelf) { this._alignSelf = value; }
};