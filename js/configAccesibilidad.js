/* ===================================
   CONFIGURACION GLOBAL
=================================== */
const accesibilidad = localStorage.getItem( "accesibilidad" );

/* ===================================
   ALTO CONTRASTE
=================================== */
if( accesibilidad === "contraste" ){
    document.body.classList.add( "alto-contraste" );
}

/* ===================================
   LECTURA AUTOMATICA
=================================== */
if( accesibilidad === "voz" ){
    window.addEventListener( "load", () => {
            const texto = document.body.innerText;
            const lectura = new SpeechSynthesisUtterance(
                texto
            );
            lectura.lang = "es-ES";
            lectura.rate = 1;
            speechSynthesis.speak( lectura );
        }
    );
}