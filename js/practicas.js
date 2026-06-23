document
.querySelectorAll(".leer")
.forEach((boton)=>{

    boton.addEventListener("click",()=>{

        speechSynthesis.cancel();

        const texto=
        boton
        .closest(".card-body")
        .querySelector(".contenido-lectura")
        .innerText;

        const lectura=
        new SpeechSynthesisUtterance(texto);

        lectura.lang="es-ES";

        lectura.rate=1;

        lectura.pitch=1;

        speechSynthesis.speak(lectura);

    });

});