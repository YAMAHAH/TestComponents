import { Injectable } from '@angular/core';
import { AService } from './AService';

@Injectable()
export class BService {
    data: any;
    constructor(private aSrv: AService) {
       
    }
}