import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AdComponent } from './ad.component';
import { HostViewContainerDirective } from './ad.directive';

import { AdBannerComponent } from './ad-banner.component';
import { HeroJobAdComponent } from './hero-job-ad.component';
import { HeroProfileComponent } from './hero-profile.component';

import { AdService } from './ad.service';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [CommonModule],
    exports: [AdComponent],
    entryComponents: [HeroJobAdComponent, HeroProfileComponent],
    declarations: [AdComponent, HostViewContainerDirective, AdBannerComponent, HeroJobAdComponent, HeroProfileComponent],
    providers: [AdService],
})
export class AdModule { }

