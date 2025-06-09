import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerSaludComponent } from './cer-salud.component';

describe('CerSaludComponent', () => {
  let component: CerSaludComponent;
  let fixture: ComponentFixture<CerSaludComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerSaludComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CerSaludComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
