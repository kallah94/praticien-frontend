import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Praticien } from '../../../core/models/praticien.model';
import { Specialite } from '../../../core/models/specialite.model';
import { PraticienService } from '../../../core/services/praticien.service';
import { SpecialiteService } from '../../../core/services/specialite.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-praticien-list',
  templateUrl: './praticien-list.component.html',
  styleUrls: ['./praticien-list.component.css']
})
export class PraticienListComponent implements OnInit, AfterViewInit {
  praticiens: Praticien[] = [];
  specialites: Specialite[] = [];
  loading = false;

  displayedColumns: string[] = ['nom', 'email', 'telephone', 'specialites', 'status', 'actions'];
  dataSource = new MatTableDataSource<Praticien>([]);

  searchControl = new FormControl('');
  specialiteFilterControl = new FormControl(null);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private praticienService: PraticienService,
    private specialiteService: SpecialiteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPraticiens();
    this.loadSpecialites();

    // Set up search with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      if (value) {
        this.searchPraticiens(value);
      } else {
        this.loadPraticiens();
      }
    });

    // Set up speciality filter
    this.specialiteFilterControl.valueChanges.subscribe(value => {
      if (value) {
        this.filterBySpecialite(value);
      } else {
        this.loadPraticiens();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPraticiens(): void {
    this.loading = true;
    this.praticienService.getAllPraticiens().subscribe({
      next: (praticiens) => {
        console.log('Loaded practitioners:', praticiens);
        this.praticiens = praticiens;
        this.dataSource.data = praticiens;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading practitioners:', error);
        this.loading = false;
      }
    });
  }

  loadSpecialites(): void {
    this.specialiteService.getAllSpecialites().subscribe({
      next: (specialites) => {
        console.log('Loaded specialties:', specialites);
        this.specialites = specialites;
      },
      error: (error) => {
        console.error('Error loading specialties:', error);
      }
    });
  }

  searchPraticiens(term: string): void {
    this.loading = true;
    this.praticienService.searchPraticiens(term).subscribe({
      next: (praticiens) => {
        console.log('Search results:', praticiens);
        this.praticiens = praticiens;
        this.dataSource.data = praticiens;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching practitioners:', error);
        this.loading = false;
      }
    });
  }

  filterBySpecialite(specialiteId: string): void {
    this.loading = true;
    console.log('Filtering by specialty ID:', specialiteId);

    this.praticienService.getPraticiensBySpecialite(specialiteId).subscribe({
      next: (praticiens) => {
        console.log('Specialty filter results:', praticiens);
        this.praticiens = praticiens;
        this.dataSource.data = praticiens;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering by specialty:', error);
        this.loading = false;
        this.snackBar.open('Erreur lors du filtrage par spécialité', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  onAddPraticien(): void {
    this.router.navigate(['/praticiens/new']);
  }

  onViewPraticien(praticien: Praticien): void {
    if (praticien && praticien.id) {
      this.router.navigate(['/praticiens', praticien.id]);
    } else {
      this.snackBar.open('ID de praticien manquant', 'Fermer', {
        duration: 3000
      });
    }
  }

  onEditPraticien(praticien: Praticien): void {
    if (event) event.stopPropagation();
    if (praticien && praticien.id) {
      this.router.navigate(['/praticiens', praticien.id, 'edit']);
    } else {
      this.snackBar.open('ID de praticien manquant', 'Fermer', {
        duration: 3000
      });
    }
  }

  onDeletePraticien(praticien: Praticien): void {
    if (event) event.stopPropagation();
    if (!praticien || !praticien.id) {
      this.snackBar.open('ID de praticien manquant', 'Fermer', {
        duration: 3000
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer le praticien ${praticien.prenom} ${praticien.nom} ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.praticienService.deletePraticien(praticien.id!).subscribe({
          next: () => {
            this.loadPraticiens();
            this.snackBar.open('Le praticien a été supprimé avec succès', 'Fermer', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error deleting practitioner:', error);
            this.loading = false;
            this.snackBar.open('Erreur lors de la suppression du praticien', 'Fermer', {
              duration: 3000
            });
          }
        });
      }
    });
  }
}
