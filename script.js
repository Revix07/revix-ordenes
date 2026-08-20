let canvas = null;
let ctx = null;
let dibujando = false;


/* =========================================
   INICIO
========================================= */

document.addEventListener("DOMContentLoaded", async () => {

  if (document.getElementById("firmaCanvas")) {
    await iniciarFormulario();
  }

  if (document.getElementById("tablaHistorial")) {
    await cargarHistorial();
  }

});


/* =========================================
   FORMULARIO
========================================= */

async function iniciarFormulario() {

  canvas = document.getElementById("firmaCanvas");
  ctx = canvas.getContext("2d");

  ajustarCanvas();

  window.addEventListener("resize", ajustarCanvas);

  canvas.addEventListener("mousedown", iniciarFirma);
  canvas.addEventListener("mousemove", dibujarFirma);
  canvas.addEventListener("mouseup", terminarFirma);
  canvas.addEventListener("mouseleave", terminarFirma);

  canvas.addEventListener(
    "touchstart",
    iniciarFirma,
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    dibujarFirma,
    { passive: false }
  );

  canvas.addEventListener(
    "touchend",
    terminarFirma
  );


  const params =
    new URLSearchParams(
      window.location.search
    );


  const numero =
    params.get("orden");


  if (numero) {

    await cargarOrden(numero);

  } else {

    await prepararNuevaOrden();

  }


  if (
    params.get("imprimir") === "1"
  ) {

    setTimeout(() => {

      window.print();

    }, 700);

  }

}


/* =========================================
   FECHA Y HORA
========================================= */

function fechaLocal() {

  const d = new Date();

  return (
    d.getFullYear() +
    "-" +
    String(
      d.getMonth() + 1
    ).padStart(2, "0") +
    "-" +
    String(
      d.getDate()
    ).padStart(2, "0")
  );

}


function horaLocal() {

  const d = new Date();

  return (
    String(
      d.getHours()
    ).padStart(2, "0") +
    ":" +
    String(
      d.getMinutes()
    ).padStart(2, "0")
  );

}


/* =========================================
   NÚMERO AUTOMÁTICO
   BASADO EN LA BASE DE DATOS
========================================= */

async function obtenerSiguienteNumero() {

  try {

    const ordenes =
      await obtenerOrdenesServidor();


    let mayor = 0;


    ordenes.forEach(orden => {

      const numeroTexto =
        orden.numeroOrden ||
        orden.numero_orden ||
        "";


      const numero =
        parseInt(
          numeroTexto.replace(
            "REVIX-",
            ""
          ),
          10
        );


      if (
        !isNaN(numero) &&
        numero > mayor
      ) {

        mayor = numero;

      }

    });


    return (
      "REVIX-" +
      String(
        mayor + 1
      ).padStart(4, "0")
    );

  } catch (error) {

    console.error(
      "Error calculando número:",
      error
    );


    const respaldo =
      parseInt(
        localStorage.getItem(
          "ultimoNumeroRevix"
        ),
        10
      ) || 0;


    return (
      "REVIX-" +
      String(
        respaldo + 1
      ).padStart(4, "0")
    );

  }

}


/* =========================================
   NUEVA ORDEN
========================================= */

async function prepararNuevaOrden() {

  const numero =
    await obtenerSiguienteNumero();


  document.getElementById(
    "numeroOrden"
  ).value =
    numero;


  document.getElementById(
    "fecha"
  ).value =
    fechaLocal();


  document.getElementById(
    "hora"
  ).value =
    horaLocal();


  limpiarFirma();

}


function nuevaOrden() {

  window.location.href =
    "index.html";

}


/* =========================================
   CANVAS / FIRMA
========================================= */

function ajustarCanvas() {

  if (!canvas) {
    return;
  }


  const rect =
    canvas.getBoundingClientRect();


  if (
    !rect.width ||
    !rect.height
  ) {
    return;
  }


  const imagenActual =
    canvas.width > 0 &&
    canvas.height > 0
      ? canvas.toDataURL(
          "image/png"
        )
      : null;


  const ratio =
    window.devicePixelRatio || 1;


  canvas.width =
    Math.round(
      rect.width * ratio
    );


  canvas.height =
    Math.round(
      rect.height * ratio
    );


  ctx =
    canvas.getContext("2d");


  ctx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );


  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#000";


  if (imagenActual) {

    const img =
      new Image();


    img.onload = () => {

      ctx.drawImage(
        img,
        0,
        0,
        canvas.clientWidth,
        canvas.clientHeight
      );

    };


    img.src =
      imagenActual;

  }

}


