// Angular Imports
import { NgModule } from '@angular/core';
import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { ContentModule } from './content/content.module';
import { LeftSidebarModule } from './left-sidebar/left-sidebar.module';

import { CenterModule } from './center/center.module';
import { RightSidebarModule } from './rigth-sidebar/rigth-sidebar.module';

@NgModule({
    exports: [
        HeaderModule,
        FooterModule,
        ContentModule,
        LeftSidebarModule,
        CenterModule,
        RightSidebarModule
    ]
})
export class LayoutModule {

}