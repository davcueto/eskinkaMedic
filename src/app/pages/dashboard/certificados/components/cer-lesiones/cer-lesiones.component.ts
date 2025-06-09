import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-cer-lesiones',
  imports: [
    ReactiveFormsModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFlexModule,
    NzSegmentedModule,
    NzModalModule
  ],
  templateUrl: './cer-lesiones.component.html',
  styleUrl: './cer-lesiones.component.css'
})
export class CerLesionesComponent implements OnInit, OnDestroy {

  formCer: FormGroup;
  formSub!: Subscription;
  pdfPreviewUrl: SafeResourceUrl | null = null;
  doc!: jsPDF;
  isVisible = false;

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
    this.formCer = this.fb.group({
      nombre: ['', Validators.required],
      edad: ['', Validators.required],
      domicilio: ['', Validators.required],
      naturalezaLesiones: ['', Validators.required],
      clasificacionLesiones: ['', Validators.required],
      fecha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // const doc = new jsPDF();
    // doc.text('Hola mundo desde Angular y jsPDF!', 10, 10);
    // doc.save('ejemplo.pdf');
    this.buildPDF();
    this.previewPDF();
    this.formSub = this.formCer.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      this.buildPDF();
      this.previewPDF();
    });
  }

  ngOnDestroy(): void {
    this.formSub.unsubscribe();
  }

  buildPDF() {
    const data = this.formCer.value;
    this.doc = new jsPDF();

    //configuraciones
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.text('DR. GABRIEL CASAHONDA ESQUINCA.', 105, 30, { align: 'center' });
    this.doc.text('Céd. Prof. 701460 SSA 89437', 105, 36, { align: 'center' });
    this.doc.text('Av. Central Sur Número 13', 105, 42, { align: 'center' });
    this.doc.text('Huixtla, Chiapas.', 105, 48, { align: 'center' });
    this.doc.text('U. A. E. M.', 105, 54, { align: 'center' });
    this.doc.line(20, 56, 190, 56);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, 57, 190, 57);

    this.doc.setFontSize(13);
    this.doc.text('CERTIFICADO MÉDICO DE LESIONES', 105, 66, { align: 'center' });

    this.doc.setFontSize(11);
    this.doc.text('A QUIEN CORRESPONDA:', 20, 80);
    this.doc.text('------------------------------------------', 20, 82);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    const texto1 = 'EL QUE SUSCRIBE MÉDICO CIRUJANO, CON CÉDULA PROFESIONAL 701460 Y REG. S.S.A 89437, LEGALMENTE AUTORIZADO PARA EJERCER SU PROFESIÓN:';
    this.justificarTexto(this.doc, texto1, 20, 92, 170, 7, 15);

    const x = 20;
    const y = 112;
    const lineHeight = 7;
    const maxWidth = 170;

    // Campos
    const nombre = data.nombre || '';
    const edad = data.edad || '';
    const domicilio = data.domicilio || '';

    // Subrayado fijo
    const nombreLinea = '_'.repeat(30);
    const edadLinea = '_'.repeat(10);
    const domicilioLinea = '_'.repeat(60);

    // Texto con placeholders
    let texto =
      `EXTIENDE EL PRESENTE CERTIFICADO MÉDICO DE LESIONES AL C. ${nombreLinea}, ` +
      `DE ${edadLinea} AÑOS DE EDAD CON DOMICILIO EN ${domicilioLinea} ` +
      `Y QUE DESPUÉS DE HABERLA EXPLORADO (A) SE ENCUENTRA CON LAS SIGUIENTES LESIONES:`;

    // Justificación manual con saltos
    const palabras = texto.split(' ');
    let lineaActual = '';
    let lineas: string[] = [];

    palabras.forEach(palabra => {
      const prueba = lineaActual ? `${lineaActual} ${palabra}` : palabra;
      if (this.doc.getTextWidth(prueba) < maxWidth) {
        lineaActual = prueba;
      } else {
        lineas.push(lineaActual);
        lineaActual = palabra;
      }
    });
    if (lineaActual) lineas.push(lineaActual);

    // Imprimir texto justificado
    lineas.forEach((line, i) => {
      const yPos = y + i * lineHeight;
      const isLast = i === lineas.length - 1;

      if (isLast || line.trim().split(' ').length === 1) {
        this.doc.text(line, x, yPos);
      } else {
        const words = line.trim().split(' ');
        const totalWords = words.length;
        const lineWidth = this.doc.getTextWidth(line);
        const space = (maxWidth - lineWidth) / (totalWords - 1);

        let cursorX = x;
        words.forEach((word, j) => {
          this.doc.text(word, cursorX, yPos);
          if (j < totalWords - 1) {
            cursorX += this.doc.getTextWidth(word) + space;
          }
        });
      }
    });

    // Luego, escribir el contenido encima de las líneas subrayadas
    this.doc.text(nombre, 0 + 140 / 7, 119);         // Ajustar X según el subrayado
    this.doc.text(edad.toString(), x + 530 / 7, 119);
    this.doc.text(domicilio, 0 + 140 / 7, 126);

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('NATURALEZA DE LAS LESIONES:', 20, 145);
    this.doc.text('______________________________', 20, 145);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);

    const textoNatLesiones = data.naturalezaLesiones || '_'.repeat(0); // Texto o subrayado
    const natLesiones = this.doc.splitTextToSize(textoNatLesiones, 170);

    // Escribir debajo de la línea, a partir de Y=152 (puedes ajustar)
    this.doc.text(natLesiones, 20, 152);

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CLASIFICACIÓN DE LAS LESIONES:', 20, 180);
    this.doc.text('______________________________', 20, 180);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);

    const textoClaLesiones = data.clasificacionLesiones || '_'.repeat(0); // Texto o subrayado
    const claLesiones = this.doc.splitTextToSize(textoClaLesiones, 170);

    // Escribir debajo de la línea, a partir de Y=152 (puedes ajustar)
    this.doc.text(claLesiones, 20, 186);

    const fecha = this.formCer.value.fecha ? new Date(this.formCer.value.fecha) : new Date();

    const dia = fecha.getDate().toString();
    const mes = fecha.toLocaleString('es-MX', { month: 'long' }); // ejemplo: mayo
    const anio = fecha.getFullYear().toString();

    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(11);

    const texto3 = 'A SOLICITUD DEL INTERESADO(A), SE EXTIENDE EL PRESENTE CERTIFICADO EN LA';
    const texto4 = `CIUDAD DE HUIXTLA, CHIAPAS A LOS ${dia} DÍAS DEL MES DE ${mes.toUpperCase()} DEL AÑO ${anio}.`;

    this.doc.text(texto3, 20, 220);
    this.doc.text(texto4, 20, 225);

    this.doc.text('ATENTAMENTE', 105, 240, { align: 'center' });

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DR. GABRIEL CASAHONDA ESQUINCA', 105, 250, { align: 'center' });
    this.doc.setLineWidth(0.5);
    this.doc.line(20, 260, 190, 260);
    this.doc.text('TELEFONO 964-64-2-10-46', 105, 266, { align: 'center' });
    this.doc.line(20, 270, 190, 270);

  }

  previewPDF() {
    const pdfBlob = this.doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  submit() {
    console.log(this.formCer.value)
  }

  justificarTexto(doc: jsPDF, texto: string, x: number, y: number, ancho: number, lineHeight: number, sangria: number) {
    const palabras = texto.split(' ');
    let linea = '';
    let cursorY = y;
    let esPrimerRenglon = true;

    for (let i = 0; i < palabras.length; i++) {
      const palabra = palabras[i];
      const margenX = esPrimerRenglon ? x + sangria : x;
      const anchoDisponible = esPrimerRenglon ? ancho - sangria : ancho;

      const pruebaLinea = linea + palabra + ' ';
      const pruebaAncho = doc.getTextWidth(pruebaLinea);

      if (pruebaAncho > anchoDisponible && linea !== '') {
        this.justificarLinea(doc, linea.trim(), margenX, cursorY, anchoDisponible);
        linea = palabra + ' ';
        cursorY += lineHeight;
        esPrimerRenglon = false;
      } else {
        linea = pruebaLinea;
      }
    }

    // Última línea sin justificar
    const margenX = esPrimerRenglon ? x + sangria : x;
    const anchoDisponible = esPrimerRenglon ? ancho - sangria : ancho;
    doc.text(linea.trim(), margenX, cursorY);
  }

  justificarLinea(doc: jsPDF, linea: string, x: number, y: number, ancho: number) {
    const palabras = linea.split(' ');
    const numEspacios = palabras.length - 1;
    if (numEspacios === 0) {
      doc.text(linea, x, y);
      return;
    }

    let anchoPalabras = 0;
    palabras.forEach((palabra) => {
      anchoPalabras += doc.getTextWidth(palabra);
    });

    const espacioExtra = ancho - anchoPalabras;
    const espacioPorSeparacion = espacioExtra / numEspacios;

    let cursorX = x;
    palabras.forEach((palabra, i) => {
      doc.text(palabra, cursorX, y);
      cursorX += doc.getTextWidth(palabra) + espacioPorSeparacion;
    });
  }

  subrayarTexto(doc: jsPDF, texto: any | undefined | null, x: number, y: number) {
    doc.text(texto, x, y);
    const ancho = doc.getTextWidth(texto);
    doc.line(x, y + 1, x + ancho, y + 1);
  }

  justificarTextoConCampos(
    doc: jsPDF,
    textoBase: string,
    campos: { [key: string]: string },
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const palabras = textoBase.split(' ');
    let linea: string[] = [];
    let cursorY = y;

    const drawLine = (lineWords: string[], isLastLine = false) => {
      const textoLinea = lineWords.join(' ');
      const anchoTexto = doc.getTextWidth(textoLinea);

      let espaciosExtras = lineWords.length - 1;
      let espacioBase = doc.getTextWidth(' ');
      let espacioExtra = espaciosExtras > 0 && !isLastLine
        ? (maxWidth - anchoTexto) / espaciosExtras
        : 0;

      let cursorX = x;

      for (let i = 0; i < lineWords.length; i++) {
        let palabra = lineWords[i];

        // Si es un campo especial (nombre, edad)
        if (campos[palabra]) {
          const textoCampo = campos[palabra];
          doc.text(textoCampo, cursorX, cursorY);
          const anchoCampo = doc.getTextWidth(textoCampo);
          doc.line(cursorX, cursorY + 1, cursorX + anchoCampo, cursorY + 1);
          cursorX += anchoCampo;
        } else {
          doc.text(palabra, cursorX, cursorY);
          cursorX += doc.getTextWidth(palabra);
        }

        // Añadir espacio si no es la última palabra
        if (i < lineWords.length - 1) {
          cursorX += espacioBase + espacioExtra;
        }
      }

      cursorY += lineHeight;
    };

    for (let palabra of palabras) {
      const lineaActual = [...linea, palabra];
      const anchoActual = doc.getTextWidth(lineaActual.join(' '));

      if (anchoActual > maxWidth) {
        drawLine(linea);
        linea = [palabra];
      } else {
        linea.push(palabra);
      }
    }

    // Última línea sin justificar
    if (linea.length > 0) drawLine(linea, true);
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

}
