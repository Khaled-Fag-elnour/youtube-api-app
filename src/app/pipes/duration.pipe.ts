import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: string): string {
    // value format => PT1H27M19S
    const v = value.substring(2);
    let h = v.substring(0, v.indexOf('H'));
    let m = v.substring(v.indexOf('H') + 1, v.indexOf('M'));
    let s = v.substring(v.indexOf('M') + 1, v.indexOf('S'));

    h = h ? h : '0';
    m = m ? m : '0';
    s = s ? s : '0';

    h = Number(h) >= 10 ? h : '0' + h;
    m = Number(m) >= 10 ? m : '0' + m;
    s = Number(s) >= 10 ? h : '0' + s;

    return `${h}-${m}-${s}`;
  }

}
