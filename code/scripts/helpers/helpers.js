/*
    General site helper functions are:    
        1. addEl
        2. addElIfNotExist
        3. setAttributes
        4. setStyles
        5. setGrid
        6. computerStyle
        7. observeEl
        8. addCaptions
    
    Definitions are self-explanatory.

    Specific site helper functions are:
        1. observeIframeCallback
        2. toggleBetweenSelects
        3. genMainMedia
        4. updateMedia
    
    Definitions in functions' comment. 
*/
const addEl = function(tag, parent, attrs, postitionFromEnd=0, content="") {
    let node = document.createElement(tag);
    setAttributes(node, attrs);
    node.innerHTML = content;
    parent.insertBefore(node, parent.children[parent.children.length-postitionFromEnd]);

    //it does not appear the mutation observer resize function is needed
    //most problematic example was https://h5p.org/node/514461
    if (tag==="iframe") {
        //observeEl("iframe", observeIframeCallback);
    }
}

const addElIfNotExist = function(selectorClass, content="", newTag="div", parent=document.querySelector("main"), postitionFromEnd=0) {
    if (!document.querySelector("."+selectorClass)) {
        addEl(newTag, parent, {class: selectorClass}, postitionFromEnd, content)
    }
}

const setAttributes = function(el, attrs) {
    Object.keys(attrs).forEach(function(key) {
        el.setAttribute(key, attrs[key]);
    })
}

const setStyles = function(el, styleObj) {
    for (var property in styleObj)
        el.style[property] = styleObj[property];
}

const setGrid = function(el, gridRows, gridColumns) {
    //one version extends setStyles; performance difference unknwon

    // setStyles(el, {
    //     "grid-template-rows": "repeat(" + gridRows + ", 1fr)",
    //     "grid-template-columns": "repeat(" + gridColumns + ", 1fr)"
    // })
    el.style["grid-template-rows"] = "repeat(" + gridRows + ", 1fr)";
    el.style["grid-template-columns"] = "repeat(" + gridColumns + ", 1fr)";
}

const computeStyle = function (selector, styleName) {
    return parseInt(window.getComputedStyle(document.querySelector(selector)).getPropertyValue(styleName))
}

const observeEl = function(tag, callbackFunction) {
    let el = document.querySelector(tag);
    let config = {attributes: true, childList: true, subtree: true}
    let observer = new MutationObserver(callbackFunction)
    observer.observe(el, config)
}

const getColumnsPerRowsAndItems = function(rows, items) {
    //recursive method of returning best-fit grid
    if (items%rows==0) {
        return items/rows;
    } else {
        if (rows-1!=2) {
            return getColumnsPerRowsAndItems(rows-1, items);
        } else {
            return Math.ceil(items/rows);
        }
        
    } 
}

const addCaptions = function(captionObj) {
    if (captionObj!=undefined) {
        let videoEl = document.querySelector("video")
        if (videoEl) {
            track = videoEl.addTextTrack("captions", "Français", "fr");
            track.mode = "showing";
            for (t in captionObj) {
                track.addCue(new VTTCue(captionObj[t][0], captionObj[t][1], captionObj[t][2]));
            }
        }   
    }
}

const observeIframeCallback = function() {
    //update height of 'main' elements, including font size, based on h5p iframe
    //let videoHeight = computeStyle("video", "height")
    
    let iframeHeight = computeStyle("iframe", "height");
    let chapterCount = document.querySelectorAll(".main__chapterButtons>div").length;
    let relativeFontSize = (iframeHeight/(3*chapterCount))/document.body.offsetWidth*100 + "vw";
    
    //also add relative font size to title

    //document.querySelectorAll(".main__chapterButtons>div").forEach(btn=>btn.style.fontSize = relativeFontSize)
}

const toggleBetweenSelects = function(visibleSelect, invisibleSelect, newVal=0) {
    //used to hide/show thematic and fdf selects
    visibleSelect.style.display = "none";
    invisibleSelect.style.display = "block";
    if (newVal!=0) {
        invisibleSelect.value = newVal;
    } else {
        invisibleSelect.selectedIndex = newVal;
    }
}

const updateTitle = function(mod="landing") {
    let title;
    if (mod=="landing") {
        title=titles.landing.title
    } else {
        title="Module " + mod.match(/\d{1,2}/)[0] + ": " + titles.modules[mod].title
    }
    
    if (!document.querySelector(".main__title")) {
        addEl("div", document.querySelector("main"), {class: "main__title"}, 0,
            "<h2 class='main__title__text'>"+title+"</h2>");
    } else {
        document.querySelector(".main__title>h2").innerHTML = title;
    }
}

