import { Pipe, PipeTransform } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';


@Pipe({
  name: 'decrypt'
})

export class DecryptPipe implements PipeTransform {

  private utils: UtilitiesService;

  transform(value: string): string {
    this.utils = new UtilitiesService();
    return this.utils.decrypt(value);
  }

}
