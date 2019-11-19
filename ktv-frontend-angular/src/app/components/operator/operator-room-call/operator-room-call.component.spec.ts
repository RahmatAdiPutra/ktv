import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorRoomCallComponent } from './operator-room-call.component';

describe('OperatorRoomCallComponent', () => {
  let component: OperatorRoomCallComponent;
  let fixture: ComponentFixture<OperatorRoomCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorRoomCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorRoomCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
