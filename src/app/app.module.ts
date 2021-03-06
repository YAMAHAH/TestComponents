import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { rootRouterConfig } from './app.router';

import { appRootProviders } from './app.service';
import { PageLoadingModule } from './common/page-loading';
import { StaticNewsModule } from './test/staticnews.module';
import { PCLayoutComponent } from './pc.layout.component';
import { LayoutModule } from './common/layout/layout-module';
import { XYZUIModule } from './common/rebirth-ui.module';
import { ToastyModule } from './common/toasty/index';
import { WebFormModule } from './components/form/FormModule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageViewerModule } from './common/page-viewer/page-viewer.module';
import { HttpClientModule } from '@angular/common/http';
import { MediaQueriesModule } from './services/mediaquery/MediaQueriesModule';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    StaticNewsModule,
    HttpClientModule,
    LayoutModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    PageLoadingModule.forRoot(),
    XYZUIModule.forRoot(),
    ToastyModule.forRoot(),
    WebFormModule.forRoot(),
    PageViewerModule.forRoot(),
    MediaQueriesModule
  ],
  declarations: [AppComponent, PCLayoutComponent],
  bootstrap: [AppComponent],
  providers: [...appRootProviders]
})
export class AppModule {
  constructor() {
  }
}
