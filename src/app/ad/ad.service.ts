import { Injectable } from '@angular/core';

import { HeroJobAdComponent } from './hero-job-ad.component';
import { HeroProfileComponent } from './hero-profile.component';
import { AdItem } from './ad-item';

@Injectable()
export class AdService {
    getAds() {
        return [
            new AdItem(HeroProfileComponent, { name: 'Bombasto', bio: 'Brave as they come' }),

            new AdItem(HeroJobAdComponent, { name: '测试1', bio: '具体什么内容啊' }),
            new AdItem(HeroJobAdComponent, { name: '测试2', bio: '第二条内容啊' }),

            new AdItem(HeroProfileComponent, { name: '测试3', bio: '具体什么内容啊' }),
            new AdItem(HeroProfileComponent, { name: '测试5', bio: '第二条内容啊' }),

            // new AdItem(HeroProfileComponent, {headline: '另外1', body: '具体的内容1'}),
            // new AdItem(HeroProfileComponent, {headline: '另外2', body: '具体的内容2'})
        ]
    }
}