const genMainMedia = function(mediaSrc, mediaType="iframe") {
    // generate the 'main media' frame with proper mediaSrc
    // and with online/offline handling of proper child mediaType - - 
    // video (offline/landing) or iframe (online)
    if (!document.querySelector(".main__media")) {
        addEl("div", document.querySelector("main"), {class: "main__media"})
    }
    if (document.querySelector(mediaType)) {
        document.querySelector(mediaType).setAttribute("src", mediaSrc);
    } else {
        document.querySelector(".main__media").innerHTML = "";
        if (mediaType=="video") {
            addEl(mediaType, document.querySelector(".main__media"), {src: mediaSrc, controls: "controls"})
        } else {
            addEl(mediaType, document.querySelector(".main__media"), {src: mediaSrc, controls: "controls"})
        }
    }
}

//set status outside function to ensure no repeat alerts
let alertStatus = false;
const updateMedia = function(mod="landing", subFolder="chap1") {
    //should be abstracted to metadata object
    let localOfflineAlert = "You are running this site locally. Some functionality will be limited."
    let localOfflineMediaText = "You are running this site locally. Some exercises may be downloaded as PDFs."
    let remoteOfflineAlert = "You have lost internet connectivity. For limited offline functionality, please contact the site administrator."

    //updates media based on whether online/offline landing/module & chapter/exercise
    let connection = navigator.onLine;
    let url = location.href;
    let mediaSrc, mediaType;

    //online
    if (connection) {
        alertStatus = false;
        if (mod==="landing") {
            mediaSrc = genMediaPath("landing") //mod, subFolder
            mediaType="video";
            //addCaptions(captions.landing) //this won't work here - - needs to be after media gen
        } else {
            if (subFolder.match(/chap/)) {
                mediaSrc = h5plinks["mod1"].chapters[0] //mod1 is mod; structure needed for chapter distinction
                console.log('Sub folder match ' + subFolder);
            } else {
                mediaSrc = subFolder//modules[mod].exercises[subFolder].online;
                console.log('Sub folder not a match' + subFolder);
            }
            console.log('Media path: ' + mediaSrc + ' ' + subFolder);
            mediaType="iframe";
        }
        genMainMedia(mediaSrc, mediaType)
    }
    //offline
    else {
        //local offline
        if (url.match(/file/)) {
            if (alertStatus==false) {
                alert(localOfflineAlert)
            }
            
            alertStatus = true;
            if (mod=="landing") {
                mediaSrc = genMediaPath("landing") //mod, subFolder
                genMainMedia(mediaSrc, "video")
            } else {
                if (subFolder.match(/chap/)) {
                    mediaSrc = genMediaPath("mod1", "chap1") //mod, subFolder
                    genMainMedia(mediaSrc, "video")
                } else {
                    mediaSrc = genMediaPath("mod1", "ex1") //mod, subFolder
                    window.open(mediaSrc)
                    document.querySelector(".main__media").innerHTML = localOfflineMediaText;
                }
            }
        //remote offline
        } else {
            if (alertStatus==false) {
                alert(remoteOfflineAlert)
            }
            
            alertStatus = true;
            document.querySelector(".main__media").innerHTML = remoteOfflineAlert;
        }
    }
}

const genPath = function(path, filename, filetype) {
    return path+filename+"."+filetype;
}

const genImgPath = function(mod="mod1", size="large") {
    return "../content/modules/"+mod+"/images/"+size.toLowerCase()+"/"+mod+".png";
}

const genMediaPath = function(mod="mod1", subFolder="chap1") {
    if (mod=="landing") {
        return "content/landing/offline/landing.mp4";
    } else if (subFolder.match(/chap/)) {
        return "content/modules/"+mod+"/chapters/offline/"+mod+"-"+subFolder+".mp4";
    } else {
        return "content/modules/"+mod+"/exercises/offline/"+mod+"-"+subFolder+".pdf";
    }
}

const genModFilePath = function(mod, path, fileName, fileType) {
    return "modules/"+mod+path+fileName+fileType;
}


const siteData = {
    icons: {
        iconPath: "content/icons/",
        logo: function() {return genPath(this.iconPath, "logo", "svg")},
        arrowLeft: function() {return genPath(this.iconPath, "arrow-left", "svg")},
        arrowRight: function() {return genPath(this.iconPath, "arrow-right", "svg")},
        arrowCurveLeft: function() {return genPath(this.iconPath, "arrow-curve-left", "svg")},
        arrowCurveDown: function() {return genPath(this.iconPath, "arrow-curve-down", "svg")}
    }
}