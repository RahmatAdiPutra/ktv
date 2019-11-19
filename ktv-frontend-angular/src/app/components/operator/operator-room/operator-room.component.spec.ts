import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorRoomComponent } from './operator-room.component';

describe('OperatorRoomComponent', () => {
  let component: OperatorRoomComponent;
  let fixture: ComponentFixture<OperatorRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
