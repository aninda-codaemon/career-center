//global folder names; exercises name can change, but position is fixed
const folders = ["exercises", "outils", "a-noter"];
Object.freeze(folders);

const prepFolders = function() {
    //get proper dom section
    let nav = document.querySelector("nav");

    //clear for changes
    nav.innerHTML = "";

    //first ensure propper class for nav
    nav.classList.remove("nav--snakes");
    nav.classList.add("nav--folders");

    //gen space for folder tabs; folders are added at same dom level
    addEl("div", nav, {class: "folders__tabs"})

    let tabDiv = document.querySelector(".folders__tabs")
    for (i in folders) {
        let tabId = folders[i].toLowerCase();
        let subTabText = tabId.replace("-", " ")
        let tabText = subTabText.charAt(0).toUpperCase() + subTabText.slice(1);
        if (i==0) {
            addEl("div", tabDiv, {class: "active", id: tabId}, 0, tabText)
            addEl("div", nav, {class: "folders__content active", id: tabId+"-folder"}, 0, "<ul></ul>")
        } else { 
            addEl("div", tabDiv, {id: tabId}, 0, tabText)
            addEl("div", nav, {class: "folders__content", id: tabId+"-folder"}, 0, "<ul></ul>")
        } 
    }
}

const bindFolderTabs = function() {
    /*
    Issues:
        1. no variable height
        2. no keydown event
    */
    document.querySelector("#exercises-folder").classList.add("flyInRight", "active");
    document.querySelectorAll(".folders__tabs>div").forEach(
        el=>el.addEventListener("click", function(ev) {
            //active tab toggle
            let currentActiveEl = document.querySelector(".folders__tabs .active")
            
            let currentActiveIndex = [...document.querySelectorAll(".folders__tabs>div")].indexOf(currentActiveEl)
            let newActiveIndex = [...document.querySelectorAll(".folders__tabs>div")].indexOf(el)

            currentActiveEl.classList.remove("active")
            document.querySelectorAll(".folders__content").forEach(el=>el.classList.remove("flyInLeft", "flyInRight", "active"))

            if (currentActiveIndex<newActiveIndex) {
                el.classList.add("active")
                document.querySelector("#"+el.id+"-folder").classList.add("flyInRight", "active");
            } else {
                el.classList.add("active")
                document.querySelector("#"+el.id+"-folder").classList.add("flyInLeft", "active");
            }
    }))
}

const updateFolders = function(mod="mod1") {
    let content;
    let lenArr = [];
    folders.forEach(function(f) {
        //online/offline mode for exercises only
        //what if exercises are empty?
        //add a line saying "This module has no exercises."
    
        
        if (folders.indexOf(f)==0) {
            if (navigator.onLine) {
                content = h5plinks["mod1"].exercises //mod1 becomes mod
                online=true;
            } else {
                content = ["1", "2", "3"]
                online=false;
            }
        } else {
            content = ["1", "2", "3", "1", "2", "3", "1", "2", "3"]
            online=false;
        }
        updateFolder(f, content, online)
        lenArr.push(content.length);
    })

    //programmatically determine height of nav on mod change
    let largestFolderLength = Math.max.apply(Math, lenArr);
    let largestFolderHeight = 2 * largestFolderLength + 4; //4 is for top and bottom margins
    let otherHeight = 15 //10 for top & bottom padding, 5 for tab height
    document.querySelector(".nav--folders").style.height = largestFolderHeight+otherHeight+"vw";

    //ensure all folders are same height 
    document.querySelectorAll(".folders__content").forEach(function(x) {
        x.style.height = largestFolderHeight + "vw";
    })

}

const updateFolder = function(folderName, content, online) {
    let folderEl = document.querySelector("#"+folderName+"-folder>ul");
    let folderText = folderName.charAt(0).toUpperCase() + folderName.slice(1).replace("-", " ") + " ";
    if (folderName=="exercises" && online==true) {
        for (let i=0; i<content.length; i++) {
            let num = parseInt(i)+1;
            addEl("li", folderEl, {class: "onlineEx", id: content[i]}, 0, folderText+num)
        }
    } else {
        for (let i=0; i<content.length; i++) {
            let num = parseInt(i)+1;
            let href = '#' //content[i]
            addEl("li", folderEl, {}, 0, "<a href='"+href+"'>"+folderText+num+"</a>")
        }
    }
}

document.addEventListener("click", function(ev) {
    if (ev.target.classList.value.match(/onlineEx/)!=null)  { 
        
        let exNum = [].indexOf.call(document.querySelectorAll(".onlineEx"), ev.target) + 1;
        
        if (location.hash.match(/chap/)) {
            location.hash = location.hash.replace(/chap\d{1,2}/gi, "ex"+exNum)
        } else if (location.hash.match(/ex/)){
            location.hash = location.hash.replace(/ex\d{1,2}/gi, "ex"+exNum)
        }
        
        //location.hash = location.hash.replace(/chap\d{1,2}/gi, chap)
        updateMedia(location.hash.match(/mod\d{1,2}/)[0], ev.target.id)
    }

})