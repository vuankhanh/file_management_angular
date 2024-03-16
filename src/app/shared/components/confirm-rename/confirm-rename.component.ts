import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../modules/material';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-rename',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
  ],
  templateUrl: './confirm-rename.component.html',
  styleUrl: './confirm-rename.component.scss'
})
export class ConfirmRenameComponent implements OnInit {
  nameControl = new FormControl('', [Validators.required]);
  constructor(
    @Inject(MAT_DIALOG_DATA) public oldName: string
  ) { }

  ngOnInit(): void {
    this.nameControl.setValue(this.oldName);
  }
}
