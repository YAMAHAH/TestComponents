import { PageLoadActionEnum } from './page-load-action-enum';
import { AnimateEffectEnum } from './animate-effect-enum';

export interface PageAnimateAction {
    method: PageLoadActionEnum;
    effect?: AnimateEffectEnum;
}