import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorSongComponent } from './operator-song.component';

describe('OperatorSongComponent', () => {
  let component: OperatorSongComponent;
  let fixture: ComponentFixture<OperatorSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorSongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
