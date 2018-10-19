import { Pipe, PipeTransform } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';


@Pipe({
  name: 'decrypt'
})

export class DecryptPipe implements PipeTransform {

  constructor(private utils: UtilitiesService) {
  }

  transform(value: string): string {
    return this.utils.decrypt(value);
  }

}
