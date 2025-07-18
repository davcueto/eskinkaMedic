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
  selector: 'app-cer-alumbramiento',
  standalone: true,
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
  templateUrl: './cer-alumbramiento.component.html',
  styleUrl: './cer-alumbramiento.component.css'
})
export class CerAlumbramientoComponent implements OnInit, OnDestroy {

  formCer: FormGroup;
  formSub!: Subscription;
  pdfPreviewUrl: SafeResourceUrl | null = null;
  doc!: jsPDF;
  isVisible = false;

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
    this.formCer = this.fb.group({
      nombrePadre: ['', Validators.required],
      nombreMadre: ['', Validators.required],
      sexo: ['', Validators.required],
      peso: ['', Validators.required],
      talla: ['', Validators.required],
      dia: ['', Validators.required],
      hora: ['', Validators.required],
      pc: ['', Validators.required],
      pt: ['', Validators.required],
      pie: ['', Validators.required]
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
    this.doc.text('CERTIFICADO DE ALUMBRAMIENTO', 105, 66, { align: 'center' });

    const nombrePadre = data.nombrePadre || '';
    const nombreMadre = data.nombreMadre || '';
    const sexo = data.sexo || '';
    const pc = data.pc || '';
    const peso = data.peso || '';
    const pt = data.pt || '';
    const talla = data.talla || '';
    const pie = data.pie || '';
    const dia = data.dia || '';
    const hora = data.hora || '';

    let y = 100;

    this.doc.text(`Nombre del padre: ${nombrePadre}`, 20, y);
    y += 10;
    this.doc.text(`Nombre de la madre: ${nombreMadre}`, 20, y);
    y += 15;

    const pageWidth = this.doc.internal.pageSize.getWidth();
    const marginLeft = 20;
    const marginRight = 20;
    const rightAlignX = pageWidth - marginRight;
    const middleX = pageWidth / 2 + 10; // para simular columna derecha

    // Fila 1: Sexo (izq) - P.C. (der)
    this.doc.text(`Sexo:`, marginLeft, y);
    this.doc.text(`P.C.:`, middleX, y);

    this.doc.setFont('helvetica', 'normal');
    this.doc.text(sexo || '', marginLeft + 15, y);
    this.doc.text(pc || '', middleX + 15, y);
    y += 10;

    // Fila 2: Peso (izq) - P.T. (der)
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Peso:`, marginLeft, y);
    this.doc.text(`P.T.:`, middleX, y);

    this.doc.setFont('helvetica', 'normal');
    this.doc.text(peso || '', marginLeft + 15, y);
    this.doc.text(pt || '', middleX + 15, y);
    y += 10;

    // Fila 3: Talla (izq) - PIE (der)
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Talla:`, marginLeft, y);
    this.doc.text(`PIE:`, middleX, y);

    this.doc.setFont('helvetica', 'normal');
    this.doc.text(talla || '', marginLeft + 15, y);
    this.doc.text(pie || '', middleX + 15, y);
    y += 10;

    // Fila 4: Día (izq) - Hora (der)
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Día:`, marginLeft, y);
    this.doc.text(`Hora:`, middleX, y);

    this.doc.setFont('helvetica', 'normal');
    this.doc.text(dia || '', marginLeft + 15, y);
    this.doc.text(hora || '', middleX + 15, y);
    y += 10;


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
