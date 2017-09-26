import { forwardRef } from '@angular/core';
export abstract class Parent { templateId: string; }

export function provideTheParent<T>(component: any) {
    return {
        provide: Parent, useExisting: forwardRef(() => component)
    };
}
export function provideParent<TDest, TBase>(component: TDest, parentType?: TBase) {
    return {
        provide: parentType || Parent,
        useExisting: forwardRef(() => component)
    };
}