import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorRoomPlaylistComponent } from './operator-room-playlist.component';

describe('OperatorRoomPlaylistComponent', () => {
  let component: OperatorRoomPlaylistComponent;
  let fixture: ComponentFixture<OperatorRoomPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorRoomPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorRoomPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
