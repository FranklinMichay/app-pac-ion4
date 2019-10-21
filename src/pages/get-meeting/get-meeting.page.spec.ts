import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetMeetingPage } from './get-meeting.page';

describe('GetMeetingPage', () => {
  let component: GetMeetingPage;
  let fixture: ComponentFixture<GetMeetingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetMeetingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetMeetingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
