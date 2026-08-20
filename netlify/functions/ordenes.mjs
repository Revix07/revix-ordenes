import { getDatabase } from "@netlify/database";

const db = getDatabase();

async function prepararTabla() {
  await db.sql`
    CREATE TABLE IF NOT EXISTS ordenes_revix (
      numero_orden TEXT PRIMARY KEY,
      fecha TEXT,
      hora TEXT,
      cliente TEXT,
      telefono TEXT,
      marca TEXT,
      modelo TEXT,
      imei TEXT,
      falla TEXT,
      motivo TEXT,
      estado TEXT,
      accesorios TEXT,
      observaciones TEXT,
      firma TEXT,
      ultima_modificacion TEXT
    )
  `;
}

export default async (req) => {
  try {
    await prepararTabla();

    if (req.method === "GET") {
      const url = new URL(req.url);
      const numero = url.searchParams.get("numero");

      if (numero) {
        const filas = await db.sql`
          SELECT *
          FROM ordenes_revix
          WHERE numero_orden = ${numero}
          LIMIT 1
        `;

        if (!filas.length) {
          return Response.json(
            { error: "Orden no encontrada" },
            { status: 404 }
          );
        }

        return Response.json(filas[0]);
      }

      const filas = await db.sql`
        SELECT *
        FROM ordenes_revix
        ORDER BY numero_orden DESC
      `;

      return Response.json(filas);
    }

    if (req.method === "POST") {
      const orden = await req.json();

      await db.sql`
        INSERT INTO ordenes_revix (
          numero_orden,
          fecha,
          hora,
          cliente,
          telefono,
          marca,
          modelo,
          imei,
          falla,
          motivo,
          estado,
          accesorios,
          observaciones,
          firma,
          ultima_modificacion
        )
        VALUES (
          ${orden.numeroOrden},
          ${orden.fecha},
          ${orden.hora},
          ${orden.cliente},
          ${orden.telefono},
          ${orden.marca},
          ${orden.modelo},
          ${orden.imei},
          ${orden.falla},
          ${orden.motivo},
          ${orden.estado},
          ${orden.accesorios},
          ${orden.observaciones},
          ${orden.firma},
          ${orden.ultimaModificacion}
        )
        ON CONFLICT (numero_orden)
        DO UPDATE SET
          fecha = EXCLUDED.fecha,
          hora = EXCLUDED.hora,
          cliente = EXCLUDED.cliente,
          telefono = EXCLUDED.telefono,
          marca = EXCLUDED.marca,
          modelo = EXCLUDED.modelo,
          imei = EXCLUDED.imei,
          falla = EXCLUDED.falla,
          motivo = EXCLUDED.motivo,
          estado = EXCLUDED.estado,
          accesorios = EXCLUDED.accesorios,
          observaciones = EXCLUDED.observaciones,
          firma = EXCLUDED.firma,
          ultima_modificacion = EXCLUDED.ultima_modificacion
      `;

      return Response.json({
        ok: true,
        numeroOrden: orden.numeroOrden
      });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const numero = url.searchParams.get("numero");

      if (!numero) {
        return Response.json(
          { error: "Falta número de orden" },
          { status: 400 }
        );
      }

      await db.sql`
        DELETE FROM ordenes_revix
        WHERE numero_orden = ${numero}
      `;

      return Response.json({ ok: true });
    }

    return Response.json(
      { error: "Método no permitido" },
      { status: 405 }
    );

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Error interno",
        detalle: error.message
      },
      { status: 500 }
    );
  }
};

export const config = {
  path: "/api/ordenes"
};