import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-error-message',
  imports: [TranslatePipe],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss'
})
export class ErrorMessageComponent {
  inputControl = input.required<AbstractControl|null>();
  inputMessage = input<string>();
  inputTitle = input<string>();
}
