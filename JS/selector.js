function select(id, selectableclass = "selectable") {
    hidebyclass(selectableclass);
    document.getElementById(id).style.display = "block";
}

function hidebyclass(classname){
  const elements = document.getElementsByClassName(classname);
    for (let i=0; i<elements.length; i++){
        elements[i].style.display = "none";
    }
}

hidebyclass("selectable");