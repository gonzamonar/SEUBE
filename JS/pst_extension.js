
export async function CargarCursos(url_json, id_container="bloque_cursos"){
	let json_file = await FetchDataAsync(url_json);
	let cursos = ParseJson(json_file);
	
    	cursos.forEach(curso => {
		DrawCourse(curso, id_container);
   	});
}


class Curso {
	constructor(n, asignatura, inscripcion, titulo, fecha_inscripcion, duracion, cursada, docentes, equipo_docente, lugar, destinatarios, modalidad, programa, presentacion, link_inscripcion) {
		this.n = parseInt(n);
		this.asignatura = asignatura;
		this.inscripcion = inscripcion;
		this.titulo = titulo;
		this.fecha_inscripcion = fecha_inscripcion;
		this.duracion = duracion;
		this.cursada = cursada;
		this.docentes = docentes;
		this.equipo_docente = equipo_docente;
		this.lugar = lugar;
		this.destinatarios = destinatarios;
		this.modalidad = modalidad;
		this.programa = programa;
		this.presentacion = presentacion;
		this.link_inscripcion = link_inscripcion;
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
            item = new Curso(e.n, e.asignatura, e.inscripcion, e.titulo, e.fecha_inscripcion, e.duracion, e.cursada, e.docentes, e.equipo_docente, e.lugar, e.destinatarios, e.modalidad, e.programa, e.presentacion, e.link_inscripcion);
            items.push(item);
    });
    return items;
}


function DrawCourse(curso, id_container){
	let header = DrawHeader(curso);
	let body = DrawBody(curso);
	
	$(id_container).appendChild(header);
	$(id_container).appendChild(body);
}

function DrawHeader(curso){
	let idCurso = 'curso' +curso.n;
	let idImg = 'plus' +curso.n;

	let header_div = document.createElement("div");
	header_div.className = "course_heading";

	header_div.addEventListener('click', (e) => {
		Deploy(idCurso, idImg);
    	});

	let div_title = document.createElement("div");
	div_title.className = "title-container";
	
	CreateParagraph("course_info", `${curso.asignatura}<span class='course_info_slash'>|</span>${curso.inscripcion.toUpperCase()}`, div_title);
	CreateParagraph("course_title", curso.titulo, div_title);
	header_div.appendChild(div_title);
	
	let plus_img = document.createElement("img");
	plus_img.setAttribute("id", idImg);
	plus_img.setAttribute("draggable", false);
	plus_img.className = "img_plus deploy";
	
	let div_img = document.createElement("div");
	div_img.className = "plus-container";
	div_img.appendChild(plus_img);
	div_title.appendChild(div_img);
	
	header_div.appendChild(div_title);
	
	return header_div;
}


function DrawBody(curso){
	let idCurso = 'curso' + curso.n;

	let body_div = document.createElement("div");
	body_div.setAttribute("id", idCurso);
	body_div.className = "course_content hidden";
	BuildLeftColumn(body_div, curso);
	BuildRightColumn(body_div, curso);
	
	return body_div;
}



function BuildLeftColumn(parent, curso){
	let leftCol = document.createElement("div");
	leftCol.className = "left_column";

	let programa = `<img src="/sites/seube.filo.uba.ar/files/u4/thumb_PDF.png" alt="PDF"
		width="25" height="25" />&nbsp; <a style="color: #d00e0b;"
		href="${curso.programa}" target="_blank">Programa</a>`;
		
	CreateField(leftCol, "FECHA DE INSCRIPCIÓN", curso.fecha_inscripcion);
	CreateField(leftCol, "DURACIÓN", curso.duracion);
	CreateField(leftCol, "CURSADA", curso.cursada);
	CreateField(leftCol, "DOCENTES", curso.docentes);
	CreateField(leftCol, "EQUIPO DOCENTE", curso.equipo_docente);
	CreateField(leftCol, "LUGAR", curso.lugar);
	CreateField(leftCol, "DESTINATARIOS", curso.destinatarios);
	CreateField(leftCol, "MODALIDAD", curso.modalidad);
    CreateField(leftCol, "PROGRAMA", programa);
	
	parent.appendChild(leftCol);
}


function BuildRightColumn(parent, curso){
	let rightCol = document.createElement("div");
	rightCol.className = "right_column";
	
	CreateField(rightCol, "PRESENTACIÓN", curso.presentacion, true, "presentation", "fieldtitle field16");
	CreateButton(rightCol, curso.link_inscripcion);
	parent.appendChild(rightCol);
}


function CreateButton(parent, link="http://seube.filo.uba.ar/inscribite", tag="Inscribirse"){
	let btn_div = document.createElement("div");
	btn_div.className = "btn_container";
		
	let btn_p = document.createElement("p");
	btn_div.appendChild(btn_p);
	
	let btn_a = document.createElement("a");
	btn_a.className = "inscr_btn";
	btn_a.setAttribute("href", link);
	btn_a.setAttribute("target", "_blank");
	btn_a.appendChild(document.createTextNode(tag));
	btn_p.appendChild(btn_a);

	parent.appendChild(btn_div);
}


function CreateField(parent, fieldtitle, fieldcontent, hastitle=true, contentClass="fieldcontent", titleClass="fieldtitle"){
	let field_div = document.createElement("div");
	field_div.className = "fieldtag";

	if (hastitle){
		let fieldtitle_div = document.createElement("div");
		fieldtitle_div.className = titleClass;
		fieldtitle_div.appendChild(document.createTextNode(fieldtitle));
		field_div.appendChild(fieldtitle_div);
	}
	
	let fieldcontent_div = document.createElement("div");
	fieldcontent_div.className = contentClass;
	fieldcontent_div.innerHTML = fieldcontent;
	field_div.appendChild(fieldcontent_div);
	
	parent.appendChild(field_div);
}


function CreateParagraph(classname, textNode, parent){
	let p_element = document.createElement("p");
	p_element.className = classname;
	p_element.appendChild(document.createTextNode(textNode));
	parent.appendChild(p_element);
}


function Deploy(id_curso, id_img) {
	ToggleClass($(id_curso), "hidden");
	ToggleClass($(id_img), "deploy");
	ToggleClass($(id_img), "reploy");
}


