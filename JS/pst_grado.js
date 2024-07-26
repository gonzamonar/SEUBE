const YEAR = new Date().getFullYear();


export async function CargarCursos(url_json, id_container="bloque_cursos"){
	let json_file = await FetchDataAsync(url_json);
	let cursos = ParseJson(json_file);
	console.log(cursos);
	
    	cursos.forEach(curso => {
		DrawCourse(curso, id_container);
   	});
}

class Curso {
	constructor(n, titulo, fecha_inscripcion, cursada, lugar, docentes, equipo_docente, programa, carreras, presentacion) {
		this.n = parseInt(n);
		this.titulo = titulo;
		this.fecha_inscripcion = fecha_inscripcion;
		this.cursada = cursada;
		this.lugar = lugar;
		this.docentes = docentes;
		this.equipo_docente = equipo_docente;
		this.programa = programa;
		this.carreras = carreras;
		this.presentacion = presentacion;
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
            item = new Curso(e.n, e.titulo, e.fecha_inscripcion, e.cursada, e.lugar, e.docentes, e.equipo_docente, e.programa, e.carreras, e.presentacion);
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

	CreateParagraph("course_title", curso.titulo, header_div);
	
	let plus_img = document.createElement("img");
	plus_img.setAttribute("id", idImg);
	plus_img.setAttribute("draggable", false);
	plus_img.className = "img_plus deploy";
	header_div.appendChild(plus_img);
	
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
	
	CreateField(leftCol, "FECHA DE INSCRIPCIÓN", curso.fecha_inscripcion);
	CreateField(leftCol, "CURSADA", curso.cursada);
	CreateField(leftCol, "LUGAR", curso.lugar);
	CreateField(leftCol, "DOCENTES", curso.docentes);
	CreateField(leftCol, "EQUIPO DOCENTE COLABORADOR", curso.equipo_docente);
	CreateField(leftCol, "PROGRAMA", curso.programa);
	CreateField(leftCol, "CARRERAS", curso.carreras);
	
	parent.appendChild(leftCol);
}


function BuildRightColumn(parent, curso){
	let rightCol = document.createElement("div");
	rightCol.className = "right_column";
	
	CreateField(rightCol, "PRESENTACIÓN", curso.presentacion, true, "presentation", "fieldtitle field16");
	parent.appendChild(rightCol);
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


function CreateParagraphInnerHTML(classname, textNode, parent){
	let p_element = document.createElement("p");
	p_element.className = classname;
	p_element.innerHTML = textNode;
	parent.appendChild(p_element);
}



function Deploy(id_curso, id_img) {
	ToggleClass($(id_curso), "hidden");
	ToggleClass($(id_img), "deploy");
	ToggleClass($(id_img), "reploy");
}





