import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileManagementService } from '../../shared/services/file-management.service';
import { MaterialModule } from '../../shared/modules/material';
import { Subscription, filter, switchMap } from 'rxjs';
import { IFileInfo } from '../../shared/interfaces/file-info.interface';
import { BreadCrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { DirectoryManagementService } from '../../shared/services/directory-management.service';
import { ListComponent } from './list/list.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmNewDirectoryComponent } from '../../shared/components/confirm-new-directory/confirm-new-directory.component';

@Component({
  selector: 'app-file-directories',
  standalone: true,
  imports: [
    MaterialModule,

    // components
    BreadCrumbsComponent,
    ListComponent
  ],
  providers: [
    FileManagementService,
    DirectoryManagementService
  ],
  templateUrl: './file-directories.component.html',
  styleUrl: './file-directories.component.scss'
})
export class FileDirectoriesComponent implements OnInit, OnDestroy {
  pathStack: string[] = ['/khanhva'];
  files: Array<IFileInfo> = [];

  selectionItem: number = -1;

  subscription: Subscription = new Subscription();
  constructor(
    private matDialog: MatDialog,
    private fileManagementService: FileManagementService,
    private directoryManagementService: DirectoryManagementService
  ) { }

  ngOnInit(): void {
    this.getPath(this.pathStack[0]);
  }

  getPath(path: string) {
    this.subscription.add(
      this.directoryManagementService.list(path).subscribe((data) => {
        this.files = data;
      })
    )
  }

  onItemClicked(file: IFileInfo) {
    switch (file.type) {
      case 'd':
        this.pathStack.push(file.name);
        const path = this.pathStack.join('/')
        this.getPath(path);
        break;
      case '-':
        this.getFile(file.name);
        break;
      default:
        break;
    }
  }

  removeItem(itemData: { file: IFileInfo, index: number }) {
    const path = [...this.pathStack];
    path.push(itemData.file.name);
    const api = itemData.file.type === 'd' ? this.directoryManagementService : this.fileManagementService;
    this.subscription.add(
      api.delete(path.join('/')).subscribe(_ => {
        this.files.splice(itemData.index, 1);
      })
    )
  }

  renameItem(data: { oldName: string, newName: string }) {
    const path = [...this.pathStack];
    this.subscription.add(
      this.fileManagementService.rename(path.join('/'), data.oldName, data.newName).subscribe((fileInfo) => {
        const index = this.files.findIndex(file => file.name === data.oldName);
        this.files[index].name = data.newName;
      })
    )
  }

  getFile(name: string) {
    const path = this.pathStack.join('/');
    this.subscription.add(
      this.fileManagementService.getFile(path, name).subscribe((data) => {
        const buffer = new Uint8Array(data.data).buffer;
        const blob = new Blob([buffer]);
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = name;

        // Ask the user before downloading the file
        if (window.confirm(`Do you want to download this file? ${name}`)) {
          link.click();
        }

        window.URL.revokeObjectURL(url);
      })
    )
  }

  listenIndexStackChange(index: number) {
    this.pathStack = this.pathStack.slice(0, index + 1);
    const path = this.pathStack.join('/');
    this.getPath(path);
  }

  createFolder() {
    this.subscription.add(
      this.matDialog.open(ConfirmNewDirectoryComponent,
        {}
      ).afterClosed().pipe(
        filter((folderName: string) => !!folderName),
        switchMap((folderName: string) => {
          const pathStack = [...this.pathStack];
          pathStack.push(folderName);
          return this.directoryManagementService.create(pathStack.join('/'))
        })
      ).subscribe((fileInfo) => {
        this.files.push(fileInfo)
      })
    )
  }

  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;
    const path = this.pathStack.join('/');

    this.subscription.add(
      this.fileManagementService.upload(Array.from(files), path).subscribe(res => {
        const metaData = res.metaData;
        for (const data of metaData) {
          if (data.isSuccess) {
            const index = this.files.findIndex(file => file.name === data.fileName);
            index !== -1 ? this.files[index] = data.fileInfo! : this.files.push(data.fileInfo!);
          }
        }
      })
    )
  }

  reload() {
    const path = this.pathStack.join('/');
    this.getPath(path);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
