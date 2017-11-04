import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';
import { applyMixins } from './app/untils/mixins';
import { stringExtend } from './app/untils/string-extend';
import { ArrayExtensions } from './app/untils/array-extensions';


applyMixins(String, [stringExtend]);
applyMixins(Array, [ArrayExtensions]);

if (process.env.ENV === 'production') enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);