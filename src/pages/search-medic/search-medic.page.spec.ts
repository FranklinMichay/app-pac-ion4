import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMedicPage } from './search-medic.page';

describe('SearchMedicPage', () => {
  let component: SearchMedicPage;
  let fixture: ComponentFixture<SearchMedicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchMedicPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMedicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
