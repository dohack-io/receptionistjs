import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEventPage } from './new-event.page';

describe('NewEventPage', () => {
  let component: NewEventPage;
  let fixture: ComponentFixture<NewEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEventPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
