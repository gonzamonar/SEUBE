/*
JS EMPLEADO EN https://seube.filo.uba.ar/cursos-de-equipos-y-programas

MEDIANTE HOJA https://docs.google.com/spreadsheets/d/1LetNREjwvCX7j4k91MZ-XxGNCuXed_HZ_YpV8CBuhzs
*/

export async function CargarCursos(id_container="bloque_cursos"){
	const SHEET_ID = "1LetNREjwvCX7j4k91MZ-XxGNCuXed_HZ_YpV8CBuhzs";
	const RANGE = "Listado!A1:Z100";
	let data = await FetchDataAsync(SHEET_ID, RANGE);
	console.log(data);
	let cursos = ParseData(data);
	console.log(cursos);
	
	cursos.forEach(curso => {
		if (curso.visible == "SI") {
			DrawCourse(curso, id_container);
		}
   	});
}


class Curso {
	constructor(n, visible, asignatura, inscripcion, titulo, fecha_inscripcion, duracion, cursada, docentes, equipo_docente, lugar, destinatarios, modalidad, programa, presentacion, link) {
		this.n = parseInt(n);
		this.visible = visible;
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
		this.link = link;
	}
}


async function FetchDataAsync(SHEET_ID, RANGE) {
	const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=AIzaSyBBoP_GWjNK5YCtGXg4GojI_PjTeyGH-eM`)
	.then((res) => res.json())
	.then((data) => {
		console.log(data);
		const [headers, ...rows] = data.values;
		const parsed = rows.map(row =>
			Object.fromEntries(headers.map((key, i) => [key, row[i] || ""]))
		);
		return parsed;
	});
    return response;
}


function $(id){
	return document.getElementById(id);
}


function ToggleClass(element, classname){
	if(element != null) {
		element.classList.toggle(classname);
	}
}


function ParseData(data){
    let items = [];
    data.forEach(e => {
            let item;
            item = new Curso(e.n, e.visible, e.asignatura, e.inscripcion, e.titulo, e.fecha_inscripcion, e.duracion, e.cursada, e.docentes, e.equipo_docente, e.lugar, e.destinatarios, e.modalidad, e.programa, e.presentacion, e.link);
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
	if (curso.inscripcion == "cerrada"){
		header_div.className = "course_heading cerrada";
	} else {
		header_div.className = "course_heading";
	}
	
	header_div.addEventListener('click', (e) => {
		Deploy(idCurso, idImg);
    	});

	let div_title = document.createElement("div");
	div_title.className = "title-container";
	
	CreateParagraphInnerHTML("course_info", `${curso.asignatura}<span class='course_info_slash'>|</span>INSCRIPCIÓN ${curso.inscripcion.toUpperCase()}`, div_title);
	CreateParagraph("course_title", curso.titulo, div_title);
	header_div.appendChild(div_title);
	
	let plus_img = document.createElement("img");
	plus_img.setAttribute("id", idImg);
	plus_img.setAttribute("draggable", false);
	plus_img.className = "img_plus deploy";
	
	let div_img = document.createElement("div");
	div_img.className = "plus-container";
	div_img.appendChild(plus_img);
	header_div.appendChild(div_img);
	
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

	if (curso.fecha_inscripcion != null && curso.fecha_inscripcion != "-") {
		CreateField(leftCol, "FECHA DE INSCRIPCIÓN", curso.fecha_inscripcion);
	}
	CreateField(leftCol, "DURACIÓN", curso.duracion);
	CreateField(leftCol, "CURSADA", curso.cursada);
	CreateField(leftCol, "DOCENTES", curso.docentes);
	if (curso.equipo_docente != null && curso.equipo_docente != "-") {
		CreateField(leftCol, "EQUIPO DOCENTE", curso.equipo_docente);
	}
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
	CreateButton(rightCol, curso.link);
	parent.appendChild(rightCol);
}


function CreateButton(parent, link, tag="Inscribirse"){
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
