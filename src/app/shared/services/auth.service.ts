import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RefreshTokenResponse, TokenResponse } from '../interfaces/token.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string = environment.backendApi+'/auth';
  constructor(
    private httpClient: HttpClient
  ) { }
  login(username: string, password: string){
    const data = { username, password }
    return this.httpClient.post<TokenResponse>(this.url+'/login', data);
  }

  refreshToken(refreshToken: string){
    const data = { refreshToken }
    return this.httpClient.post<RefreshTokenResponse>(this.url+'/refresh_token', data);
  }
}
