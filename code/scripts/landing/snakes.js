const genSnakes = function(snakeRows=3, modalRows=3) {
    //grab nav
    let nav = document.querySelector("nav");

    //prep nav
    nav.innerHTML = "";
    nav.classList.remove("nav--folders");
    nav.classList.add("nav--snakes");

    //prep modal with display prop so it can be read later by el.style
    addEl("div", nav, {class: "nav__dimmer", style: "display: none"});
    addEl("div", nav, {class: "nav__modal", style: "display: none"});

    //grab modal/dimmer
    let modal = document.querySelector(".nav__modal");
    let dimmer = document.querySelector(".nav__dimmer");

    //use module counts from data file in scripts root
    let arrows = thematicModuleCount - 1
    let snakeItems = thematicModuleCount + arrows;
    let snakeColumns = getColumnsPerRowsAndItems(snakeRows, snakeItems)
    setGrid(nav, snakeRows, snakeColumns)

    let modalColumns = getColumnsPerRowsAndItems(modalRows, fdfModuleCount);
    setGrid(modal, modalRows, modalColumns)

    //essential counters to keep track of items
    let rowCount = 1;
    let imgCount = 1;
    let backwardsCounter = 0;

    //loop over elements in thematic modules and generate snakes
    for (let i=0; i<snakeItems; i++) {
        //firstFdfNum from data file in scripts root
        if (i==firstFdfNum*2) {
            addEl("div", nav, {class: "fdfImg"}, backwardsCounter, "FDF");
            for (let p=0; p<fdfModuleCount; p++) {
                let path = genImgPath("mod1", "large") //correct mod = "mod"+imgCount
                addEl("div", modal, {class: "snakeDiv", id: "mod"+imgCount}, 0, "<img class='snakeImg' src='"+path+"' alt='module "+imgCount+" thumbnail'>") 
                imgCount++;
            }
            backwardsCounter++;
        } else {
            if (rowCount%2!=0) {
                //odd rows simply add elements
                if (i%2==0) {
                    let path = genImgPath("mod1", "large") //correct modnum = "mod"+imgCount
                    addEl("div", nav, {class: "snakeDiv", id: "mod"+imgCount}, backwardsCounter, "<img class='snakeImg' src='"+path+"' alt='module "+imgCount+" thumbnail'>") 
                    imgCount++;
                } else {
                    addEl("div", nav, {class: "arrow"}, backwardsCounter, "<img src='"+siteData.icons.arrowRight()+"'>");
                }
            } else {
                //even rows count backwards
                if (i%2==0) {
                    let path = genImgPath("mod1", "large") //correct modnum = "mod"+imgCount
                    addEl("div", nav, {class: "snakeDiv", id: "mod"+imgCount}, backwardsCounter, "<img class='snakeImg' src='"+path+"' alt='module "+imgCount+" thumbnail'>") 
                } else {
                    if (backwardsCounter==0) {
                        addEl("div", nav, {class: "arrow"}, backwardsCounter, "<img src='"+siteData.icons.arrowCurveLeft()+"'>");
                    } else if ((i+1)%snakeColumns==0) {
                        addEl("div", nav, {class: "arrow"}, backwardsCounter, "<img src='"+siteData.icons.arrowCurveDown()+"'>");
                    } else {
                        addEl("div", nav, {class: "arrow"}, backwardsCounter, "<img src='"+siteData.icons.arrowLeft()+"'>");
                    }
                }
                backwardsCounter++;
            }
        }
        if (i!=0 && (i+1)%snakeColumns==0) {
            rowCount++;
            backwardsCounter=0;
        }
    }
    document.addEventListener("click", function(ev) {
        
        if (ev.target.className == "fdfImg" || ev.target.className == "nav__dimmer") {
            if (modal.style.display === "none") {
                modal.style.display = "grid";
                dimmer.style.display = "block";
            } else {
                modal.style.display = "none";
                dimmer.style.display = "none";
            }
        } else if (ev.target.className.match(/snakeImg/)) {
            genModule(ev.target.parentNode.id)

            //scroll to top after generation
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
    })
}

