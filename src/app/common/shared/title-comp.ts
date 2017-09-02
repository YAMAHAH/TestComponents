// Exact copy of app/title.component.ts except import UserService from shared
import { Component, Input } from '@angular/core';
import { UserService } from '../shared';

@Component({
  selector: 'app-title',
  templateUrl: './title-comp.html',
})
export class TitleComponent {
  @Input() subtitle = 'Test';
  title = 'Angular Share Modules for';
  user = '';

  constructor(userService: UserService) {
    this.user = userService.userName;
  }
}