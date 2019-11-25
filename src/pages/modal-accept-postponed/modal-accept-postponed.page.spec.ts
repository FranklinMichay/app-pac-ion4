import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAcceptPostponedPage } from './modal-accept-postponed.page';

describe('ModalAcceptPostponedPage', () => {
  let component: ModalAcceptPostponedPage;
  let fixture: ComponentFixture<ModalAcceptPostponedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAcceptPostponedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAcceptPostponedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
