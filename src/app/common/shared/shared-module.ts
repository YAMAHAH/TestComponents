import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TitleComponent } from './title-comp';
import { HighlightDirective } from './highlight-directive';
import { AwesomePipe } from './awesome-pipe';
import { UserService } from '../shared';
import { FilterPipe } from './filter.pipe';
import { FocusDirective } from '../directives/focus.directive';
import { JYComponentOutlet } from '../directives/component.outlet';
import { HostViewContainerDirective } from '../directives/host.view.container';
import { KeyBindingDirective } from '../directives/key-binding';
import { ImageLazyLoadDirective } from '../directives/img-lazy-load.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    AwesomePipe,
    FilterPipe,
    HighlightDirective,
    TitleComponent,
    FocusDirective,
    JYComponentOutlet,
    HostViewContainerDirective,
    KeyBindingDirective,
    ImageLazyLoadDirective
  ],
  exports: [
    AwesomePipe,
    FilterPipe,
    HighlightDirective,
    FocusDirective,
    JYComponentOutlet,
    TitleComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HostViewContainerDirective,
    KeyBindingDirective,
    ImageLazyLoadDirective
  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [UserService]
    };
  }
}

@NgModule({
  exports: [SharedModule],
  providers: [UserService]
})
export class SharedRootModule { }
