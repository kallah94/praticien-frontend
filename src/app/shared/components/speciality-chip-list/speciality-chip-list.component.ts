import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Specialite } from '../../../core/models/specialite.model';
import { SpecialiteService } from '../../../core/services/specialite.service';

@Component({
  selector: 'app-speciality-chip-list',
  templateUrl: './speciality-chip-list.component.html',
  styleUrls: ['./speciality-chip-list.component.css']
})
export class SpecialityChipListComponent implements OnInit {
  @Input() selectedSpecialities: Specialite[] = [];
  @Output() specialitiesChanged = new EventEmitter<Specialite[]>();

  separatorKeysCodes: number[] = [ENTER, COMMA];
  specialityCtrl = new FormControl('');
  filteredSpecialities: Observable<Specialite[]> = of([]);
  allSpecialities: Specialite[] = [];
  removable = true;
  loading = false;

  @ViewChild('specialityInput') specialityInput!: ElementRef<HTMLInputElement>;

  constructor(private specialiteService: SpecialiteService) {}

  ngOnInit(): void {
    this.loadSpecialities();
  }

  private _filter(value: string | Specialite): Specialite[] {
    let filterValue = '';
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else if (value && value.nom) {
      filterValue = value.nom.toLowerCase();
    }

    return this.allSpecialities.filter(specialite =>
      specialite.nom.toLowerCase().includes(filterValue) &&
      !this.selectedSpecialities.some(selected => selected.id === specialite.id)
    );
  }

  loadSpecialities(): void {
    this.loading = true;
    this.specialiteService.getAllSpecialites().subscribe({
      next: (specialities) => {
        this.allSpecialities = specialities;
        this.filteredSpecialities = this.specialityCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || ''))
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  add(event: MatChipInputEvent): void {
    // Don't add chips directly from input - only from autocomplete
    event.chipInput!.clear();
  }

  remove(specialite: Specialite): void {
    const index = this.selectedSpecialities.findIndex(s => s.id === specialite.id);

    if (index >= 0) {
      this.selectedSpecialities.splice(index, 1);
      this.specialitiesChanged.emit(this.selectedSpecialities);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedSpecialite = event.option.value as Specialite;
    // Don't add if already in the list
    if (!this.selectedSpecialities.some(s => s.id === selectedSpecialite.id)) {
      this.selectedSpecialities.push(selectedSpecialite);
      this.specialitiesChanged.emit(this.selectedSpecialities);
    }

    this.specialityInput.nativeElement.value = '';
    this.specialityCtrl.setValue(null);
  }
}
