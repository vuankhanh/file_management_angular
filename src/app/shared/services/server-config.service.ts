import { Injectable } from '@angular/core';
import { ServerConfigResponse } from '../interfaces/server_config.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ServerConfigService {
  private url: string = environment.backendApi+'/config';
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  get(){
    return this.httpClient.get<ServerConfigResponse>(this.url);
  }
}
