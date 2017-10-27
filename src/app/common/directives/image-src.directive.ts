import { makeDecorator } from '../../untils/decorators';

import {
    Directive,
    ElementRef,
    Input,
    OnInit,
    OnChanges,
    Renderer2
} from '@angular/core';

export type ImageSrcType = string | object;
/**
 * This directive provides a responsive API for the HTML <img> 'src' attribute
 * and will update the img.src property upon each responsive activation.
 *
 * e.g.
 *      <img src="defaultScene.jpg" src.xs="mobileScene.jpg"></img>
 *
 * @see https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-src/
 */
@Directive({
    selector: `
    img[src.xs], img[src.sm], img[src.md], img[src.lg], img[src.xl],
    img[src.lt-sm], img[src.lt-md], img[src.lt-lg], img[src.lt-xl],
    img[src.gt-xs], img[src.gt-sm], img[src.gt-md], img[src.gt-lg]
  `
})
export class ImgSrcDirective implements OnInit, OnChanges {

    private _cacheInput: Map<string, any> = new Map<string, any>();

    /* tslint:disable */
    @Input('src') set srcBase(val: string) { this.cacheDefaultSrc(val); }

    @Input('src.xs') set srcXs(val: ImageSrcType) { this._cacheInput.set('srcXs', val); }
    @Input('src.sm') set srcSm(val: ImageSrcType) { this._cacheInput.set('srcSm', val); }
    @Input('src.md') set srcMd(val: ImageSrcType) { this._cacheInput.set('srcMd', val); }
    @Input('src.lg') set srcLg(val: ImageSrcType) { this._cacheInput.set('srcLg', val); }
    @Input('src.xl') set srcXl(val: ImageSrcType) { this._cacheInput.set('srcXl', val); }

    @Input('src.lt-sm') set srcLtSm(val: ImageSrcType) { this._cacheInput.set('srcLtSm', val); }
    @Input('src.lt-md') set srcLtMd(val: ImageSrcType) { this._cacheInput.set('srcLtMd', val); }
    @Input('src.lt-lg') set srcLtLg(val: ImageSrcType) { this._cacheInput.set('srcLtLg', val); }
    @Input('src.lt-xl') set srcLtXl(val: ImageSrcType) { this._cacheInput.set('srcLtXl', val); }

    @Input('src.gt-xs') set srcGtXs(val: ImageSrcType) { this._cacheInput.set('srcGtXs', val); }
    @Input('src.gt-sm') set srcGtSm(val: ImageSrcType) { this._cacheInput.set('srcGtSm', val); }
    @Input('src.gt-md') set srcGtMd(val: ImageSrcType) { this._cacheInput.set('srcGtMd', val); }
    @Input('src.gt-lg') set srcGtLg(val: ImageSrcType) { this._cacheInput.set('srcGtLg', val); }
    /* tslint:enable */

    constructor(protected elRef: ElementRef,
        protected renderer: Renderer2) {
        this._cacheInput.set('src', elRef.nativeElement.getAttribute('src') || '');
    }

    /**
     * Listen for responsive changes to update the img.src attribute
     */

    protected _hasInitialized = false;
    ngOnInit() {
        this._hasInitialized = true;
        if (this.hasResponsiveKeys) {
            // // Listen for responsive changes
            // this._listenForMediaQueryChanges('src', this.defaultSrc, () => {
            //     this._updateSrcFor();
            // });
        }
        this._updateSrcFor();
    }

    /**
     * Update the 'src' property of the host <img> element
     */
    ngOnChanges() {
        if (this._hasInitialized) {
            this._updateSrcFor();
        }
    }

    /**
     * Use the [responsively] activated input value to update
     * the host img src attribute or assign a default `img.src=''`
     * if the src has not been defined.
     *
     * Do nothing to standard `<img src="">` usages, only when responsive
     * keys are present do we actually call `setAttribute()`
     */
    activatedValue = '';
    protected _updateSrcFor() {
        if (this.hasResponsiveKeys) {
            let url = this.activatedValue || this.defaultSrc;
            this.renderer.setAttribute(this.elRef.nativeElement, 'src', String(url));
        }
    }

    /**
     * Cache initial value of 'src', this will be used as fallback when breakpoint
     * activations change.
     * NOTE: The default 'src' property is not bound using @Input(), so perform
     * a post-ngOnInit() lookup of the default src value (if any).
     */
    protected cacheDefaultSrc(value?: string) {
        this._cacheInput.set('src', value || '');
    }

    /**
     * Empty values are maintained, undefined values are exposed as ''
     */
    protected get defaultSrc(): string {
        return this._cacheInput.get('src') || '';
    }

    /**
     * Does the <img> have 1 or more src.<xxx> responsive inputs
     * defined... these will be mapped to activated breakpoints.
     */
    protected get hasResponsiveKeys() {
        return true;// Object.keys(this._inputMap).length > 1;
    }

}