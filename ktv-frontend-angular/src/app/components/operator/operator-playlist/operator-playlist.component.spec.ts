import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorPlaylistComponent } from './operator-playlist.component';

describe('OperatorPlaylistComponent', () => {
  let component: OperatorPlaylistComponent;
  let fixture: ComponentFixture<OperatorPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
