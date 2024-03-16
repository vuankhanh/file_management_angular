import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-new-directory',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './confirm-new-directory.component.html',
  styleUrl: './confirm-new-directory.component.scss'
})
export class ConfirmNewDirectoryComponent {
  folderNameControl: FormControl = new FormControl('Tổng hợp', [Validators.required]);
}
