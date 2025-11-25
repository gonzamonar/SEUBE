/*
JS EMPLEADO EN https://seube.filo.uba.ar/pst-oferta-vigente

MEDIANTE HOJA https://docs.google.com/spreadsheets/d/1X3EA0-5fpj79XQbUd4PRq10ufU8mKpW-C-uCbXo_3R8/
*/

export async function CargarCursos(id_container="bloque_cursos"){
  const container = $(id_container);   	
	if (container) {
		const SHEET_ID = "1X3EA0-5fpj79XQbUd4PRq10ufU8mKpW-C-uCbXo_3R8";
		const sheetName = container.className;
		const RANGE = sheetName + "!A1:Z200";
		let data = await FetchDataAsync(SHEET_ID, RANGE);
		let cursos = ParseData(data);
		container.innerHTML = "";
	    	cursos.forEach(curso => {
  		    if (curso.visible == "SI") {
    			  DrawCourse(curso, id_container);
  		    }
        });
	}	
}

class Curso {
	constructor(n, visible, inscripcion, titulo, fecha_inscripcion, cursada, lugar, docentes, equipo_docente, programa, carreras, presentacion) {
		this.n = parseInt(n);
    this.visible = visible;
    this.inscripcion = inscripcion;
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
            item = new Curso(e.n, e.visible, e.titulo, e.fecha_inscripcion, e.cursada, e.lugar, e.docentes, e.equipo_docente, e.programa, e.carreras, e.presentacion);
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
	
	CreateField(leftCol, "FECHA DE INSCRIPCIÓN", curso.fecha_inscripcion);
	CreateField(leftCol, "CURSADA", curso.cursada);
	CreateField(leftCol, "LUGAR", curso.lugar);
	CreateField(leftCol, "DOCENTES", curso.docentes);
	CreateField(leftCol, "EQUIPO DOCENTE COLABORADOR", curso.equipo_docente);
	CreateField(leftCol, "PROGRAMA", programa);
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


function Deploy(id_curso, id_img) {
	ToggleClass($(id_curso), "hidden");
	ToggleClass($(id_img), "deploy");
	ToggleClass($(id_img), "reploy");
}
