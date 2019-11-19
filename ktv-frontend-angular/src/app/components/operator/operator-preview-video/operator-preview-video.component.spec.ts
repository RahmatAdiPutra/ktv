import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorPreviewVideoComponent } from './operator-preview-video.component';

describe('OperatorPreviewVideoComponent', () => {
  let component: OperatorPreviewVideoComponent;
  let fixture: ComponentFixture<OperatorPreviewVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorPreviewVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorPreviewVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
