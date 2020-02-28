import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APPCONFIG } from '../../../shared/globals';
import { Observable } from 'rxjs';

@Injectable()
export class SettingsService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get(APPCONFIG.API_PATH + 'settings');
  }

  getSettings(settId: string): Observable<any> {
    return this.http.get(APPCONFIG.API_PATH + 'settings/' + settId);
  }

  createSettings(settings: any): Observable<any> {
    return this.http.post<any>(APPCONFIG.API_URL + 'settings', settings);
  }

  updateSettings(settings: any, settId: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'settings/' + settId, settings);
  }

  deleteSettings(settId: string): Observable<any> {
    return this.http.delete<any>(APPCONFIG.API_URL + 'settings/' + settId);
  }
}
