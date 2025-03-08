import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialiteFormComponent } from './specialite-form.component';

describe('SpecialiteFormComponent', () => {
  let component: SpecialiteFormComponent;
  let fixture: ComponentFixture<SpecialiteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialiteFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialiteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
