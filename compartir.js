const TERMINOS_REVIX_PDF = [
  ["1. Estado del equipo.", "El cliente declara que los datos, accesorios, daños visibles y estado general indicados en esta orden corresponden al estado en que entrega el dispositivo a REVIX."],
  ["2. Diagnóstico y reparación.", "El cliente autoriza a REVIX a realizar las pruebas y procedimientos razonablemente necesarios para diagnosticar el equipo y comprobar su funcionamiento. Cualquier reparación o costo adicional no comprendido en lo previamente acordado deberá ser informado al cliente para su autorización cuando corresponda."],
  ["3. Garantía REVIX.", "REVIX otorga una garantía comercial de 30 días corridos sobre la reparación efectuada y/o el repuesto instalado, contados desde la entrega del equipo reparado al cliente. Esta garantía contractual se entiende sin perjuicio de los derechos que correspondan al consumidor conforme a la normativa vigente."],
  ["4. Cobertura.", "La garantía comercial cubre únicamente defectos directamente atribuibles al trabajo realizado por REVIX o al repuesto instalado objeto de la reparación."],
  ["5. Exclusiones.", "La garantía comercial no cubre nuevas fallas ajenas a la reparación efectuada ni daños posteriores ocasionados por golpes, caídas, humedad o líquidos, mal uso, sobrecargas o daños eléctricos externos, ni intervenciones o manipulaciones posteriores realizadas por terceros, cuando tales circunstancias sean la causa del desperfecto reclamado."],
  ["6. Equipos no retirados.", "Si transcurren 30 días corridos desde la notificación de finalización del trabajo sin que el cliente retire el equipo, REVIX podrá requerir formalmente su retiro y adoptar las medidas legalmente procedentes respecto de su guarda, los importes adeudados y los gastos que correspondan. El vencimiento de dicho plazo no implica por sí solo la transferencia de la propiedad del dispositivo a REVIX."],
  ["7. Aceptación.", "Mediante su firma, el cliente declara haber leído, comprendido y aceptado los presentes términos y condiciones, sin perjuicio de los derechos que le correspondan legalmente como consumidor."]
];

function campoPDF(doc, etiqueta, valor, x, y, ancho, alto=9) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(25);
  doc.text(etiqueta, x, y);

  doc.setDrawColor(120);
  doc.roundedRect(x, y + 1.5, ancho, alto, 1, 1);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const texto = String(valor || "—");
  const lineas = doc.splitTextToSize(texto, ancho - 4);
  doc.text(lineas.slice(0, 3), x + 2, y + 5);
}

