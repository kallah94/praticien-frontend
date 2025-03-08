import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PraticienDetailComponent } from './praticien-detail.component';

describe('PraticienDetailComponent', () => {
  let component: PraticienDetailComponent;
  let fixture: ComponentFixture<PraticienDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PraticienDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PraticienDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
