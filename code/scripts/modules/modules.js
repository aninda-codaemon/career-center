const prepModules = function() {
    //ensure propper class for main
    document.querySelector("main").classList.remove("main--landing");
    document.querySelector("main").classList.add("main--modules");

    //add if not exist given possible direct-to-module load
    addElIfNotExist("main__media");
    addElIfNotExist("main__title", "<h2></h2>");
    addElIfNotExist("main__chapterButtons");
    
    addElIfNotExist("main__modNavButtons");
}

const setSelect = function(mod="mod1") {
    //faster to set and check empty value than to loop over array of values
    let themeSelect = document.querySelector(".themeSelect");
    let fdfSelect = document.querySelector(".fdfSelect");
    if (themeSelect.style.display!="none") {
        themeSelect.value=mod;
        if (themeSelect.value=="") {
            toggleBetweenSelects(themeSelect, fdfSelect, mod)
        }
    } else {
        fdfSelect.value=mod;
        if (fdfSelect.value=="") {
            toggleBetweenSelects(fdfSelect, themeSelect, mod)
        }
    }
}

const updateModule = function(mod="mod1", chap="chap1") {
    //refresh prev/next buttons - could be optomized if only one load
    document.querySelector(".main__modNavButtons").innerHTML = "<img class='icon' id='prevBtn' src='content/icons/arrow-left.svg' alt='previous module'><img class='icon' id='nextBtn' src='content/icons/arrow-right.svg' alt='next module'>";
    
    updateTitle(mod);

    //refresh chapter buttons
    let chapButtons = document.querySelector(".main__chapterButtons");
    chapButtons.innerHTML="";
    
    //prep updated chapter buttons
    let newButtons = titles.modules[mod].chapters;

    //update chapterbuttons
    for (let i=0; i<newButtons.length; i++) {
        //distinguish i for index of button title and actual chapNum
        let chapNum = i+1;
        addEl("div", chapButtons, {id:"chap"+chapNum}, 0, chapNum+". " + newButtons[i]);
    }

    //update folders
    updateFolders(mod)

    //update chapter
    updateChapter(chap)

}

const updateChapter = function(chap="chap1") {
    //update chapter part of hash
    if (location.hash.match(/chap/)) {
        location.hash = location.hash.replace(/chap\d{1,2}/gi, chap)
    } else if (location.hash.match(/ex/)){
        location.hash = location.hash.replace(/ex\d{1,2}/gi, chap)
    }

    //update active chapter button
    document.querySelectorAll(".main__chapterButtons>div").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".main__chapterButtons>div")[chap.match(/\d{1,2}/)[0]-1].classList.add("active")

    let mod = location.hash.match(/mod\d{1,2}/)[0]
    updateMedia(mod, chap);
}

const bindChapterButtons = function() {
    document.querySelectorAll(".main__chapterButtons>div").forEach(btn=>btn.addEventListener("click", function(ev) {
        updateChapter(ev.target.id)
    }))
}


const bindPrevNextButtons = function() {
    document.querySelectorAll(".main__modNavButtons>img").forEach(btn=>btn.addEventListener("click", function(ev) {
        let elId = ev.target.id
        let currentMod = location.hash.match(/mod\d{1,2}/)[0]
        let currentModNum = parseInt(currentMod.match(/\d{1,2}/));
        let newModNum, newMod;
        if (elId.match(/prev/)) {
            if (currentModNum-1 > 0) {
                newModNum = currentModNum-1;   
            } else {
                newModNum = moduleCount;
            }
        } else {
            if (currentModNum+1 <= moduleCount) {
                newModNum = currentModNum+1;
            } else {
                newModNum = 1;
            }
        }
        newMod = "mod" + newModNum;
        genModule(newMod);
    }))
}

const genModule = function(mod="mod1", chap="chap1") {
    location.hash = mod+chap;
    prepModules();

    prepFolders();

    setSelect(mod);
    updateModule(mod, chap);

    //package to prevent rebinding - should only occur on first load of modules page
    bindChapterButtons();
    bindPrevNextButtons();
    bindFolderTabs();
}