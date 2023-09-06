export function appendCSS(url){
  let link = document.createElement("link");
  link.href = url;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName( "head" )[0].appendChild( link );  
}