function crearComprobantePDF() {
  if (!window.jspdf?.jsPDF) {
    throw new Error("No se pudo cargar jsPDF.");
  }

  const orden = obtenerDatosFormulario();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const izq = 12;
  const der = 198;
  const ancho = der - izq;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(7,75,128);
  doc.setFontSize(23);
  doc.text("REVIX", izq, 16);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(70);
  doc.setFontSize(8.5);
  doc.text("Servicio Técnico de Celulares", izq, 21);

  campoPDF(doc, "N° de orden", orden.numeroOrden, 148, 10, 50, 9);

  doc.setDrawColor(7,75,128);
  doc.line(izq, 25, der, 25);

  doc.setTextColor(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("ORDEN DE RECEPCIÓN", 105, 31, { align: "center" });

  let y = 36;
  campoPDF(doc, "Fecha", orden.fecha, izq, y, 48, 8);
  campoPDF(doc, "Hora", orden.hora, 64, y, 35, 8);

  y += 15;
  doc.setTextColor(6,58,96);
  doc.setFontSize(9.5);
  doc.text("DATOS DEL CLIENTE", izq, y);
  doc.line(izq, y+1.5, der, y+1.5);

  y += 5;
  campoPDF(doc, "Nombre y apellido", orden.cliente, izq, y, 120, 9);
  campoPDF(doc, "Teléfono", orden.telefono, 135, y, 63, 9);

  y += 17;
  doc.setTextColor(6,58,96);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("DATOS DEL EQUIPO", izq, y);
  doc.line(izq, y+1.5, der, y+1.5);

  y += 5;
  campoPDF(doc, "Marca", orden.marca, izq, y, 58, 9);
  campoPDF(doc, "Modelo", orden.modelo, 74, y, 62, 9);
  campoPDF(doc, "Forma de pago", orden.imei, 140, y, 58, 9);

  y += 17;
  campoPDF(doc, "¿Qué tiene el celular?", orden.falla, izq, y, 90, 17);
  campoPDF(doc, "¿Por qué ingresa?", orden.motivo, 108, y, 90, 17);

  y += 25;
  campoPDF(doc, "Estado físico al recibirlo", orden.estado, izq, y, ancho, 12);

  y += 19;
  campoPDF(doc, "Accesorios entregados", orden.accesorios, izq, y, 90, 9);
  campoPDF(doc, "Valor reparación", orden.observaciones, 108, y, 90, 9);

  y += 17;
  doc.setTextColor(6,58,96);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("FIRMA DEL CLIENTE", izq, y);
  doc.line(izq, y+1.5, der, y+1.5);

  y += 5;
  doc.setDrawColor(80);
  doc.rect(izq, y, ancho, 22);

  if (orden.firma?.startsWith("data:image")) {
    try {
      doc.addImage(orden.firma, "PNG", izq+2, y+1, ancho-4, 20);
    } catch(e) {
      console.warn("No se pudo insertar la firma", e);
    }
  }

  y += 27;
  doc.setDrawColor(7,75,128);
  doc.line(izq, y, der, y);
  y += 4;

  doc.setTextColor(6,58,96);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("TÉRMINOS Y CONDICIONES – REVIX", izq, y);
  y += 4;

  doc.setTextColor(25);
  doc.setFontSize(5.8);

  for (const [titulo, texto] of TERMINOS_REVIX_PDF) {
    doc.setFont("helvetica", "bold");
    const tituloLineas = doc.splitTextToSize(titulo, ancho);
    doc.text(tituloLineas, izq, y);
    y += tituloLineas.length * 2.5;

    doc.setFont("helvetica", "normal");
    const lineas = doc.splitTextToSize(texto, ancho);
    doc.text(lineas, izq, y);
    y += lineas.length * 2.35 + 1.2;
  }
if (y > 280) {
  doc.addPage();
  y = 15;
}
  doc.setDrawColor(7,75,128);
  doc.line(izq, y + 2, der, y + 2);
  doc.setTextColor(7,75,128);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("¡Gracias por confiar en REVIX!", 105, y + 7, { align: "center" });

  return { doc, orden };
}

async function compartirComprobante() {
  const orden = obtenerDatosFormulario();

  if (!orden.cliente) {
    alert("Antes de compartir, escribe el nombre del cliente.");
    return;
  }

  if (!orden.modelo) {
    alert("Antes de compartir, escribe el modelo del celular.");
    return;
  }

  const guardada = await guardarOrden(false);
  if (!guardada) return;

  try {
    const { doc } = crearComprobantePDF();
    const nombre = `${orden.numeroOrden || "REVIX-comprobante"}.pdf`;
    const blob = doc.output("blob");
    const archivo = new File([blob], nombre, { type: "application/pdf" });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [archivo] })) {
      await navigator.share({
        title: `Comprobante ${orden.numeroOrden}`,
        text: `Comprobante de recepción REVIX - ${orden.numeroOrden}`,
        files: [archivo]
      });
    } else {
      doc.save(nombre);
      alert("El navegador no permite compartir archivos directamente. El comprobante se descargó como PDF.");
    }
  } catch (error) {
    if (error?.name === "AbortError") return;
    console.error(error);
    alert("No se pudo crear o compartir el comprobante.");
  }
}
async function guardarEImprimirPDF() {
  const ventanaPDF = window.open("", "_blank");

  const guardada = await guardarOrden(false);

  if (!guardada) {
    if (ventanaPDF) ventanaPDF.close();
    return;
  }

  try {
    const { doc } = crearComprobantePDF();

    doc.autoPrint();

    const urlPDF = doc.output("bloburl");

    if (ventanaPDF) {
      ventanaPDF.location.href = urlPDF;
    } else {
      window.location.href = urlPDF;
    }

  } catch (error) {
    console.error(error);

    if (ventanaPDF) ventanaPDF.close();

    alert("No se pudo crear el comprobante para imprimir.");  
  }
}
function imprimirComprobantePDF() {
  try {
    const { doc } = crearComprobantePDF();

    doc.autoPrint();

    const urlPDF = doc.output("bloburl");
    window.open(urlPDF, "_blank");
  } catch (error) {
    console.error(error);
    alert("No se pudo crear el comprobante para imprimir.");
  }
}
function generarFacturaFinal() {
  const orden = obtenerDatosFormulario();

  const fechaEntrega = new Date();
  const fechaVencimiento = new Date(fechaEntrega);
  fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);

  const formatoFecha = (fecha) =>
    fecha.toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

  const entregaTexto = formatoFecha(fechaEntrega);
  const vencimientoTexto = formatoFecha(fechaVencimiento);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
