import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemCarrito, ServicioCarrito } from '../servicios/servicio-carrito';
import { DatosCliente } from '../entidades/datos-del-cliente';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  private logo: string | null = null;

  // datos del cliente, agrupados en la entidad DatosCliente
  datosCliente: DatosCliente = {
    nombre: '',
    celular: '',
    direccion: '',
  };

  mensajeError = signal('');

  constructor(public servicioCarrito: ServicioCarrito) {}

  ngOnInit(): void {
    void this.cargarLogo();
  }

  aumentar(item: ItemCarrito) {
    this.servicioCarrito.cambiarCantidad(item.id, item.cantidad + 1);
  }

  disminuir(item: ItemCarrito) {
    if (item.cantidad > 1) {
      this.servicioCarrito.cambiarCantidad(item.id, item.cantidad - 1);
    }
  }

  eliminar(item: ItemCarrito) {
    this.servicioCarrito.quitarProducto(item.id);
  }

  realizarPedido() {
    this.mensajeError.set('');

    if (this.servicioCarrito.productos().length === 0) {
      this.mensajeError.set('Tu carrito está vacío.');
      return;
    }

    if (
      !this.datosCliente.nombre.trim() ||
      !this.datosCliente.celular.trim() ||
      !this.datosCliente.direccion.trim()
    ) {
      this.mensajeError.set('Completa tus datos antes de realizar el pedido.');
      return;
    }

    this.generarPdf();
  }

  generarPdf(): void {
    const doc = new jsPDF();
    const productos = this.servicioCarrito.productos();
    const total = this.servicioCarrito.total();
    const logo = this.logo;
    const anchoPagina = doc.internal.pageSize.getWidth();
    const altoPagina = doc.internal.pageSize.getHeight();
    const margen = 16;

    doc.setFillColor(15, 25, 18);
    doc.rect(0, 0, anchoPagina, 44, 'F');
    doc.setFillColor(168, 224, 99);
    doc.rect(0, 42, anchoPagina, 2, 'F');
    if (logo) {
      doc.addImage(logo, 'PNG', margen, 8, 27, 27);
    }
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(21);
    doc.text('MANILA', 50, 21);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(190, 205, 190);
    doc.text('EL MEJOR RESTAURANTE', 50, 29);
    doc.setFontSize(10);
    doc.text('COMPROBANTE DE PEDIDO', anchoPagina - margen, 18, { align: 'right' });

    const fecha = new Date().toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    doc.setFontSize(9);
    doc.text(fecha, anchoPagina - margen, 27, { align: 'right' });

    doc.setTextColor(35, 45, 37);
    doc.setFillColor(244, 248, 241);
    doc.roundedRect(margen, 55, anchoPagina - margen * 2, 35, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Datos del cliente', margen + 6, 64);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nombre: ${this.datosCliente.nombre}`, margen + 6, 74);
    doc.text(`Celular: ${this.datosCliente.celular}`, margen + 75, 74);
    doc.text(`Dirección: ${this.datosCliente.direccion}`, margen + 6, 83);

    let y = 105;
    doc.setTextColor(35, 45, 37);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Detalle del pedido', margen, y);
    y += 9;
    doc.setFillColor(168, 224, 99);
    doc.roundedRect(margen, y, anchoPagina - margen * 2, 10, 2, 2, 'F');
    doc.setFontSize(9);
    doc.text('PRODUCTO', margen + 5, y + 6.5);
    doc.text('CANT.', 122, y + 6.5);
    doc.text('PRECIO UNIT.', 143, y + 6.5);
    doc.text('SUBTOTAL', 181, y + 6.5, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    y += 16;
    productos.forEach((p, indice) => {
      const subtotal = p.precio * p.cantidad;
      if (indice % 2 === 0) {
        doc.setFillColor(248, 250, 247);
        doc.rect(margen, y - 6, anchoPagina - margen * 2, 13, 'F');
      }
      doc.setTextColor(45, 52, 46);
      doc.text(doc.splitTextToSize(p.nombre, 82)[0], margen + 5, y + 1);
      doc.text(String(p.cantidad), 125, y + 1, { align: 'center' });
      doc.text(`$${p.precio.toLocaleString('es-CO')}`, 157, y + 1, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.text(`$${subtotal.toLocaleString('es-CO')}`, 181, y + 1, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      y += 13;

      if (y > altoPagina - 45) {
        this.agregarPie(doc, anchoPagina, altoPagina);
        doc.addPage();
        y = 24;
      }
    });

    doc.setDrawColor(168, 224, 99);
    doc.setLineWidth(0.7);
    doc.line(margen, y, anchoPagina - margen, y);
    y += 14;
    doc.setFillColor(15, 25, 18);
    doc.roundedRect(112, y - 7, anchoPagina - 112 - margen, 20, 3, 3, 'F');
    doc.setTextColor(168, 224, 99);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('TOTAL', 119, y + 5);
    doc.setTextColor(255, 255, 255);
    doc.text(`$${total.toLocaleString('es-CO')}`, anchoPagina - margen - 5, y + 5, { align: 'right' });
    this.agregarPie(doc, anchoPagina, altoPagina);

    doc.save(`pedido-manila-${Date.now()}.pdf`);

    // una vez descargado el pedido, se limpia el carrito y el formulario
    this.servicioCarrito.vaciarCarrito();
    this.datosCliente = { nombre: '', celular: '', direccion: '' };
  }

  private async cargarLogo(): Promise<void> {
    try {
      const rutaLogo = new URL('img/logo.png', document.baseURI).href;
      const respuesta = await fetch(rutaLogo);
      const archivo = await respuesta.blob();

      this.logo = await new Promise<string>((resolver, rechazar) => {
        const lector = new FileReader();
        lector.onload = () => resolver(lector.result as string);
        lector.onerror = () => rechazar(lector.error);
        lector.readAsDataURL(archivo);
      });
    } catch {
      this.logo = null;
    }
  }

  private agregarPie(doc: jsPDF, anchoPagina: number, altoPagina: number): void {
    doc.setDrawColor(220, 230, 218);
    doc.setLineWidth(0.3);
    doc.line(16, altoPagina - 19, anchoPagina - 16, altoPagina - 19);
    doc.setTextColor(120, 130, 120);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Gracias por elegir Manila', 16, altoPagina - 11);
    doc.text(`Página ${doc.getNumberOfPages()}`, anchoPagina - 16, altoPagina - 11, { align: 'right' });
  }
}