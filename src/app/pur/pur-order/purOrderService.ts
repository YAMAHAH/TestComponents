import { Injectable } from '@angular/core';

@Injectable()
export class PurOrderService {
    data: any = { value: 'default' };
    constructor() {
        this.data = { value: new Date().getTime() };
        // this.showMessage();
    }

    showMessage() {
        // console.log(this.data);
    }
}