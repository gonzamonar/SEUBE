function select(id, selectableclass = "selectable") {
    const elements = document.getElementsByClassName(selectableclass);
    for (let i=0; i<elements.length; i++){
        elements[i].style.display = "none";
    }
    document.getElementById(id).style.display = "block";
}