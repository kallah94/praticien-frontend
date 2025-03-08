import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Praticien } from '../../core/models/praticien.model';
import { Specialite } from '../../core/models/specialite.model';
import { PraticienService } from '../../core/services/praticien.service';
import { SpecialiteService } from '../../core/services/specialite.service';

interface SpecialiteCount extends Specialite {
  count: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;

  // Counters
  praticienCount = 0;
  specialiteCount = 0;
  activePraticienCount = 0;

  // Recent practitioners
  recentPraticiens: Praticien[] = [];
  practitionerColumns: string[] = ['nom', 'email', 'specialites', 'dateCreation', 'actions'];

  // Popular specialties
  popularSpecialites: SpecialiteCount[] = [];

  constructor(
    private praticienService: PraticienService,
    private specialiteService: SpecialiteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load all required data
    forkJoin({
      praticiens: this.praticienService.getAllPraticiens(),
      specialites: this.specialiteService.getAllSpecialites()
    }).subscribe({
      next: (results) => {
        const { praticiens, specialites } = results;

        // Update counts
        this.praticienCount = praticiens.length;
        this.specialiteCount = specialites.length;
        this.activePraticienCount = praticiens.filter(p => p.actif).length;

        // Get recent practitioners (last 5 added)
        this.recentPraticiens = [...praticiens]
          .sort((a, b) => new Date(b.dateCreation || 0).getTime() - new Date(a.dateCreation || 0).getTime())
          .slice(0, 5);

        // Calculate popular specialties
        const specialityCounts = new Map<string, number>();

        // Count occurrences of each specialty
        praticiens.forEach(praticien => {
          if (praticien.specialites && praticien.specialites.length > 0) {
            praticien.specialites.forEach(specialite => {
              const currentCount = specialityCounts.get(specialite.id!) || 0;
              specialityCounts.set(specialite.id!, currentCount + 1);
            });
          }
        });

        // Create array of specialties with counts
        this.popularSpecialites = specialites
          .map(specialite => ({
            ...specialite,
            count: specialityCounts.get(specialite.id!) || 0
          }))
          .filter(specialite => specialite.count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getSpecialitesString(specialites: Specialite[]): string {
    if (!specialites || specialites.length === 0) {
      return 'Aucune spécialité';
    }

    if (specialites.length <= 2) {
      return specialites.map(s => s.nom).join(', ');
    }

    return `${specialites[0].nom}, ${specialites[1].nom}, +${specialites.length - 2}`;
  }

  navigateToPraticiens(): void {
    this.router.navigate(['/praticiens']);
  }

  navigateToSpecialites(): void {
    this.router.navigate(['/specialites']);
  }

  viewPraticien(praticien: Praticien): void {
    this.router.navigate(['/praticiens', praticien.id]);
  }

  viewSpecialite(specialite: SpecialiteCount): void {
    this.router.navigate(['/specialites', specialite.id, 'edit']);
  }
}
