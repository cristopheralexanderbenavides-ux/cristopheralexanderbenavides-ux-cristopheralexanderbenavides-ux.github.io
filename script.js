// ESTRUCTURA DE DATOS PARA LOS SERVICIOS Y COTIZADOR DINÁMICO
const SERVICIOS_DATA = {
    "banquetas": {
        nombre: "Construcción de Banquetas",
        desc: "Colocación de firmes peatonales exteriores con control térmico para evitar fisuras superficiales.",
        cobro: "Por metro cuadrado (m²)",
        factores: "Grosor de losa (estándar 8-10cm), tipo de malla electrosoldada (6-6/10-10), accesibilidad de camión revolvedor y acabado escobillado antiderrapante.",
        icono: "fa-solid fa-road"
    },
    "bardas": {
        nombre: "Bardas Perimetrales",
        desc: "Levantamiento de muros de delimitación de propiedad reforzados estructuralmente con castillos y dintel de concreto.",
        cobro: "Por metro lineal (m) acoplado a la altura solicitada",
        factores: "Tipo de block utilizado, cimentación requerida (profundidad de zapa), número de castillos de amarre internos y desplome del terreno.",
        icono: "fa-solid fa-gavel"
    },
    "firmes": {
        nombre: "Firmes de Concreto",
        desc: "Nivelación y colado de bases de alta resistencia mecánicas listas para recibir losetas pétreas o acabados epóxicos.",
        cobro: "Por metro cuadrado (m²)",
        factores: "Compactación mecánica del suelo (terreno natural vs relleno), espesor final y armado metálico estructural.",
        icono: "fa-solid fa-layer-group"
    },
    "losas": {
        nombre: "Losas de Entrepiso y Azotea",
        desc: "Sistemas estructurales horizontales de concreto armado mediante varilla corrugada de alta resistencia o vigueta y bovedilla.",
        cobro: "Por metro cuadrado (m²)",
        factores: "Puntales y cimbrado de madera, peralte o grosor estructural requerido, claro libre de muros y altura total de bombeo.",
        icono: "fa-solid fa-building"
    },
    "enjarres": {
        nombre: "Enjarres y Aplanados",
        desc: "Aplicación de morteros base arena-cemento sobre muros rústicos para plomeado y protección hidrófuga.",
        cobro: "Por metro cuadrado (m²)",
        factores: "Irregularidad previa del block o ladrillo, andamiaje para fachadas de doble altura y dosificación de cal impermeabilizante.",
        icono: "fa-solid fa-brush"
    },
    "pulidos": {
        nombre: "Pulidos Mecánicos y Espejo",
        desc: "Tratamiento y sellado abrasivo superficial para pisos industriales o decorativos de concreto reflectivo.",
        cobro: "Por metro cuadrado (m²)",
        factores: "Dureza del concreto existente (f'c), cantidad de pasadas con discos de diamante y selladores acrílicos protectores.",
        icono: "fa-solid fa-wand-magic-sparkles"
    },
    "remodelaciones": {
        nombre: "Remodelaciones Integrales",
        desc: "Modificación arquitectónica, demoliciones controladas y redistribución espacial de interiores residenciales.",
        cobro: "Por proyecto global / Estimación de catálogo de conceptos",
        factores: "Estado de salud estructural de los elementos existentes, manejo e instalaciones preexistentes y nivel de acabados finales seleccionados.",
        icono: "fa-solid fa-house-chimney-medical"
    },
    "instalaciones_hidraulicas": {
        nombre: "Instalaciones Hidráulicas",
        desc: "Red de distribución de agua potable limpia utilizando tuberías termo-fusionadas de PPR o CPVC de alta presión.",
        cobro: "Por punto de salida hidráulico o proyecto cerrado",
        factores: "Presión requerida en red, número de servicios (baños, cocinas) y trayectorias lineales empotradas en muros.",
        icono: "fa-solid fa-faucet"
    },
    "instalaciones_sanitarias": {
        nombre: "Instalaciones Sanitarias",
        desc: "Desarrollo de líneas de desalojo pluvial y de aguas negras con pendientes precisas para evitar estancamientos y olores.",
        cobro: "Por punto o salida sanitaria",
        factores: "Diámetros de ductos (PVC Sanitario), profundidad de excavación para registros de inspección y conexión a colector municipal.",
        icono: "fa-solid fa-droplet"
    },
    "instalaciones_electricas": {
        nombre: "Instalaciones Eléctricas de Fuerza",
        desc: "Canalización, cableado y balanceo de cargas monofásicas o bifásicas operando bajo normas oficiales de seguridad.",
        cobro: "Por salida de centro de luz, contacto o interruptor",
        factores: "Calibre de conductor (cobre AWG), longitud de circuitos, subtableros de distribución y tuberías de protección conduit rígidas.",
        icono: "fa-solid fa-bolt"
    }
};

