import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

import { Praticien } from '../../../core/models/praticien.model';
import { Specialite } from '../../../core/models/specialite.model';
import { Adresse, AdresseType, AdresseTypeLabels } from '../../../core/models/adresse.model';
import { PraticienService } from '../../../core/services/praticien.service';
import { SpecialiteService } from '../../../core/services/specialite.service';

@Component({
  selector: 'app-praticien-form',
  templateUrl: './praticien-form.component.html',
  styleUrls: ['./praticien-form.component.css']
})
export class PraticienFormComponent implements OnInit {
  praticienForm!: FormGroup;
  praticien: Praticien | null = null;

  editMode = false;
  submitting = false;

  // Addresses management
  adresses: Adresse[] = [];
  showAddressForm = false;
  addressEditMode = false;
  currentAddress: Adresse | null = null;
  currentAddressIndex: number | null = null;

  // Specialities management
  selectedSpecialities: Specialite[] = [];

  constructor(
    private fb: FormBuilder,
    private praticienService: PraticienService,
    private specialiteService: SpecialiteService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();

    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.loadPraticien(id);
    }
  }

  initForm(): void {
    this.praticienForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.pattern(/^\+?[0-9]{10,15}$/)],
      actif: [true]
    });
  }

  loadPraticien(id: string): void {
    this.praticienService.getPraticienById(id).subscribe({
      next: (praticien) => {
        this.praticien = praticien;
        this.updateFormWithPraticien(praticien);
      },
      error: () => {
        this.snackBar.open('Impossible de charger les données du praticien', 'Fermer', {
          duration: 3000
        });
        this.goBack();
      }
    });
  }

  updateFormWithPraticien(praticien: Praticien): void {
    this.praticienForm.patchValue({
      nom: praticien.nom,
      prenom: praticien.prenom,
      email: praticien.email,
      telephone: praticien.telephone,
      actif: praticien.actif
    });

    // Set addresses
    this.adresses = [...praticien.adresses];

    // Set specialities
    this.selectedSpecialities = [...praticien.specialites];
  }

  onSubmit(): void {
    if (this.praticienForm.invalid) {
      return;
    }

    this.submitting = true;
    const formData = this.praticienForm.value;

    const praticienData: Praticien = {
      ...formData,
      adresses: this.adresses,
      specialites: this.selectedSpecialities
    };

    if (this.editMode && this.praticien) {
      praticienData.id = this.praticien.id;

      this.praticienService.updatePraticien(this.praticien.id!, praticienData).subscribe({
        next: () => {
          this.snackBar.open('Praticien mis à jour avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/praticiens']);
        },
        error: () => {
          this.submitting = false;
        }
      });
    } else {
      this.praticienService.createPraticien(praticienData).subscribe({
        next: (newPraticien) => {
          if (newPraticien) {
            this.snackBar.open('Praticien créé avec succès', 'Fermer', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/praticiens']);
          }
        },
        error: () => {
          this.submitting = false;
        }
      });
    }
  }

  // Address management
  addNewAddress(): void {
    this.showAddressForm = true;
    this.addressEditMode = false;
    this.currentAddress = null;
    this.currentAddressIndex = null;
  }

  editAddress(index: number): void {
    this.showAddressForm = true;
    this.addressEditMode = true;
    this.currentAddress = { ...this.adresses[index] };
    this.currentAddressIndex = index;
  }

  removeAddress(index: number): void {
    this.adresses.splice(index, 1);
  }

  onAddressSave(event: { address: Adresse, index: number | null }): void {
    if (event.index !== null) {
      // Update existing address
      this.adresses[event.index] = event.address;
    } else {
      // Add new address
      this.adresses.push(event.address);
    }

    this.showAddressForm = false;
    this.currentAddress = null;
    this.currentAddressIndex = null;
  }

  onAddressCancel(): void {
    this.showAddressForm = false;
    this.currentAddress = null;
    this.currentAddressIndex = null;
  }

  getAdresseTypeLabel(type: AdresseType): string {
    return AdresseTypeLabels[type];
  }

  // Speciality management
  onSpecialitiesChanged(specialities: Specialite[]): void {
    this.selectedSpecialities = specialities;
  }

  goBack(): void {
    this.router.navigate(['/praticiens']);
  }
}
