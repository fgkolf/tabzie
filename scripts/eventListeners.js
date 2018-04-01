const starBtnFullUri = 'url("../images/star-full.png")';
const starBtnUri = 'url("../images/star.png")';

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

const onStarHovered = (e) => {
  const url = e.target.dataset.url;
  const searching = browser.bookmarks.search({ url })
  searching.then((bkmNode)=>{
    if (bkmNode && bkmNode.length === 0) {
      e.target.style.backgroundImage = starBtnUri;
    } else {
      e.target.style.backgroundImage = starBtnFullUri;
    }
  })
};

const onStarOut = (e) => {
  e.target.style.backgroundImage = "none";
}