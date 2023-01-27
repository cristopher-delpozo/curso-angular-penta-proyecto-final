import { Component, EventEmitter, Output } from '@angular/core';
import { SendMessageService } from 'src/app/services/send-message.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  searchString: string = '';

  constructor(private sendMessageService: SendMessageService) {}

  sendSearchString() {
    this.sendMessageService.messageEmitter.next(this.searchString);
  }
}
