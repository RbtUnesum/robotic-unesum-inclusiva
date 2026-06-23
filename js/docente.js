/* ===================================
   ACCESO DOCENTE
=================================== */

const PASSWORD_DOCENTE =
"unesum-ti-robotica";

document
.getElementById("btnIngresarDocente")
.addEventListener("click", () => {

    const password =
    document
    .getElementById("passwordDocente")
    .value;

    const error =
    document
    .getElementById("mensajeError");

    if(password === PASSWORD_DOCENTE){

        localStorage.setItem(
            "docenteAutenticado",
            "true"
        );

        window.location.href =
        "panel-docente.html";

    }else{

        error.classList.remove(
            "d-none"
        );

    }

});