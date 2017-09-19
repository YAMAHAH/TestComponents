import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { PageLoadingService, PageAnimateAction, PageLoadActionEnum, AnimateEffectEnum, pageLoadingEffects } from '../page-loading';
import { LoadScriptService } from '../../services/load-script-service';
//let Snap: any;// = require("snapsvg");

@Component({
    selector: 'pageloading',
    templateUrl: './page-loading-comp.html',
    styleUrls: ['./page-loading-comp.css'],
})

export class PageLoadingComponent implements OnInit, AfterViewInit {
    autoPageLoading: boolean = true;
    effect: string = 'random';
    timeOut: number = 500;
    animateOpt: any;
    isAnimating: boolean;
    el: HTMLElement;
    options: any;
    pageLoad: boolean;
    checkStream = Observable.interval(100);
    constructor(private pageLoadService: PageLoadingService,
        private loadScriptService: LoadScriptService) {
        this.pageLoadService.pageLoadingStream
            .subscribe((pageAction: PageAnimateAction) => {
                if (pageAction.method === PageLoadActionEnum.show) {
                    this.showLoading(pageAction.effect);
                }
                if (pageAction.method === PageLoadActionEnum.hide) {
                    this.Hide();
                }
            });
    }

    ngOnInit() {
        this.loadScriptService
            .loadSnapSvg
            .then(snap => {
                console.log(snap);
            });
    }

    ngAfterViewInit() {
        this.pageLoadService.pageReady.next({ ready: true });
    }

    showLoading(effect: AnimateEffectEnum) {
        let checkSubscriber = this.checkStream.subscribe((i: number) => {
            if (this.pageLoadService.isShow === false && this.pageLoadService.isLoading) {
                this.pageLoadService.isLoading = false;
            }
            if (!this.pageLoadService.isShow && !this.pageLoadService.isLoading) {
                checkSubscriber.unsubscribe();
            }
        });
        this.AnimateInit({ el: "#paper", effect: AnimateEffectEnum[effect] });
        this.Show(AnimateEffectEnum[effect]);
        //  setTimeout(() => { this.Hide(); }, 1860);
    }


    public get path(): Snap.Element {
        let paper = window["Snap"]("#paper");
        return paper === null ? null : paper.select("path");
    }

    AnimateInit(options: any) {
        this.options = options;
        this.options.speedIn = 500;
        this.options.easingIn = 'linear';
        this.effect = options.effect || 'random';
        this.animateOpt = null;
        this.isAnimating = false;
        this.pageLoadService.isShow = false;
        this.pageLoadService.isLoading = false;
    }

    GetOpt(newEffect: string) {
        let effect: string, effects: any, effectObj: any, initialPath: any,
            openingSteps: any, openingStepsStr: any, openingStepsTotal: any,
            closingSteps: any, closingStepsStr: any,
            closingStepsTotal: any, animateOpt: any, speedOut: any, easingOut: any;

        effect = newEffect || effect;
        effects = Object.keys(pageLoadingEffects);

        if (effect === 'random' || effects.indexOf(effect) < 0) {
            effect = effects[Math.floor(Math.random() * 13)]
        }
        effectObj = pageLoadingEffects[effect];

        initialPath = effectObj.path;

        openingStepsStr = effectObj.opening;
        openingSteps = openingStepsStr ? openingStepsStr.split(';') : '';
        openingStepsTotal = openingStepsStr ? openingSteps.length : 0;

        if (openingStepsTotal === 0) {
            return false;
        }

        closingStepsStr = effectObj.closing || initialPath;
        closingSteps = closingStepsStr ? closingStepsStr.split(';') : '';
        closingStepsTotal = closingStepsStr ? closingSteps.length : 0;

        speedOut = effectObj.speedOut || effectObj.speedIn;
        easingOut = effectObj.easingOut || effectObj.easingIn;

        animateOpt = {
            initialPath: initialPath,
            openingSteps: openingSteps,
            openingStepsTotal: openingStepsTotal,
            closingSteps: closingSteps,
            closingStepsTotal: closingStepsTotal,
            speedOut: speedOut,
            easingOut: easingOut,
            speedIn: effectObj.speedIn,
            easingIn: effectObj.easingIn
        };

        return animateOpt;
    }
    getClass() {
        return {
            "show": this.pageLoadService.isShow,
            "pageloading-loading": this.pageLoadService.isLoading,
            "pageload-overlay": true
        };
    }

    Show(newEffect: string) {
        let animateOpt: any;
        if (this.isAnimating || (this.pageLoadService.isLoading || this.pageLoadService.isShow)) {
            return false;
        }
        animateOpt = this.GetOpt(newEffect);
        if (!animateOpt) {
            return;
        }
        this.path.attr({ d: animateOpt.initialPath });
        this.animateOpt = animateOpt;
        this.isAnimating = true;
        this.pageLoadService.isLoading = true;
        let cbk = () => this.pageLoadService.isLoading = true;
        this.AnimateSVG('in', animateOpt, cbk);
        this.pageLoadService.isShow = true;
    }

    Hide() {
        let animateOpt = this.animateOpt;
        if (!animateOpt) { // have stopped or is stopping the animation, just return
            return false;
        }
        this.animateOpt = null; // prevent hide one animation multi times
        this.pageLoadService.isLoading = false;
        let cbk = () => {
            this.pageLoadService.isShow = false;
            this.isAnimating = false;
        };
        this.AnimateSVG('out', animateOpt, cbk);
    }

    AnimateSVG(dir: string, animateOpt: any, cbk: Function) {
        let pos = 0,
            steps = dir === 'out' ? animateOpt.closingSteps : animateOpt.openingSteps,
            stepsTotal = dir === 'out' ? animateOpt.closingStepsTotal : animateOpt.openingStepsTotal,
            speed = dir === 'out' ? animateOpt.speedOut : animateOpt.speedIn,
            easing = dir === 'out' ? animateOpt.easingOut : animateOpt.easingIn, nextStep: any;

        easing = mina[easing] || mina.linear;
        nextStep = (pos: number) => {
            if (pos > stepsTotal - 1) {
                if (cbk && typeof cbk == 'function') {
                    cbk();
                }
                return;
            }
            this.path.animate({ 'path': steps[pos] }, speed, easing, () => {
                nextStep(pos);
            });
            pos++;
        };

        nextStep(pos);
    }


}