import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetasComponent } from './resetas.component';

describe('ResetasComponent', () => {
  let component: ResetasComponent;
  let fixture: ComponentFixture<ResetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
