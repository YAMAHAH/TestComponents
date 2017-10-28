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
import { ComponentOutlet } from '../directives/component.outlet';
import { HostViewContainerDirective } from '../directives/host.view.container';
import { ImageLazyLoadDirective } from '../directives/img-lazy-load.directive';
import { FlexLayoutDirective } from '../directives/flex-layout.directive';
import { FlexItemDirective } from '../directives/flex-item.directive';
import { FxStyle } from '../directives/fxstyle';
import { KeyBindingDirective } from '../directives/key-binding';

@NgModule({
  imports: [CommonModule],
  declarations: [
    AwesomePipe,
    FilterPipe,
    HighlightDirective,
    TitleComponent,
    FocusDirective,
    ComponentOutlet,
    HostViewContainerDirective,
    KeyBindingDirective,
    ImageLazyLoadDirective,
    FlexLayoutDirective,
    FlexItemDirective,
    FxStyle
  ],
  exports: [
    AwesomePipe,
    FilterPipe,
    HighlightDirective,
    FocusDirective,
    ComponentOutlet,
    TitleComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HostViewContainerDirective,
    KeyBindingDirective,
    ImageLazyLoadDirective,
    FlexLayoutDirective,
    FlexItemDirective,
    FxStyle
  ]
})
export class CoreModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [UserService]
    };
  }
}

@NgModule({
  exports: [CoreModule],
  providers: [UserService]
})
export class SharedRootModule { }
