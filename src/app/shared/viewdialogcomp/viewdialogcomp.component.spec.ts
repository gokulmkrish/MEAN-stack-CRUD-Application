import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewdialogcompComponent } from './viewdialogcomp.component';

describe('ViewdialogcompComponent', () => {
  let component: ViewdialogcompComponent;
  let fixture: ComponentFixture<ViewdialogcompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewdialogcompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewdialogcompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
