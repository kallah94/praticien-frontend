import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Specialite } from '../../../core/models/specialite.model';
import { SpecialiteService } from '../../../core/services/specialite.service';

@Component({
  selector: 'app-specialite-form',
  templateUrl: './specialite-form.component.html',
  styleUrls: ['./specialite-form.component.css']
})
export class SpecialiteFormComponent implements OnInit {
  specialiteForm!: FormGroup;
  specialite: Specialite | null = null;

  editMode = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
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
      this.loadSpecialite(id);
    }
  }

  initForm(): void {
    this.specialiteForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['']
    });
  }

  loadSpecialite(id: string): void {
    this.specialiteService.getSpecialiteById(id).subscribe({
      next: (specialite) => {
        this.specialite = specialite;
        this.updateFormWithSpecialite(specialite);
      },
      error: () => {
        this.snackBar.open('Impossible de charger les données de la spécialité', 'Fermer', {
          duration: 3000
        });
        this.goBack();
      }
    });
  }

  updateFormWithSpecialite(specialite: Specialite): void {
    this.specialiteForm.patchValue({
      nom: specialite.nom,
      description: specialite.description
    });
  }

  onSubmit(): void {
    if (this.specialiteForm.invalid) {
      return;
    }

    this.submitting = true;
    const formData = this.specialiteForm.value;

    if (this.editMode && this.specialite) {
      const specialiteData: Specialite = {
        ...this.specialite,
        ...formData
      };

      this.specialiteService.updateSpecialite(this.specialite.id!, specialiteData).subscribe({
        next: () => {
          this.snackBar.open('Spécialité mise à jour avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/specialites']);
        },
        error: () => {
          this.submitting = false;
        }
      });
    } else {
      this.specialiteService.createSpecialite(formData).subscribe({
        next: () => {
          this.snackBar.open('Spécialité créée avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/specialites']);
        },
        error: () => {
          this.submitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/specialites']);
  }
}
