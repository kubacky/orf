import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APPCONFIG } from 'src/app/shared/globals';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get<Observable<any>>(APPCONFIG.API_URL + 'category');
  }

  get(id: string): Observable<any> {
    return this.http.get<Observable<any>>(APPCONFIG.API_URL + 'category/' + id);
  }

  create(category: any): Observable<any> {
    return this.http.post<any>(APPCONFIG.API_URL + 'category', category);
  }

  update(category: any, catId: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'category/' + catId, category);
  }

  delete(catId): Observable<any> {
    return this.http.delete<any>(APPCONFIG.API_URL + 'category/' + catId);
  }
}