function posicion(evento) {

  const rect =
    canvas.getBoundingClientRect();


  const p =
    evento.touches
      ? evento.touches[0]
      : evento;


  return {

    x:
      p.clientX -
      rect.left,

    y:
      p.clientY -
      rect.top

  };

}


function iniciarFirma(evento) {

  evento.preventDefault();

  dibujando = true;


  const p =
    posicion(evento);


  ctx.beginPath();

  ctx.moveTo(
    p.x,
    p.y
  );

}


function dibujarFirma(evento) {

  if (!dibujando) {
    return;
  }


  evento.preventDefault();


  const p =
    posicion(evento);


  ctx.lineTo(
    p.x,
    p.y
  );


  ctx.stroke();

}


function terminarFirma() {

  dibujando = false;

}


function limpiarFirma() {

  if (
    !ctx ||
    !canvas
  ) {
    return;
  }


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


/* =========================================
   DATOS DEL FORMULARIO
========================================= */

function obtenerDatosFormulario() {

  return {

    numeroOrden:
      document.getElementById(
        "numeroOrden"
      ).value,

    fecha:
      document.getElementById(
        "fecha"
      ).value,

    hora:
      document.getElementById(
        "hora"
      ).value,

    cliente:
      document.getElementById(
        "cliente"
      ).value.trim(),

    telefono:
      document.getElementById(
        "telefono"
      ).value.trim(),

    marca:
      document.getElementById(
        "marca"
      ).value.trim(),

    modelo:
      document.getElementById(
        "modelo"
      ).value.trim(),

    imei:
      document.getElementById(
        "imei"
      ).value.trim(),

    falla:
      document.getElementById(
        "falla"
      ).value.trim(),

    motivo:
      document.getElementById(
        "motivo"
      ).value.trim(),

    estado:
      document.getElementById(
        "estado"
      ).value.trim(),

    accesorios:
      document.getElementById(
        "accesorios"
      ).value.trim(),

    observaciones:
      document.getElementById(
        "observaciones"
      ).value.trim(),

    firma:
      canvas
        ? canvas.toDataURL(
            "image/png"
          )
        : "",

    ultimaModificacion:
      new Date().toISOString()

  };

}


/* =========================================
   API - OBTENER TODAS LAS ÓRDENES
========================================= */

async function obtenerOrdenesServidor() {

  const respuesta =
    await fetch(
      "/api/ordenes",
      {
        method: "GET",
        cache: "no-store"
      }
    );


  if (!respuesta.ok) {

    const texto =
      await respuesta.text();


    throw new Error(
      "No se pudo leer la base de datos. " +
      texto
    );

  }


  const datos =
    await respuesta.json();


  return normalizarListaOrdenes(
    datos
  );

}


/* =========================================
   NORMALIZAR RESPUESTA
========================================= */

function normalizarListaOrdenes(datos) {

  if (Array.isArray(datos)) {

    return datos.map(
      normalizarOrden
    );

  }


  if (
    datos &&
    Array.isArray(datos.rows)
  ) {

    return datos.rows.map(
      normalizarOrden
    );

  }


  return [];

}


function normalizarOrden(orden) {

  return {

    numeroOrden:
      orden.numeroOrden ??
      orden.numero_orden ??
      "",

    fecha:
      orden.fecha ?? "",

    hora:
      orden.hora ?? "",

    cliente:
      orden.cliente ?? "",

    telefono:
      orden.telefono ?? "",

    marca:
      orden.marca ?? "",

    modelo:
      orden.modelo ?? "",

    imei:
      orden.imei ?? "",

    falla:
      orden.falla ?? "",

    motivo:
      orden.motivo ?? "",

    estado:
      orden.estado ?? "",

    accesorios:
      orden.accesorios ?? "",

    observaciones:
      orden.observaciones ?? "",

    firma:
      orden.firma ?? "",

    ultimaModificacion:
      orden.ultimaModificacion ??
      orden.ultima_modificacion ??
      ""

  };

}


/* =========================================
   GUARDAR ORDEN EN SERVIDOR
========================================= */

async function guardarOrden(
  mostrarMensaje = true
) {

  const orden =
    obtenerDatosFormulario();


  if (!orden.cliente) {

    alert(
      "Debes escribir el nombre del cliente."
    );

    return false;

  }


  if (!orden.modelo) {

    alert(
      "Debes escribir el modelo del celular."
    );

    return false;

  }


  try {

    const respuesta =
      await fetch(
        "/api/ordenes",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(
              orden
            )
        }
      );


    if (!respuesta.ok) {

      const texto =
        await respuesta.text();


      throw new Error(
        texto
      );

    }


    const numero =
      parseInt(
        orden.numeroOrden.replace(
          "REVIX-",
          ""
        ),
        10
      );


    if (!isNaN(numero)) {

      localStorage.setItem(
        "ultimoNumeroRevix",
        String(numero)
      );

    }


    if (mostrarMensaje) {

      alert(
        `Orden ${orden.numeroOrden} guardada correctamente y sincronizada.`
      );

    }


    return true;

  } catch (error) {

    console.error(
      "Error guardando orden:",
      error
    );


    alert(
      "No se pudo guardar la orden en la base de datos.\n\n" +
      "Revisa tu conexión a Internet e inténtalo nuevamente."
    );


    return false;

  }

}


