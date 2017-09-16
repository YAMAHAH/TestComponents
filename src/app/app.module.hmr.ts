import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { PageLoadingModule } from './common/page-loading/page-loading-module';
import { rootRouterConfig } from './app.router';
import { appRootProviders } from './app.service';
import { StaticNewsModule } from './test/staticnews.module';
import { PCLayoutComponent } from './pc.layout.component';
import { LayoutModule } from './common/layout/layout-module';
import { XYZUIModule } from './common/rebirth-ui.module';
import { ToastyModule } from './common/toasty/index';
import { WebFormModule } from './components/form/FormModule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageViewerModule } from './common/page-viewer/page-viewer.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule, BrowserAnimationsModule,
    HttpModule, HttpClientModule,
    PageLoadingModule.forRoot(),
    LayoutModule,
    StaticNewsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    XYZUIModule.forRoot(),
    ToastyModule.forRoot(),
    WebFormModule.forRoot(),
    PageViewerModule.forRoot()
  ],
  declarations: [AppComponent, PCLayoutComponent],
  providers: [...appRootProviders]
})
export class AppHMRModule {

}
