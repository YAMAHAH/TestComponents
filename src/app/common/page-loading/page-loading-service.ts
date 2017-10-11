import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { PageAnimateAction, AnimateEffectEnum, PageLoadActionEnum } from './index';
import { LoadingExtras } from './loading-extras';

export interface PageLoadState {
    // define your state here
    ready: boolean;
}

const defaultState: PageLoadState = {
    // define your initial state here
    ready: false
}


@Injectable()
export class PageLoadingService {
    isLoading: boolean;
    isShow: boolean;
    pageLoadingStream: Subject<PageAnimateAction>;

    pageLoadReady: Subject<PageLoadState>;
    constructor() {
        this.pageLoadingStream = new Subject<PageAnimateAction>();
        this.pageLoadReady = new BehaviorSubject<PageLoadState>(defaultState);
    }
    subscription: Subscription;
    showPageLoading(effect: AnimateEffectEnum, extras: LoadingExtras = null) {
        this.subscription = this.pageLoadReady.subscribe(res => {
            if (res.ready) {
                this.pageLoadingStream.next({ method: PageLoadActionEnum.show, effect: effect, extras: extras });
            }
        });
    }
    hidePageLoading() {
        this.pageLoadingStream.next({ method: PageLoadActionEnum.hide });
        this.subscription.unsubscribe();
    }
}