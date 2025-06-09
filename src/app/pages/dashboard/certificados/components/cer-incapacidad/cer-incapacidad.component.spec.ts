import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerIncapacidadComponent } from './cer-incapacidad.component';

describe('CerIncapacidadComponent', () => {
  let component: CerIncapacidadComponent;
  let fixture: ComponentFixture<CerIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerIncapacidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CerIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
