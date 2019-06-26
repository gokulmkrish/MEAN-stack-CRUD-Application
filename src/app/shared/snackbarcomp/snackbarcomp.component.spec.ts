import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarcompComponent } from './snackbarcomp.component';

describe('SnackbarcompComponent', () => {
  let component: SnackbarcompComponent;
  let fixture: ComponentFixture<SnackbarcompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackbarcompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarcompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
