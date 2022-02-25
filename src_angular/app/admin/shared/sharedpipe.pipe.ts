import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'limitToString'
})
export class LimitStringPipe implements PipeTransform {
  transform(value: string, limit: number) : string {
    let trail = '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }

}

