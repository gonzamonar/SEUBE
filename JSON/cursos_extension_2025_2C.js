import { CargarCursos, CargarPagina } from "https://gonzamonar.github.io/SEUBE/JS/cursos_extension_v4.js";
import { appendCSS } from "https://gonzamonar.github.io/SEUBE/JS/Export/appendCSS.js";

const JSON_FILE = "https://gonzamonar.github.io/SEUBE/JSON/cursos_extension_2025_2C.json";

appendCSS("https://gonzamonar.github.io/SEUBE/CSS/flyer_cursos_extension_v1.css");
appendCSS("https://gonzamonar.github.io/SEUBE/CSS/cursos_extension_v2.css");
CargarCursos(JSON_FILE);
CargarPagina(JSON_FILE);
