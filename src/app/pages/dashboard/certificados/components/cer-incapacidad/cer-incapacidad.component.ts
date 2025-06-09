import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-cer-incapacidad',
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
  templateUrl: './cer-incapacidad.component.html',
  styleUrl: './cer-incapacidad.component.css'
})
export class CerIncapacidadComponent implements OnInit {

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
      diagnostico: ['', Validators.required],
      diasIncapacidad: ['', Validators.required],
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
    this.doc.text('CERTIFICADO MÉDICO DE INCAPACIDAD', 105, 66, { align: 'center' });

    this.doc.setFontSize(11);
    this.doc.text('A QUIEN CORRESPONDA:', 20, 80);
    this.doc.text('------------------------------------------', 20, 82);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    const texto1 = 'EL QUE SUSCRIBE MÉDICO CIRUJANO, CON CÉDULA PROFESIONAL 701460 Y REG. S.S.A 89437, LEGALMENTE AUTORIZADO PARA EJERCER SU PROFESIÓN:';
    this.justificarTexto(this.doc, texto1, 20, 92, 170, 7, 15);

    this.doc.setFont('times', 'bold');
    this.subrayarTexto(this.doc, 'C E R T I F I C A', 90, 110);

    const yLinea1 = 125;
    const xInicio = 20;
    let x = xInicio;

    this.doc.setFont('times', 'normal');
    this.doc.setFontSize(11);

    // 1. "QUE EL C."
    this.doc.text('QUE EL C.', x, yLinea1);
    x += this.doc.getTextWidth('QUE EL C.') + 2;

    // 2. Subrayado fijo (ej. 110 mm de ancho)
    const anchoLinea = 150;
    const nombre = data.nombre?.trim();
    const textoNombre = nombre || ''; // Puede estar vacío

    if (textoNombre) {
      this.doc.text(textoNombre, x, yLinea1);
    }

    this.doc.line(x, yLinea1 + 1, x + anchoLinea, yLinea1 + 1); // subrayado fijo

    // 3. Coma
    this.doc.text('', x, yLinea1);

    const xx = 20;
    const y = 133;
    const doc = this.doc;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    // Datos del formulario
    const edad = data.edad?.toString() || '';
    const domicilio = data.domicilio?.toString() || '';
    const diagnostico = data.diagnostico?.toString() || '';

    // Subrayados base
    const subEdad = '_______';
    const subDomicilio = '________________________________________________';
    const subDiagnostico = '____________________________________________________';

    // Imprimir línea base con subrayado fijo
    const textoSubrayado = `DE ${subEdad} AÑOS, CON DOMICILIO ${subDomicilio}`;
    const textoSubrayado2 = `CURSA CON EL DIAGNOSTICO ${subDiagnostico}`;
    doc.text(textoSubrayado, xx, y); // solo subrayado visible
    doc.text(textoSubrayado2, xx, y + 7); // solo subrayado visible

    // Escribir los datos por encima del subrayado
    let offsetX = xx + doc.getTextWidth('DE ');
    if (edad) {
      doc.text(edad, offsetX, y); // edad a la izquierda
    }

    offsetX = xx + doc.getTextWidth(`DE ${subEdad} AÑOS, CON DOMICILIO `);
    if (domicilio) {
      doc.text(domicilio, offsetX, y); // domicilio alineado normalmente
    }

    offsetX = xx + doc.getTextWidth(`CURSA CON EL DIAGNOSTICO `);
    if (diagnostico) {
      doc.text(diagnostico, offsetX, y + 7);
    }

    const texto2 = 'POR LO QUE APARTE DE SUS MEDICAMENTOS, SE LE MANDA REPOSO ABSOLUTO PARA TENER MEJOR EVOLUCION CLINICA (INCAPACIDAD) VALIDA PARA LOS DIAS';
    this.justificarTexto(this.doc, texto2, 20, 147, 170, 7, 0);

    this.doc.text('', 0, 160);
    x += this.doc.getTextWidth('') + 2;

    // 2. Subrayado fijo (ej. 110 mm de ancho)
    const diasIncapacidad = data.diasIncapacidad?.trim();
    const textoIncapacidad = diasIncapacidad || ''; // Puede estar vacío

    if (textoIncapacidad) {
      this.doc.text(textoIncapacidad, 20, 160);
    }

    this.doc.line(20, 160 + 1, x + anchoLinea, 160 + 1); // subrayado fijo


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

  imprimirLineaConCampoSeparado(doc: any, textoInicio: string, valorCampo: string, x: number, y: number, anchoMaximo: number) {
    const anchoTextoInicio = doc.getTextWidth(textoInicio);
    const anchoDisponible = anchoMaximo - anchoTextoInicio;

    const anchoChar = doc.getTextWidth('A'); // Ancho estimado de un carácter
    const maxChars = Math.floor(anchoDisponible / anchoChar);

    // Recorta o rellena el texto del campo para que ocupe espacio fijo
    const valorRecortado = (valorCampo || '').slice(0, maxChars);
    const campoConLinea = valorRecortado.padEnd(maxChars, '_');

    // Dibuja el texto y el campo subrayado
    doc.text(textoInicio, x, y);
    doc.text(campoConLinea, x + anchoTextoInicio, y);
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
