/* ===================================
   ACCESO ESTUDIANTE
=================================== */

document .getElementById("btnIngresar") .addEventListener("click", async () => {
    const nombre = document.getElementById( "nombre" ).value.trim();
    const periodo = document.getElementById( "periodo" ).value.trim();
    const paralelo = document.getElementById( "paralelo" ).value;
    const accesibilidad = document.getElementById( "accesibilidad" ).value;
    if( nombre === "" || periodo === "" || paralelo === "" ){
        alert( "Complete todos los campos." );
        return;
    }

    const { data, error } = await supabaseClient .from("estudiantes").insert([
        {
            nombre,
            periodo,
            paralelo
        }
    ]) .select();
    if(error){
        console.error(error);
        alert( "Error al registrar estudiante.");
        return;
    }
    localStorage.setItem( "estudianteId", data[0].id );
    localStorage.setItem( "nombre", nombre );
    localStorage.setItem( "periodoAcademico", periodo );
    localStorage.setItem( "paralelo", paralelo );
    localStorage.setItem( "accesibilidad", accesibilidad );

    await supabaseClient
    .from("accesos")
    .insert([
        {
            estudiante_id: data[0].id,
            periodo: periodo,
            paralelo: paralelo,
            accesibilidad: accesibilidad
        }
    ]);

    window.location.href = "dashboard.html";
});