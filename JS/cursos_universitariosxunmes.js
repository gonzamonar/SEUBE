/*
JS EMPLEADO EN
https://seube.filo.uba.ar/universitarios-por-un-mes

MEDIANTE HOJA https://docs.google.com/spreadsheets/d/1TVQyNkzs4rjrWu1Hcu5WSmL-a-DARj2zHuKtoYqSd5E
*/

export async function CargarCursos(id_container = "bloque_cursos"){   	
   	const container = $(id_container);
	console.log(container);
	if (container) {
		const SHEET_ID = "1TVQyNkzs4rjrWu1Hcu5WSmL-a-DARj2zHuKtoYqSd5E";
		const sheetName = container.className;
		const RANGE = sheetName + "!A1:Z200";
		let data = await FetchDataAsync(SHEET_ID, RANGE);
		console.log(data);
		let cursos = ParseData(data);
		console.log(cursos);
		container.innerHTML = "";
	    	cursos.forEach(curso => {
                if (curso.visible == "SI") {
                    container.innerHTML += renderCurso(curso);
                }
	    	});
	}
}

class Curso {
	constructor(n, visible, carrera, carrera_tabla, titulo, aula, fecha, horario, link, presentacion, programa) {
		this.n = parseInt(n);
		this.visible = visible;
		this.carrera = carrera;
		this.carrera_tabla = carrera_tabla;
		this.titulo = titulo;
		this.aula = aula;
		this.fecha = fecha;
		this.horario = horario;
		this.link = link;
		this.presentacion = presentacion;
		this.programa = programa;
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
        item = new Curso(e.n, e.visible, e.carrera, e.carrera_tabla, e.titulo, e.aula, e.fecha, e.horario, e.link, e.presentacion, e.programa);
        items.push(item);
    });
    return items;
}

function renderCurso(curso) {
    return `
        <h2 class="selector" onclick="select('${curso.n}', this);">
            <strong>${curso.carrera}</strong> | ${curso.titulo}
        </h2>
        <div id="${curso.n}" class="selectable">
        <table>
            <tbody>
            <tr>
                <th>Carrera</th>
                <th>Aula</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Inscripción</th>
            </tr>
            <tr>
                <td>${curso.carrera}</td>
                <td>${curso.aula}</td>
                <td>${curso.fecha}</td>
                <td>${curso.horario}</td>
                <td><a href="${curso.link}" target="_blank">LINK</a></td>
            </tr>
            <tr>
                <td class="td-presentacion" colspan="5">
                <span class="title-presentacion">
                    Presentación
                </span>
                <br />
                <td>${curso.presentacion}</td>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    `;
}

function select(id, selector) {
    unselectAll();
    deactivateSelectors();
    selector.classList.add("active");
    $(id).classList.add("selected");
}

function unselectAll(){
    const elements = document.getElementsByClassName("selectable");
    elements.forEach((e) => {
        e.classList.remove("selected");
    })
}

function deactivateSelectors(){
    const elements = document.getElementsByClassName("selector");
    elements.forEach((e) => {
        e.classList.remove("active");
    })
}

