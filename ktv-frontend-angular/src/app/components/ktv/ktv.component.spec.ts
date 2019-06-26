import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KtvComponent } from './ktv.component';

describe('KtvComponent', () => {
  let component: KtvComponent;
  let fixture: ComponentFixture<KtvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KtvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KtvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
