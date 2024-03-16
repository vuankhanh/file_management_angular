import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material';
import { IFileInfo } from '../../../shared/interfaces/file-info.interface';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { ConfirmRenameComponent } from '../../../shared/components/confirm-rename/confirm-rename.component';

@Component({
  selector: 'file-directories-list',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnChanges, OnDestroy {
  @Input() files: Array<IFileInfo> = [];

  @Output() itemClick: EventEmitter<IFileInfo> = new EventEmitter<IFileInfo>();
  @Output() removeItem = new EventEmitter<{ file: IFileInfo, index: number }>();
  @Output() renameItem = new EventEmitter<{ oldName: string, newName: string }>();
  selectionItem: number = -1;

  subscription: Subscription = new Subscription()

  constructor(
    private matDialog: MatDialog,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const filesChanges = changes['files'];
    const curFiles = JSON.stringify(filesChanges.currentValue);
    const prevFiles = JSON.stringify(filesChanges.previousValue);
    if (curFiles !== prevFiles) {
      this.selectionItem = -1;
    }
  }
  onClickItem(index: number) {
    this.selectionItem = index;
  }

  onDoulbeClickItem(file: IFileInfo) {
    this.itemClick.emit(file);
  }

  remove(itemData: { file: IFileInfo, index: number }) {
    this.subscription.add(
      this.matDialog.open(ConfirmComponent, {
        data: `Bạn có chắc chắn muốn xóa ${itemData.file.name}?`
      }).afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.removeItem.emit(itemData);
        }
      })
    )
  }

  rename(itemData: { file: IFileInfo, index: number }) {
    const oldName = itemData.file.name;
    this.subscription.add(
      this.matDialog.open(ConfirmRenameComponent, {
        data: oldName
      }).afterClosed().subscribe((newName: string) => {
        if (newName && newName !== oldName) {
          this.renameItem.emit({ oldName, newName });
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
