function goBackHome() {
      hideItemsContent();
      $("main-menu").classList.add('active');
      $("return-btn").classList.remove('active');
    }

function showbyclass(classname){
      const elements = document.getElementsByClassName(classname);
        for (let i=0; i<elements.length; i++){
            elements[i].style.display = "flex";
        }
    }

function select(n) {
        hideItemsContent();
        let id = "item" + String(n);
        $(id).classList.add('active');
        $("return-btn").classList.add('active');
    }

function hideItemsContent() {
        let items = document.getElementsByClassName("item");
        Array.from(items).forEach(item => {
            item.classList.remove('active');
        });
    }

function hidebyclass(classname){
      const elements = document.getElementsByClassName(classname);
        for (let i=0; i<elements.length; i++){
            elements[i].style.display = "none";
        }
    }

function $(id) {
      return document.getElementById(id);
    }
    
function showAsignatures() {
  let selectedCarrera = $("carrera").value;
  console.log(selectedCarrera);
  hidebyclass("materias-recomendadas");
  $(selectedCarrera).style.display = "flex";
}

hidebyclass("primero");
hidebyclass("materias-recomendadas");
