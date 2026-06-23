/* ===================================
   DATOS DEL ESTUDIANTE
=================================== */

const estudianteId = localStorage.getItem("estudianteId");
const nombre = localStorage.getItem("nombre");
const periodo = localStorage.getItem("periodoAcademico");
const paralelo = localStorage.getItem("paralelo");

const TOTAL_SESIONES = 27;

/* Mostrar nombre */

const nombreHTML = document.getElementById("nombreUsuario");

if (nombreHTML) {
    nombreHTML.textContent = nombre || "No registrado";
}

/* Mostrar periodo */

const periodoHTML = document.getElementById("periodoUsuario");

if (periodoHTML) {
    periodoHTML.textContent = periodo || "No registrado";
}

/* Mostrar paralelo */

const paraleloHTML = document.getElementById("paraleloUsuario");

if (paraleloHTML) {
    paraleloHTML.textContent = paralelo || "No registrado";
}

/* Guardar último acceso */

localStorage.setItem(
    "ultimoAcceso",
    new Date().toLocaleString("es-EC")
);

/* ===================================
   PROGRESO REAL DESDE SUPABASE
=================================== */

async function cargarProgresoDashboard() {

    const barra = document.getElementById("progresoGeneral");
    const texto = document.getElementById("textoProgreso");

    if (!barra || !texto) return;

    if (!estudianteId) {
        barra.style.width = "0%";
        barra.innerHTML = "0%";
        texto.textContent = "0% completado";
        return;
    }

    const { data, error } = await supabaseClient
        .from("progreso")
        .select("*")
        .eq("estudiante_id", estudianteId)
        .eq("completado", true);

    if (error) {
        console.error("Error al cargar progreso:", error);
        barra.style.width = "0%";
        barra.innerHTML = "0%";
        texto.textContent = "0% completado";
        return;
    }

    const sesionesUnicas = new Set();

    data.forEach(item => {
        sesionesUnicas.add(`${item.unidad}-${item.sesion}`);
    });

    const completadas = sesionesUnicas.size;

    const porcentaje = Math.round(
        (completadas / TOTAL_SESIONES) * 100
    );

    barra.style.width = porcentaje + "%";
    barra.innerHTML = porcentaje + "%";
    texto.textContent = porcentaje + "% completado";
}

cargarProgresoDashboard();

/* ===================================
   LECTOR DE VOZ
=================================== */

const btnLeer = document.getElementById("leerPagina");

if (btnLeer) {
    btnLeer.addEventListener("click", () => {

        speechSynthesis.cancel();

        const hero = document.querySelector(".hero-dashboard");

        if (!hero) return;

        const lectura = new SpeechSynthesisUtterance(hero.innerText);

        lectura.lang = "es-ES";

        speechSynthesis.speak(lectura);
    });
}

/* ===================================
   ALTO CONTRASTE
=================================== */

const btnContraste = document.getElementById("altoContraste");

if (btnContraste) {
    btnContraste.addEventListener("click", () => {

        document.body.classList.toggle("alto-contraste");

    });
}

/* ===================================
   TAMAÑO DE FUENTE
=================================== */

let tamaño = 16;

const btnMas = document.getElementById("aumentarFuente");
const btnMenos = document.getElementById("disminuirFuente");

if (btnMas) {
    btnMas.addEventListener("click", () => {

        tamaño += 2;

        document.body.style.fontSize = tamaño + "px";
    });
}

if (btnMenos) {
    btnMenos.addEventListener("click", () => {

        if (tamaño > 12) {
            tamaño -= 2;
            document.body.style.fontSize = tamaño + "px";
        }
    });
}