// Copyright (C) 2016 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-toasty

import { NgModule, ModuleWithProviders, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';

export * from './toasty.service';
export * from './toasty.component';

import { ToastyComponent } from './toasty.component';
import { ToastComponent } from './toast.component';
import { ToastyService, ToastyConfig, toastyServiceFactory } from './toasty.service';
import { SharedModule } from '../shared/shared-module';
import { DomHandler } from '../dom/domhandler';

export let providers = [
    ToastyConfig, DomHandler,
    { provide: ToastyService, useFactory: toastyServiceFactory, deps: [ToastyConfig] }
];

@NgModule({
    imports: [SharedModule],
    declarations: [ToastComponent, ToastyComponent],
    exports: [ToastComponent, ToastyComponent],
    // providers: providers
})
export class ToastyModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ToastyModule,
            providers: providers
        };
    }
}