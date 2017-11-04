import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { PageLoadingModule } from './common/page-loading/page-loading-module';
import { rootRouterConfig } from './app.router';
import { appRootProviders } from './app.service';
import { StaticNewsModule } from './test/staticnews.module';
import { LayoutModule } from './common/layout/layout-module';
import { XYZUIModule } from './common/rebirth-ui.module';
import { ToastyModule } from './common/toasty/index';
import { WebFormModule } from './components/form/FormModule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageViewerModule } from './common/page-viewer/page-viewer.module';
import { HttpClientModule } from '@angular/common/http';
import { MediaQueriesModule } from './services/mediaquery/MediaQueriesModule';
import { AppHmrComponent } from './app.hmr.comp';
import { HMRLayoutComponent } from './hmr-layout.component';
import { rootHMRRouterConfig } from './app-hmr.router';


@NgModule({
  imports: [
    BrowserModule, BrowserAnimationsModule,
    HttpModule, HttpClientModule,
    PageLoadingModule.forRoot(),
    LayoutModule,
    StaticNewsModule,
    RouterModule.forRoot(rootHMRRouterConfig, { useHash: false }),
    XYZUIModule.forRoot(),
    ToastyModule.forRoot(),
    WebFormModule.forRoot(),
    PageViewerModule.forRoot(),
    MediaQueriesModule
  ],
  declarations: [AppHmrComponent, HMRLayoutComponent],
  providers: [...appRootProviders]
})
export class AppHMRModule {

}
