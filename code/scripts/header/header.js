const genHeader = function(fdfTransModNum = 5) {
    
    let header = document.querySelector("header")
    //prep updated chapter buttons
    let newModules = titles.modules;

    //first add logo
    addEl("div", header, {class: "header__logo"}, 0,
        "<div onclick='redirectExternal()'><img src='"+siteData.icons.logo()+"'><h1>CAREER CENTER</h1></div>");

    //and add both select menus
    addEl("div", header, {class: "header__menu"}, 0,
        "<select class='themeSelect'><option value='default' selected disabled>Modules Thématiques</option><option value='landing'>Page d'accueil</option></select>\
        <select class='fdfSelect'><option value='default' selected disabled>Modules FdF</option><option value='landing'>Page d'accueil</option></select>");

    //init counters outside loops to use at both levels
    //t for thematic, f for fdf; fdf at zero in case mod1
    let t = 1;
    let f = 0;

    //note that modnum total repeats 3 times to account for changes; a non-repeating approach is preferred
    for (t; t<=thematicModuleCount; t++) {
        let modNum = t+f;
        let modName = '', modTitle = '';
        if (t==firstFdfNum) {
            //add trans to fdf
            addEl("option", document.querySelector(".themeSelect"), {value: "fdf"}, 0, "Modules FdF")
            //add fdf modules
            for (f; f<fdfModuleCount; f++) {
                modNum = t+f;
                modName = "mod"+modNum;
                modTitle = stringElipsis(newModules[modName].title);
                addEl("option", document.querySelector(".fdfSelect"), {value: modName}, 0, modNum+": "+modTitle);
            }
            modNum = t+f;
            //add trans to thematic
            addEl("option", document.querySelector(".fdfSelect"), {value: "thematic"}, 0, "Modules Thématiques");
            //add next thematic module before increment given new value of f for fdf modnum          
            modName = "mod"+modNum;
            modTitle = stringElipsis(newModules[modName].title);
            addEl("option", document.querySelector(".themeSelect"), {value: modName}, 0, modNum+": "+modTitle);
        } else {
          modName = "mod"+modNum;
          modTitle = stringElipsis(newModules[modName].title);
          addEl("option", document.querySelector(".themeSelect"), {value: modName}, 0, modNum+": "+modTitle);
        }
    }

    //hide fdf dynamically to be able to toggle
    document.querySelector(".fdfSelect").style.display = "none";

    //bind select onchange event to hand display switch and mod inits
    document.querySelectorAll("select").forEach(select => select.addEventListener("change", function(ev) {
        if (ev.target.value=='landing') {
          genLanding();
        } else if (ev.target.value=="fdf") {
            toggleBetweenSelects(document.querySelector(".themeSelect"), document.querySelector(".fdfSelect"));
        } else if (ev.target.value=="thematic") {
            toggleBetweenSelects(document.querySelector(".fdfSelect"), document.querySelector(".themeSelect"));
        } else {
            genModule(ev.target.value);
        }
    }))
}

const stringElipsis = function (text) {  
  if (text.length > 30){    
    return text.substring(0, 30) + '...';
  } else {
    return text;
  }     
};