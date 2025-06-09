import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerLesionesComponent } from './cer-lesiones.component';

describe('CerLesionesComponent', () => {
  let component: CerLesionesComponent;
  let fixture: ComponentFixture<CerLesionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerLesionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CerLesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
