const starBtnFullUri = 'url("../images/star-full.png")';
const starBtnUri = 'url("../images/star.png")';
const results = document.getElementById("results");

const onCloseButtonClicked = (e) => {
  document.getElementById("curtain").style.display = "none";
  // clear previous state
  document.getElementById("search").value = "";
  onInputChange(e);
};

const onImageRemoved = (tabId) => {
  const element = document.getElementById(tabId);
  element.parentNode.removeChild(element);
}

const onXClicked = async (e) => {
  const tabId = parseInt(e.target.dataset.id);
  await browser.tabs.remove(tabId);
  onImageRemoved(tabId);
}

const onFileClicked = (e) => {
  document.getElementById("curtain").style.display = "grid";
  results.dataset.url = e.target.dataset.url;
  document.getElementById("search").focus();
};

const onStarClicked = async (e) => {
  const url = e.target.dataset.url;
  const bkmNode = await browser.bookmarks.search({ url })
  if (bkmNode && bkmNode.length > 0) {
    e.target.style.backgroundImage = starBtnUri;
    browser.bookmarks.remove(bkmNode[0].id);
  } else {
    e.target.style.backgroundImage = starBtnFullUri;
    browser.bookmarks.create({
      url,
      title: url
    });
  }
}

const onImageOverlayClicked = (e) => {
  const tabId = parseInt(e.target.dataset.id);
  browser.tabs.update(tabId, { active: true });
}

const onImageEnter = async (e) => {
  const url = e.target.dataset.url;
  const elms = e.target.getElementsByClassName('btn');
  Array.prototype.forEach.call(elms, (el => { el.style.display = 'block' }))
  const starButton = e.target.getElementsByClassName('star')[0];
  const bkmNode = await browser.bookmarks.search({ url })
  if (bkmNode && bkmNode.length > 0) {
    starButton.style.backgroundImage = starBtnFullUri;
  } else {
    starButton.style.backgroundImage = starBtnUri;
  }
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

const createListElement = (name, isCreateButton) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  if (isCreateButton) {
    const plusIcon = document.createElement('span');
    plusIcon.appendChild(document.createTextNode('+ '));
    plusIcon.setAttribute('class', 'plus')
    a.appendChild(plusIcon);
  }
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
  const li = createListElement("Create New", true);
  li.addEventListener('click', async () => {
    const folder = await browser.bookmarks.create({ title: name })
    addAndClose(folder.id);
  })
  results.appendChild(li);
}

const onInputChange = async (e) => {
  clearResults();
  const value = e.target.value;
  if (value) {
    createNewFolderElement(value);
    const bkmNode = await browser.bookmarks.search(value);
    if (bkmNode && bkmNode.length) {
    bkmNode
      .filter(b => b.type === "folder")
      .forEach(f => { createResultElement(f) })
    }
  }
}