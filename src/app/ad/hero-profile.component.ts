import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

export interface AdComponent {
    data: any;
}


@Component({
    template: `
        <div class="hero-profile">
            <h3> 公司动态</h3>
          <h4>{{data?.name}}</h4>
        </div>

    `
})

export class HeroProfileComponent implements AdComponent, OnChanges {
    @Input() data: any;

    ngOnChanges(simple: SimpleChanges) {

    }
}