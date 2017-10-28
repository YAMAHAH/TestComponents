import { Directive, ViewContainerRef, OnChanges, Input, SimpleChanges, ComponentRef } from '@angular/core';
import { isFunction } from '../toasty/toasty.utils';

@Directive({
    selector: '[gxHostContainer]'
})

export class HostViewContainerDirective implements OnChanges {
    @Input("gxHostContainer") xyzComponentRef: ComponentRef<any> = null;
    @Input() gxHostContainerContext: any = null;
    constructor(public viewContainerRef: ViewContainerRef) { }

    ngOnChanges(changes: SimpleChanges) {
        if (this.xyzComponentRef) {
            this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.xyzComponentRef.hostView));

            this.viewContainerRef.clear();
            if (this.gxHostContainerContext) {
                let parseObject = this.gxHostContainerContext;
                if (isFunction(parseObject)) {
                    parseObject = parseObject();
                }
                Object.assign(this.xyzComponentRef.instance, parseObject);
                this.viewContainerRef.insert(this.xyzComponentRef.hostView);
            }
        }
    }
}