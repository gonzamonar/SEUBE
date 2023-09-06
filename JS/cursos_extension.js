import { appendCSS } from "https://gonzamonar.github.io/SEUBE/JS/Export/appendCSS.js";

appendCSS("https://gonzamonar.github.io/SEUBE/CSS/cursos_extension.css");


class Curso {
	constructor(n, inscripcion, modalidad, titulo, top, altura, area, docente, inicio, fin, horario, link, presentacion) {
		this.n = parseInt(n);
		this.inscripcion = inscripcion == undefined ? "abierta" : inscripcion ;
		this.modalidad = modalidad;
		this.titulo = titulo;
		this.top = top;
		this.altura = altura;
		this.area = area;
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

	getTop(){
		let brCount = ((this.titulo.match(new RegExp("<br", "g")) || []).length);
		let top = "30.5px";
		switch(brCount){
			case 1:
				top = "44.5px";
				break;
			case 2:
				top = "60.5px";
				break;
		}
		return top;
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
            item = new Curso(e.n, e.inscripcion, e.modalidad, e.titulo, e.top, e.altura, e.area, e.docente, e.inicio, e.fin, e.horario, e.link, e.presentacion);
            items.push(item);
    });
    return items;
}


async function InitCourses(){
	let json_file = await FetchDataAsync('https://gonzamonar.github.io/SEUBE/cursos.json');
	let cursos = ParseJson(json_file);
    	cursos.forEach(curso => {
		DrawCourse(curso);
   	});
}


function DrawCourse(curso){
	let header = DrawHeader(curso);
	let body = DrawBody(curso);
	
	$("courseBlock").appendChild(header);
	$("courseBlock").appendChild(body);
}


function DrawHeader(curso){
	let idCurso = 'curso' +curso.n;
	let idPlus = 'plus' +curso.n;

	let header_div = document.createElement("div");
	if (curso.inscripcion == "cerrada"){
		header_div.className = "course_heading cerrada";
	} else if (curso.modalidad == "presencial") {
		header_div.className = "course_heading presencial";
	} else {
		header_div.className = "course_heading virtual";
	}

	header_div.addEventListener("mouseover", transpIn);
	header_div.addEventListener("mouseout", transpOut);

	let slash_div = document.createElement("div");
	CreateParagraph("course_info", "CURSO Nº"+curso.n, slash_div);
	CreateParagraph("course_info_slash", "|", slash_div);
	CreateParagraph("course_info", curso.getStatus("2023"), slash_div);
	header_div.appendChild(slash_div);

	CreateParagraphInnerHTML("course_title", curso.titulo, header_div);
	
	let plus_img = document.createElement("img");
	plus_img.setAttribute("id", idPlus);
	plus_img.className = "img_plus deploy";
	plus_img.style = "top: "+ curso.getTop() + ";";
	header_div.appendChild(plus_img);
	
	return header_div;
}


function DrawBody(curso){
	let idCurso = 'curso' +curso.n;

	let body_div = document.createElement("div");
	body_div.setAttribute("id", idCurso);
	body_div.className = "course_content";
	body_div.style.height = curso.altura;
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
	body_div.appendChild(leftCol);
}


function BuildRightColumn(parent, curso){
	let rightCol = document.createElement("div");
	rightCol.className = "right_column";
	
	CreateField(rightCol, "PRESENTACIÓN", curso.presentacion, true, "presentation", "fieldtitle field16");
	CreateButton(rightCol, curso.link);
	
	body_div.appendChild(rightCol);
}


function CreateButton(parent, link="http://seube.filo.uba.ar/inscribite", tag="Inscribirse"){
	let btn_div = document.createElement("div");
	btn_div.className = "btn_container";
		
	let btn_p = document.createElement("p");
	
	
	let btn_a = document.createElement("p");
	btn_a.className = "inscr_btn";
	body_div.setAttribute("href", link);
	body_div.setAttribute("target", "_blank");

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


function desplegar(a,b) {
        view=$(a).style.display;

        if (view=='none') {
            view='block';
            source='/sites/seube.filo.uba.ar/files/Signo%20-%2028-B%20Bold.jpg';
        } else {
            view='none';
            source='/sites/seube.filo.uba.ar/files/Signo%20%2B%2028.jpg';
        }
        $(a).style.display = view;
        $(b).src = source;
}


function mouseOver(item) {
	item.style.backgroundColor = "#7aba53";
	item.style.border = "2px solid #7aba53";
}


function mouseOut(item) {
	item.style.backgroundColor = "#A37B75";
	item.style.border = "2px solid #A37B75";
}


function transpIn(e, opacity = "0.82") {
	e.currentTarget.style.cursor = "pointer";
	e.currentTarget.style.opacity = opacity;
}


function transpOut(e) {
	e.currentTarget.style.opacity = "1";
}


const fixed_items = document.getElementsByClassName('img_plus');
for (let i = 0; i < fixed_items.length; i++) {
	let item = fixed_items[i];  
	item.ondragstart = function() { return false; };
}

InitCourses();
