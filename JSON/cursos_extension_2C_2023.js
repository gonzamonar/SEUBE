import { CargarCursos, $, ApplyFilter } from "https://gonzamonar.github.io/SEUBE/JS/cursos_extension.js";
import { appendCSS } from "https://gonzamonar.github.io/SEUBE/JS/Export/appendCSS.js";

appendCSS("https://gonzamonar.github.io/SEUBE/CSS/cursos_extension.css");
CargarCursos("https://gonzamonar.github.io/SEUBE/JSON/cursos_extension_2C_2023.json");
$("").addEventListener("change", ApplyFilter);
