const starBtnFullUri = 'url("../images/star-full.png")';
const starBtnUri = 'url("../images/star.png")';
const results = document.getElementById("results");

const onCloseButtonClicked = (e) => {
  document.getElementById("curtain").style.display = "none";
  // clear previous state
  document.getElementById("search").value = "";
  onInputChange(e);
};

const onFileClicked = (e) => {
  document.getElementById("curtain").style.display = "grid";
  results.dataset.url = e.target.dataset.url;
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

const clearResults = () => {
  while (results.hasChildNodes()) {
    results.removeChild(results.lastChild);
  }
}

const createListElement = (name) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.appendChild(document.createTextNode(name));
  li.appendChild(a);
  return li;
}

const addAndClose = (parentId) => {
  browser.bookmarks.create({ url: results.dataset.url, parentId });
  onCloseButtonClicked();
}

const createResultElement = (folder) => {
  const li = createListElement(folder.title);
  li.addEventListener('click', () => addAndClose(folder.id));
  results.appendChild(li);
}

const createNewFolderElement = (name) => {
  const li = createListElement("Create New");
  li.addEventListener('click', () => {
    const creating = browser.bookmarks.create({ title: name, parentId: "toolbar_____" })
    creating.then(f => addAndClose(f.id));
  })
  results.appendChild(li);
}

const onInputChange = (e) => {
  clearResults();
  const value = e.target.value;
  if (value) {
    const searching = browser.bookmarks.search(value);
    createNewFolderElement(value);
    searching.then((bkmNode) => {
      if (bkmNode && bkmNode.length) {
        bkmNode
          .filter(b => b.type === "folder")
          .forEach(f => { createResultElement(f) })
      }
    })
  }
}