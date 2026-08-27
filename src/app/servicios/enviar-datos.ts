import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnviarDatos {

  // Subject para emitir/recibir los datos
  private disparadorSubject = new BehaviorSubject<any>(null);
  public disparador = this.disparadorSubject.asObservable();

  constructor() { }

  // Método para emitir cualquier dato (comidas, bebidas o un objeto combinado)
  enviar(data: any) {
    this.disparadorSubject.next(data);
  }
}
