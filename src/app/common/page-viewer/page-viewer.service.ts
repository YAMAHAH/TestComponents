import { ComponentFactoryResolver, Injector, ViewContainerRef, Injectable, ComponentFactory, ComponentRef, Type } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { isType } from '../../untils/type-checker';
import { PageViewerOptions } from './page-viewer.options';
import { PageViewer } from './page-viewer';

@Injectable()
export class PageViewerService {

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector) { }

    instances: any[] = [];
    showPage<T>(options: PageViewerOptions): Observable<T> {
        const rootContainer: ViewContainerRef = options.rootContainer;
        if (!rootContainer) {
            throw new Error('Should setup ViewContainerRef on modal options or config service!');
        }
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PageViewer);

        const injector: Injector = options.injector || rootContainer.parentInjector;

        const pageViewerRef = rootContainer.createComponent(componentFactory, rootContainer.length, injector);
        this.instances.push(pageViewerRef);
        if (options.pageModel) {
            if (options.isForceAppend) {
                options.pageModel.views = {
                    current: pageViewerRef,
                    pageViewerRef: pageViewerRef,
                    modelRef: options.pageModel.views.modelRef,
                    tabViewRef: options.pageModel.views.tabViewRef
                };
            } else {
                options.pageModel.pageViewerRef = pageViewerRef;
                options.pageModel.views = {
                    current: null,
                    pageViewerRef: null,
                    modelRef: null,
                    tabViewRef: null
                };
            }
        }

        if (!!options.appendComponentRef) {
            if (!!options.appendComponentRef.elementRef) {
                options.append = options.appendComponentRef.elementRef.nativeElement;
            }
            Object.assign(options.appendComponentRef, pageViewerRef.instance.compctx());
        }

        const instance: PageViewer = pageViewerRef.instance;
        instance.dispose = () => { this.close(pageViewerRef) };
        this.handleResolve(options, instance);

        let myOptions = options;
        ["rootContainer", "injector", "resolve"].forEach((item) => {
            delete myOptions[item];
        })
        Object.assign(instance, myOptions);

        const dismissResult = instance.modalResult
            .do(() => this.close(pageViewerRef))
            .catch(error => {
                this.close(pageViewerRef);
                return _throw(error);
            });
        instance.visible = true;
        return dismissResult;
    }
    private handleResolve(options: any, instance: PageViewer) {
        const resolve = options.resolve || {};
        if (resolve.then) {
            resolve.then((data: any) => instance.context = data);
        } else if (resolve.subscribe) {
            resolve.subscribe((data: any) => instance.context = data);
        } else {
            instance.context = resolve;
        }
        return resolve;
    }
    closeAll(): void {
        this.instances.forEach(formRef => this.close(formRef));
    }
    close(pageViewerRef: ComponentRef<PageViewer>): void {
        this.instances.splice(this.instances.indexOf(pageViewerRef), 1);
        pageViewerRef.destroy();
    }
    hide(pageViewerRef: ComponentRef<PageViewer>) {
        pageViewerRef.instance.visible = false;
    }
    show(pageViewerRef: ComponentRef<PageViewer>) {
        pageViewerRef.instance.visible = true;
    }
}
