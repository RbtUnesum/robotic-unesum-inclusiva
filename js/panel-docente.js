/* ===================================
   PROTEGER PANEL DOCENTE
=================================== */

const autenticado = localStorage.getItem("docenteAutenticado");

if (autenticado !== "true") {
    window.location.href = "docente.html";
}

/* ===================================
   CERRAR SESIÓN
=================================== */

const btnCerrar = document.getElementById("btnCerrarSesion");

if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
        localStorage.removeItem("docenteAutenticado");
        window.location.href = "docente.html";
    });
}

/* ===================================
   CARGAR DATOS DESDE SUPABASE
=================================== */

async function cargarPanelDocente() {
    const { data: estudiantes, error: errorEstudiantes } =
        await supabaseClient
            .from("estudiantes")
            .select("*");

    const { data: accesos, error: errorAccesos } =
        await supabaseClient
            .from("accesos")
            .select("*");

    const { data: progreso, error: errorProgreso } =
        await supabaseClient
            .from("progreso")
            .select("*")
            .eq("completado", true);

    if (errorEstudiantes || errorAccesos || errorProgreso) {
        console.error(errorEstudiantes || errorAccesos || errorProgreso);
        alert("Error al cargar datos del panel docente.");
        return;
    }

    document.getElementById("totalEstudiantes").textContent =
        estudiantes.length;

    document.getElementById("totalAccesos").textContent =
        accesos.length;

    document.getElementById("totalProgreso").textContent =
        progreso.length;

    const paralelosUnicos = new Set(
        estudiantes.map(e => e.paralelo)
    );

    document.getElementById("totalParalelos").textContent =
        paralelosUnicos.size;

    cargarTablaEstudiantes(estudiantes);
    cargarTablaParalelos(accesos);
    cargarTablaAccesibilidad(accesos);
}

/* ===================================
   TABLA ESTUDIANTES
=================================== */

function cargarTablaEstudiantes(estudiantes) {
    const tabla = document.getElementById("tablaEstudiantes");

    tabla.innerHTML = "";

    estudiantes.forEach(estudiante => {
        tabla.innerHTML += `
            <tr>
                <td>${estudiante.nombre || "Sin nombre"}</td>
                <td>${estudiante.periodo}</td>
                <td>${estudiante.paralelo}</td>
                <td>${new Date(estudiante.created_at).toLocaleString("es-EC")}</td>
            </tr>
        `;
    });
}

/* ===================================
   TABLA PARALELOS
=================================== */

function cargarTablaParalelos(accesos) {
    const tabla = document.getElementById("tablaParalelos");

    const conteo = {};

    accesos.forEach(acceso => {
        conteo[acceso.paralelo] =
            (conteo[acceso.paralelo] || 0) + 1;
    });

    tabla.innerHTML = "";

    Object.keys(conteo).forEach(paralelo => {
        tabla.innerHTML += `
            <tr>
                <td>Paralelo ${paralelo}</td>
                <td>${conteo[paralelo]}</td>
            </tr>
        `;
    });
}

/* ===================================
   TABLA ACCESIBILIDAD
=================================== */

function cargarTablaAccesibilidad(accesos) {
    const tabla = document.getElementById("tablaAccesibilidad");

    const conteo = {};

    accesos.forEach(acceso => {
        conteo[acceso.accesibilidad] =
            (conteo[acceso.accesibilidad] || 0) + 1;
    });

    tabla.innerHTML = "";

    Object.keys(conteo).forEach(tipo => {
        tabla.innerHTML += `
            <tr>
                <td>${tipo}</td>
                <td>${conteo[tipo]}</td>
            </tr>
        `;
    });
}

cargarPanelDocente();