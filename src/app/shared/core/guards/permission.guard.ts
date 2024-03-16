import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { ServerConfigService } from '../../services/server-config.service';

import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
class PermissionsService {
  constructor(
    private router: Router,
    private serverConfigService: ServerConfigService,
  ){

  }
  canActivate(): Observable<boolean> {
    return this.serverConfigService.get().pipe(
      map(res=>true),
      catchError(err=>{
        this.router.navigate(['/login'])
        return of(false)}
      )
    )
  }
}

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(PermissionsService).canActivate()
};
