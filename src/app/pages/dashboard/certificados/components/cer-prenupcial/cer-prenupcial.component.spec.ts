import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerPrenupcialComponent } from './cer-prenupcial.component';

describe('CerPrenupcialComponent', () => {
  let component: CerPrenupcialComponent;
  let fixture: ComponentFixture<CerPrenupcialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerPrenupcialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CerPrenupcialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
