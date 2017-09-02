import { Directive, ViewContainerRef, OnChanges, Input, SimpleChanges, ComponentRef } from '@angular/core';
import { isFunction } from '../toasty/toasty.utils';

@Directive({
    selector: '[xyzHostContainer]'
})

export class HostViewContainerDirective implements OnChanges {
    @Input("xyzHostContainer") xyzComponentRef: ComponentRef<any> = null;
    @Input() xyzHostContainerContext: any = null;
    constructor(public viewContainerRef: ViewContainerRef) { }

    ngOnChanges(changes: SimpleChanges) {
        if (this.xyzComponentRef) {
            this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.xyzComponentRef.hostView));

            this.viewContainerRef.clear();
            if (this.xyzHostContainerContext) {
                let parseObject = this.xyzHostContainerContext;
                if (isFunction(parseObject)) {
                    parseObject = parseObject();
                }
                Object.assign(this.xyzComponentRef.instance, parseObject);
                this.viewContainerRef.insert(this.xyzComponentRef.hostView);
            }
        }
    }
}