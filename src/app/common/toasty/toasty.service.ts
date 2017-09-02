// Copyright (C) 2016 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-toasty

import { Injectable, EventEmitter, Type, Injector, ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { isString, isNumber, isFunction } from './toasty.utils';

import { Observable } from 'rxjs/Observable';
import { ToastyComponent } from './toasty.component';
import { ToastPositionEnum } from './toastPositionEnum';

/**
 * Options to configure specific Toast
 */
@Injectable()
export class ToastOptions {
  title: string;
  msg?: string;
  showClose?: boolean;
  theme?: string;
  timeout?: number;
  position?: ToastPositionEnum;
  posCss?: string;
  manual?: boolean = false;
  componentOutlet?: Type<any>;
  onAdd?: Function;
  onRemove?: Function;

}

/**
 * Structrure of Toast
 */
@Injectable()
export class ToastData {
  id: number;
  title: string;
  msg: string;
  showClose: boolean;
  type: string;
  theme: string;
  timeout: number;
  manual: boolean;
  position: ToastPositionEnum;
  posCss: string;
  componentOutlet: Type<any>;
  componentRef: any;
  elementRef: any;
  appendParent:any;
  onAdd: Function;
  onRemove: Function;
  onClick: Function;
  onClose: Function;
}

/**
 * Default configuration foa all toats and toasty container
 */
@Injectable()
export class ToastyConfig {

  // Maximum number of toasties to show at once
  limit: number = 5;

  // Whether to show the 'X' icon to close the toast
  showClose: boolean = true;

  // The window position where the toast pops up
  position: ToastPositionEnum = ToastPositionEnum.bottomRight;

  // How long (in miliseconds) the toasty shows before it's removed. Set to null/0 to turn off.
  timeout: number = 3000;

  // What theme to use
  theme: 'default' | 'material' | 'bootstrap' = 'default';
  rootViewContainer: ViewContainerRef;
}

export function toastyServiceFactory(config: ToastyConfig): ToastyService {
  return new ToastyService(config);
}

/**
 * Toasty service helps create different kinds of Toasts
 */
@Injectable()
export class ToastyService {
  // Allowed THEMES
  static THEMES: Array<string> = ['default', 'material', 'bootstrap'];
  // Init the counter
  uniqueCounter: number = 0;
  // ToastData event emitter
  private toastsEmitter: EventEmitter<ToastData> = new EventEmitter<ToastData>();
  // Clear event emitter
  private clearEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor(private config: ToastyConfig) {
  }

  /**
   * Get list of toats
   */
  getToasts(): Observable<ToastData> {
    return this.toastsEmitter.asObservable();
  }

  getClear(): Observable<number> {
    return this.clearEmitter.asObservable();
  }

  /**
   * Create Toast of a default type
   */
  default(options: ToastOptions | string | number) {
    return this.add(options, 'default');
  }

  /**
   * Create Toast of info type
   * @param  {object} options Individual toasty config overrides
   */
  info(options: ToastOptions | string | number) {
    return this.add(options, 'info');
  }

  /**
   * Create Toast of success type
   * @param  {object} options Individual toasty config overrides
   */
  success(options: ToastOptions | string | number) {
    return this.add(options, 'success');
  }

  /**
   * Create Toast of wait type
   * @param  {object} options Individual toasty config overrides
   */
  wait(options: ToastOptions | string | number) {
    return this.add(options, 'wait');
  }

  /**
   * Create Toast of error type
   * @param  {object} options Individual toasty config overrides
   */
  error(options: ToastOptions | string | number) {
    return this.add(options, 'error');
  }

  /**
   * Create Toast of warning type
   * @param  {object} options Individual toasty config overrides
   */
  warning(options: ToastOptions | string | number) {
    return this.add(options, 'warning');
  }


  // Add a new toast item
  private add(options: ToastOptions | string | number, type: string) {
    let toastyOptions: ToastOptions;

    if (isString(options) && options !== '' || isNumber(options)) {
      toastyOptions = <ToastOptions>{
        title: options.toString()
      };
    } else {
      toastyOptions = <ToastOptions>options;
    }

    if (!toastyOptions || !toastyOptions.title && !toastyOptions.msg) {
      throw new Error('ng2-toasty: No toast title or message specified!');
    }

    type = type || 'default';

    // Set a unique counter for an id
    this.uniqueCounter++;

    // Set the local vs global config items
    let showClose = this._checkConfigItem(this.config, toastyOptions, 'showClose');

    // If we have a theme set, make sure it's a valid one
    let theme: string;
    if (toastyOptions.theme) {
      theme = ToastyService.THEMES.indexOf(toastyOptions.theme) > -1 ? toastyOptions.theme : this.config.theme;
    } else {
      theme = this.config.theme;
    }

    let toast: ToastData = <ToastData>{
      id: this.uniqueCounter,
      title: toastyOptions.title,
      msg: toastyOptions.msg,
      showClose: showClose,
      type: 'toasty-type-' + type,
      theme: 'toasty-theme-' + theme,
      position: toastyOptions.position,
      posCss: toastyOptions.posCss,
      componentOutlet: toastyOptions.componentOutlet,
      manual: toastyOptions.manual || false,
      onAdd: toastyOptions.onAdd && isFunction(toastyOptions.onAdd) ? toastyOptions.onAdd : null,
      onRemove: toastyOptions.onRemove && isFunction(toastyOptions.onRemove) ? toastyOptions.onRemove : null
    };

    // If there's a timeout individually or globally, set the toast to timeout
    // Allows a caller to pass null/0 and override the default. Can also set the default to null/0 to turn off.
    toast.timeout = toastyOptions.hasOwnProperty('timeout') ? toastyOptions.timeout : this.config.timeout;

    // Push up a new toast item
    // this.toastsSubscriber.next(toast);
    this.toastsEmitter.next(toast);
    // If we have a onAdd function, call it here
    if (toastyOptions.onAdd && isFunction(toastyOptions.onAdd)) {
      toastyOptions.onAdd.call(this, toast);
    }
    toast.onClose = () => this.clear(toast.id);
    return toast;
  }

  // Clear all toasts
  clearAll() {
    this.clearEmitter.next(null);
  }

  // Clear the specific one
  clear(id: number) {
    this.clearEmitter.next(id);
  }

  // Checks whether the local option is set, if not,
  // checks the global config
  private _checkConfigItem(config: any, options: any, property: string) {
    if (options[property] === false) {
      return false;
    } else if (!options[property]) {
      return config[property];
    } else {
      return true;
    }
  }

  instances: any[] = [];
  showModal<T>(options: ToastOptions | string | number, type: string): Observable<T> {
    const rootContainer: any = null;//options.rootContainer || this.rebirthConfig.rootContainer;
    if (!rootContainer) {
      throw new Error('Should setup ViewContainerRef on modal options or rebirth config service!');
    }
    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);

    const injector: Injector = null; //options.injector || this.injector;
    const componentFactory: ComponentFactory<ToastyComponent> = null; // injector.get(ComponentFactoryResolver).resolveComponentFactory(ToastyComponent);

    const modalRef = rootContainer.createComponent(componentFactory, rootContainer.length, injector);
    this.instances.push(modalRef);
    const instance: ToastyComponent = modalRef.instance;
    // const dismissResult = instance.addContent(options, this.instances.length)
    //   .do(() => this.close(modalRef))
    //   .catch(error => {
    //     this.close(modalRef);
    //     return _throw(error);
    //   });
    // //instance.open();
    return instance.dismiss;
  }
}
