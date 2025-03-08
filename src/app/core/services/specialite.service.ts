import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specialite } from '../models/specialite.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecialiteService {
  private apiUrl = `${environment.apiUrl}/specialites`;

  constructor(private http: HttpClient) { }

  getAllSpecialites(): Observable<Specialite[]> {
    return this.http.get<Specialite[]>(this.apiUrl);
  }

  getSpecialiteById(id: string): Observable<Specialite> {
    return this.http.get<Specialite>(`${this.apiUrl}/${id}`);
  }

  searchSpecialites(term: string): Observable<Specialite[]> {
    return this.http.get<Specialite[]>(`${this.apiUrl}/search?nom=${term}`);
  }

  createSpecialite(specialite: Specialite): Observable<Specialite> {
    return this.http.post<Specialite>(this.apiUrl, specialite);
  }

  updateSpecialite(id: string, specialite: Specialite): Observable<Specialite> {
    return this.http.put<Specialite>(`${this.apiUrl}/${id}`, specialite);
  }

  deleteSpecialite(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
