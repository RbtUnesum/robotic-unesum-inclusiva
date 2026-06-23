/* ===================================
   ACORDEONES DE SESIONES
=================================== */

document.querySelectorAll(".sesion-header").forEach(header => {

    header.addEventListener("click", () => {

        const body = header.nextElementSibling;

        body.classList.toggle("activa");

    });

});


/* ===================================
   LECTOR DE VOZ
=================================== */

document.querySelectorAll(".leer").forEach(boton => {

    boton.addEventListener("click", () => {

        speechSynthesis.cancel();

        const contenido = boton
            .closest(".sesion-body")
            .querySelector(".contenido-lectura");

        if (!contenido) return;

        const lectura = new SpeechSynthesisUtterance(
            contenido.innerText
        );

        lectura.lang = "es-ES";
        lectura.rate = 1;
        lectura.pitch = 1;

        speechSynthesis.speak(lectura);

    });

});


/* ===================================
   PROGRESO CON SUPABASE
=================================== */

const botonesCompletar = document.querySelectorAll(".completar");

const totalSesionesPagina = botonesCompletar.length;

let completadasPagina = 0;

const estudianteId = localStorage.getItem("estudianteId");


/* ===================================
   CARGAR PROGRESO GUARDADO
=================================== */

async function cargarProgreso() {

    if (!estudianteId) {

        console.warn("No existe estudianteId en localStorage.");

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

    completadasPagina = 0;

    botonesCompletar.forEach(boton => {

        const unidad = boton.dataset.unidad;
        const sesion = Number(boton.dataset.sesion);

        const sesionCompletada = data.some(item =>
            item.unidad === unidad &&
            Number(item.sesion) === sesion
        );

        if (sesionCompletada) {

            boton.classList.add("done");
            boton.disabled = true;
            boton.innerHTML = "✓ Completada";

            completadasPagina++;

        }

    });

    actualizarBarra();

}


/* ===================================
   MARCAR SESIÓN COMPLETADA
=================================== */

botonesCompletar.forEach(boton => {

    boton.addEventListener("click", async () => {

        if (boton.classList.contains("done")) return;

        const unidad = boton.dataset.unidad;
        const sesion = Number(boton.dataset.sesion);

        if (!estudianteId) {

            alert("No se encontró el registro del estudiante. Ingrese nuevamente desde la pantalla de acceso.");

            window.location.href = "acceso.html";

            return;

        }

        const { error } = await supabaseClient
            .from("progreso")
            .upsert(
                [
                    {
                        estudiante_id: estudianteId,
                        unidad: unidad,
                        sesion: sesion,
                        completado: true,
                        fecha: new Date().toISOString()
                    }
                ],
                {
                    onConflict: "estudiante_id,unidad,sesion"
                }
            );

        if (error) {

            console.error("Error al guardar progreso:", error);

            alert("No se pudo guardar el progreso en Supabase.");

            return;

        }

        boton.classList.add("done");
        boton.disabled = true;
        boton.innerHTML = "✓ Completada";

        completadasPagina++;

        actualizarBarra();

    });

});


/* ===================================
   ACTUALIZAR BARRA DE LA UNIDAD
=================================== */

function actualizarBarra() {

    const barra = document.getElementById("barraProgreso");

    if (!barra) return;

    const porcentaje = Math.round(
        (completadasPagina / totalSesionesPagina) * 100
    );

    barra.style.width = porcentaje + "%";
    barra.innerHTML = porcentaje + "%";

}


/* ===================================
   INICIAR
=================================== */

cargarProgreso();