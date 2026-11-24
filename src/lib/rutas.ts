// Direcciones (URLs) de cada página en cada idioma. El castellano va sin
// prefijo y el inglés bajo /en/. Las de castellano coinciden con las de la web
// actual de Pablo (/cuadros/, /esculturas/, /encargos/) para que los enlaces
// que ya circulan sigan funcionando cuando el dominio apunte aquí.

export type Idioma = 'es' | 'en';
export const idiomas: Idioma[] = ['es', 'en'];

export type Seccion = 'cuadros' | 'esculturas';
// Las colaboraciones (24-11-2026) se guardan y se enseñan como las obras,
// pero no tienen sección propia: sus tarjetas van en ¿Colaboramos? y cada
// una cuelga de esa página (/colabora/<nombre>/, /en/work-with-me/<nombre>/).
export type Coleccion = Seccion | 'colaboraciones';

// El nombre que se lee es "Pintura" y "Escultura" (decisión de Guzmán,
// 16-10-2026), pero las direcciones siguen siendo /cuadros/ y /esculturas/,
// las de la web actual de Pablo.
export const secciones: Record<Seccion, { slug: Record<Idioma, string>; nombre: Record<Idioma, string> }> = {
  cuadros: { slug: { es: 'cuadros', en: 'paintings' }, nombre: { es: 'Pintura', en: 'Painting' } },
  esculturas: { slug: { es: 'esculturas', en: 'sculptures' }, nombre: { es: 'Escultura', en: 'Sculpture' } },
};

// Inicio de todas las direcciones: "" en pablobarrioarauz.com (antes
// "/Barrio-Portfolio", en github.io).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const conBase = (ruta: string) => `${BASE}${ruta}`;
const prefijo = (idioma: Idioma) => conBase(idioma === 'en' ? '/en' : '');

export const urlInicio = (idioma: Idioma) => `${prefijo(idioma)}/`;
export const urlSeccion = (seccion: Coleccion, idioma: Idioma) =>
  seccion === 'colaboraciones' ? urlColabora(idioma) : `${prefijo(idioma)}/${secciones[seccion].slug[idioma]}/`;
export const nombreSeccion = (seccion: Coleccion, idioma: Idioma) =>
  seccion === 'colaboraciones' ? { es: 'Colaboraciones', en: 'Collaborations' }[idioma] : secciones[seccion].nombre[idioma];
export const urlObra = (seccion: Coleccion, obra: string, idioma: Idioma) =>
  `${urlSeccion(seccion, idioma)}${obra}/`;
export const urlEncargos = (idioma: Idioma) => conBase(idioma === 'en' ? '/en/commissions/' : '/encargos/');
export const urlColabora = (idioma: Idioma) => conBase(idioma === 'en' ? '/en/work-with-me/' : '/colabora/');
export const urlContacto = (idioma: Idioma) => conBase(idioma === 'en' ? '/en/contact/' : '/contacto/');

// La misma página en los dos idiomas, para el botón ES/EN y los buscadores.
export const ambas = (url: (idioma: Idioma) => string): Record<Idioma, string> => ({ es: url('es'), en: url('en') });
