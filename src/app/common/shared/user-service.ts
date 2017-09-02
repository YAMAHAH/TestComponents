
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  static userName = '';

  constructor() {
    UserService.userName = UserService.userName || 'Sam Spade';
  }

  get userName() { return UserService.userName; }
}