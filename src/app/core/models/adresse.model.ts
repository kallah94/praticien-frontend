export enum AdresseType {
  OFFICE = 'OFFICE',
  OFFICIEL = 'OFFICIEL',
  HOME = 'HOME'
}

export const AdresseTypeLabels = {
  [AdresseType.OFFICE]: 'Adresse de travail',
  [AdresseType.OFFICIEL]: 'Adresse officielle',
  [AdresseType.HOME]: 'Adresse personnelle'
};

export interface Adresse {
  type: AdresseType;
  rue: string;
  complementRue?: string;
  codePostal: string;
  ville: string;
  pays: string;
  adressePrincipale: boolean;
}