// BASE DE DATOS DE CONSEJOS (MUTABLE EN MEMORIA)
let CONSEJOS_BASE = [
    { id: 1, titulo: "Diferencia entre PVC sanitario e hidráulico", cat: "Instalaciones", desc: "El PVC hidráulico soporta altas presiones por bombeo; el sanitario es de pared delgada, optimizado para descargas por gravedad continua." },
    { id: 2, titulo: "Cómo evitar la humedad por capilaridad", cat: "Estructura", desc: "Colocar un film de polietileno de alta densidad antes de vaciar el concreto del firme corta el ascenso del agua subterránea." },
    { id: 3, titulo: "Cuándo conviene hacer una losa reticular", cat: "Ingeniería", desc: "Es ideal cuando buscas claros libres mayores a 5 metros sin columnas intermedias, reduciendo drásticamente el peso propio de la losa." }
];

// INICIALIZACIÓN DE LA INTERFAZ AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    poblarServiciosCard();
    poblarSelectorCotizador();
    ejecutarCotizacionExterna();
    renderConsejos();
    switchCalc('concreto'); // Inicializar primera calculadora

    // Manejador del FAQ Acordeón
    document.querySelectorAll('.toggle-faq').forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('i');
            content.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });
});

// POBLAR TARJETAS DE SERVICIOS
function poblarServiciosCard() {
    const grid = document.getElementById("grid-servicios");
    if (!grid) return;
    grid.innerHTML = "";
    Object.keys(SERVICIOS_DATA).forEach(key => {
        const item = SERVICIOS_DATA[key];
        grid.innerHTML += `
            <div class="service-card bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div class="w-12 h-12 bg-[#0066FF]/20 text-[#0066FF] rounded-xl flex items-center justify-center text-xl"><i class="${item.icono}"></i></div>
                <h4 class="text-xl font-bold">${item.nombre}</h4>
                <p class="text-gray-400 text-xs font-light leading-relaxed">${item.desc}</p>
                <a href="#cotizador" onclick="forzarSeleccion('${key}')" class="inline-block text-xs text-[#0066FF] font-semibold hover:underline">Más información técnico-económica &rarr;</a>
            </div>
        `;
    });
}

// POBLAR SELECTOR COTIZADOR
function poblarSelectorCotizador() {
    const select = document.getElementById("select-cotizador");
    if (!select) return;
    select.innerHTML = "";
    Object.keys(SERVICIOS_DATA).forEach(key => {
        select.innerHTML += `<option value="${key}">${SERVICIOS_DATA[key].nombre}</option>`;
    });
    select.addEventListener("change", ejecutarCotizacionExterna);
}

function forzarSeleccion(key) {
    const select = document.getElementById("select-cotizador");
    if (select) {
        select.value = key;
        ejecutarCotizacionExterna();
    }
}

