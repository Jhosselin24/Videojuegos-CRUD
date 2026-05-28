import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroFormPage } from './registro-form.page';

describe('RegistroFormPage', () => {
  let component: RegistroFormPage;
  let fixture: ComponentFixture<RegistroFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
