/*
JS EMPLEADO EN
https://seube.filo.uba.ar/humanidades-en-curso-cursos-de-extensi%C3%B3n-primer-cuatrimestre-2025

MEDIANTE HOJA https://docs.google.com/spreadsheets/d/1a2XMnq8PCqOA3C10dPnvP4H_UMv3HI1XWXi2LX6Paf0
*/

const YEAR = new Date().getFullYear();

export async function CargarCursos(id_container = "bloque_cursos"){
	const SHEET_ID = "1a2XMnq8PCqOA3C10dPnvP4H_UMv3HI1XWXi2LX6Paf0";
	const container = $(id_container);
	if (container) {
	   	const sheetName = container.className;
		const RANGE = sheetName + "!A1:Z200";
		console.log(RANGE);
		let data = await FetchDataAsync(SHEET_ID, RANGE);
		let cursos = ParseData(data);
		
		CreateFilters(id_container);
		
		cursos.forEach(curso => {
			DrawCourse(curso, id_container);
		});
	}
}

class Curso {
	constructor(n, inscripcion, modalidad, titulo, docente, inicio, fin, horario, programa, carga, arancel, link, presentacion) {
		this.n = parseInt(n);
		this.inscripcion = inscripcion;
		this.modalidad = modalidad;
		this.titulo = titulo;
		this.docente = docente;
		this.inicio = inicio;
		this.fin = fin;
		this.horario = horario;
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


async function FetchDataAsync(SHEET_ID, RANGE) {
	const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=AIzaSyBBoP_GWjNK5YCtGXg4GojI_PjTeyGH-eM`)
	.then((res) => res.json())
	.then((data) => {
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
            item = new Curso(e.n, e.inscripcion, e.modalidad, e.titulo, e.docente, e.inicio, e.fin, e.horario, e.programa, e.carga, e.arancel, e.link, e.presentacion);
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
	} else if (curso.modalidad == "presencial") {
		header_div.className = "course_heading presencial";
	} else {
		header_div.className = "course_heading virtual";
	}

	header_div.addEventListener('click', (e) => {
		Deploy(idCurso, idImg);
    	});

	let div_title = document.createElement("div");
	div_title.className = "title-container";
	
	CreateParagraphInnerHTML("course_info", `Curso N°${curso.n}<span class='course_info_slash'>|</span> ${curso.getStatus(YEAR)}`, div_title);
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
	let idCurso = 'curso' +curso.n;

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
	
	CreateField(leftCol, "", "CURSO Nº"+curso.n, false, "course_number");
	CreateField(leftCol, "DOCENTE", curso.docente);
	CreateField(leftCol, "FECHA DE INICIO", curso.inicio);
	CreateField(leftCol, "FECHA DE FINALIZACIÓN", curso.fin);
	CreateField(leftCol, "DÍA Y HORARIO", curso.horario);
	CreateField(leftCol, "PROGRAMA", programa);
	CreateField(leftCol, "CARGA HORARIA", curso.carga);
	CreateField(leftCol, "ARANCEL", curso.arancel);
	parent.appendChild(leftCol);
}


function BuildRightColumn(parent, curso){
	let rightCol = document.createElement("div");
	rightCol.className = "right_column";
	
	CreateField(rightCol, "PRESENTACIÓN", curso.presentacion, true, "presentation", "fieldtitle field16");
	CreateButton(rightCol, curso.link);
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


function CreateFilters(id_container){
	let filter_div = document.createElement("div");
	filter_div.setAttribute("id", "filter_div");
	filter_div.className = "filter_container_2";
	$(id_container).appendChild(filter_div);
	
	CreateFilterInscripcion(id_container);
	CreateFilterModalidad(id_container);
}


function CreateFilterInscripcion(id_container){
	let filter_div = document.createElement("div");
	filter_div.className = "filter_inscripcion";
	
	CreateParagraph("filter_lbl", "Estado de Inscripción", filter_div);
	
	let filter_select = document.createElement("select");
	filter_select.className = "filter_select";
	filter_select.setAttribute("id", "filtro_cursos");
	filter_select.addEventListener("change", ApplyFilterInscripcion);

	let option1 = document.createElement("option");
	option1.setAttribute("selected", "selected");
	option1.setAttribute("value", "All");
	option1.appendChild(document.createTextNode("- Cualquiera -"));
	filter_select.appendChild(option1);
	
	let option2 = document.createElement("option");
	option2.setAttribute("value", "0");
	option2.appendChild(document.createTextNode("Abierta"));
	filter_select.appendChild(option2);
	
	let option3 = document.createElement("option");
	option3.setAttribute("value", "1");
	option3.appendChild(document.createTextNode("Cerrada"));
	filter_select.appendChild(option3);
	
	filter_div.appendChild(filter_select);
    $("filter_div").appendChild(filter_div);
}

function CreateFilterModalidad(id_container){
	let filter_div = document.createElement("div");
	filter_div.className = "filter_modalidad";
	
	CreateParagraph("filter_lbl", "Modalidad del curso", filter_div);
	
	let filter_select = document.createElement("select");
	filter_select.className = "filter_select";
	filter_select.setAttribute("id", "filtro_modalidad");
	filter_select.addEventListener("change", ApplyFilterModalidad);

	let option1 = document.createElement("option");
	option1.setAttribute("selected", "selected");
	option1.setAttribute("value", "All");
	option1.appendChild(document.createTextNode("- Cualquiera -"));
	filter_select.appendChild(option1);
	
	let option2 = document.createElement("option");
	option2.setAttribute("value", "0");
	option2.appendChild(document.createTextNode("Presencial"));
	filter_select.appendChild(option2);
	
	let option3 = document.createElement("option");
	option3.setAttribute("value", "1");
	option3.appendChild(document.createTextNode("Virtual"));
	filter_select.appendChild(option3);
	
	filter_div.appendChild(filter_select);
    $("filter_div").appendChild(filter_div);
}

function ApplyFilterInscripcion(){
    ClearFilter();
    if ($("filtro_cursos").value == "0"){
        Filter(FilterCerrada);
    } else if  ($("filtro_cursos").value == "1") {
        Filter(FilterAbierta);
    }
}

function ApplyFilterModalidad(){
    ClearFilter();
    if ($("filtro_modalidad").value == "0"){
        Filter(FilterVirtual);
    } else if  ($("filtro_modalidad").value == "1") {
        Filter(FilterPresencial);
    }
}

function Filter(ValidationFunc){
    const headers = document.getElementsByClassName('course_heading');
    for (let i = 0; i < headers.length; i++) {
        let element = headers[i];
        if (ValidationFunc(element)) {
            element.classList.add("hidden");
        }
    }
}

function ClearFilter(){
    const headers = document.getElementsByClassName('course_heading');
    for (let i = 0; i < headers.length; i++) {
        let element = headers[i];
        element.classList.remove("hidden");
    }
}

function FilterAbierta(element){
    return !element.classList.contains("cerrada");
}

function FilterCerrada(element){
    return element.classList.contains("cerrada")
}

function FilterPresencial(element){
    return element.classList.contains("presencial");
}

function FilterVirtual(element){
    return element.classList.contains("virtual")
}
