import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AllowSoundCall } from './../../app-interface';

@Component({
  selector: 'app-dialog-allow-sound-call',
  templateUrl: './dialog-allow-sound-call.component.html',
  styleUrls: ['./dialog-allow-sound-call.component.css']
})
export class DialogAllowSoundCallComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogAllowSoundCallComponent>,
    @Inject(MAT_DIALOG_DATA) public allowCall: AllowSoundCall[]
  ) { }

  ngOnInit() {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
