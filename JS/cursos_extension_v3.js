const YEAR = new Date().getFullYear();


export async function CargarCursos(url_json, id_container = "bloque_cursos"){
	let json_file = await FetchDataAsync(url_json);
	let cursos = ParseJson(json_file);
	
	CreateFilterInscripcion(id_container);
	CreateFilterModalidad(id_container);
	
	cursos.forEach(curso => {
		DrawCourse(curso, id_container);
   	});
}

class Curso {
	constructor(n, inscripcion, modalidad, titulo, docente, inicio, fin, horario, link, presentacion) {
		this.n = parseInt(n);
		this.inscripcion = inscripcion;
		this.modalidad = modalidad;
		this.titulo = titulo;
		this.docente = docente;
		this.inicio = inicio;
		this.fin = fin;
		this.horario = horario;
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
            item = new Curso(e.n, e.inscripcion, e.modalidad, e.titulo, e.docente, e.inicio, e.fin, e.horario, e.link, e.presentacion);
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
	
	CreateParagraphInnerHTML("course_info", `${curso.n}<span class='course_info_slash'>|</span> ${curso.getStatus(YEAR)}`, div_title);
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
	
	CreateField(leftCol, "", "CURSO Nº"+curso.n, false, "course_number");
	CreateField(leftCol, "DOCENTE", curso.docente);
	CreateField(leftCol, "FECHA DE INICIO", curso.inicio);
	CreateField(leftCol, "FECHA DE FINALIZACIÓN", curso.fin);
	CreateField(leftCol, "DÍA Y HORARIO", curso.horario);
	CreateField(leftCol, "ARANCEL", "Gratuito");
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

function CreateFilterInscripcion(id_container){
	let filter_div = document.createElement("div");
	filter_div.className = "filter_container";
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
	
	$(id_container).appendChild(filter_div);
}

function CreateFilterModalidad(id_container){
	let filter_div = document.createElement("div");
	filter_div.className = "filter_container";
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
	
	$(id_container).appendChild(filter_div);
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



