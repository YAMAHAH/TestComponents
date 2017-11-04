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
        }
        this.viewContainerRef.clear();
        if (this.xyzComponentRef) {
            if (this.xyzHostContainerContext) {
                let parseObject = this.xyzHostContainerContext;
                if (isFunction(parseObject)) {
                    parseObject = parseObject();
                }
                if (parseObject.componentRef) {
                    Object.assign(parseObject.componentRef.instance, parseObject);
                    this.viewContainerRef.insert((parseObject.componentRef as ComponentRef<any>).hostView);
                }
            }
        }
    }
}