import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, ApplicationRef } from '@angular/core';
import { removeNgStyles, createNewHosts, createInputTransfer, bootloader } from '@angularclass/hmr';

import { AppComponent } from './app/app.component';
import { AppStore, State } from './app-store';
import { AppHMRModule } from './app/app.module.hmr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { applyMixins } from './app/untils/mixins';
import { stringExtend } from './app/untils/string-extend';
import { UUID } from './app/untils/uuid';
import { BehaviorSubject } from 'rxjs/Rx';
import { HTMLElementExtendService } from './app/untils/html-element-extend';
import { ArrayExtensions } from './app/untils/array-extensions';

applyMixins(String, [stringExtend]);
applyMixins(Array, [ArrayExtensions]);

// applyMixins(HTMLElement, [HTMLElementExtend]);


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppHMRModule, BrowserAnimationsModule
    ],
    providers: [
        AppStore
    ]
})
class MainModule {

    constructor(public appRef: ApplicationRef, public appStore: AppStore) {

    }

    hmrOnInit(store: any) {
        if (!store || !store.State) { return; }
        console.log('HMR store', JSON.stringify(store, null, 2));
        // restore state
        this.appStore.setState(store.state);
        // restore input values
        if ('restoreInputValues' in store) { store.restoreInputValues(); }
        this.appRef.tick();
        Object.keys(store).forEach(prop => delete store[prop]);
    }
    hmrOnDestroy(store: any) {
        const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        const currentState = this.appStore.getState();
        store.state = currentState;
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }
    hmrAfterDestroy(store: any) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}

export function main() {
    return platformBrowserDynamic().bootstrapModule(MainModule);
}

// boot on document ready
bootloader(main);
