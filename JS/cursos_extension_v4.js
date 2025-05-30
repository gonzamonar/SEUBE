const YEAR = new Date().getFullYear();


export async function CargarCursos(url_json, id_container = "bloque_cursos"){
	let json_file = await FetchDataAsync(url_json);
	let cursos = ParseJson(json_file);
   	
   	const container = $(id_container);

    // Loop and inject HTML
    cursos.forEach(curso => {
        container.innerHTML += renderCurso(curso);
    });
}

class Curso {
	constructor(n, inscripcion, modalidad, titulo, docente, flyer_inicio, inicio, fin, flyer_horario, horario, flyer_imagen, programa, carga, arancel, link, presentacion) {
		this.n = parseInt(n);
		this.inscripcion = inscripcion;
		this.modalidad = modalidad;
		this.titulo = titulo;
		this.docente = docente;
		this.flyer_inicio = flyer_inicio;
		this.inicio = inicio;
		this.fin = fin;
		this.flyer_horario = flyer_horario;
		this.horario = horario;
		this.flyer_imagen = flyer_imagen;
		this.programa = programa;
		this.carga = carga;
		this.arancel = arancel;
		this.link = link;
		this.presentacion = presentacion;
	}

	getStatus(year){
		return this.inscripcion == "cerrada" ? "INSCRIPCIÓN CERRADA" :
					   "MODALIDAD "+ this.modalidad.toUpperCase()+" – INICIA "+ this.getMonth() + " " + year ;
	}

	getMonth(){
		return this.inicio == "A Confirmar" ? "PRÓXIMAMENTE" : this.inicio.split(' ').slice(-1)[0].toUpperCase() ;
	}
}


async function FetchDataAsync(url) {
    const response = await fetch(url);
    let jsonArray = await response.json();
    return jsonArray;
}


function $(id){
	return document.getElementById(id);
}


function ToggleClass(element, classname){
	if(element != null) {
		element.classList.toggle(classname);
	}
}


function ParseJson(json){
    let items = [];
    json.forEach(e => {
            let item;
            item = new Curso(e.n, e.inscripcion, e.modalidad, e.titulo, e.docente, e.flyer_inicio, e.inicio, e.fin, e.flyer_horario, e.horario, e.flyer_imagen, e.programa, e.carga, e.arancel, e.link, e.presentacion);
            items.push(item);
    });
    return items;
}



function renderCurso(curso) {
    const modalidad = curso.modalidad.charAt(0).toUpperCase() + curso.modalidad.slice(1);

    return `
        <div class="flyer_container" style="background-image: url('${curso.flyer_imagen}');">
            <div class="marco">&nbsp;</div>

            <div class="content-container">
                <div class="banner-img-container">
                    <img src="https://seube.filo.uba.ar/sites/seube.filo.uba.ar/files/banner-humanidades.jpg" alt="Humanidades en Curso" />
                </div>
                
                <p class="titulo_flyer">${curso.titulo}</p>
                <p class="docente_flyer">${curso.docente}</p>
                <div class="fechas_flyer_container">
                    <p class="detalle_flyer">Inicia ${curso.flyer_inicio}</p>
                    <p class="division_flyer">|</p>
                    <p class="detalle_flyer">${curso.flyer_horario}</p>
                    <p class="division_flyer">|</p>
                    <p class="detalle_flyer">${modalidad}</p>
                </div>
                
                <div class="logo_uba_container">
                    <img src="https://seube.filo.uba.ar/sites/seube.filo.uba.ar/files/Logo%20UBA%20Filo.jpg" alt="Logo Filo:UBA" />
                </div>
            </div>
        </div>
    `;
}