/* =========================================
   GUARDAR E IMPRIMIR
========================================= */

async function guardarEImprimir() {

  const guardada =
    await guardarOrden(false);


  if (guardada) {

    setTimeout(
      () => {

        window.print();

      },
      250
    );

  }

}


/* =========================================
   IMPRIMIR
========================================= */

function imprimirOrden() {

  window.print();

}


/* =========================================
   NAVEGACIÓN
========================================= */

function abrirHistorial() {

  window.location.href =
    "historial.html";

}


function irNuevaOrden() {

  window.location.href =
    "index.html";

}


/* =========================================
   HISTORIAL
========================================= */

async function cargarHistorial() {

  const tabla =
    document.getElementById(
      "tablaHistorial"
    );


  const contador =
    document.getElementById(
      "cantidadOrdenes"
    );


  const sinOrdenes =
    document.getElementById(
      "sinOrdenes"
    );


  if (!tabla) {
    return;
  }


  tabla.innerHTML = `
    <tr>
      <td colspan="7">
        Cargando órdenes...
      </td>
    </tr>
  `;


  try {

    const busqueda =
      (
        document.getElementById(
          "buscador"
        )?.value || ""
      )
      .trim()
      .toLowerCase();


    let ordenes =
      await obtenerOrdenesServidor();


    ordenes.sort(
      (a, b) =>
        (
          b.numeroOrden || ""
        ).localeCompare(
          a.numeroOrden || ""
        )
    );


    if (contador) {

      contador.textContent =
        ordenes.length;

    }


    const filtradas =
      ordenes.filter(
        orden => {

          const texto =
            [
              orden.numeroOrden,
              orden.fecha,
              orden.cliente,
              orden.telefono,
              orden.marca,
              orden.modelo,
              orden.imei,
              orden.motivo,
              orden.falla
            ]
            .join(" ")
            .toLowerCase();


          return texto.includes(
            busqueda
          );

        }
      );


    tabla.innerHTML = "";


    if (
      filtradas.length === 0
    ) {

      if (sinOrdenes) {

        sinOrdenes.style.display =
          "block";

      }

      return;

    }


    if (sinOrdenes) {

      sinOrdenes.style.display =
        "none";

    }


    filtradas.forEach(
      orden => {

        const tr =
          document.createElement(
            "tr"
          );


        tr.innerHTML = `

          <td>
            <strong>
              ${escaparHTML(
                orden.numeroOrden
              )}
            </strong>
          </td>

          <td>
            ${formatearFecha(
              orden.fecha
            )}
          </td>

          <td>
            ${escaparHTML(
              orden.cliente
            )}
          </td>

          <td>
            ${escaparHTML(
              orden.telefono
            )}
          </td>

          <td>
            ${escaparHTML(
              (
                orden.marca +
                " " +
                orden.modelo
              ).trim()
            )}
          </td>

          <td>
            ${escaparHTML(
              orden.motivo
            )}
          </td>

          <td>

            <div class="acciones-tabla">

              <button
                class="boton-pequeno"
                onclick='verOrden(
                  ${JSON.stringify(
                    orden.numeroOrden
                  )}
                )'
              >
                Ver
              </button>

              <button
                class="boton-pequeno"
                onclick='imprimirDesdeHistorial(
                  ${JSON.stringify(
                    orden.numeroOrden
                  )}
                )'
              >
                Imprimir
              </button>

              <button
                class="boton-pequeno boton-eliminar"
                onclick='eliminarOrden(
                  ${JSON.stringify(
                    orden.numeroOrden
                  )}
                )'
              >
                Eliminar
              </button>

            </div>

          </td>

        `;


        tabla.appendChild(
          tr
        );

      }
    );

  } catch (error) {

    console.error(
      error
    );


    tabla.innerHTML = `

      <tr>

        <td colspan="7">

          No se pudo cargar el historial.
          Revisa la conexión con la base de datos.

        </td>

      </tr>

    `;

  }

}


