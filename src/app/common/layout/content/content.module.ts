// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { ContentComponent } from './content.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule
    ],
    declarations: [
        ContentComponent,
    ],
    exports: [
        ContentComponent,
    ]
})
export class ContentModule {

}
