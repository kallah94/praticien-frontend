import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Praticien } from '../models/praticien.model';
import { Adresse } from '../models/adresse.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PraticienService {
  private apiUrl = `${environment.apiUrl}/praticiens`;

  constructor(private http: HttpClient) { }

  getAllPraticiens(): Observable<Praticien[]> {
    return this.http.get<Praticien[]>(this.apiUrl);
  }

  getPraticienById(id: string): Observable<Praticien> {
    if (!id) {
      throw new Error('ID cannot be null or undefined');
    }
    return this.http.get<Praticien>(`${this.apiUrl}/${id}`);
  }

  searchPraticiens(term: string): Observable<Praticien[]> {
    return this.http.get<Praticien[]>(`${this.apiUrl}/search?search=${term}`);
  }

  getPraticiensBySpecialite(specialiteId: string): Observable<Praticien[]> {
    if (!specialiteId) {
      throw new Error('Specialty ID cannot be null or undefined');
    }
    console.log(`Calling API endpoint: ${this.apiUrl}/specialite/${specialiteId}`);
    return this.http.get<Praticien[]>(`${this.apiUrl}/specialite/${specialiteId}`);
  }

  createPraticien(praticien: Praticien): Observable<Praticien> {
    return this.http.post<Praticien>(this.apiUrl, praticien);
  }

  updatePraticien(id: string, praticien: Praticien): Observable<Praticien> {
    if (!id) {
      throw new Error('ID cannot be null or undefined');
    }
    return this.http.put<Praticien>(`${this.apiUrl}/${id}`, praticien);
  }

  deletePraticien(id: string): Observable<void> {
    if (!id) {
      throw new Error('ID cannot be null or undefined');
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Specialty management
  addSpecialiteToPraticien(praticienId: string, specialiteId: string): Observable<Praticien> {
    if (!praticienId || !specialiteId) {
      throw new Error('IDs cannot be null or undefined');
    }
    return this.http.post<Praticien>(`${this.apiUrl}/${praticienId}/specialites/${specialiteId}`, {});
  }

  removeSpecialiteFromPraticien(praticienId: string, specialiteId: string): Observable<Praticien> {
    if (!praticienId || !specialiteId) {
      throw new Error('IDs cannot be null or undefined');
    }
    return this.http.delete<Praticien>(`${this.apiUrl}/${praticienId}/specialites/${specialiteId}`);
  }

  // Address management
  getPraticienAdresses(praticienId: string): Observable<Adresse[]> {
    if (!praticienId) {
      throw new Error('ID cannot be null or undefined');
    }
    return this.http.get<Adresse[]>(`${this.apiUrl}/${praticienId}/adresses`);
  }

  addAdresseToPraticien(praticienId: string, adresse: Adresse): Observable<Praticien> {
    if (!praticienId) {
      throw new Error('ID cannot be null or undefined');
    }
    return this.http.post<Praticien>(`${this.apiUrl}/${praticienId}/adresses`, adresse);
  }

  updatePraticienAdresse(praticienId: string, index: number, adresse: Adresse): Observable<Praticien> {
    if (!praticienId) {
      throw new Error('ID cannot be null or undefined');
    }
    return this.http.put<Praticien>(`${this.apiUrl}/${praticienId}/adresses/${index}`, adresse);
  }

  deletePraticienAdresse(praticienId: string, index: number): Observable<Praticien> {
    if (!praticienId) {
      throw new Error('ID cannot be null or undefined');
    }
    return this.http.delete<Praticien>(`${this.apiUrl}/${praticienId}/adresses/${index}`);
  }
}
