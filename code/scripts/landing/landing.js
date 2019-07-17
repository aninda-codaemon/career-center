const prepLandingMain = function () {
  //remove possible module artifacts
  if (document.querySelector(".main__chapterButtons")) {
    document.querySelector(".main__chapterButtons").remove();
    document.querySelector(".main__modNavButtons").remove();

  }

  //ensure proper styling of main and nav
  document.querySelector("main").classList.remove("main--modules");
  document.querySelector("main").classList.add("main--landing");
}

const genLanding = function () {
  location.hash = "landing";
  prepLandingMain();
  updateTitle("landing");
  updateMedia("landing");
  genSnakes();
}

//unclear if resize needed
const resizeMain = function () {
  let mediaHeight = computeStyle("video", "height");
  let titleHeight = computeStyle(".main__title", "height");
  let mainPaddingHeight = 2 * computeStyle("main", "padding");

  document.querySelector(".main__media").setAttribute("height", mediaHeight + "px");
  document.querySelector("main").setAttribute("height", mediaHeight + titleHeight + mainPaddingHeight + "px")
}

// redirect to external link when clicked on site logo
const redirectExternal = function () {
  window.location.href = 'http://kitcareercenter.ma/';
}