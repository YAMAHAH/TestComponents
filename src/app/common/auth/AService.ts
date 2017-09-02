import { Injectable } from '@angular/core';

@Injectable()
export class AService {
    data: any;
    constructor() {
        this.data = new Date().getTime();
    }
}