// MARCA DE AGUA REVIX
doc.setTextColor(225, 230, 235);
doc.setFont("helvetica", "bold");
doc.setFontSize(55);
doc.text("REVIX", 105, 155, {
  align: "center",
  angle: 45
});
  const azul = [6, 58, 96];
  const azulClaro = [7, 75, 128];
  const gris = [245, 247, 249];
  const izq = 15;
  const der = 195;

  // ENCABEZADO
  doc.setTextColor(...azul);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(27);
  doc.text("REVIX", izq, 27);

  doc.setFontSize(8);
  doc.text("SERVICIO TÉCNICO DE CELULARES", izq, 33);

  doc.setTextColor(25);
  doc.setFontSize(22);
  doc.text("FACTURA", der, 18, { align: "right" });

  doc.setFillColor(...azul);
  doc.roundedRect(167, 22, 28, 11, 1.5, 1.5, "F");
  doc.setTextColor(255);
  doc.setFontSize(10);
  doc.text(orden.numeroOrden || "REVIX", 181, 29, { align: "center" });

  // FECHAS
  doc.setTextColor(40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Fecha de entrega:", 120, 41);
  doc.text(entregaTexto, der, 41, { align: "right" });

  doc.text("Vencimiento de garantía:", 120, 48);
  doc.setFont("helvetica", "bold");
  doc.text(vencimientoTexto, der, 48, { align: "right" });

  // TOTAL DESTACADO
  doc.setFillColor(...gris);
  doc.roundedRect(120, 54, 75, 16, 2, 2, "F");
  doc.setTextColor(30);
  doc.setFontSize(10);
  doc.text("TOTAL", 125, 64);

  doc.setFillColor(...azul);
  doc.roundedRect(162, 55, 31, 14, 2, 2, "F");
  doc.setTextColor(255);
  doc.setFontSize(13);
  doc.text(
    `$ ${orden.observaciones || "0"}`,
    177.5,
    64,
    { align: "center" }
  );

  // DATOS DEL CLIENTE
  doc.setFillColor(...azul);
  doc.rect(izq, 78, 86, 9, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("DATOS DEL CLIENTE", 19, 84);

  doc.setFillColor(...gris);
  doc.rect(izq, 87, 86, 31, "F");

  doc.setTextColor(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Nombre:", 19, 95);
  doc.text("Teléfono:", 19, 106);

  doc.setFont("helvetica", "normal");
  doc.text(orden.nombre || orden.cliente || "", 19, 100);
  doc.text(orden.telefono || "", 19, 111);

  // DATOS DEL EQUIPO
  doc.setFillColor(...azul);
  doc.rect(109, 78, 86, 9, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("DATOS DEL EQUIPO", 113, 84);

  doc.setFillColor(...gris);
  doc.rect(109, 87, 86, 31, "F");

  doc.setTextColor(30);
  doc.setFontSize(8.5);
  doc.text("Marca:", 113, 95);
  doc.text("Modelo:", 113, 106);

  doc.setFont("helvetica", "normal");
  doc.text(orden.marca || "", 113, 100);
  doc.text(orden.modelo || "", 113, 111);

  // DETALLES DE REPARACIÓN
  doc.setFillColor(...azul);
  doc.rect(izq, 124, 180, 9, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("DETALLES DE LA REPARACIÓN", 19, 130);

  doc.setFillColor(...gris);
  doc.rect(izq, 133, 180, 38, "F");

  doc.setTextColor(30);
  doc.setFontSize(8.5);
  doc.text("Trabajo realizado:", 19, 141);
  doc.text("Valor de la reparación:", 19, 153);
  doc.text("Forma de pago:", 19, 165);

  doc.setFont("helvetica", "normal");

  const trabajo = doc.splitTextToSize(orden.motivo || "", 115);
  doc.text(trabajo, 67, 141);

  doc.text(`$ ${orden.observaciones || ""}`, 67, 153);
  doc.text(orden.imei || "", 67, 165);

  // GARANTÍA
  doc.setDrawColor(...azulClaro);
  doc.setLineWidth(0.4);
  doc.roundedRect(izq, 178, 83, 50, 2, 2);

  doc.setTextColor(...azul);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("GARANTÍA", 20, 187);

  doc.setTextColor(35);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);

  const garantia = [
    "Este servicio cuenta con una garantía de 30 días",
    "corridos a partir de la fecha de entrega.",
    "La garantía cubre únicamente fallas relacionadas",
    "con la reparación realizada.",
    "No cubre golpes, humedad, mal uso ni",
    "manipulación o intervención de terceros."
  ];

  doc.text(garantia, 20, 196);

  // TÉRMINOS Y CONDICIONES
  doc.roundedRect(103, 178, 92, 50, 2, 2);

  doc.setTextColor(...azul);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TÉRMINOS Y CONDICIONES", 108, 187);

  doc.setTextColor(35);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);

  const terminos = [
    "• El cliente declara recibir el equipo reparado.",
    "• La garantía aplica solo al trabajo realizado.",
    "• El equipo debe ser retirado y abonado según lo acordado.",
    "• Equipos no retirados dentro de 30 días podrán",
    "  considerarse en situación de abandono.",
    "• Daños posteriores por golpes, agua, mal uso o",
    "  intervención de terceros anulan la garantía."
  ];

  doc.text(terminos, 108, 196);

  // FIRMA DEL CLIENTE
  doc.setTextColor(30);
  doc.setDrawColor(100);
  doc.line(118, 251, 190, 251);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Firma del cliente", 154, 257, { align: "center" });

  if (orden.firma) {
    try {
      doc.addImage(orden.firma, "PNG", 130, 233, 48, 16);
    } catch (error) {
      console.warn("No se pudo insertar la firma en la factura.", error);
    }
  }

  // PIE DE PÁGINA
  doc.setFillColor(...azul);
  doc.rect(izq, 270, 180, 10, "F");

  doc.setTextColor(255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Gracias por confiar en REVIX", 190, 276.5, {
    align: "right"
  });

  // COMPARTIR PDF
  const nombreFactura =
    `${orden.numeroOrden || "REVIX"}-factura-final.pdf`;

  const blob = doc.output("blob");
  const archivo = new File(
    [blob],
    nombreFactura,
    { type: "application/pdf" }
  );

  if (
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({ files: [archivo] })
  ) {
    navigator.share({
      title: `Factura final ${orden.numeroOrden || ""}`,
      text: "Factura final de reparación REVIX",
      files: [archivo]
    });
  } else {
    const urlPDF = doc.output("bloburl");
    window.open(urlPDF, "_blank");
  }
}


function imprimirFacturaFinal() {
  const orden = obtenerDatosFormulario();
  const fechaEntrega = new Date();
  const fechaVencimiento = new Date(fechaEntrega);
  fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
  const formatoFecha = (fecha) => fecha.toLocaleDateString("es-VE");
  const entregaTexto = formatoFecha(fechaEntrega);
const vencimientoTexto = formatoFecha(fechaVencimiento);
  const { jsPDF } = window.jspdf;
const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: "a4"
});
  doc.setFont("helvetica", "bold");
