import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../modules/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public message: string,
  ) { }
}
