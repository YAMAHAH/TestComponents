import { forwardRef } from '@angular/core';
export abstract class Parent { templateId: string; }

export function getClassProviders(components: any[]) {
    let providers = [];
    for (let index = 0; index < components.length; index++) {
        let comp = components[index];
        providers.push({
            provide: comp, useClass: comp
        }
        );
    }
    return providers;
}

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