doc.setFontSize(18);
doc.text("REVIX", 15, 18);

doc.setFontSize(14);
doc.text("FACTURA FINAL DE REPARACIÓN", 105, 30, { align: "center" });

doc.setFontSize(10);
doc.text(`Fecha de entrega: ${entregaTexto}`, 15, 42);
doc.text(`Vencimiento de garantía: ${vencimientoTexto}`, 15, 49);
  doc.setFont("helvetica", "bold");
doc.setFontSize(11);
doc.text("DATOS DEL CLIENTE", 15, 62);

doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.text(`Nombre: ${orden.cliente || ""}`, 15, 70);
doc.text(`Teléfono: ${orden.telefono || ""}`, 15, 77);

doc.setFont("helvetica", "bold");
doc.text("DATOS DEL EQUIPO", 15, 90);

doc.setFont("helvetica", "normal");
doc.text(`Marca: ${orden.marca || ""}`, 15, 98);
doc.text(`Modelo: ${orden.modelo || ""}`, 15, 105);
  doc.setFont("helvetica", "bold");
doc.text("DETALLES DE LA REPARACIÓN", 15, 118);

doc.setFont("helvetica", "normal");
doc.text(`Trabajo realizado: ${orden.motivo || ""}`, 15, 126);
doc.text(`Valor de la reparación: ${orden.observaciones || ""}`, 15, 133);
doc.text(`Forma de pago: ${orden.imei || ""}`, 15, 140);
  doc.autoPrint();

const urlPDF = doc.output("bloburl");
window.open(urlPDF, "_blank");
}
