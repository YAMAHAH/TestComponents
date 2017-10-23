import { NgStyleType } from '../untils/style-transforms';
export class flexItem {
    constructor(_span: number = 0, _order: number = 0, offset: number = 0,
        _show: boolean = true, _width: number = 0, _height: number = 0,
        _elClass: string = null, _style: string = null) {
        this._fxSpan = _span;
        this.order = _order;
        this.offset = offset;
        this.show = _show;
        this.width = _width;
        this.height = _height;
        this.class = _elClass;
        this.style = _style;
    }
    order?: number;
    offset?: number;
    private _fxSpan?: number;

    get span(): number {
        return this._fxSpan;
    }
    set span(value: number) {
        this._fxSpan = value;
    }
    show?: boolean;
    width?: number;
    height?: number;
    class?: string | string[] | object;
    style?: NgStyleType;
};