import { ComponentFactoryResolver, Injector, ViewContainerRef, Injectable, ComponentFactory, ComponentRef, Type } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Form } from './form';
import { _throw } from 'rxjs/observable/throw';
import { isType } from '../../untils/type';
import { FormOptions } from './FormOptions';

@Injectable()
export class FormService {

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector) { }

    instances: any[] = [];
    showForm<T>(options: FormOptions): Observable<T> {
        const rootContainer: ViewContainerRef = options.rootContainer;
        if (!rootContainer) {
            throw new Error('Should setup ViewContainerRef on modal options or config service!');
        }
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(Form);

        const injector: Injector = options.injector || rootContainer.parentInjector; //this.injector
        // const componentFactory: ComponentFactory<Dialog> = injector.get(ComponentFactoryResolver).resolveComponentFactory(Dialog);

        const formRef = rootContainer.createComponent(componentFactory, rootContainer.length, injector);
        this.instances.push(formRef);
        if (options.formModel) {
            options.formModel.modalRef = formRef;
            if (options.isForceAppend) {
                options.formModel.views = {
                    current: formRef,
                    pageViewerRef: options.formModel.views.pageViewerRef,
                    modelRef: formRef,
                    tabViewRef: options.formModel.views.tabViewRef
                };
            } else {
                options.formModel.views = {
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
            Object.assign(options.appendComponentRef, formRef.instance.compctx());
        }

        const instance: Form = formRef.instance;
        instance.dispose = () => { this.close(formRef) };
        this.handleResolve(options, instance);

        let myOptions = options;
        ["rootContainer", "injector", "resolve"].forEach((item) => {
            delete myOptions[item];
        })
        Object.assign(instance, myOptions);

        const dismissResult = instance.modalResult
            .do(() => this.close(formRef))
            .catch(error => {
                this.close(formRef);
                return _throw(error);
            });
        instance.visible = true;
        return dismissResult;
    }

    createForm(options: FormOptions): Form {
        const rootContainer: ViewContainerRef = options.rootContainer;
        if (!rootContainer) {
            throw new Error('Should setup ViewContainerRef on modal options or config service!');
        }
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(Form);

        const injector: Injector = options.injector || rootContainer.parentInjector;

        const formRef = rootContainer.createComponent(componentFactory, rootContainer.length, injector);
        this.instances.push(formRef);
        if (options.formModel) {
            options.formModel.modalRef = formRef;
        }
        if (!!options.appendComponentRef) {
            if (!!options.appendComponentRef.elementRef) {
                options.append = options.appendComponentRef.elementRef.nativeElement;
            }
            Object.assign(options.appendComponentRef, formRef.instance.compctx());
        }
        const instance: Form = formRef.instance;
        this.handleResolve(options, instance);

        let myOptions = options;
        ["rootContainer", "injector", "resolve"].forEach((item) => {
            delete myOptions[item];
        })
        Object.assign(instance, myOptions);
        return instance;
    }

    showForm2<T>(options: FormOptions): { formRef: ComponentRef<Form>, formResult: Observable<T> } {
        const rootContainer: ViewContainerRef = options.rootContainer;
        if (!rootContainer) {
            throw new Error('Should setup ViewContainerRef on modal options or config service!');
        }
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(Form);

        const injector: Injector = options.injector || rootContainer.parentInjector; //this.injector
        // const componentFactory: ComponentFactory<Dialog> = injector.get(ComponentFactoryResolver).resolveComponentFactory(Dialog);

        const formRef = rootContainer.createComponent(componentFactory, rootContainer.length, injector);
        this.instances.push(formRef);
        if (options.formModel) {
            options.formModel.modalRef = formRef;
        }
        if (!!options.appendComponentRef) {
            Object.assign(options.appendComponentRef, formRef.instance.compctx());
        }

        const instance: Form = formRef.instance;
        this.handleResolve(options, instance);

        let myOptions = options;
        ["rootContainer", "injector", "resolve"].forEach((item) => {
            delete myOptions[item];
        })
        Object.assign(instance, myOptions);

        const dismissResult = instance.modalResult
            .do(() => this.close(formRef))
            .catch(error => {
                this.close(formRef);
                return _throw(error);
            });
        instance.visible = true;
        return { formRef: formRef, formResult: dismissResult };
    }
    private handleResolve(options: any, instance: Form) {
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
    close(formRef: ComponentRef<Form>): void {
        this.instances.splice(this.instances.indexOf(formRef), 1);
        formRef.destroy();
    }
    hide(formRef: ComponentRef<Form>) {
        formRef.instance.visible = false;
    }
    show(formRef: ComponentRef<Form>) {
        formRef.instance.visible = true;
    }
}
