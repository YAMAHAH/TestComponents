import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { PageAnimateAction, AnimateEffectEnum, PageLoadActionEnum } from './index';

export interface AppState {
    // define your state here
    ready: boolean;
}

const defaultState: AppState = {
    // define your initial state here
    ready: false
}

@Injectable()
export class PageLoadingService {
    isLoading: boolean;
    isShow: boolean;
    isAnimateSVG: boolean;
    pageLoadingStream: Subject<PageAnimateAction>;
    //ready = new BehaviorSubject<AppState>(defaultState);
    //appState: AppState = defaultState;
    pageReady: Subject<AppState>;
    constructor() {
        this.pageLoadingStream = new Subject<PageAnimateAction>();
        this.pageReady = new BehaviorSubject<AppState>(defaultState);
    }
    subscription: Subscription;
    showPageLoading(effect: AnimateEffectEnum) {
        this.subscription = this.pageReady.subscribe(ready => {
            if (ready.ready) {
            }
        });
        this.pageLoadingStream.next({ method: PageLoadActionEnum.show, effect: effect });
    }
    hidePageLoading() {
        this.pageLoadingStream.next({ method: PageLoadActionEnum.hide });
        // this.pageReady.next({ ready: false });
        this.subscription.unsubscribe();
    }
}