// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { D3DemoComponent } from './d3-component.component';
import { d3RouterConfig } from './d3.router';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild(d3RouterConfig)
    ],
    declarations: [
        D3DemoComponent,
    ],
    exports: [
        D3DemoComponent,
    ]
})
export class D3Module {

}
