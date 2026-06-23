/* ===================================
   PERFIL DEL ESTUDIANTE - SUPABASE
=================================== */

const TOTAL_SESIONES = 27;

const estudianteId = localStorage.getItem("estudianteId");
const nombre = localStorage.getItem("nombre");
const periodo = localStorage.getItem("periodoAcademico");
const ultimoAcceso = localStorage.getItem("ultimoAcceso");

/* FUNCIÓN SEGURA PARA ESCRIBIR DATOS */

function ponerTexto(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}

/* DATOS DEL ESTUDIANTE */

ponerTexto("nombreUsuario", nombre || "No registrado");
ponerTexto("periodoAcademico", periodo || "No registrado");
ponerTexto("ultimoAcceso", ultimoAcceso || "-");

/* CARGAR PROGRESO DESDE SUPABASE */

async function cargarPerfil() {
    const barra = document.getElementById("barraProgresoGeneral");
    const texto = document.getElementById("textoProgreso");
    const sesionesHTML = document.getElementById("sesionesCompletadas");
    const unidadesHTML = document.getElementById("unidadesCompletadas");

    if (!estudianteId) {
        if (barra) {
            barra.style.width = "0%";
            barra.textContent = "0%";
        }

        if (texto) texto.textContent = "0% Completado";
        if (sesionesHTML) sesionesHTML.textContent = "0";
        if (unidadesHTML) unidadesHTML.textContent = "0";

        return;
    }

    const { data, error } = await supabaseClient
        .from("progreso")
        .select("*")
        .eq("estudiante_id", estudianteId)
        .eq("completado", true);

    if (error) {
        console.error("Error al cargar progreso:", error);
        return;
    }

    const sesionesUnicas = new Set();

    data.forEach(item => {
        sesionesUnicas.add(`${item.unidad}-${item.sesion}`);
    });

    const sesionesCompletadas = sesionesUnicas.size;

    const porcentaje = Math.round(
        (sesionesCompletadas / TOTAL_SESIONES) * 100
    );

    if (barra) {
        barra.style.width = porcentaje + "%";
        barra.textContent = porcentaje + "%";
    }

    if (texto) {
        texto.textContent = porcentaje + "% Completado";
    }

    if (sesionesHTML) {
        sesionesHTML.textContent = sesionesCompletadas;
    }

    const unidadesCompletadas =
        unidadCompleta(data, "UT1", 1, 5) +
        unidadCompleta(data, "UT2", 6, 9) +
        unidadCompleta(data, "UT3", 10, 14) +
        unidadCompleta(data, "UT4", 15, 18) +
        unidadCompleta(data, "UT5", 19, 23) +
        unidadCompleta(data, "UT6", 24, 27);

    if (unidadesHTML) {
        unidadesHTML.textContent = unidadesCompletadas;
    }

    verificarUnidad(data, "UT1", 1, 5, "ut1Estado");
    verificarUnidad(data, "UT2", 6, 9, "ut2Estado");
    verificarUnidad(data, "UT3", 10, 14, "ut3Estado");
    verificarUnidad(data, "UT4", 15, 18, "ut4Estado");
    verificarUnidad(data, "UT5", 19, 23, "ut5Estado");
    verificarUnidad(data, "UT6", 24, 27, "ut6Estado");
}

/* VERIFICAR SI UNA UNIDAD ESTÁ COMPLETA */

function unidadCompleta(data, unidad, inicio, fin) {
    for (let i = inicio; i <= fin; i++) {
        const existe = data.some(item =>
            item.unidad === unidad &&
            Number(item.sesion) === i
        );

        if (!existe) {
            return 0;
        }
    }

    return 1;
}

/* ACTUALIZAR ICONO DE CADA UNIDAD */

function verificarUnidad(data, unidad, inicio, fin, elementoId) {
    const elemento = document.getElementById(elementoId);

    if (!elemento) return;

    const completa = unidadCompleta(data, unidad, inicio, fin);

    elemento.textContent = completa ? "✅" : "⏳";
}

/* CERRAR SESIÓN */

const cerrarSesion = document.getElementById("cerrarSesion");

if (cerrarSesion) {
    cerrarSesion.addEventListener("click", () => {
        const confirmar = confirm("¿Desea cerrar la sesión?");

        if (!confirmar) return;

        localStorage.clear();

        window.location.href = "../index.html";
    });
}

/* INICIAR PERFIL */

cargarPerfil();