// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { NavTreeViewComponent } from './nav-tree-view.component';
import { CommonModule } from '@angular/common';
import { NavTreeViewItemComponent } from './tree-view-item.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule, RouterModule
    ],
    declarations: [
        NavTreeViewComponent, NavTreeViewItemComponent
    ],
    exports: [
        NavTreeViewComponent
    ]
})
export class NavTreeViewModule {

}
