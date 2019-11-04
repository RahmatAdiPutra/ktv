import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAllowSoundCallComponent } from './dialog-allow-sound-call.component';

describe('DialogAllowSoundCallComponent', () => {
  let component: DialogAllowSoundCallComponent;
  let fixture: ComponentFixture<DialogAllowSoundCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAllowSoundCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAllowSoundCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
