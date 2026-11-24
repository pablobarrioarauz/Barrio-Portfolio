// Las obras, tal como las guarda el panel, listas para enseñar en un idioma.
import { getCollection } from 'astro:content';
import type { Coleccion, Idioma } from './rutas';

export async function obrasDe(seccion: Coleccion) {
  const obras = await getCollection(seccion);
  // El orden lo pone Pablo arrastrando en el panel.
  return obras.sort((a, b) => a.data.order - b.data.order);
}

export type Obra = Awaited<ReturnType<typeof obrasDe>>[number];

// Lo que se enseña de una obra (o de una colaboración) en un idioma. Si
// falta el inglés, va el castellano. El título nunca se traduce.
//  - datos: las líneas bajo el título en su página.
//  - subtitulo: la línea bajo el título en su tarjeta.
//  - enVenta: si lleva "Disponible / Vendida" y el botón de preguntar.
export function ficha(obra: Obra, idioma: Idioma) {
  if (obra.collection === 'colaboraciones') {
    const d = obra.data;
    const en = idioma === 'en' ? d.en : {};
    return {
      titulo: d.titulo,
      texto: en.texto ?? d.texto,
      // Con quién (con enlace a su web, si la hay), dónde y cuándo.
      datos: [
        d.colaborador && { texto: d.colaborador, url: enlace(d.enlace) },
        d.lugar && { texto: d.lugar },
        d.anio && { texto: String(d.anio) },
      ].filter((x) => !!x),
      subtitulo: d.colaborador,
      portada: d.portada ?? d.fotos[0],
      enVenta: false,
      vendida: false,
      fotos: d.fotos,
    };
  }
  const d = obra.data;
  const en = idioma === 'en' ? d.en : {};
  return {
    titulo: d.titulo,
    texto: en.texto ?? d.texto,
    // Medidas, año y técnica, en ese orden (pedido de Guzmán). El año se
    // quitó el 29-10-2026 y volvió al día siguiente; lo que falte no sale.
    datos: [d.medidas, d.anio, en.tecnica ?? d.tecnica].filter((x) => !!x).map((x) => ({ texto: String(x), url: undefined })),
    // En la tarjeta, solo las medidas (pedido de Guzmán).
    subtitulo: d.medidas,
    enVenta: true,
    // Sin precio (se quitó del todo): solo si está disponible o vendida.
    vendida: d.estado === 'vendido',
    fotos: d.fotos,
  };
}

// La web del colaborador tal como la escriba Pablo: "@estudio" lleva a su
// Instagram y lo que no empiece por http se completa con https://.
function enlace(texto?: string) {
  if (!texto) return undefined;
  const t = texto.trim();
  if (t.startsWith('@')) return `https://www.instagram.com/${t.slice(1)}/`;
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}
