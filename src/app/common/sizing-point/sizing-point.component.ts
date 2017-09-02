import { Component, Input, AfterViewInit, OnDestroy, Renderer } from '@angular/core';
import { DomHandler } from '../dom/domhandler';
import { SizingPointEnum } from '../../components/form/SelectPointEnum';


@Component({
    moduleId: module.id,
    selector: 'sizing-point',
    templateUrl: 'sizing-point.component.html',
    styleUrls: ['sizing-point.component.css']
})
export class SizingPointComponent implements AfterViewInit, OnDestroy {
    @Input() resizable: boolean = true;
    @Input() minHeight: any;
    @Input() minWidth: any;
    resizing: boolean;
    lastPageX: any; lastPageY: any;
    sizingPoint: SizingPointEnum = SizingPointEnum.none;
    container: any
    documentResizeListener: any;
    documentResizeEndListener: any;
    constructor(private domHandler: DomHandler, private renderer: Renderer) {

    }

    ngAfterViewInit() {
        if (this.resizable) {
            this.documentResizeListener = this.renderer.listenGlobal('body', 'mousemove', (event: Event) => {
                this.onResize(event);
            });

            this.documentResizeEndListener = this.renderer.listenGlobal('body', 'mouseup', (event: Event) => {
                if (this.resizing) {
                    // if (this.delCustomStyleFn) {
                    //     this.delCustomStyleFn();
                    //     this.delCustomStyleFn = null;
                    // }
                    this.resizing = false;
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.documentResizeListener && this.documentResizeEndListener) {
            this.documentResizeListener();
            this.documentResizeEndListener();
        }
    }
    initResize(event: any, selectPoint: SizingPointEnum) {
        if (this.resizable) {
            this.resizing = true;
            this.sizingPoint = selectPoint;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }

    onResize(event: any) {
        if (this.resizing) {
            let wdir = 0, hdir = 0, xdir = 0, ydir = 0, deltaX = 0, deltaY = 0;
            deltaX = event.pageX - this.lastPageX;
            deltaY = event.pageY - this.lastPageY;
            switch (this.sizingPoint) {
                case SizingPointEnum.topCenter:
                    ydir += deltaY;
                    hdir -= deltaY;
                    break;
                case SizingPointEnum.rightTop:
                    wdir += deltaX;
                    ydir += deltaY;
                    hdir -= deltaY;
                    break;
                case SizingPointEnum.rightCenter:
                    wdir += deltaX;
                    break;
                case SizingPointEnum.rightBottom:
                    wdir += deltaX;
                    hdir += deltaY;
                    break;
                case SizingPointEnum.bottomCenter:
                    hdir += deltaY;
                    break;
                case SizingPointEnum.leftBottom:
                    xdir += deltaX;
                    wdir -= deltaX;
                    hdir += deltaY;
                    break;
                case SizingPointEnum.leftCenter:
                    xdir += deltaX;
                    wdir -= deltaX;
                    break;
                case SizingPointEnum.leftTop:
                    xdir += deltaX;
                    wdir -= deltaX;
                    ydir += deltaY;
                    hdir -= deltaY;
                    break;
                default:
                    break;
            }
            let containerWidth = this.domHandler.getOuterWidth(this.container);
            let containerHeight = this.domHandler.getOuterHeight(this.container);
            // let contentHeight = this.domHandler.getOuterHeight(this.contentContainer);
            let newWidth = containerWidth + wdir;
            let newHeight = containerHeight + hdir;
            let leftPos = parseInt(this.container.style.left);
            let topPos = parseInt(this.container.style.top);

            if (newWidth > this.minWidth) {
                this.container.style.width = newWidth + 'px';
                this.container.style.left = leftPos + xdir + 'px';
            }

            if (newHeight > this.minHeight) {
                // this.contentContainer.style.height = newHeight + 'px';
                this.container.style.height = containerHeight + hdir + 'px';
                this.container.style.top = topPos + ydir + 'px';
            }
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }
}
