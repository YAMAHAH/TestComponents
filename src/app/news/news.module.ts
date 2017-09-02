import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './news.router';
import { NewsComponent } from './news.component';
import { AuxNewsComponent } from './auxnews.component';
import { SharedModule } from '../common/shared/shared-module';
import { NewsService } from '../services/news/news.service';

@NgModule({
  imports: [SharedModule.forRoot(), RouterModule.forChild(rootRouterConfig)],
  declarations: [NewsComponent, AuxNewsComponent],
  exports: [NewsComponent],
  providers: [NewsService]
})
export class NewsModule { }
