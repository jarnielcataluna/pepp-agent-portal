import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import { MatSnackBar } from '../../../node_modules/@angular/material';

const IV_PARAMETER_SPEC = '$s3aRc#0ptM3d!@%';
const SECRET_KEY_SPEC = '$pR0p3LrR2018@@%';


@Injectable({
  providedIn: 'root'
})

export class UtilitiesService {

  constructor(
    public snackBar: MatSnackBar,
  ) { }


  encrypt(text: string) {
    return crypto.AES.encrypt(
      text,
      crypto.enc.Utf8.parse(SECRET_KEY_SPEC),
      {
        iv: crypto.enc.Utf8.parse(IV_PARAMETER_SPEC),
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
      }
    ).toString();
  }


  decrypt(text: string) {
    return crypto.AES.decrypt(
      text,
      crypto.enc.Utf8.parse(SECRET_KEY_SPEC),
      {
        iv: crypto.enc.Utf8.parse(IV_PARAMETER_SPEC),
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
      }
    ).toString(crypto.enc.Utf8);
  }


  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

}
