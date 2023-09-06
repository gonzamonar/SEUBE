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
}


async function FetchDataAsync(url) {
    const response = await fetch(url);
    let jsonArray = await response.json();
    return jsonArray;
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


function $(id){
    return document.getElementById(id);
}


async function InitCourses(){
	let json_file = await FetchDataAsync('https://gonzamonar.github.io/SEUBE/cursos.json');
	let cursos = ParseJson(json_file);
    	cursos.forEach(curso => {
        		DrawHeader(curso);
   	});
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

	header_div.addEventListener("mouseOver", transpIn);
	header_div.addEventListener("mouseOut", transpOut);

	let slash_div = document.createElement("div");
	CreateParagraph("course_info", "CURSO Nº"+curso.n, slash_div);
	CreateParagraph("course_info_slash", "|", slash_div);
	CreateParagraph("course_info", curso.getStatus("2023"), slash_div);
	header_div.appendChild(slash_div);

	CreateParagraph("course_title", curso.titulo, header_div);
	
	let plus_img = document.createElement("img");
	plus_img.setAttribute("id", idPlus);
	plus_img.className = "fixed";
	plus_img.style = "top: "+ curso.top + ";";

	$("courseBlock").appendChild(header_div);
}

function CreateParagraph(classname, textNode, parent){
	let p_element = document.createElement("p");
	p_element.className = classname;
	p_element.appendChild(document.createTextNode(textNode));
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


function mouseOver(x) {
	x.style.backgroundColor = "#7aba53";
	x.style.border = "2px solid #7aba53";
}

function mouseOut(x) {
	x.style.backgroundColor = "#A37B75";
	x.style.border = "2px solid #A37B75";
}

function transpIn(item, opacity="0.82") {
	item.style.cursor = "pointer";
	item.style.opacity = opacity;
}

function transpOut(item) {
	item.style.opacity = "1";
}

const fixed_items = document.getElementsByClassName('img_plus');
for (let i = 0; i < fixed_items.length; i++) {
	let item = fixed_items[i];  
	item.ondragstart = function() { return false; };
}

InitCourses();
