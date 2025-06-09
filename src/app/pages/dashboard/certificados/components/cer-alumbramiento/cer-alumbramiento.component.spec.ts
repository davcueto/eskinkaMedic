import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerAlumbramientoComponent } from './cer-alumbramiento.component';

describe('CerAlumbramientoComponent', () => {
  let component: CerAlumbramientoComponent;
  let fixture: ComponentFixture<CerAlumbramientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerAlumbramientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CerAlumbramientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
