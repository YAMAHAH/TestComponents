import { PageLoadActionEnum } from './page-load-action-enum';
import { AnimateEffectEnum } from './animate-effect-enum';
import { LoadingExtras } from './loading-extras';

export interface PageAnimateAction {
    method: PageLoadActionEnum;
    effect?: AnimateEffectEnum;
    extras?: LoadingExtras;
}