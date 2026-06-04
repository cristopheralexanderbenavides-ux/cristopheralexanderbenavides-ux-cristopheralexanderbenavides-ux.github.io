// REGLAS LÓGICAS PARA EL SISTEMA DE DIAGNÓSTICO SMARTPLANT
function procesarDiagnostico() {
    // Captura de valores del formulario
    const tipoPlanta = document.getElementById('tipo-planta').value;
    const tierra = document.getElementById('tierra').value;
    const hojas = document.getElementById('hojas').value;
    const luz = document.getElementById('luz').value;
    const crecimiento = document.getElementById('crecimiento').value;

    // Variables de salida
    let diagnostico = "";
    let explicacion = "";
    let capsula = "";
    let consejo = "";
    let urgencia = "";

    // --- ALGORITMO DE RAZONAMIENTO LOGICO VEGETAL ---

    // Condición 1: Exceso Crítico de Riego
    if (tierra === "muy_mojada" && (hojas === "amarillas" || hojas === "caidas")) {
        diagnostico = "Asfixia Radicular por Exceso de Agua";
        explicacion = `Tu ${tipoPlanta} está recibiendo más agua de la que sus raíces pueden procesar. La saturación desplaza el oxígeno del suelo, pudriendo las raíces lentamente.`;
        capsula = "AquaBalance";
        consejo = "Suspende el riego de inmediato. Retira los platos de drenaje acumulados y coloca la planta en un área muy ventilada.";
        urgencia = "🔴 ALTA";
    }
    // Condición 2: Deshidratación Extrema
    else if (tierra === "seca" && (hojas === "secas" || hojas === "caidas")) {
        diagnostico = "Deshidratación o Déficit Hídrico Severo";
        explicacion = `El sustrato se ha quedado completamente sin reservas líquidas. Las células de las hojas han perdido turgencia, lo que genera colapso físico.`;
        capsula = "AquaBalance";
        consejo = "Aplica un riego profundo por inmersión o riego lento hasta que el agua drene por debajo. Monitorea la humedad de forma regular.";
        urgencia = "🔴 ALTA";
    }
    // Condición 3: Ataque de Patógenos u Hongos
    else if (hojas === "manchas") {
        diagnostico = "Infección Micótica o Foliar (Hongos)";
        explicacion = `La presencia de motas o manchas de color inusual suele deberse a la proliferación de esporas fúngicas generadas por humedad en las hojas o mala ventilación.`;
        capsula = "FungiStop";
        consejo = "Poda las hojas severamente afectadas con herramientas desinfectadas. Evita mojar el follaje directo durante los próximos riegos.";
        urgencia = "🟡 MEDIA";
    }
    // Condición 4: Desnutrición o Empobrecimiento de Sustrato
    else if ((hojas === "amarillas" || crecimiento === "lento" || crecimiento === "detenido") && tierra === "humeda") {
        diagnostico = "Clorosis Férrica o Deficiencia de Nutrientes";
        explicacion = `A pesar de que el riego es óptimo, la planta carece de los bloques químicos esenciales (Nitrógeno, Fósforo, Potasio) para generar clorofila y crecer.`;
        capsula = "NutriPlant";
        consejo = "Aplica suplementación nutricional al sustrato. Asegúrate de renovar la capa superior de tierra por humus orgánico.";
        urgencia = "🟡 MEDIA";
    }
    // Condición 5: Fotoperiodo Deficiente (Falta de Luz)
    else if (luz === "poca" && (hojas === "amarillas" || crecimiento === "lento")) {
        diagnostico = "Etiolación o Déficit Lumínico";
        explicacion = `La planta no está recibiendo fotones suficientes para activar la fotosíntesis de manera sostenible, lo que frena su metabolismo por completo.`;
        capsula = "RevivePlant";
        consejo = "Traslada gradualmente la planta hacia una ventana con mayor exposición lumínica. No la expongas a sol directo abruptamente.";
        urgencia = "🟡 MEDIA";
    }
    // Condición 6: Estado de Alerta General / Debilidad Generalizada
    else if (hojas === "caidas" || crecimiento === "detenido") {
        diagnostico = "Estado de Shock Vegetal o Decaimiento General";
        explicacion = `Múltiples factores estresantes sutiles (cambio brusco de temperatura, corrientes de aire o maceta pequeña) han debilitado los sistemas de la planta.`;
        capsula = "RevivePlant";
        consejo = "Mantén la planta en un lugar con temperatura estable, protegida de corrientes frías o cálidas de aire.";
        urgencia = "🟡 MEDIA";
    }
    // Condición 7: Planta Saludable Óptima
    else {
        diagnostico = "Salud Vegetal Estable / Estado Saludable";
        explicacion = `Los parámetros analizados coinciden con un entorno equilibrado. Las funciones metabólicas operan en total normalidad.`;
        capsula = "Ninguna (¡Sigue así!)";
        consejo = "No requiere intervenciones químicas o físicas. Conserva los ciclos actuales de luz y riego establecidos.";
        urgencia = "🟢 BAJA";
    }

    // Renderizar resultados en la interfaz HTML
    document.getElementById('res-diag').innerText = diagnostico;
    document.getElementById('res-exp').innerText = explicacion;
    document.getElementById('res-capsula').innerText = capsula;
    document.getElementById('res-consejo').innerText = consejo;
    document.getElementById('res-urgencia').innerText = urgencia;

    // Mostrar el contenedor removiendo la propiedad oculta
    const resultBox = document.getElementById('resultado-box');
    resultBox.classList.remove('hidden');

    // Efecto visual: Resaltar la tarjeta de la cápsula recomendada en la tienda
    resaltarCapsula(capsula);
}

// Resalta visualmente la tarjeta de la cápsula sugerida
function resaltarCapsula(nombreCapsula) {
    // Limpiar clases previas
    document.querySelectorAll('.capsula-card').forEach(card => {
        card.classList.remove('capsula-highlight');
    });

    // Mapear y aplicar clase de destaque
    const idMapa = {
        'NutriPlant': 'cap-nutriplant',
        'AquaBalance': 'cap-aquabalance',
        'FungiStop': 'cap-fungistop',
        'RevivePlant': 'cap-reviveplant'
    };

    const targetId = idMapa[nombreCapsula];
    if (targetId) {
        document.getElementById(targetId).classList.add('capsula-highlight');
    }
}

// SIMULADOR SENSOR DE HUMEDAD (MACETA IOT)
function simularHumedad(valor) {
    // Actualizar texto del número porcentual
    document.getElementById('valor-humedad').innerText = valor;

    const display = document.getElementById('status-display');
    
    // Limpiar todos los estados visuales anteriores
    display.className = "status-display";

    // Evaluar rangos numéricos del Slider
    if (valor >= 0 && valor <= 30) {
        display.innerText = "🚨 Alerta: Falta Agua";
        display.classList.add('falta-agua');
    } else if (valor >= 31 && valor <= 70) {
        display.innerText = "❇️ Humedad Correcta";
        display.classList.add('correcto');
    } else if (valor >= 71 && valor <= 100) {
        display.innerText = "🌊 Alerta: Exceso de Agua";
        display.classList.add('exceso-agua');
    }
}