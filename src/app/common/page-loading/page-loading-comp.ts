import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { PageLoadingService, PageAnimateAction, PageLoadActionEnum, AnimateEffectEnum, pageLoadingEffects } from '../page-loading';
import { LoadScriptService } from '../../services/load-script-service';
import { UUID } from '../../untils/uuid';
import { tryGetValue } from '../../untils/type-checker';

@Component({
    selector: 'x-pageloading',
    templateUrl: './page-loading-comp.html',
    styleUrls: ['./page-loading-comp.css']
})

export class PageLoadingComponent implements OnInit, AfterViewInit {
    @Input() effect: string = 'random';
    timeOut: number = 500;
    animateOpt: any;
    isAnimating: boolean;
    options: any;
    pageLoad: boolean;
    checkStream = Observable.interval(100);
    constructor(private pageLoadService: PageLoadingService,
        private cdRef: ChangeDetectorRef,
        private loadScriptService: LoadScriptService) {

        this.pageLoadService
            .pageLoadingStream
            .subscribe((pageAction: PageAnimateAction) => {

                if (this.disabledLoading == undefined)
                    this.disabledLoading = tryGetValue(() => pageAction.extras.disabledLoading).value || false;

                if (this.showBeforeFn == undefined)
                    this.showBeforeFn = tryGetValue(() => pageAction.extras.showBefore).value || null;

                if (this.hideBefore == undefined)
                    this.hideBeforeFn = tryGetValue(() => pageAction.extras.hideBefore).value || null;

                if (this.globalLoad)
                    if (pageAction.method === PageLoadActionEnum.show) {
                        this.showLoading(pageAction.effect);
                    }
                if (pageAction.method === PageLoadActionEnum.hide) {
                    this.Hide();
                }
                else
                    console.error("不是全局加载模式,禁止通过服务调用")
            });
    }

    @ViewChild("paper", { read: ElementRef }) svgEl: ElementRef;
    _postPrefix: string;
    get postPrefix(): string {
        if (!!!this._postPrefix)
            this._postPrefix = UUID.uuid(8, 10);
        return this._postPrefix;
    }
    svgId: string = "paper_" + this.postPrefix;

    ngOnInit() {
        this.loadScriptService
            .loadSnapSvg
            .then(snap => { });
    }

    ngAfterViewInit() {
        if (this.globalLoad)
            this.pageLoadService.pageLoadReady.next({ ready: true });
        else
            this.pageLoad = true;
    }

    private _startLoading: boolean;
    @Input() get startLoading() {
        return this._startLoading;
    }

    set startLoading(value: boolean) {
        if (value) {
            this.showLoading(AnimateEffectEnum[this.effect]);
        } else
            this.Hide();
        this._startLoading = value;
    }
    @Output() showBefore: EventEmitter<any> = new EventEmitter<any>();
    showBeforeFn: () => void;
    @Output() hideBefore: EventEmitter<any> = new EventEmitter<any>();
    hideBeforeFn: () => void;
    isShow: boolean;
    isLoading: Boolean;
    showLoading(effect: AnimateEffectEnum) {
        this.cdRef.markForCheck();
        let checkSubscriber = this.checkStream.subscribe((i: number) => {
            if (this.globalLoad) {
                if (!this.pageLoadService.isShow && this.pageLoadService.isLoading) {
                    this.pageLoadService.isLoading = false;
                }
                if (!this.pageLoadService.isShow && !this.pageLoadService.isLoading) {
                    checkSubscriber.unsubscribe();
                }
            } else {
                if (!this.isShow && this.isLoading) {
                    this.isLoading = false;
                }
                if (!this.isShow && !this.isLoading) {
                    checkSubscriber.unsubscribe();
                }
            }
        });
        this.AnimateInit({ el: "#" + this.svgId, effect: AnimateEffectEnum[effect] });
        this.Show(AnimateEffectEnum[effect]);
    }


    private get path(): Snap.Element {
        let paper = window["Snap"](this.svgEl.nativeElement); //("#" + this.svgId);
        return paper === null ? null : paper.select("path");
    }

    private AnimateInit(options: any) {
        this.options = options;
        this.options.speedIn = 500;
        this.options.easingIn = 'linear';
        this.effect = options.effect || 'random';
        this.animateOpt = null;
        this.isAnimating = false;
        if (this.globalLoad) {
            this.pageLoadService.isShow = false;
            this.pageLoadService.isLoading = false;
        } else {
            this.isShow = false;
            this.isLoading = false;
        }

    }

    private GetOpt(newEffect: string) {
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

    @Input() globalLoad: boolean;
    @Input() nzSpinning = true;
    _tip: string;

    @Input()
    get tip() {
        return this._tip;
    }

    set tip(value) {
        this._tip = value || '加载中...';
    }

    @Input() tipColor: string = "#108ee9";
    @ViewChild('ref') _ref: ElementRef;
    get elStyleClass() {
        return {
            "show": this.showEnabled,
            "pageloading-loading": this.loadingEnabled
        };
    }

    get showEnabled() {
        return this.pageLoadService.isShow || this.isShow;
    }
    get loadingEnabled() {
        return (this.pageLoadService.isLoading || this.isLoading) && !this.disabledLoading;
    }
    @Input() disabledLoading: boolean;
    private Show(newEffect: string) {
        this.showBefore.emit("show");
        if (this.showBeforeFn) this.showBeforeFn();
        let animateOpt: any;
        if (this.globalLoad) {
            if (this.isAnimating || this.pageLoadService.isLoading || this.pageLoadService.isShow) {
                return false;
            }
        } else {
            if (this.isAnimating || this.isLoading || this.isShow) {
                return false;
            }
        }

        animateOpt = this.GetOpt(newEffect);
        if (!animateOpt) {
            return;
        }
        this.path.attr({ d: animateOpt.initialPath });
        this.animateOpt = animateOpt;
        this.isAnimating = true;
        if (this.globalLoad)
            this.pageLoadService.isLoading = true;
        else this.isLoading = true;
        let cbk = () => {
            if (this.globalLoad)
                this.pageLoadService.isLoading = true;
            else
                this.isLoading = true;
        }
        if (!this.disabledLoading)
            this.AnimateSVG('in', animateOpt, cbk);
        if (this.globalLoad)
            this.pageLoadService.isShow = true;
        else
            this.isShow = true;
    }

    Hide() {
        this.hideBefore.emit('hide');
        if (this.hideBeforeFn)
            this.hideBeforeFn();
        let animateOpt = this.animateOpt;
        if (!animateOpt) { // have stopped or is stopping the animation, just return
            return false;
        }
        this.animateOpt = null; // prevent hide one animation multi times
        if (this.globalLoad)
            this.pageLoadService.isLoading = false;
        else
            this.isLoading = false;
        let cbk = () => {
            if (this.globalLoad)
                this.pageLoadService.isShow = false;
            else
                this.isShow = false;
            this.isAnimating = false;
        };
        if (!this.disabledLoading)
            this.AnimateSVG('out', animateOpt, cbk);
        if (this.globalLoad)
            this.pageLoadService.isShow = false;
        else
            this.isShow = false;
    }

    private AnimateSVG(dir: string, animateOpt: any, cbk: Function) {
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