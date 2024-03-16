import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IFileInfo } from '../interfaces/file-info.interface';
import { Success } from '../interfaces/response.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectoryManagementService {
  private url: string = environment.backendApi + '/directory';
  constructor(
    private httpClient: HttpClient
  ) { }

  list(path: string) {
    let params = new HttpParams();
    params = params.append('path', path);
    return this.httpClient.get<DirectoryListResponse>(this.url, { params }).pipe(
      map((res) => res.metaData)
    )
  }

  create(path: string) {
    let params = new HttpParams();
    params = params.append('path', path);
    return this.httpClient.post<DirectoryCreateResponse>(this.url+'/create', undefined, { params }).pipe(
      map((res) => res.metaData)
    )
  }

  delete(path: string) {
    let params = new HttpParams();
    params = params.append('path', path);
    return this.httpClient.delete(this.url+'/delete', { params })
  }
}

export interface DirectoryListResponse extends Success {
  metaData: Array<IFileInfo>
}

export interface DirectoryCreateResponse extends Success {
  metaData: IFileInfo
}
