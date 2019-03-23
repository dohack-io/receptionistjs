import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistratedUsersPage } from './registrated-users.page';

describe('RegistratedUsersPage', () => {
  let component: RegistratedUsersPage;
  let fixture: ComponentFixture<RegistratedUsersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistratedUsersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistratedUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
