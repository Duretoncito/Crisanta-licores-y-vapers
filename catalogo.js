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
//    seccion: en qué sección sale el aviso pequeño ("Vapers", "Baterías", "Gomitas"...)
//    icono:   un emoji, o una imagen de Iconify entre comillas simples ' '
//    texto:   lo que esté entre <b> y </b> sale en negrita
const REGALOS = [
  { activa: true, seccion: "Vapers",
    icono: '<img src="https://api.iconify.design/noto-v1/candy.svg" width="20" height="20" alt="">',
    texto: "Compra <b>2 vapers</b> de cualquier referencia y llévate <b>una gomita gratis</b>." },
];

// ✏️ Orden de las secciones (las que no tengan productos no aparecen)
const ORDEN = [ "Vapers", "Destilados", "Baterías", "Gomitas", "Licores", "Cervezas", "Bebidas" ];
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
   // ===== MÁS VENDIDOS (salen primero, mezclados entre secciones) =====
  { nombre: "LOST MARY - 5 MIL PUFF", categoria: "Vapers", precio: 25000,
      imagenes: ["vaposimg/lostmary1.jpg"], descripcion: `• Duración: 5.000 puffs (13.5 ml) | 5% nicotina
• Funciones: Diseño "gordito" compacto, discreto y de activación automática al inhalar
• Resistencia: Malla (Mesh Coil) de calada suave que mantiene el sabor sin quemarse
• Batería: 500 mAh recargable (puerto Tipo-C)`,
      etiqueta: "Más vendido",
      sabores: [
        "Limonada negra",
        "Banana con frambuesa",
        "Nube de arándanos",
        "Rosa y ciruela ácida",
        "Kiwi con arándanos",
        "Mango con pitaya",
        "Helado de melocotón",
        "Sueño de Mary",
        "Mora con fresa",
        "Banana split",
        "Limonada de sandía y kiwi",
        "Uva verde helada",
        "Menta negra",
        "Frambuesa helada"
      ], 
      garantia: true },

    { nombre: "CÁPSULA - NACIONAL", categoria: "Destilados", precio: 35000,
      imagenes: ["vaposimg/nacional1.jpg"], descripcion: `• Contenido: 1 ml
• Cepa: Sativa, Índica o Híbrida (según disponibilidad)
 *No incluye la batería*`,
      etiqueta: "Más vendido",
      sabores: [], garantia: true },

    { nombre: "DEATH ROW - 5 MIL PUFF", categoria: "Vapers", precio: 20000,
      imagenes: ["vaposimg/deathrow1.jpg"], descripcion: `• Duración: 5.000 puffs (10.5 ml) | 5% nicotina
• Funciones: Cuerpo de color metálico brillante, ligero y con boquilla ergonómica
• Resistencia: Malla (Mesh Coil) para un golpe de garganta firme y buen vapor
• Batería: 650 mAh recargable (puerto Tipo-C)`,
      etiqueta: "Más vendido",
      sabores: [
        "Bomba de mandarina",
        "Menta",
        "Fresa con melocotón",
        "Menta y arándanos",
        "Frambuesa azul",
        "Sandía dulce",
        "Melocotón",
        "Menta negra",
        "Cola helada",
        "Mango, melocotón y sandía",
        "Sin sabor",
        "Caramelo",
        "Bayas silvestres"
      ], 
      garantia: true },

    { nombre: "BATERÍA BRASS KNUCKLES LED", categoria: "Baterías", precio: 50000,
      imagenes: ["vaposimg/brassknucklesled1.jpg"], descripcion: `• Compatibilidad: Rosca 510 universal (para cualquier cápsula)
• Funciones: 3 niveles de voltaje ajustables + modo precalentamiento
• Batería: 900 mAh de larga duración (incluye cargador USB)
• Diseño: Metálico tipo pen con pantalla LED que muestra el % de carga`,
      etiqueta: "Más vendido",
      sabores: [], garantia: true },

    { nombre: "DUMMY - 8 MIL PUFF", categoria: "Vapers", precio: 25000,
      imagenes: ["vaposimg/dummy1.jpg"], descripcion: `• Duración: 5.000 puffs (10.5 ml) | 5% nicotina
• Funciones: Cuerpo metálico brillante, ligero y con boquilla ergonómica
• Resistencia: Malla (Mesh Coil) para un golpe de garganta firme y buen vapor
• Batería: 650 mAh recargable (puerto Tipo-C)`,
      etiqueta: "Más vendido",
      sabores: [
        "Guayaba",
        "Sin sabor"
      ], 
     etiqueta: "Agotado",
      garantia: true },

    { nombre: "GOMITAS", categoria: "Gomitas", precio: 10000,
      imagenes: ["vaposimg/gomitas1.jpg"], descripcion: "",
      etiqueta: "Más vendido",
      sabores: [], garantia: false },

    { nombre: "DOJO - 40 MIL PUFF", categoria: "Vapers", precio: 55000,
      imagenes: ["vaposimg/dojo1.jpg"], descripcion: `• Duración: Hasta 40.000 puffs (20 ml) | 5% nicotina
• Funciones: Pantalla curva 360° iluminada + 2 modos de potencia (Eco y Power)
• Resistencia: Cuádruple malla (Quad Mesh) para máxima potencia de sabor y vapor
• Batería: 1.100 mAh de larga duración con carga rápida Tipo-C`,
      etiqueta: "Más vendido",
      sabores: [
        "Limonada rosa",
        "Estrella azul",
        "Menta Miami",
        "Sandía y melocotón",
        "Hawái",
        "Frambuesa azul helada"
      ], 
      garantia: true },

    // ===== VAPERS =====
    { nombre: "PYNE POD - 8.5 MIL PUFF", categoria: "Vapers", precio: 25000,
      imagenes: ["vaposimg/pynepod1.jpg"], descripcion: `• Duración: 8.500 puffs | 5% nicotina
• Funciones: Pantalla LED de batería/líquido + botón con Modo Boost (doble golpe de vapor)
• Resistencia: Doble malla (Dual Mesh) para un sabor mucho más concentrado
• Batería: 550 mAh con carga rápida (puerto Tipo-C)`,
      sabores: [
        "Café colombiano",
        "Sin sabor",
        "Melón y manzana"
      ], 
      garantia: true },

    { nombre: "NICKY JAM - 10 MIL PUFF", categoria: "Vapers", precio: 30000,
      imagenes: ["vaposimg/nickyjam1.jpg"], descripcion: `• Duración: 10.000 puffs (19 ml) | 5% nicotina
• Funciones: Indicador de batería/líquido y edición especial de agarre cómodo
• Resistencia: Doble malla (Dual Mesh) que alterna el calentado para que nunca sepa a quemado
• Batería: 650 mAh recargable (puerto Tipo-C)`,
      sabores: [
        "Melocotón",
        "Banana",
        "Amanecer amarillo"
      ], 
      garantia: true },

    { nombre: "BUGATTI - 17 MIL PUFF", categoria: "Vapers", precio: 40000,
      imagenes: ["vaposimg/bugatti1.jpg"], descripcion: `• Duración: 17.000 puffs | 5% nicotina
• Funciones: Pantalla digital lateral, modos de potencia y chasis de lujo resistente
• Resistencia: Doble malla (Dual Mesh) de alto rendimiento para nubes densas
• Batería: 800 mAh recargable (puerto Tipo-C)`,
      sabores: [
        "Menta",
        "Kiwi con arándanos",
        "Arándanos y menta"
      ], 
      garantia: true },

    { nombre: "CHILLAX - 15 MIL PUFF", categoria: "Vapers", precio: 40000,
      imagenes: ["vaposimg/chillax1.jpg"], descripcion: `• Duración: 15.000 puffs (16 ml) | 5% nicotina
• Funciones: Pantalla digital a color que se activa al moverlo + control de flujo de aire
• Resistencia: Doble malla (Dual Mesh) para elegir entre calada suave o densa
• Batería: 650 mAh recargable (puerto Tipo-C)`,
      sabores: [
        "Uva",
        "Helado de vainilla",
        "Rosella negra",
        "Helado",
        "Fresa y sandía",
        "Fresa y rosella"
      ], 
      garantia: true },

    { nombre: "NOLA BAR - 10 MIL PUFF", categoria: "Vapers", precio: 30000,
      imagenes: ["vaposimg/nolabar1.jpg"], descripcion: `• Duración: 10.000 puffs | 5% nicotina
• Funciones: Formato tipo barra ligera, práctica y sin botones complicados
• Resistencia: Malla (Mesh Coil) de calada pareja y flujo de aire suave
• Batería: 600 mAh recargable (puerto Tipo-C)`,
      sabores: [
        "Sin sabor"
      ], garantia: true },

    { nombre: "POD KING - 10 MIL PUFF", categoria: "Vapers", precio: 30000,
      imagenes: ["vaposimg/podking1.jpg"], descripcion: `• Duración: 10.000 puffs (18 ml) | 5% nicotina
• Funciones: Pantalla indicadora de niveles y flujo de aire optimizado
• Resistencia: Malla (Mesh Coil) diseñada para resaltar los sabores dulces y fríos
• Batería: 650 mAh recargable (puerto Tipo-C)`,
      sabores: [
        "Oasis ártico",
        "Gomitas de frutos rojos",
        "Helado de fresa",
        "Gomita de pitaya",
        "Mango",
        "Limonada de manzana",
        "Mango frío intenso",
        "Pitaya fresca",
        "Mezcla frutal"
      ], 
      garantia: true },

    { nombre: "BEYOND - 12 MIL PUFF", categoria: "Vapers", precio: 35000,
      imagenes: ["vaposimg/beyond1.jpg"], descripcion: `• Duración: 12.000 puffs | 5% nicotina
• Funciones: Indicador de estado y diseño compacto para el día a día
• Resistencia: Malla (Mesh Coil) de calentamiento rápido para buen volumen de humo
• Batería: 650 mAh recargable (puerto Tipo-C)`,
      sabores: [
        "Manzana verde",
        "Cereza, melocotón y limón",
        "Limonada",
        "Melocotón blanco",
        "Melón amarillo",
        "Uva",
        "Guayaba, piña y maracuyá"
      ], 
      garantia: true },

    { nombre: "BADDIE BAR - 15 MIL PUFF", categoria: "Vapers", precio: 40000,
      imagenes: ["vaposimg/baddiebar1.jpg"], descripcion: `• Duración: 15.000 puffs (15 ml) | 5% nicotina
• Funciones: Pantalla LED de batería y líquido + regulador de aire en la base
• Resistencia: Doble malla (Dual Mesh) que mantiene el sabor intenso de principio a fin
• Batería: 650 mAh recargable (puerto Tipo-C)`,
      sabores: [
        "Arcoíris naranja",
        "Menta",
        "Melocotón",
        "Bayas"
      ], 
      garantia: true },

    { nombre: "AIRFUZE - 30 MIL PUFF", categoria: "Vapers", precio: 50000,
      imagenes: ["vaposimg/airfuze1.jpg"], descripcion: `• Duración: Hasta 30.000 puffs (20 ml) | 5% nicotina
• Funciones: Pantalla táctil Smart con Bluetooth (música, llamadas y cámara) + 3 niveles de potencia
• Resistencia: Doble malla (Dual Mesh) con modo Normal y modo Boost para golpe intenso
• Batería: 900 mAh recargable (puerto Tipo-C)`,
      sabores: [
        "Explosión de frutas",
        "Melocotón jugoso"
      ], 
      garantia: true },

    { nombre: "HOOKALIT - 35 MIL PUFF", categoria: "Vapers", precio: 50000,
      imagenes: ["vaposimg/hookalit1.jpg"], descripcion: `• Duración: Hasta 35.000 puffs | 5% nicotina
• Funciones: Pantalla digital LED + regulador de aire para calada estilo Hookah (narguile)
• Resistencia: Malla Lit (Mesh Coil) diseñada para botar nubes de vapor extra densas
• Batería: 1.300 mAh de ultra duración (puerto Tipo-C)`,
      llego: "2026-10-15",
      sabores: [
        "Destello blanco",
        "Sueño lúcido",
        "Manzana",
        "Amor"
      ], 
      garantia: true },

    { nombre: "SPACEMAN - 50 MIL PUFF", categoria: "Vapers", precio: 70000,
      imagenes: ["vaposimg/spaceman1.jpg"], descripcion: `• Duración: Hasta 50.000 puffs | 5% nicotina
• Funciones: Pantalla HD animada + control de potencia (Soft, Norm, Boost) y flujo de aire ajustable
• Resistencia: Doble malla (Dual Mesh) de alta precisión que mantiene el sabor intacto
• Batería: 1.000 mAh con carga rápida (puerto Tipo-C)`,
      llego: "2026-10-15",
      sabores: [
        "Mango ácido y piña",
        "Melocotón con frambuesa",
        "Menta Miami"
      ], 
      garantia: true },

    { nombre: "LADY GALAX - 60 MIL PUFF", categoria: "Vapers", precio: 70000,
      imagenes: ["vaposimg/galax1.jpg"], descripcion: `• Duración: Hasta 60.000 puffs | 5% nicotina
• Funciones: Pantalla digital indicadora de niveles, modos de potencia y diseño llamativo
• Resistencia: Doble malla (Dual Mesh) para un golpe firme y sabor frutal concentrado
• Batería: Alta capacidad recargable (puerto Tipo-C)`,
      llego: "2026-10-15",
      sabores: [
        "Mora",
        "Menta Miami",
        "Polvo rosado ácido",
        "Caramelo de frutos rojos"
      ], 
      garantia: true },

    // ===== DESTILADOS (CÁPSULAS) =====
    { nombre: "CÁPSULA TORNASOL - NACIONAL", categoria: "Destilados", precio: 40000,
      imagenes: ["vaposimg/tornasol1.jpg"], descripcion: `• Contenido: 1 ml
• Cepa: Sativa, Índica o Híbrida (según disponibilidad)
 *No incluye la batería*`,
      sabores: [
        "Único"
      ], garantia: true },

    { nombre: "CÁPSULA COOKIES - IMPORTADA", categoria: "Destilados", precio: 65000,
      imagenes: ["vaposimg/cookies1.jpg"], descripcion: `• Contenido: 1 ml
• Cepa: Sativa, Índica o Híbrida (según disponibilidad)
 *No incluye la batería*`,
      sabores: [
        "Único"
      ], garantia: true },

    { nombre: "CÁPSULA JEETER JUICE - IMPORTADA", categoria: "Destilados", precio: 80000,
      imagenes: ["vaposimg/jeeterjuice1.jpg"], descripcion: `• Contenido: 1 ml
• Cepa: Sativa, Índica o Híbrida (según disponibilidad)
 *No incluye la batería*`,
      sabores: [
        "Manzana",
        "Horchata"
      ], garantia: true },

    { nombre: "CÁPSULA RUNZ - IMPORTADA", categoria: "Destilados", precio: 80000,
      imagenes: ["vaposimg/runz1.jpg"], descripcion: `• Contenido: 1 ml
• Cepa: Sativa o Híbrida (según disponibilidad)
 *No incluye la batería*`,
      sabores: [
        "Único"
      ], garantia: true },

    { nombre: "CÁPSULA MUHA MEDS - IMPORTADA", categoria: "Destilados", precio: 75000,
      imagenes: ["vaposimg/muhameds1.jpg"], descripcion: `• Contenido: 1 ml
• Cepa: Sativa, Índica o Híbrida (según disponibilidad)
 *No incluye la batería*`,
      sabores: [
        "Único"
      ],
     etiqueta: "Agotado",
     garantia: true },

    { nombre: "CÁPSULA BIG CHIEF - IMPORTADA", categoria: "Destilados", precio: 75000,
      imagenes: ["vaposimg/bigchief1.jpg"], descripcion: `• Contenido: 1 ml
• Cepa: Híbrida
 *No incluye la batería*`,
      sabores: [
        "Único"
      ], garantia: true },

    { nombre: "CÁPSULA ROVE - IMPORTADA", categoria: "Destilados", precio: 65000,
      imagenes: ["vaposimg/rove1.jpg"], descripcion: `• Contenido: 1 ml
• Cepa: Sativa, Índica o Híbrida (según disponibilidad)
 *No incluye la batería*`,
      sabores: [
        "Único"
      ], garantia: true },
    
    { nombre: "CÁPSULA MAD LABS - IMPORTADA", categoria: "Destilados", precio: 70000,
      imagenes: ["vaposimg/madlabs1.jpg"], descripcion: `• Contenido: 1 ml
• Cepa: Sativa, Índica o Híbrida (según disponibilidad)
 *No incluye la batería*`,
      sabores: [
        "Banana",
        "Melón",
        "Cereal"
      ], garantia: true },

    { nombre: "CÁPSULA LEMONADE - IMPORTADA", categoria: "Destilados", precio: 65000,
      imagenes: ["vaposimg/lemonade1.jpg"], descripcion: `• Contenido: 1 ml
• Cepa: Sativa, Índica o Híbrida (según disponibilidad)
 *No incluye la batería*`,
      sabores: [
        "Único"
      ], garantia: true },

    { nombre: "CÁPSULA ALIEN LABS - IMPORTADA", categoria: "Destilados", precio: 80000,
      imagenes: ["vaposimg/alienlabs1.jpg"], descripcion: `• Contenido: 1 ml
• Cepa: Sativa, Índica o Híbrida (según disponibilidad)
 *No incluye la batería*`,
      sabores: [
        "Único"
      ], garantia: true },

    // ===== BATERÍAS =====
    { nombre: "BATERÍA BRASS KNUCKLES", categoria: "Baterías", precio: 40000,
      imagenes: ["vaposimg/brassknuckles1.jpg"], descripcion: `• Compatibilidad: Rosca 510 universal (para cualquier cápsula)
• Funciones: 3 niveles de voltaje ajustables + modo precalentamiento
• Batería: 900 mAh de larga duración (incluye cargador USB)
• Diseño: Acabado metálico clásico tipo pen (madera o dorado)`,
      sabores: [], garantia: true },

    { nombre: "BATERÍA MINI", categoria: "Baterías", precio: 50000,
      imagenes: ["vaposimg/bateriamini1.jpg"], descripcion: `• Compatibilidad: Rosca 510 universal (para cualquier cápsula)
• Funciones: 3 niveles de voltaje ajustables + modo precalentamiento
• Batería: 650 mAh recargable (puerto Tipo-C / USB)
• Diseño: Ultra compacto y discreto, cabe oculto en la palma de la mano`,
     etiqueta: "Agotado",
      sabores: [], garantia: true },

    // ===== COMBOS (solo salen en Promociones y al buscar) =====
    { nombre: "2 CÁPSULAS", categoria: "Destilados", combo: true, activa: true,
      etiqueta: "Promoción", tituloOpciones: "Elige las cápsulas",
      presentaciones: [ { nombre: "Nacional", precio: 60000, precioAntes: 70000 },
                        { nombre: "Tornasol", precio: 70000, precioAntes: 80000 } ],
      imagenes: ["vaposimg/prueba3.png", "vaposimg/tornasoluni2.png"], descripcion: `Este combo incluye:
• 2 cápsulas nacionales o 2 cápsulas tornasol respectivamente
*No incluye la batería*`,
      sabores: [], garantia: true },

    { nombre: "CÁPSULA NACIONAL + BATERÍA", categoria: "Destilados", combo: true, activa: false,
      etiqueta: "Promoción", tituloOpciones: "Elige la batería",
      presentaciones: [ { nombre: "Brass Knuckles", precio: 65000, precioAntes: 75000 },
                        { nombre: "Brass Knuckles LED", precio: 75000, precioAntes: 85000 },
                        { nombre: "Mini", precio: 75000, precioAntes: 85000 } ],
      imagenes: ["vaposimg/combonyb1.jpg", "vaposimg/combonybl1.jpg", "vaposimg/combonym1.jpg"], descripcion: `Este combo incluye:
• 1 cápsula nacional (1 ml)
• 1 batería a elección (con su cargador)
 *Kit completo listo para usar*`,
      sabores: [], garantia: true },

    { nombre: "CÁPSULA TORNASOL + BATERÍA", categoria: "Destilados", combo: true, activa: false,
      etiqueta: "Promoción", tituloOpciones: "Elige la batería",
      presentaciones: [ { nombre: "Brass Knuckles", precio: 70000, precioAntes: 80000 },
                        { nombre: "Brass Knuckles LED", precio: 80000, precioAntes: 90000 },
                        { nombre: "Mini", precio: 80000, precioAntes: 90000 } ],
     imagenes: ["vaposimg/combotyb1.jpg", "vaposimg/combotybl1.jpg", "vaposimg/combotym1.jpg"], descripcion: `Este combo incluye:
• 1 cápsula tornasol nacional (1 ml)
• 1 batería a elección (con su cargador)
 *Kit completo listo para usar*`,
      sabores: [], garantia: true },

    { nombre: "6 GOMITAS", categoria: "Gomitas", combo: true, activa: true,
      etiqueta: "Promoción", precio: 50000, precioAntes: 60000,
     imagenes: ["vaposimg/gomitasuni6.png"], descripcion: `Este combo incluye:
• 6 gomitas empacadas individualmente`,
      sabores: [], garantia: false},
  ];
