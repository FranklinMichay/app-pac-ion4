import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMedicPage } from './detail-medic.page';

describe('DetailMedicPage', () => {
  let component: DetailMedicPage;
  let fixture: ComponentFixture<DetailMedicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailMedicPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMedicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
