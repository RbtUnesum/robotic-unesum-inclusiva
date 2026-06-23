/* ===================================
   PANEL
=================================== */
const panel = document.getElementById( "panelAccesibilidad" );

document.getElementById( "btnAccesibilidad" ).addEventListener("click",()=>{
    panel.classList.toggle( "activo" );
});

document.getElementById( "cerrarPanel" ).addEventListener("click",()=>{
    panel.classList.remove( "activo" );
});

/* ===================================
   CONTRASTE
=================================== */
document.getElementById( "btnContraste" ).addEventListener("click",()=>{
    document.body.classList.add( "alto-contraste" );
});
document.getElementById( "btnNormal" ).addEventListener("click",()=>{
    document.body.classList.remove( "alto-contraste" );
});

/* ===================================
   TAMAÑO TEXTO
=================================== */
let tamaño = 100;
document.getElementById( "btnAumentar" ).addEventListener("click",()=>{
    tamaño += 10;
    document.body.style.fontSize =
    tamaño + "%";
});

document.getElementById( "btnReducir" ).addEventListener("click",()=>{
    if(tamaño > 70){
        tamaño -= 10;
        document.body.style.fontSize =
        tamaño + "%";
    }
});

/* ===================================
   LECTURA PAGINA
=================================== */
document.getElementById( "btnLeerPagina" ).addEventListener("click",()=>{
    speechSynthesis.cancel();
    const texto = document.body.innerText;
    const lectura = new SpeechSynthesisUtterance( texto );
    lectura.lang = "es-ES";
    speechSynthesis.speak( lectura );
});