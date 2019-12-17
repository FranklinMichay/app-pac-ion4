import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any, input: string) {
    if (input) {
      input = input.toLowerCase();
      return value.filter(el => {
        const val = el.priNombre.toLowerCase() + ' ' +
          el.priApellido.toLowerCase() + ' ' + el.segApellido.toLowerCase();
        const val1 = el.priApellido.toLowerCase() + ' ' + el.segApellido.toLowerCase() + ' ' +
          el.priNombre.toLowerCase();
        const val2 = el.especialidad.nombre.toLowerCase();
        return (new RegExp(input, 'gi').test(val) || new RegExp(input, 'gi').test(val1) || new RegExp(input, 'gi').test(val2));
      });
    }
    return value;
  }
}
