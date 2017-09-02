import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLoadingComponent } from './page-loading-comp';
import { PageLoadingService } from './page-loading-service';

@NgModule({
    imports: [CommonModule],
    declarations: [PageLoadingComponent],
    exports: [PageLoadingComponent]
})
export class PageLoadingModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PageLoadingModule,
            providers: [PageLoadingService]
        };
    }
}