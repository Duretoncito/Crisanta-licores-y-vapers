// ✏️ Tu número con indicativo 57, sin + ni espacios
const WHATSAPP = "573244847215";
// ✏️ Mensaje del botón flotante
const MENSAJE_GENERAL = "Hola, me interesa realizar un pedido";
// ✏️ Monto mínimo para domicilio gratis
const DOMICILIO_GRATIS = 70000;
// ✏️ Mensaje de la franja que lleva a Promociones
const MENSAJE_PROMOS = "🔥 Mira nuestras promociones";
// ✏️ Días que se recuerda el "Sí, soy mayor de edad" (después vuelve a preguntar)
const DIAS_EDAD = 30;

// ✏️ ====== INTERRUPTOR DE PROMOCIONES ======
//    true  = se muestran los combos y los avisos de regalo
//    false = se ocultan TODOS de una vez (no se borra nada)
const PROMOS_ACTIVAS = true;

// ✏️ Promos de regalo (avisos informativos, no se agregan a la lista)
//    activa:  true = se muestra / false = se oculta
//    seccion: en qué sección sale el aviso pequeño
//    icono:   un emoji, o una imagen de Iconify entre comillas simples ' '
//    texto:   lo que esté entre <b> y </b> sale en negrita
const REGALOS = [
  // 👉 Pega aquí tus promos de regalo: todo lo que hoy tienes entre los [ ] de REGALOS
];

// ✏️ Orden de las secciones (las que no tengan productos no aparecen)
const ORDEN = [ "Vapers", "Destilados", "Baterías", "Gomitas", "Licores", "Cervezas" ];
// ✏️ Nombre de la sección automática de promociones
const PROMO = "🔥Promociones";
// ✏️ Etiquetas disponibles y su color
const ETIQUETAS = {
  "Nuevo": "#2563eb",
  "Más vendido": "#b07d2a",
  "Promoción": "#dc2626",
  "Agotado": "#6b7280",
};
// ✏️ Etiquetas que tienen brillo animado
const BRILLAN = ["Promoción", "Nuevo"];
// ✏️ Prioridad en "Recomendados": las etiquetas de arriba salen primero
const PRIORIDAD = ["Más vendido", "Promoción", "Nuevo"];
// ✏️ Días que un producto sale como "Nuevo" desde su fecha de llegada (llego)
const DIAS_NUEVO = 20;
// ✏️ Iconos de las etiquetas (se dibujan al lado del texto)
const svg = d => `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">${d}</svg>`;
const ICONOS = {
  "Nuevo": svg('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'),
  "Más vendido": svg('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'),
  "Promoción": svg('<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>'),
  "Agotado": ""
};

// ✏️ Tus productos
//    precio:         número sin puntos ni $  -> precio: 45000
//                    (si no lo pones, sale "Consultar precio")
//    precioAntes:    opcional, precio tachado (si es mayor, sale "Ahorras $...")
//    presentaciones: opcional, opciones con su propio precio:
//                    presentaciones: [ { nombre: "375 ml", precio: 35000 },
//                                      { nombre: "750 ml", precio: 65000, precioAntes: 75000 } ]
//    tituloOpciones: opcional, texto encima de las opciones (si no, dice "Presentación")
//    etiqueta:       opcional -> "Nuevo", "Más vendido", "Promoción" o "Agotado"
//    llego:          opcional, fecha de llegada (año-mes-día) -> llego: "2026-10-15"
//    imagen:         una foto  -> imagen: "foto.jpg"
//    imagenes:       varias    -> imagenes: ["foto1.jpg", "foto2.jpg"]
//    sabores:        opcional. Solo el nombre -> "Uva"
//                    o con descripción        -> { nombre: "Mango", desc: "A qué sabe" }
//    garantia:       true -> muestra "Garantía incluida"
//    activa:         false -> oculta el producto sin borrarlo
//    combo:          true -> solo sale en Promociones y al buscar
//    El orden de la lista es el orden en "Recomendados" (los que tienen etiqueta suben primero)
const catalogo = [
  // 👉 Pega aquí tus productos: todo lo que hoy tienes entre los [ ] de catalogo
];
