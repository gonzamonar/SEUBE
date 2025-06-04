const YEAR = new Date().getFullYear();

export async function CargarCursos(url_json, id_container = "bloque_cursos"){
	let json_file = await FetchDataAsync(url_json);
	let cursos = ParseJson(json_file);
   	
   	const container = $(id_container);   	
	if (container) {
	   	container.innerHTML = "";
	
	    cursos.forEach(curso => {
	        container.innerHTML += renderCurso(curso);
	    });
	}
}

export async function CargarPagina(url_json, id_container = "renderer"){
	let json_file = await FetchDataAsync(url_json);
	let cursos = ParseJson(json_file);
   	
   	const container = $(id_container);
	if (container) {
	   	const numCurso = parseInt(container.className);
		let cursos_filtrados = cursos.filter((c) => { return c.n == numCurso });
		if (cursos_filtrados.length > 0) {
		        container.innerHTML = "";
		        container.innerHTML += renderPagina(cursos_filtrados[0]);
	   	}
	}
}

class Curso {
	constructor(n, inscripcion, modalidad, titulo, subtitulo, docente, flyer_inicio, inicio, fin, flyer_horario, horario, flyer_imagen, programa, carga, arancel, url_pagina, link_inscripcion, presentacion) {
		this.n = parseInt(n);
		this.inscripcion = inscripcion;
		this.modalidad = modalidad;
		this.titulo = titulo;
		this.subtitulo = subtitulo;
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
		this.url = url_pagina;
		this.link_inscripcion = link_inscripcion;
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
            item = new Curso(e.n, e.inscripcion, e.modalidad, e.titulo, e.subtitulo, e.docente, e.flyer_inicio, e.inicio, e.fin, e.flyer_horario, e.horario, e.flyer_imagen, e.programa, e.carga, e.arancel, e.url_pagina, e.link_inscripcion, e.presentacion);
            items.push(item);
    });
    return items;
}


function renderCurso(curso) {
	console.log(curso);
    const modalidad = curso.modalidad.charAt(0).toUpperCase() + curso.modalidad.slice(1);
    const isOpen = curso.inscripcion == "abierta";
	
    return `
        <div class="flyer_container" style="background-image: url('${curso.flyer_imagen}');">
            <div class="marco">&nbsp;</div>

	    <div class="status-stripe ${isOpen ? 'open' : 'closed'}">
                <span class="status-text">${isOpen ? 'Inscripción<br>Abierta' : 'Inscripción<br>Cerrada'}</span>
            </div>

            <div class="content-container">
                <div class="banner-img-container">
                    <img src="https://seube.filo.uba.ar/sites/seube.filo.uba.ar/files/banner-humanidades.jpg" alt="Humanidades en Curso" />
                </div>
                
                <a class="info_overlay" href="${curso.url}" target="_blank" rel="noopener noreferrer">
                    <p>+INFO</p>
                </a>
                
                <p class="titulo_flyer">${curso.titulo}</p>
                ${curso.subtitulo ? `<p class="subtitulo_flyer">${curso.subtitulo}</p>` : ''}
                <p class="docente_flyer">${curso.docente}</p>
                <div class="detalle_flyer_container">
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


function renderPagina(curso) {
    const modalidad = curso.modalidad.charAt(0).toUpperCase() + curso.modalidad.slice(1);
    const isOpen = curso.inscripcion.toLowerCase() == "abierta";
    const inscription_btn = isOpen
	  ? `
	      <p><a class="inscr_btn" href="${curso.link_inscripcion}" target="_blank">Inscribirse</a></p>
	    `
	  : `
	      <p class="closed_msg">Inscripción Cerrada</p>
	    `;
	
    return `
        <div class="course_heading ${curso.inscripcion.toLowerCase()}">
            <div class="title-container">
                <p class="course_info">Curso N°${curso.n}<span class="course_info_slash">|</span> INSCRIPCIÓN ${curso.inscripcion.toUpperCase()}</p>
                <p class="course_title">${curso.titulo}</p>
		<p class="course_subtitle">${curso.subtitulo}</p>
            </div>
        </div>
        
        <div class="course_content">
        
            <div class="left_column">
                <div class="fieldtag">
                    <div class="course_number">CURSO Nº${curso.n}</div>
                </div>
            
                <div class="fieldtag">
                    <div class="fieldtitle">DOCENTE</div>
                    <div class="fieldcontent">${curso.docente}</div>
                </div>
                
                <div class="fieldtag">
                    <div class="fieldtitle">FECHA DE INICIO</div>
                    <div class="fieldcontent">${curso.inicio}</div>
                </div>
                
                <div class="fieldtag">
                    <div class="fieldtitle">FECHA DE FINALIZACIÓN</div>
                    <div class="fieldcontent">${curso.fin}</div>
                </div>
                
                <div class="fieldtag">
                    <div class="fieldtitle">MODALIDAD</div>
                    <div class="fieldcontent">${modalidad}</div>
                </div>
                                
                <div class="fieldtag">
                    <div class="fieldtitle">DÍA Y HORARIO</div>
                    <div class="fieldcontent">${curso.horario}</div>
                </div>
                
                <div class="fieldtag">
                    <div class="fieldtitle">PROGRAMA</div>
                    <div class="fieldcontent">
                        <img src="/sites/seube.filo.uba.ar/files/u4/thumb_PDF.png" alt="PDF" width="25" height="25">
                        &nbsp; 
                        <a style="color: #d00e0b;" href="${curso.programa}" target="_blank">Programa</a>
                    </div>
                </div>
                
                <div class="fieldtag">
                    <div class="fieldtitle">CARGA HORARIA</div>
                    <div class="fieldcontent">${curso.carga}</div>
                </div>
                
                <div class="fieldtag">
                    <div class="fieldtitle">ARANCEL</div>
                    <div class="fieldcontent">${curso.arancel}</div>
                </div>
            </div>
                
            <div class="right_column">
                <div class="fieldtag">
                    <div class="fieldtitle field16">PRESENTACIÓN</div>
                    <div class="presentation">${curso.presentacion}</div>
                </div>
		<div class="btn_container">
  		${inscription_btn}
    		</div>
		
            </div>
        </div>
    `;
}
