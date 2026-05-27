export async function CargarTrayectos(id_container = "bloque_trayecto"){   	
   	const container = $(id_container);   	
	if (container) {
		loadTrayecto(container);
	}
}

function $(id){
	return document.getElementById(id);
}

async function loadTrayecto(container) {
  const sourceId = container.dataset.source;

  // Replace with your actual Google Sheets API fetch
  const SHEET_ID = "18iDq_BQcnNRgVoAw2aGfkOBTpK_fOqNdNBE4U3gJpWw";
  const RANGE = "trayectos!A1:Z200";
  const response = await FetchDataAsync(SHEET_ID, RANGE);
  const data = response.find(r => r.id === sourceId);

  if (!data) {
    container.innerHTML = "<p>No se encontró información.</p>";
    return;
  }

  renderTrayecto(container, data);
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

function renderTrayecto(container, data) {

  const estadoHTML =
    data.estado === "cerrada"
      ? `
        <div class="trayecto-estado cerrado">
          <p>INSCRIPCIÓN CERRADA</p>
        </div>
      `
      : '';

  const seminarTitles = [
    data.sem1_titulo,
    data.sem2_titulo,
    data.sem3_titulo,
    data.sem4_titulo
  ].filter(Boolean);

  const seminarListHTML = seminarTitles
    .map(title => `
      <p class="trayecto-bullet">
        <span>● </span>${title}
      </p>
    `)
    .join("");

  const detailedSeminarsHTML = `
    <section class="trayecto-seminario">

      <h3>
        "${data.sem_activo_titulo}"
      </h3>

      <p class="trayecto-docente">
        Docente: ${data.sem_activo_docente || ""}
      </p>

      <p>
        ${data.sem_activo_desc || ""}
      </p>

    </section>
  `;

  const formularioHTML =
    data.estado === "abierta"
      ? `
        <p>
          Abierta la pre-inscripción en este
          <a
            href="${data.formulario_url}"
            target="_blank">
            formulario
          </a>
        </p>
      `
      : "";

  const duracionSeminario =
	  data.duracion_sem ?
	  	`<p>
	      <strong class="trayecto-label">
	        Duración:
	      </strong>
	
	      ${data.duracion_sem}
    	</p>` : '';
	  

  container.innerHTML = `
  
    ${estadoHTML}

    <p>
      ${data.descripcion}
    </p>

    <p>
      Los seminarios que componen la Cohorte ${data.cohorte} son:
    </p>

    ${seminarListHTML}

	<p>&nbsp;</p>
	
    <p>
      <strong class="trayecto-label">
        Título:
      </strong>

      ${data.titulo}
    </p>

    ${formularioHTML}
	
    <p>
      <img style="color: #404040; font-weight: 400; text-align: start;" src="/sites/seube.filo.uba.ar/files/u4/thumb_PDF.png" alt="PDF" width="20" height="20">&nbsp;<a
        class="trayecto-programa"
        href="${data.programa_url}"
        target="_blank">
        <strong>Programa Completo</strong>
      </a>
    </p>

	<p>&nbsp;</p>

    <p>
      <strong class="trayecto-label">
        Destinatarios:
      </strong>
    </p>

    <p class="trayecto-indented">
      <span class="trayecto-dot">● </span>
      ${data.destinatarios}
    </p>

    <p>
      <strong class="trayecto-label">
        Modalidad de Cursada:
      </strong>
    </p>

    <p class="trayecto-indented">
      <span class="trayecto-dot">● </span>
      ${data.modalidad_1}
    </p>

    <p class="trayecto-indented">
      <span class="trayecto-dot">● </span>
      ${data.modalidad_2}
    </p>

    <p>
      <strong class="trayecto-label">
        Duración:
      </strong>

      ${data.duracion}
    </p>

	${duracionSeminario}

    <p>
      <strong class="trayecto-label">
        Inicio de la cursada:
      </strong>

      ${data.inicio}
    </p>

    <p>
      <strong class="trayecto-label">
        Costo del seminario:
      </strong>

      ${data.costo}
    </p>

    <p>
      <strong class="trayecto-label">
        Email de contacto:
      </strong>
    </p>

    <p class="trayecto-indented">
      <img style="color: #404040;" src="/sites/seube.filo.uba.ar/files/u4/thumb_Communication.png" alt="Email" width="20" height="20">&nbsp;<a
        href="mailto:${data.email}"
        target="_blank">
        <strong>${data.email}</strong>
      </a>
    </p>

    <p class="trayecto-indented">
      <img style="color: #404040;" src="/sites/seube.filo.uba.ar/files/u4/thumb_Communication.png" alt="Email" width="20" height="20">&nbsp;<a
        href="mailto:areaadultosmayores@filo.uba.ar"
        target="_blank">
        <strong>areaadultosmayores@filo.uba.ar</strong>
      </a>
    </p>

    ${
      data.estado === "abierta"
        ? `
		  <p>&nbsp;</p>
          <p>
            Para pre-inscribirte a la cohorte ${data.cohorte} completar este
            <a
              href="${data.formulario_url}"
              target="_blank">
              formulario
            </a>
          </p>
		  <p>&nbsp;</p>
        `
        : ""
    }

    ${detailedSeminarsHTML}

  `;
}
