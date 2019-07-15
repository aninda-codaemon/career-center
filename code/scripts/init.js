/*
    Generate site based on url.
    Inputing at least mod and num,
    User may nav directly to mods.
*/
genHeader();

let modArray = location.hash.match(/mod\d{1,}/);
if (!modArray) {
    genLanding();
} else {
    let mod, chap, modNum, chapNum;
    mod = modArray[0];
    modNum = mod.match(/\d{1,}/)[0];
    if (moduleCount<modNum) {
        mod = "mod1";
        chap = "chap1";
    } else {
        chapArray = location.hash.match(/chap\d{1,}/);
        if (!chapArray) {
            chap = "chap1";
        } else {
            chap = chapArray[0];
            chapNum = chap.match(/\d{1,}/)[0];
            let chapterCount = titles.modules[mod].chapters.length
            if (chapNum>chapterCount) {
                chap="chap1";
            }
        }
    }
    genModule(mod, chap);
}

