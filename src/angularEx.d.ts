import { ViewContainerRef, ComponentFactory, TemplateRef, EmbeddedViewRef, ElementRef, InjectionToken, Type, ComponentRef } from '@angular/core';
import { ViewRef } from "@angular/core/src/linker";
import { NgModuleRef } from "@angular/core/src/core";

/// <reference> view_container_ref.d.ts
// declare module "@angular/core" {


// }
// private _view: ViewData, private _elDef: NodeDef, private _data: ElementData

// export interface ElementData {
//     renderElement: any;
//     componentView: ViewData;
//     viewContainer: ViewContainerData|null;
//     template: TemplateData;
//   }
// export interface ViewContainerData extends ViewContainerRef {
//     // Note: we are using the prefix _ as ViewContainerData is a ViewContainerRef and therefore
//     // directly
//     // exposed to the user.
//     _embeddedViews: ViewData[];
//   }

//   export interface TemplateData extends TemplateRef<any> {
//     // views that have been created from the template
//     // of this element,
//     // but inserted into the embeddedViews of another element.
//     // By default, this is undefined.
//     // Note: we are using the prefix _ as TemplateData is a TemplateRef and therefore directly
//     // exposed to the user.
//     _projectedViews: ViewData[];
//   }
// export interface ViewData {
//     def: ViewDefinition;
//     root: RootData;
//     renderer: Renderer2;
//     // index of component provider / anchor.
//     parentNodeDef: NodeDef|null;
//     parent: ViewData|null;
//     viewContainerParent: ViewData|null;
//     component: any;
//     context: any;
//     // Attention: Never loop over this, as this will
//     // create a polymorphic usage site.
//     // Instead: Always loop over ViewDefinition.nodes,
//     // and call the right accessor (e.g. `elementData`) based on
//     // the NodeType.
//     nodes: {[key: number]: NodeData};
//     state: ViewState;
//     oldValues: any[];
//     disposables: DisposableFn[]|null;
//   }