function ejecutarCotizacionExterna() {
    const select = document.getElementById("select-cotizador");
    if (!select) return;
    const key = select.value;
    const item = SERVICIOS_DATA[key];
    const resContainer = document.getElementById("resultado-cotizador");
    
    if (!resContainer) return;
    resContainer.classList.remove("hidden");
    resContainer.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/10">
            <div>
                <h4 class="text-2xl font-bold text-[#0066FF]">${item.nombre}</h4>
                <p class="text-xs text-gray-400 mt-1">${item.desc}</p>
            </div>
            <span class="bg-white/10 border border-white/20 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider text-right"><i class="fa-solid fa-tags text-[#0066FF] mr-1"></i> Cobro: ${item.cobro}</span>
        </div>
        <div class="space-y-2">
            <h5 class="text-xs font-bold uppercase tracking-widest text-gray-400">Factores Críticos de Variación en Obra:</h5>
            <p class="text-sm text-gray-300 font-light leading-relaxed">${item.factores}</p>
        </div>
        <div>
            <h5 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Galería y Evidencia Técnica Vinculada</h5>
            <div class="grid grid-cols-3 gap-3">
                <div class="h-24 bg-white/5 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-[10px] text-gray-500">Muestra Obra A</div>
                <div class="h-24 bg-white/5 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-[10px] text-gray-500">Muestra Obra B</div>
                <div class="h-24 bg-white/5 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-[10px] text-gray-500">Muestra Obra C</div>
            </div>
        </div>
    `;
}

// SUITE DE 7 CALCULADORAS DE OBRA JAVASCRIPT
function switchCalc(calcType) {
    activeCalc = calcType;
    document.querySelectorAll('.calc-tab-btn').forEach(btn => btn.classList.remove('active-tab'));
    event.currentTarget?.classList?.add('active-tab');
    renderCalculadoraUI();
}

function renderCalculadoraUI() {
    const container = document.getElementById("calc-interface");
    if (!container) return;
    
    if(activeCalc === 'concreto') {
        container.innerHTML = `
            <h4 class="text-xl font-bold mb-4 text-[#0066FF]"><i class="fa-solid fa-cubes"></i> Dosificación de Concreto Estructural</h4>
            <div class="grid sm:grid-cols-4 gap-4 mb-6">
                <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-1">Largo (m)</label>
                    <input type="number" id="c-largo" value="4" step="0.1" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-1">Ancho (m)</label>
                    <input type="number" id="c-ancho" value="3" step="0.1" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-1">Espesor (cm)</label>
                    <input type="number" id="c-espesor" value="10" step="1" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-1">% Desperdicio</label>
                    <select id="c-desp" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none">
                        <option value="1.05">5%</option>
                        <option value="1.10" selected>10%</option>
                        <option value="1.15">15%</option>
                    </select>
                </div>
            </div>
            <button onclick="calcularConcreto()" class="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-700 rounded-lg text-xs font-bold uppercase transition-all mb-6">Procesar Volumetria</button>
            <div id="calc-res" class="grid sm:grid-cols-2 gap-4"></div>
        `;
        calcularConcreto();
    } 
    else if(activeCalc === 'mezcla') {
        container.innerHTML = `
            <h4 class="text-xl font-bold mb-4 text-[#0066FF]"><i class="fa-solid fa-mortar-pestle"></i> Análisis Cemento/Grava/Arena para Firmes</h4>
            <div class="grid sm:grid-cols-4 gap-4 mb-6">
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Largo (m)</label><input type="number" id="m-largo" value="5" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Ancho (m)</label><input type="number" id="m-ancho" value="4" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Espesor (cm)</label><input type="number" id="m-espesor" value="10" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-1">Resistencia Requerida</label>
                    <select id="m-tipo" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none">
                        <option value="pobre">Concreto Pobre (Plantillas)</option>
                        <option value="normal" selected>Concreto Normal (f'c 200/250)</option>
                        <option value="reforzado">Concreto Alta Resistencia</option>
                    </select>
                </div>
            </div>
            <button onclick="calcularMezcla()" class="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-700 rounded-lg text-xs font-bold uppercase transition-all mb-6">Desglosar Proporciones</button>
            <div id="calc-res" class="grid sm:grid-cols-2 gap-4"></div>
        `;
        calcularMezcla();
    }
    else if(activeCalc === 'block') {
        container.innerHTML = `
            <h4 class="text-xl font-bold mb-4 text-[#0066FF]"><i class="fa-solid fa-cubes-stacked"></i> Cálculo Métrico de Block Estructural</h4>
            <div class="grid sm:grid-cols-3 gap-4 mb-4">
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Largo Muro (m)</label><input type="number" id="b-largo" value="10" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Alto Muro (m)</label><input type="number" id="b-alto" value="2.5" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-1">Desperdicio Block</label>
                    <select id="b-desp" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none">
                        <option value="1.05">5%</option>
                        <option value="1.10" selected>10%</option>
                    </select>
                </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-4 mb-6">
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Ancho Huecos (Vanos/Puertas m)</label><input type="number" id="b-hlargo" value="1" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Alto Huecos (m)</label><input type="number" id="b-halto" value="2" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
            </div>
            <button onclick="calcularBlock()" class="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-700 rounded-lg text-xs font-bold uppercase transition-all mb-6">Calcular Piezas</button>
            <div id="calc-res" class="grid sm:grid-cols-2 gap-4"></div>
        `;
        calcularBlock();
    }
    else if(activeCalc === 'piso') {
        container.innerHTML = `
            <h4 class="text-xl font-bold mb-4 text-[#0066FF]"><i class="fa-solid fa-border-all"></i> Modulación de Loseta Cerámica / Porcelanatos</h4>
            <div class="grid sm:grid-cols-4 gap-4 mb-6">
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Largo Área (m)</label><input type="number" id="p-largo" value="6" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Ancho Área (m)</label><input type="number" id="p-ancho" value="4" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-1">Cortes e Instalación</label>
                    <select id="p-desp" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none">
                        <option value="1.10" selected>10% Recto Estándar</option>
                        <option value="1.15">15% Desplante Diagonal</option>
                        <option value="1.20">20% Cartabón Complejo</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-1">Dimensión Pieza (cm)</label>
                    <select id="p-dim" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none">
                        <option value="0.09">30x30 cm</option>
                        <option value="0.16" selected>40x40 cm</option>
                        <option value="0.36">60x60 cm</option>
                    </select>
                </div>
            </div>
            <button onclick="calcularPiso()" class="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-700 rounded-lg text-xs font-bold uppercase transition-all mb-6">Calcular Cajas e Hiladas</button>
            <div id="calc-res" class="grid sm:grid-cols-2 gap-4"></div>
        `;
        calcularPiso();
    }
    else if(activeCalc === 'pintura') {
        container.innerHTML = `
            <h4 class="text-xl font-bold mb-4 text-[#0066FF]"><i class="fa-solid fa-paint-roller"></i> Rendimientos de Recubrimientos Vinílicos</h4>
            <div class="grid sm:grid-cols-4 gap-4 mb-6">
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Largo Muro (m)</label><input type="number" id="pt-largo" value="8" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Alto Muro (m)</label><input type="number" id="pt-alto" value="2.6" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Cant. Muros</label><input type="number" id="pt-cant" value="4" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Manos/Capas</label><input type="number" id="pt-manos" value="2" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
            </div>
            <button onclick="calcularPintura()" class="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-700 rounded-lg text-xs font-bold uppercase transition-all mb-6">Calcular Litros</button>
            <div id="calc-res" class="grid sm:grid-cols-2 gap-4"></div>
        `;
        calcularPintura();
    }
    else if(activeCalc === 'enjarre') {
        container.innerHTML = `
            <h4 class="text-xl font-bold mb-4 text-[#0066FF]"><i class="fa-solid fa-sheet-plastic"></i> Cubicaje de Mortero para Enjarre</h4>
            <div class="grid sm:grid-cols-3 gap-4 mb-6">
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Largo (m)</label><input type="number" id="e-largo" value="12" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Alto Muro (m)</label><input type="number" id="e-alto" value="2.5" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Espesor Enjarre (cm)</label><input type="number" id="e-esp" value="2" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
            </div>
            <button onclick="calcularEnjarre()" class="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-700 rounded-lg text-xs font-bold uppercase transition-all mb-6">Calcular Volumen</button>
            <div id="calc-res" class="grid sm:grid-cols-2 gap-4"></div>
        `;
        calcularEnjarre();
    }
    else if(activeCalc === 'varilla') {
        container.innerHTML = `
            <h4 class="text-xl font-bold mb-4 text-[#0066FF]"><i class="fa-solid fa-lines-leaning"></i> Cuantificación de Acero Corrugado para Losas</h4>
            <div class="grid sm:grid-cols-3 gap-4 mb-6">
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Largo Losa (m)</label><input type="number" id="v-largo" value="6" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div><label class="block text-xs font-semibold text-gray-400 mb-1">Ancho Losa (m)</label><input type="number" id="v-ancho" value="5" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none"></div>
                <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-1">Separación (cm)</label>
                    <select id="v-sep" class="w-full bg-[#0D0D0D] border border-white/20 rounded-xl p-3 text-sm text-white outline-none">
                        <option value="0.15" selected>15 cm</option>
                        <option value="0.20">20 cm</option>
                        <option value="0.25">25 cm</option>
                    </select>
                </div>
            </div>
            <button onclick="calcularVarilla()" class="px-6 py-2.5 bg-[#0066FF] hover:bg-blue-700 rounded-lg text-xs font-bold uppercase transition-all mb-6">Calcular Varillas de 12m</button>
            <div id="calc-res" class="grid sm:grid-cols-2 gap-4"></div>
        `;
        calcularVarilla();
    }
}

// LOGICA MATEMATICA DE CALCULADORAS
function calcularConcreto() {
    const l = parseFloat(document.getElementById("c-largo").value);
    const a = parseFloat(document.getElementById("c-ancho").value);
    const e = parseFloat(document.getElementById("c-espesor").value) / 100;
    const desp = parseFloat(document.getElementById("c-desp").value);
    
    let m3 = l * a * e;
    let totalConDesp = m3 * desp;

    document.getElementById("calc-res").innerHTML = `
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl"><h5>Volumen Neto Teórico</h5><p class="text-2xl font-bold text-[#0066FF]">${m3.toFixed(2)} m³</p></div>
        <div class="bg-black/40 border border-[#0066FF]/40 p-4 rounded-xl"><h5>Volumen de Solicitud Recomendado</h5><p class="text-2xl font-bold text-emerald-400">${totalConDesp.toFixed(2)} m³</p></div>
    `;
}

function calcularMezcla() {
    const l = parseFloat(document.getElementById("m-largo").value);
    const a = parseFloat(document.getElementById("m-ancho").value);
    const e = parseFloat(document.getElementById("m-espesor").value) / 100;
    const m3 = l * a * e;

    let sacosCemento = Math.ceil(m3 * 7);
    let arena = m3 * 0.52;
    let grava = m3 * 0.72;

    document.getElementById("calc-res").innerHTML = `
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl col-span-2"><h5>Volumen Total a Elaborar: ${m3.toFixed(2)} m³</h5></div>
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl"><h5>Cemento (Sacos 50kg)</h5><p class="text-xl font-bold text-white">${sacosCemento} Sacos</p></div>
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl"><h5>Arena Agregada</h5><p class="text-xl font-bold text-white">${arena.toFixed(2)} m³</p></div>
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl"><h5>Grava Agregada</h5><p class="text-xl font-bold text-white">${grava.toFixed(2)} m³</p></div>
    `;
}

function calcularBlock() {
    const l = parseFloat(document.getElementById("b-largo").value);
    const h = parseFloat(document.getElementById("b-alto").value);
    const hl = parseFloat(document.getElementById("b-hlargo").value);
    const ha = parseFloat(document.getElementById("b-halto").value);
    const desp = parseFloat(document.getElementById("b-desp").value);

    let areaBruta = l * h;
    let areaVanos = hl * ha;
    let areaFinal = areaBruta - areaVanos;
    
    let pzasNetas = areaFinal * 12.5; 
    let pzasDesp = Math.ceil(pzasNetas * desp);

    document.getElementById("calc-res").innerHTML = `
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl"><h5>Área Única de Muro</h5><p class="text-xl font-bold">${areaFinal.toFixed(2)} m²</p></div>
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl"><h5>Blocks Requeridos (+Desp)</h5><p class="text-2xl font-bold text-emerald-400">${pzasDesp} Piezas</p></div>
    `;
}

function calcularPiso() {
    const l = parseFloat(document.getElementById("p-largo").value);
    const a = parseFloat(document.getElementById("p-ancho").value);
    const desp = parseFloat(document.getElementById("p-desp").value);
    const areaPieza = parseFloat(document.getElementById("p-dim").value);

    let areaTotal = l * a;
    let pzasNecesarias = Math.ceil((areaTotal / areaPieza) * desp);

    document.getElementById("calc-res").innerHTML = `
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl"><h5>Superficie</h5><p class="text-xl font-bold">${areaTotal.toFixed(2)} m²</p></div>
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl"><h5>Total de Piezas Sueltas</h5><p class="text-2xl font-bold text-[#0066FF]">${pzasNecesarias} Pzas</p></div>
    `;
}

function calcularPintura() {
    const l = parseFloat(document.getElementById("pt-largo").value);
    const h = parseFloat(document.getElementById("pt-alto").value);
    const cant = parseInt(document.getElementById("pt-cant").value);
    const manos = parseInt(document.getElementById("pt-manos").value);

    let areaMuros = (l * h) * cant;
    let litros = (areaMuros * manos) / 10; 
    let cubetas = Math.ceil(litros / 19);

    document.getElementById("calc-res").innerHTML = `
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl"><h5>Área Total de Cobertura</h5><p class="text-xl font-bold">${areaMuros.toFixed(2)} m²</p></div>
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl"><h5>Volumen de Pintura</h5><p class="text-xl font-bold text-emerald-400">${litros.toFixed(1)} L (~ ${cubetas} Cubetas)</p></div>
    `;
}

function calcularEnjarre() {
    const l = parseFloat(document.getElementById("e-largo").value);
    const h = parseFloat(document.getElementById("e-alto").value);
    const esp = parseFloat(document.getElementById("e-esp").value) / 100;

    let area = l * h;
    let vol = area * esp * 1.10; 

    document.getElementById("calc-res").innerHTML = `
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl"><h5>Metros de Muro</h5><p class="text-xl font-bold">${area.toFixed(2)} m²</p></div>
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl"><h5>Mortero Requerido</h5><p class="text-xl font-bold text-[#0066FF]">${vol.toFixed(3)} m³</p></div>
    `;
}

function calcularVarilla() {
    const l = parseFloat(document.getElementById("v-largo").value);
    const a = parseFloat(document.getElementById("v-ancho").value);
    const sep = parseFloat(document.getElementById("v-sep").value);

    let varillasLargo = (l / sep) * a;
    let varillasAncho = (a / sep) * l;
    let metrosTotales = (varillasLargo + varillasAncho) * 1.10; 
    let piezas12m = Math.ceil(metrosTotales / 12);

    document.getElementById("calc-res").innerHTML = `
        <div class="bg-black/40 border border-white/10 p-4 rounded-xl"><h5>Longitud Lineal de Acero</h5><p class="text-xl font-bold">${metrosTotales.toFixed(1)} m</p></div>
        <div class="bg-black/40 border border-[#0066FF]/40 p-4 rounded-xl"><h5>Varillas Enteras (12 metros)</h5><p class="text-2xl font-bold text-emerald-400">${piezas12m} Piezas</p></div>
    `;
}

// LOGICA CONTROLADORA DE CONSEJOS (BUSQUEDA, AGREGAR Y ELIMINAR)
function renderConsejos(filtro = "") {
    const container = document.getElementById("container-consejos");
    if (!container) return;
    container.innerHTML = "";
    
    const listaFiltrada = CONSEJOS_BASE.filter(item => item.titulo.toLowerCase().includes(filtro.toLowerCase()));

    listaFiltrada.forEach(item => {
        container.innerHTML += `
            <div class="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                <div>
                    <span class="text-[10px] uppercase font-bold tracking-widest text-[#0066FF] bg-[#0066FF]/10 px-2.5 py-1 rounded-full">${item.cat}</span>
                    <h4 class="text-lg font-bold mt-2">${item.titulo}</h4>
                    <p class="text-xs text-gray-400 mt-2 font-light leading-relaxed">${item.desc}</p>
                </div>
                <button onclick="eliminarConsejo(${item.id})" class="text-left text-[10px] text-red-400 hover:text-red-500 font-semibold uppercase tracking-wider"><i class="fa-solid fa-trash-can mr-1"></i> Remover Consejo</button>
            </div>
        `;
    });
}

// Buscador activo
const searchInput = document.getElementById("search-consejos");
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        renderConsejos(e.target.value);
    });
}

// AGREGAR CONSEJO 100% REAL Y PERSONALIZADO
function agregarConsejoReal() {
    const titulo = document.getElementById("new-title").value.trim();
    const categoria = document.getElementById("new-category").value;
    const descripcion = document.getElementById("new-desc").value.trim();
    
    if(!titulo || !descripcion) {
        return alert("Por favor, ingresa tanto el Título como la Información completa del consejo antes de publicar.");
    }
    
    const nuevoConsejo = {
        id: Date.now(),
        titulo: titulo,
        cat: category = categoria,
        desc: descripcion
    };
    
    CONSEJOS_BASE.unshift(nuevoConsejo); // Se agrega al inicio de la lista
    
    // Limpiar los campos del formulario
    document.getElementById("new-title").value = "";
    document.getElementById("new-desc").value = "";
    
    renderConsejos(); // Volver a pintar las tarjetas actualizadas
}

// Eliminar consejo de memoria
function eliminarConsejo(id) {
    CONSEJOS_BASE = CONSEJOS_BASE.filter(i => i.id !== id);
    renderConsejos();
}

// NAVEGACIÓN DEL CARRUSEL DE PORTAFOLIO
const track = document.getElementById('carousel-track');
let index = 0;

if (track) {
    const btnNext = document.getElementById('next-slide');
    const btnPrev = document.getElementById('prev-slide');
    
    if(btnNext && btnPrev) {
        btnNext.addEventListener('click', () => {
            if(index < 2) { index++; } else { index = 0; }
            track.style.transform = `translateX(-${index * 100}%)`;
        });

        btnPrev.addEventListener('click', () => {
            if(index > 0) { index--; } else { index = 2; }
            track.style.transform = `translateX(-${index * 100}%)`;
        });
    }
}