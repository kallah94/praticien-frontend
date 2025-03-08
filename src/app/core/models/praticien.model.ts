import { Adresse } from './adresse.model';
import { Specialite } from './specialite.model';

export interface Praticien {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresses: Adresse[];
  specialites: Specialite[];
  dateCreation?: Date;
  dateModification?: Date;
  actif: boolean;
}
