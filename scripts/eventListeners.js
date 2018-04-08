const starBtnFullUri = 'url("../images/star-full.png")';
const starBtnUri = 'url("../images/star.png")';

const onFileClicked = () => {
  document.getElementById("curtain").style.display = "grid";
  document.getElementById("search").focus();
};

const onStarClicked = (e) => {
  const url = e.target.dataset.url;
  const searching = browser.bookmarks.search({ url })
  searching.then((bkmNode)=>{
    if (bkmNode && bkmNode.length > 0) {
      e.target.style.backgroundImage = starBtnUri;
      browser.bookmarks.remove(bkmNode[0].id);
    } else {
      e.target.style.backgroundImage = starBtnFullUri;
      browser.bookmarks.create({
        parentId: "toolbar_____",
        url,
        title: url
      });
    }
  })
}

const onImageEnter = (e) => {
  const url = e.target.dataset.url;
  const elms = e.target.getElementsByClassName('btn');
  Array.prototype.forEach.call(elms, (el => { el.style.display = 'block' }))
  const searching = browser.bookmarks.search({ url })
  searching.then((bkmNode)=>{
    const starButton = e.target.getElementsByClassName('star')[0];
    if (bkmNode && bkmNode.length > 0) {
      starButton.style.backgroundImage = starBtnFullUri;
    } else {
      starButton.style.backgroundImage = starBtnUri;
    }
  })
};

const onImageLeave = (e) => {
  const elms = e.target.getElementsByClassName('btn');
  Array.prototype.forEach.call(elms, (el => { el.style.display = 'none' }))
}