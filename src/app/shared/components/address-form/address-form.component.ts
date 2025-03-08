import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Adresse, AdresseType, AdresseTypeLabels } from '../../../core/models/adresse.model';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  @Input() address: Adresse | null = null;
  @Input() editMode = false;
  @Input() addressIndex: number | null = null;

  @Output() save = new EventEmitter<{ address: Adresse, index: number | null }>();
  @Output() cancel = new EventEmitter<void>();

  addressForm!: FormGroup;

  addressTypes = [
    { value: AdresseType.OFFICE, label: AdresseTypeLabels[AdresseType.OFFICE] },
    { value: AdresseType.OFFICIEL, label: AdresseTypeLabels[AdresseType.OFFICIEL] },
    { value: AdresseType.HOME, label: AdresseTypeLabels[AdresseType.HOME] }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.addressForm = this.fb.group({
      type: [this.address?.type || AdresseType.OFFICE, Validators.required],
      rue: [this.address?.rue || '', Validators.required],
      complementRue: [this.address?.complementRue || ''],
      codePostal: [this.address?.codePostal || '', Validators.required],
      ville: [this.address?.ville || '', Validators.required],
      pays: [this.address?.pays || 'France', Validators.required],
      adressePrincipale: [this.address?.adressePrincipale || false]
    });
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      const formData = this.addressForm.value;
      this.save.emit({
        address: formData as Adresse,
        index: this.addressIndex
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