/* =========================================
   VER ORDEN
========================================= */

function verOrden(
  numeroOrden
) {

  window.location.href =
    "index.html?orden=" +
    encodeURIComponent(
      numeroOrden
    );

}


/* =========================================
   IMPRIMIR DESDE HISTORIAL
========================================= */

function imprimirDesdeHistorial(
  numeroOrden
) {

  window.location.href =
    "index.html?orden=" +
    encodeURIComponent(
      numeroOrden
    ) +
    "&imprimir=1";

}


/* =========================================
   CARGAR UNA ORDEN DESDE SERVIDOR
========================================= */

async function cargarOrden(
  numeroOrden
) {

  try {

    const respuesta =
      await fetch(
        "/api/ordenes?numero=" +
        encodeURIComponent(
          numeroOrden
        ),
        {
          cache: "no-store"
        }
      );


    if (!respuesta.ok) {

      throw new Error(
        "Orden no encontrada"
      );

    }


    const datos =
      await respuesta.json();


    const orden =
      normalizarOrden(
        datos.rows
          ? datos.rows[0]
          : datos
      );


    const ids = [

      "numeroOrden",
      "fecha",
      "hora",
      "cliente",
      "telefono",
      "marca",
      "modelo",
      "imei",
      "falla",
      "motivo",
      "estado",
      "accesorios",
      "observaciones"

    ];


    ids.forEach(
      id => {

        const el =
          document.getElementById(
            id
          );


        if (el) {

          el.value =
            orden[id] || "";

        }

      }
    );


    if (orden.firma) {

      cargarFirmaEnCanvas(
        orden.firma
      );

    }

  } catch (error) {

    console.error(
      error
    );


    alert(
      "No se pudo encontrar esa orden."
    );


    window.location.href =
      "historial.html";

  }

}


/* =========================================
   MOSTRAR FIRMA GUARDADA
========================================= */

function cargarFirmaEnCanvas(
  firmaBase64
) {

  if (
    !canvas ||
    !ctx ||
    !firmaBase64
  ) {
    return;
  }


  const img =
    new Image();


  img.onload = () => {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    ctx.drawImage(
      img,
      0,
      0,
      canvas.clientWidth,
      canvas.clientHeight
    );

  };


  img.src =
    firmaBase64;

}


/* =========================================
   ELIMINAR ORDEN DEL SERVIDOR
========================================= */

async function eliminarOrden(
  numeroOrden
) {

  const confirmar =
    confirm(
      `¿Seguro que quieres eliminar la orden ${numeroOrden}?`
    );


  if (!confirmar) {
    return;
  }


  try {

    const respuesta =
      await fetch(
        "/api/ordenes?numero=" +
        encodeURIComponent(
          numeroOrden
        ),
        {
          method: "DELETE"
        }
      );


    if (!respuesta.ok) {

      throw new Error(
        "No se pudo eliminar"
      );

    }


    await cargarHistorial();

  } catch (error) {

    console.error(
      error
    );


    alert(
      "No se pudo eliminar la orden."
    );

  }

}


/* =========================================
   FORMATEAR FECHA
========================================= */

function formatearFecha(
  fecha
) {

  if (!fecha) {
    return "";
  }


  const partes =
    fecha.split("-");


  if (
    partes.length !== 3
  ) {
    return fecha;
  }


  return (
    partes[2] +
    "/" +
    partes[1] +
    "/" +
    partes[0]
  );

}


/* =========================================
   SEGURIDAD DE TEXTO
========================================= */

function escaparHTML(
  texto
) {

  return String(
    texto ?? ""
  )

  .replace(
    /&/g,
    "&amp;"
  )

  .replace(
    /</g,
    "&lt;"
  )

  .replace(
    />/g,
    "&gt;"
  )

  .replace(
    /"/g,
    "&quot;"
  )

  .replace(
    /'/g,
    "&#039;"
  );

}