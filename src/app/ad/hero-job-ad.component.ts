import { Component, Input, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';

export interface AdComponent {
    data: any;
}

@Component({
    // changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="job-ad">
            招聘 广告
            <h4>{{data?.name}}</h4>
            {{data?.name}}
        </div>
    `
})
export class HeroJobAdComponent implements AdComponent, AfterViewInit {

    @Input() data: any = null;

    job: any;

    constructor() {

        //   console.log(this, '---')
    }

    ngAfterViewInit() {
        //  this.job = this.data;
    }

}