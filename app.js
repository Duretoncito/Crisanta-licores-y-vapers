const textoEtiqueta = e => (ICONOS[e] || "") + e;
// Pone o quita la etiqueta "Nuevo" según la fecha de llegada (llego)
catalogo.forEach(p => {
  if (!p.llego) return;
  const dias = (Date.now() - new Date(p.llego + "T00:00:00-05:00")) / 86400000;
  if (dias <= DIAS_NUEVO) { if (!p.etiqueta) p.etiqueta = "Nuevo"; }
  else if (p.etiqueta === "Nuevo") delete p.etiqueta;
});
const productos = catalogo.filter(p => p.activa !== false && !(p.combo && !PROMOS_ACTIVAS));
const regalosActivos = PROMOS_ACTIVAS ? REGALOS.filter(r => r.activa) : [];
const $ = id => document.getElementById(id);
const waLink = texto => `https://wa.me/${WHATSAPP}?text=` + encodeURIComponent(texto);
const normalizar = t => (t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const fmt = n => "$" + n.toLocaleString("es-CO");
const reducirMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Vuelve a ejecutar una animación de CSS en un elemento
const reanimar = (el, clase) => { el.classList.remove(clase); void el.offsetWidth; el.classList.add(clase); };
// Cierra una ventana con animación
function cerrar(dlg) {
  if (!dlg.open || dlg.classList.contains("cerrando")) return;
  dlg.classList.add("cerrando");
  setTimeout(() => { dlg.classList.remove("cerrando"); dlg.close(); }, reducirMovimiento() ? 0 : 200);
}
// Muestra la foto con efecto cuando termina de cargar
function cargarFoto(img, caja) {
  const listo = () => { caja.classList.remove("cargando"); caja.classList.add("lista"); };
  if (img.complete) listo();
  else { img.addEventListener("load", listo, { once: true }); img.addEventListener("error", listo, { once: true }); }
}
const fotos = p => (p.imagenes && p.imagenes.length) ? p.imagenes : [p.imagen];
const pres = p => (p.presentaciones && p.presentaciones.length) ? p.presentaciones : null;
const saborNombre = s => typeof s === "string" ? s : s.nombre;
const saborDesc = s => typeof s === "string" ? "" : (s.desc || "");
const precioMin = p => {
  if (pres(p)) {
    const v = pres(p).map(x => x.precio).filter(Boolean);
    return v.length ? Math.min(...v) : null;
  }
  return p.precio || null;
};
// Opción más barata de un producto con presentaciones
const opcionMin = p => pres(p).filter(x => x.precio).sort((a, b) => a.precio - b.precio)[0] || null;
const ahorroHTML = (precio, antes) =>
  (precio && antes > precio) ? `<span class="ahorro">Ahorras ${fmt(antes - precio)}</span>` : "";
const precioHTML = (precio, antes) => precio
  ? `<div class="precio">${fmt(precio)}${antes ? `<s>${fmt(antes)}</s>` : ''}</div>${ahorroHTML(precio, antes)}`
  : `<div class="precio consultar">Consultar precio</div>`;
const precioCard = p => {
  if (!pres(p)) return precioHTML(p.precio, p.precioAntes);
  const x = opcionMin(p);
  if (!x) return precioHTML(null);
  return `<div class="precio">${pres(p).length > 1 ? '<small>Desde</small>' : ''}${fmt(x.precio)}${x.precioAntes ? `<s>${fmt(x.precioAntes)}</s>` : ''}</div>${ahorroHTML(x.precio, x.precioAntes)}`;
};
const precioTexto = p => {
  const m = precioMin(p);
  if (!m) return "Consultar precio";
  return (pres(p) && pres(p).length > 1 ? "Desde " : "") + fmt(m);
};
// ----- Secciones, búsqueda y orden -----
const hayPromos = productos.some(p => p.etiqueta === "Promoción") || regalosActivos.length > 0;
const sueltos = productos.filter(p => !p.combo);
const extras = [...new Set(sueltos.map(p => p.categoria))].filter(c => !ORDEN.includes(c));
const cats = [...(hayPromos ? [PROMO] : []), "Todos",
              ...ORDEN.filter(c => sueltos.some(p => p.categoria === c)), ...extras];
let actual = "Todos", busqueda = "";
// Los combos solo salen en Promociones, o al buscar
const enSeccion = (p, c, buscando) => {
  if (p.combo) return c === PROMO || (buscando && (c === "Todos" || c === p.categoria));
  return c === "Todos" ? true : c === PROMO ? p.etiqueta === "Promoción" : p.categoria === c;
};
// Cuántas letras hay que cambiar para pasar de una palabra a otra
function distancia(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
const compacto = t => t.replace(/[^a-z0-9]/g, "");
// Búsqueda tolerante: acepta errores de letra, sin espacios y palabras en otro orden
const coincide = p => {
  if (!busqueda) return true;
  const texto = normalizar(p.nombre + " " + p.categoria + " " + (p.sabores || []).map(saborNombre).join(" ") + " " +
                           (pres(p) || []).map(x => x.nombre).join(" "));
  if (compacto(texto).includes(compacto(busqueda))) return true;
  const palabras = texto.split(/[^a-z0-9]+/).filter(Boolean);
  return busqueda.split(/\s+/).filter(Boolean).every(q =>
    texto.includes(q) ||
    (q.length >= 4 && palabras.some(w => Math.abs(w.length - q.length) <= 2 &&
                                         distancia(q, w) <= (q.length >= 7 ? 2 : 1))));
};
// Posición según la etiqueta (para "Recomendados")
const rango = p => {
  const i = PRIORIDAD.indexOf(p.etiqueta);
  return i === -1 ? PRIORIDAD.length : i;
};
function ordenar(lista) {
  const modo = $("orden").value;
  return [...lista].sort((a, b) => {
    const agA = a.etiqueta === "Agotado", agB = b.etiqueta === "Agotado";
    if (agA !== agB) return agA ? 1 : -1;
    if (modo === "menor" || modo === "mayor") {
      const pa = precioMin(a), pb = precioMin(b);
      if (!pa && !pb) return 0;
      if (!pa) return 1;
      if (!pb) return -1;
      return modo === "menor" ? pa - pb : pb - pa;
    }
    if (modo === "az") return a.nombre.localeCompare(b.nombre, "es");
    if (modo === "za") return b.nombre.localeCompare(a.nombre, "es");
    return rango(a) - rango(b);
  });
}
// Cambia de sección
function irA(c, subir) {
  actual = c;
  pintarPills();
  pintar();
  pintarNota();
  if (subir) window.scrollTo({ top: 0, behavior: "smooth" });
}
function pintarPills() {
  $("pills").innerHTML = "";
  cats.forEach(c => {
    const total = productos.filter(p => enSeccion(p, c, false)).length;
    const b = document.createElement("button");
    b.className = "pill" + (c === PROMO ? " hot" : "") + (c === actual ? " on" : "");
    b.innerHTML = `${c}<span>${total}</span>`;
    b.onclick = () => irA(c, false);
    $("pills").appendChild(b);
  });
}
// ----- Avisos de regalo -----
let cerrados = {};
try { cerrados = JSON.parse(sessionStorage.getItem("crisanta-avisos")) || {}; } catch (e) {}
function pintarNota() {
  const caja = $("nota");
  caja.innerHTML = "";
  if (!regalosActivos.length) return;
  if (actual === PROMO) {
    caja.innerHTML = `<div class="regalos"><h3>🎁 Llévate regalos en tu compra</h3>
      ${regalosActivos.map(r => `<div class="regalo"><span class="regalo-icono">${r.icono}</span><span>${r.texto}</span></div>`).join("")}
      <p class="regalos-nota">Al enviar tu lista por WhatsApp te confirmamos tu regalo.</p></div>`;
    return;
  }
  if (cerrados[actual]) return;
  let icono, texto;
  if (actual === "Todos") {
    icono = "🎁";
    texto = `Tenemos <b>promos con regalo</b>. <a href="#" data-ir="promo">Ver promociones</a>`;
  } else {
    const rs = regalosActivos.filter(r => r.seccion === actual);
    if (!rs.length) return;
    icono = rs[0].icono;
    texto = rs.map(r => r.texto).join("<br>");
  }
  caja.innerHTML = `<div class="nota"><span class="nota-icono">${icono}</span>
    <div class="nota-texto">${texto}</div>
    <button class="nota-x" aria-label="Cerrar aviso">✕</button></div>`;
}
$("nota").onclick = e => {
  if (e.target.closest(".nota-x")) {
    cerrados[actual] = true;
    try { sessionStorage.setItem("crisanta-avisos", JSON.stringify(cerrados)); } catch (err) {}
    pintarNota();
  } else if (e.target.closest("[data-ir]")) {
    e.preventDefault();
    irA(PROMO, true);
  }
};
function pintar() {
  const lista = ordenar(productos.filter(p => enSeccion(p, actual, busqueda !== "") && coincide(p)));
  $("titulo").textContent =
    actual === "Todos" ? "Todos los productos" : actual === PROMO ? "Promociones" : actual;
  $("conteo").textContent = lista.length + (lista.length === 1 ? " producto" : " productos");
  $("grid").innerHTML = "";
  if (!lista.length) {
    const texto = $("q").value.trim();
    if (actual === PROMO && !texto) {
      $("vacio").style.display = "none";
      $("grid").style.display = "none";
      return;
    }
    $("vacio-titulo").textContent = texto ? `No encontramos "${texto}"` : "No hay productos en esta sección";
    $("vacio-wa").href = waLink(texto ? `Hola, ¿tienen ${texto}?` : MENSAJE_GENERAL);
    $("vacio").style.display = "block";
    $("grid").style.display = "none";
    return;
  }
  $("vacio").style.display = "none";
  $("grid").style.display = "";
  lista.forEach((p, i) => {
    const f = fotos(p);
    const agotado = p.etiqueta === "Agotado";
    const c = document.createElement("div");
    c.className = "card" + (agotado ? " agotado" : "");
    c.style.animationDelay = Math.min(i * 60, 480) + "ms";
    c.innerHTML = `<div class="foto cargando"><img src="${f[0]}" alt="${p.nombre}" decoding="async"></div>
      ${p.etiqueta ? `<span class="etiqueta${BRILLAN.includes(p.etiqueta) ? ' brilla' : ''}" style="background:${ETIQUETAS[p.etiqueta] || '#6b7280'}">${textoEtiqueta(p.etiqueta)}</span>` : ''}
      ${f.length > 1 ? `<span class="nfotos">+${f.length - 1}</span>` : ''}
      <div class="info"><h3>${p.nombre}</h3>${precioCard(p)}<p>${p.descripcion}</p>
      <div class="info-foot">
        ${p.garantia ? '<span class="badge">🛡 Garantía incluida</span>' : ''}
        ${agotado ? '' : '<button class="mas" aria-label="Agregar a mi lista">+</button>'}
      </div></div>`;
    cargarFoto(c.querySelector(".foto img"), c.querySelector(".foto"));
    c.onclick = () => abrir(p);
    const mas = c.querySelector(".mas");
    if (mas) mas.onclick = e => {
      e.stopPropagation();
      if (pres(p) || (p.sabores && p.sabores.length)) abrir(p);
      else { agregarItem(p, null, null); toast("Agregado a tu lista ✓"); }
    };
    $("grid").appendChild(c);
  });
}
// ----- Ventana del producto -----
let sel = { p: null, pres: null, sabor: null, foto: 0 };
function mostrarFoto(i) {
  const f = fotos(sel.p);
  sel.foto = (i + f.length) % f.length;
  const g = $("galeria"), img = $("m-img");
  const lista = () => { g.classList.remove("cargando"); g.classList.add("lista"); };
  g.classList.remove("lista");
  g.classList.add("cargando");
  void img.offsetWidth;
  img.onload = img.onerror = lista;
  img.src = f[sel.foto];
  if (img.complete) requestAnimationFrame(lista);
  [...$("m-thumbs").children].forEach((t, k) => t.classList.toggle("on", k === sel.foto));
}
function textoItem(p, presI, saborI) {
  let t = p.nombre;
  if (pres(p) && presI !== null) t += ` (${pres(p)[presI].nombre})`;
  if (p.sabores && saborI !== null) t += ` sabor ${saborNombre(p.sabores[saborI])}`;
  return t;
}
function actualizarWA() {
  const t = textoItem(sel.p, sel.pres, sel.sabor);
  $("m-wa").href = waLink(sel.p.etiqueta === "Agotado"
    ? `Hola, ¿cuándo vuelve a estar disponible: ${t}?`
    : `Hola, me interesa: ${t}`);
}
function pintarPres() {
  const ps = pres(sel.p);
  if (!ps) {
    $("m-pres-box").style.display = "none";
    $("m-precio").innerHTML = precioHTML(sel.p.precio, sel.p.precioAntes);
    return;
  }
  $("m-pres-box").style.display = "block";
  $("m-pres-titulo").textContent = sel.p.tituloOpciones || "Presentación";
  $("m-pres").innerHTML = "";
  ps.forEach((x, i) => {
    const b = document.createElement("button");
    b.className = "opcion" + (i === sel.pres ? " on" : "");
    b.textContent = x.nombre;
    b.onclick = () => {
      if (sel.pres === i) return;
      sel.pres = i;
      pintarPres();
      reanimar($("m-precio"), "cambia");
      actualizarWA();
    };
    $("m-pres").appendChild(b);
  });
  const x = ps[sel.pres];
  $("m-precio").innerHTML = precioHTML(x.precio, x.precioAntes);
}
function pintarSabores() {
  const ss = sel.p.sabores || [];
  if (!ss.length) { $("m-sabores-box").style.display = "none"; return; }
  $("m-sabores-box").style.display = "block";
  $("m-ayuda").classList.remove("alerta");
  $("m-ayuda").textContent = ss.some(saborDesc)
    ? "Toca un sabor para ver a qué sabe"
    : "Toca un sabor para elegirlo";
  $("m-sabores").innerHTML = "";
  ss.forEach((s, i) => {
    const b = document.createElement("button");
    b.className = "sabor" + (i === sel.sabor ? " on" : "");
    b.textContent = saborNombre(s);
    b.onclick = () => { sel.sabor = (sel.sabor === i ? null : i); pintarSabores(); actualizarWA(); };
    $("m-sabores").appendChild(b);
  });
  const caja = $("m-sabor-desc");
  if (sel.sabor !== null && saborDesc(ss[sel.sabor])) {
    caja.innerHTML = `<b>${saborNombre(ss[sel.sabor])}:</b> ${saborDesc(ss[sel.sabor])}`;
    caja.style.display = "block";
    reanimar(caja, "fade");
  } else {
    caja.style.display = "none";
  }
}
function pintarRel() {
  const rel = productos.filter(x => x !== sel.p && x.categoria === sel.p.categoria && x.etiqueta !== "Agotado").slice(0, 3);
  if (!rel.length) { $("m-rel-box").style.display = "none"; return; }
  $("m-rel-box").style.display = "block";
  $("m-rel").innerHTML = "";
  rel.forEach(x => {
    const d = document.createElement("div");
    d.className = "rel-item";
    d.innerHTML = `<img src="${fotos(x)[0]}" alt="${x.nombre}" loading="lazy"><div><b>${x.nombre}</b><span>${precioTexto(x)}</span></div>`;
    d.onclick = () => abrir(x);
    $("m-rel").appendChild(d);
  });
}
function abrir(p) {
  const yaAbierta = $("modal").open;
  sel = { p, pres: pres(p) ? 0 : null, sabor: null, foto: 0 };
  const f = fotos(p);
  $("m-thumbs").innerHTML = "";
  if (f.length > 1) {
    f.forEach((src, i) => {
      const t = document.createElement("img");
      t.src = src;
      t.alt = "";
      t.onclick = () => mostrarFoto(i);
      $("m-thumbs").appendChild(t);
    });
  }
  $("prev").style.display = $("next").style.display = f.length > 1 ? "grid" : "none";
  mostrarFoto(0);
  const et = $("m-etiqueta");
  if (p.etiqueta) {
    et.innerHTML = textoEtiqueta(p.etiqueta);
    et.style.background = ETIQUETAS[p.etiqueta] || "#6b7280";
    et.style.display = "inline-flex";
    et.classList.toggle("brilla", BRILLAN.includes(p.etiqueta));
  } else {
    et.style.display = "none";
  }
  $("m-garantia").style.display = p.garantia ? "inline-block" : "none";
  $("m-nombre").textContent = p.nombre;
  // Corrección: antes esta línea estaba duplicada
  $("m-desc").innerHTML = (p.descripcion || "").replace(/\*(.*?)\*/g, "<b>$1</b>");
  pintarPres();
  pintarSabores();
  const agotado = p.etiqueta === "Agotado";
  const b = $("m-agregar");
  b.disabled = agotado;
  b.classList.remove("ok");
  b.textContent = agotado ? "Agotado" : "➕ Agregar a mi lista";
  actualizarWA();
  pintarRel();
  if (yaAbierta) reanimar($("modal"), "cambio");
  else { $("modal").classList.remove("cambio"); $("modal").showModal(); }
  $("modal").scrollTop = 0;
}
// Deslizar fotos con el dedo
let x0 = null;
$("galeria").addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
$("galeria").addEventListener("touchend", e => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 40 && fotos(sel.p).length > 1) mostrarFoto(sel.foto + (dx < 0 ? 1 : -1));
  x0 = null;
});
$("prev").onclick = () => mostrarFoto(sel.foto - 1);
$("next").onclick = () => mostrarFoto(sel.foto + 1);
$("m-cerrar").onclick = () => cerrar($("modal"));
$("m-agregar").onclick = () => {
  const p = sel.p;
  if (p.sabores && p.sabores.length && sel.sabor === null) {
    $("m-ayuda").textContent = "Elige un sabor para agregarlo a tu lista";
    reanimar($("m-ayuda"), "alerta");
    return;
  }
  agregarItem(p, sel.pres, sel.sabor);
  const b = $("m-agregar");
  b.textContent = "✓ Agregado a tu lista";
  b.classList.add("ok");
  setTimeout(() => { b.textContent = "➕ Agregar a mi lista"; b.classList.remove("ok"); }, 1500);
};
// ----- Lista de consulta (se guarda en el celular del cliente) -----
let lista = [];
try { lista = JSON.parse(localStorage.getItem("crisanta-lista")) || []; } catch (e) {}
const guardar = () => { try { localStorage.setItem("crisanta-lista", JSON.stringify(lista)); } catch (e) {} };
function agregarItem(p, presI, saborI) {
  const texto = textoItem(p, presI, saborI);
  const precio = pres(p) ? pres(p)[presI].precio : p.precio;
  const existe = lista.find(i => i.texto === texto);
  if (existe) existe.cantidad++;
  else lista.push({ texto, precio: precio || null, cantidad: 1 });
  guardar();
  pintarLista();
  reanimar($("btn-lista"), "pop");
}
function pintarLista() {
  const n = lista.reduce((s, i) => s + i.cantidad, 0);
  $("lista-n").textContent = n;
  $("btn-lista").style.display = n ? "flex" : "none";
  $("lista-items").innerHTML = lista.map((i, k) => `
    <div class="item">
      <div class="item-info"><b>${i.texto}</b><span>${i.precio ? fmt(i.precio) : "Consultar precio"}</span></div>
      <div class="cant">
        <button data-a="menos" data-i="${k}" aria-label="Quitar uno">−</button>
        <span>${i.cantidad}</span>
        <button data-a="mas" data-i="${k}" aria-label="Agregar uno">+</button>
      </div>
    </div>`).join("");
  const total = lista.reduce((s, i) => s + (i.precio ? i.precio * i.cantidad : 0), 0);
  $("lista-total").innerHTML = total ? `<span>Total aproximado</span><span>${fmt(total)}</span>` : "";
  const gratis = total >= DOMICILIO_GRATIS;
  const envio = $("lista-envio");
  if (!total) {
    envio.innerHTML = "";
  } else if (gratis) {
    envio.className = "lista-envio ok";
    envio.innerHTML = "🎉 ¡Tu pedido tiene domicilio gratis!";
  } else {
    envio.className = "lista-envio";
    envio.innerHTML = `🛵 Te faltan <b>${fmt(DOMICILIO_GRATIS - total)}</b> para el domicilio gratis
      <div class="barra"><i style="width:${Math.round(total / DOMICILIO_GRATIS * 100)}%"></i></div>`;
  }
  const lineas = lista.map(i => `• ${i.cantidad} x ${i.texto}${i.precio ? ` - ${fmt(i.precio * i.cantidad)}` : ""}`);
  $("lista-wa").href = waLink(`Hola, me interesan estos productos:\n${lineas.join("\n")}` +
    (total ? `\n\nTotal aproximado: ${fmt(total)}` : "") +
    (gratis ? `\n🛵 Aplica domicilio gratis` : ""));
  if (!n && $("lista-dlg").open) cerrar($("lista-dlg"));
}
$("lista-items").onclick = e => {
  const b = e.target.closest("button");
  if (!b) return;
  const k = +b.dataset.i;
  if (b.dataset.a === "mas") lista[k].cantidad++;
  else if (--lista[k].cantidad <= 0) lista.splice(k, 1);
  guardar();
  pintarLista();
};
$("btn-lista").onclick = () => { pintarLista(); $("lista-dlg").showModal(); };
$("lista-x").onclick = () => cerrar($("lista-dlg"));
$("lista-vaciar").onclick = () => { lista = []; guardar(); pintarLista(); };
// ----- Franja de avisos (va alternando los mensajes) -----
const mensajesAviso = [`🛵 Domicilio gratis en compras de ${fmt(DOMICILIO_GRATIS)} o más`];
if (hayPromos) mensajesAviso.push(MENSAJE_PROMOS);
let iAviso = 0;
function mostrarAviso() {
  const t = mensajesAviso[iAviso];
  $("aviso").innerHTML = t;
  $("aviso").classList.toggle("link", t === MENSAJE_PROMOS);
}
mostrarAviso();
if (mensajesAviso.length > 1) setInterval(() => {
  $("aviso").classList.add("oculto");
  setTimeout(() => {
    iAviso = (iAviso + 1) % mensajesAviso.length;
    mostrarAviso();
    $("aviso").classList.remove("oculto");
  }, reducirMovimiento() ? 0 : 300);
}, 4000);
$("aviso").onclick = () => { if ($("aviso").classList.contains("link")) irA(PROMO, true); };
// ----- Aviso de mayoría de edad (+18) -----
let edadOk = 0;
try { edadOk = +localStorage.getItem("crisanta-edad") || 0; } catch (e) {}
if (Date.now() - edadOk > DIAS_EDAD * 86400000) {
  $("edad").classList.add("ver");
  document.body.classList.add("bloqueado");
}
$("edad-si").onclick = () => {
  try { localStorage.setItem("crisanta-edad", Date.now()); } catch (e) {}
  $("edad").classList.remove("ver");
  document.body.classList.remove("bloqueado");
};
$("edad-no").onclick = () => {
  $("edad-pregunta").style.display = "none";
  $("edad-rechazo").style.display = "block";
};
// ----- Varios -----
let tt;
function toast(t) {
  $("toast").textContent = t;
  $("toast").classList.add("ver");
  clearTimeout(tt);
  tt = setTimeout(() => $("toast").classList.remove("ver"), 1800);
}
window.addEventListener("scroll", () => {
  $("arriba").classList.toggle("ver", window.scrollY > 400);
});
$("arriba").onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
let quieto;
window.addEventListener("scroll", () => {
  document.documentElement.classList.add("moviendo");
  clearTimeout(quieto);
  quieto = setTimeout(() => document.documentElement.classList.remove("moviendo"), 1000);
});
["modal", "lista-dlg"].forEach(id => {
  $(id).onclick = e => { if (e.target.id === id) cerrar($(id)); };
  $(id).addEventListener("cancel", e => { e.preventDefault(); cerrar($(id)); });
});
$("flotante").href = waLink(MENSAJE_GENERAL);
$("orden").onchange = pintar;
$("q").oninput = e => { busqueda = normalizar(e.target.value.trim()); pintar(); };
pintarPills(); pintar(); pintarNota(); pintarLista();
