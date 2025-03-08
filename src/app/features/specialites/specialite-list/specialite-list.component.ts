import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Specialite } from '../../../core/models/specialite.model';
import { SpecialiteService } from '../../../core/services/specialite.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-specialite-list',
  templateUrl: './specialite-list.component.html',
  styleUrls: ['./specialite-list.component.css']
})
export class SpecialiteListComponent implements OnInit, AfterViewInit {
  specialites: Specialite[] = [];
  loading = false;

  displayedColumns: string[] = ['nom', 'description', 'dateCreation', 'actions'];
  dataSource = new MatTableDataSource<Specialite>([]);

  searchControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private specialiteService: SpecialiteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSpecialites();

    // Set up search with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      if (value) {
        this.searchSpecialites(value);
      } else {
        this.loadSpecialites();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSpecialites(): void {
    this.loading = true;
    this.specialiteService.getAllSpecialites().subscribe({
      next: (specialites) => {
        this.specialites = specialites;
        this.dataSource.data = specialites;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  searchSpecialites(term: string): void {
    this.loading = true;
    this.specialiteService.searchSpecialites(term).subscribe({
      next: (specialites) => {
        this.specialites = specialites;
        this.dataSource.data = specialites;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onAddSpecialite(): void {
    this.router.navigate(['/specialites/new']);
  }

  onEditSpecialite(specialite: Specialite): void {
    event?.stopPropagation();
    this.router.navigate(['/specialites', specialite.id, 'edit']);
  }

  onDeleteSpecialite(specialite: Specialite): void {
    event?.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer la spécialité "${specialite.nom}" ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.specialiteService.deleteSpecialite(specialite.id!).subscribe({
          next: () => {
            this.loadSpecialites();
            this.snackBar.open('La spécialité a été supprimée avec succès', 'Fermer', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    });
  }
}
