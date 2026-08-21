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
  campoPDF(doc, "IMEI / Serie", orden.imei, 140, y, 58, 9);

  y += 17;
  campoPDF(doc, "¿Qué tiene el celular?", orden.falla, izq, y, 90, 17);
  campoPDF(doc, "¿Por qué ingresa?", orden.motivo, 108, y, 90, 17);

  y += 25;
  campoPDF(doc, "Estado físico al recibirlo", orden.estado, izq, y, ancho, 12);

  y += 19;
  campoPDF(doc, "Accesorios entregados", orden.accesorios, izq, y, 90, 9);
  campoPDF(doc, "Observaciones", orden.observaciones, 108, y, 90, 9);

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

  doc.setDrawColor(7,75,128);
  doc.line(izq, 288, der, 288);
  doc.setTextColor(7,75,128);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("¡Gracias por confiar en REVIX!", 105, 292, { align: "center" });

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
