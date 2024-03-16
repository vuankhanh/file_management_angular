import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Success } from '../interfaces/response.interface';
import { map } from 'rxjs';
import { IFileInfo } from '../interfaces/file-info.interface';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {
  private url: string = environment.backendApi + '/file';
  constructor(
    private httpClient: HttpClient
  ) { }

  upload(files: Array<File>, path: string) {
    let params = new HttpParams();
    params = params.append('path', path);

    const formData = new FormData();
    for (const file of files) {
      formData.append('file', file);
    }
    return this.httpClient.post<FileUploadResponse>(this.url + '/upload', formData, { params });
  }

  getFile(path: string, fileName: string) {
    let params = new HttpParams();
    params = params.append('path', path);
    params = params.append('fileName', fileName);
    return this.httpClient.get<FileDownloadResponse>(this.url, { params }).pipe(
      map((res) => res.metaData)
    );
  }

  rename(path: string, oldName: string, newName: string) {
    let params = new HttpParams();
    params = params.append('path', path);
    params = params.append('oldName', oldName);
    params = params.append('newName', newName);
    return this.httpClient.patch(this.url + '/rename', null, { params });
  }

  delete(path: string) {
    let params = new HttpParams();
    params = params.append('path', path);
    return this.httpClient.delete(this.url + '/delete', { params });
  }
}

export interface FileDownloadResponse extends Success {
  metaData: { type: string, data: Array<number> }
}

export interface FileUploadResponse extends Success {
  metaData: Array<SuccessResult | FailureResult>
}

type Result<T extends boolean> = {
  fileName: string;
  fileInfo: T extends true ? IFileInfo : undefined;
  isSuccess: boolean;
}

type SuccessResult = Result<true>;
type FailureResult = Result<false>;
