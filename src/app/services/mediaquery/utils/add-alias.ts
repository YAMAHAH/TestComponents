import { MediaChange } from '../media-change';
import { BreakPoint } from '../breakpoints/break-point';
import { extendObject } from "../../../untils/object-extend";
/**
 * For the specified MediaChange, make sure it contains the breakpoint alias
 * and suffix (if available).
 */
export function mergeAlias(dest: MediaChange, source: BreakPoint | null) {
    return extendObject(dest, source ? {
        mqAlias: source.alias,
        suffix: source.suffix
    } : {});
}