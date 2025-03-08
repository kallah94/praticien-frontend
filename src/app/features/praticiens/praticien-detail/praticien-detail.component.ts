import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Praticien } from '../../../core/models/praticien.model';
import { AdresseType, AdresseTypeLabels } from '../../../core/models/adresse.model';
import { PraticienService } from '../../../core/services/praticien.service';

@Component({
  selector: 'app-praticien-detail',
  templateUrl: './praticien-detail.component.html',
  styleUrls: ['./praticien-detail.component.css']
})
export class PraticienDetailComponent implements OnInit {
  praticien: Praticien | null = null;
  loading = false;

  constructor(
    private praticienService: PraticienService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPraticien();
  }

  loadPraticien(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.snackBar.open('ID de praticien manquant', 'Fermer', { duration: 3000 });
      this.goBack();
      return;
    }

    this.loading = true;
    this.praticienService.getPraticienById(id).subscribe({
      next: (praticien) => {
        this.praticien = praticien;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Impossible de charger les données du praticien', 'Fermer', {
          duration: 3000
        });
        this.goBack();
      }
    });
  }

  getAdresseTypeLabel(type: AdresseType): string {
    return AdresseTypeLabels[type];
  }

  onEdit(): void {
    if (this.praticien) {
      this.router.navigate(['/praticiens', this.praticien.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/praticiens']);
  }
}
