import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialityChipListComponent } from './speciality-chip-list.component';

describe('SpecialityChipListComponent', () => {
  let component: SpecialityChipListComponent;
  let fixture: ComponentFixture<SpecialityChipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialityChipListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialityChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
