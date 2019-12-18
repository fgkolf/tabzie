/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
const starBtnFullUri = 'url("../images/star-full.png")';
const starBtnUri = 'url("../images/star.png")';
const results = document.getElementById('results');
let checkedIds = [];
let checkedUrls = [];

const setMenuVisibility = (on, idToKeep) => {
  const menu = document.getElementById('menu');
  const checkboxes = document.getElementsByClassName('checkbox');
  if (on) {
    menu.style.display = 'grid';
    Array.prototype.forEach.call(checkboxes, el => {
      el.style.display = 'block';
    });
  } else {
    menu.style.display = 'none';
    Array.prototype.forEach.call(checkboxes, el => {
      el.classList.remove('checked');
      if (el.id === 'menuCheckbox') {
        return;
      }
      if (el.dataset.id !== idToKeep) {
        el.style.display = 'none';
      }
      if (el.dataset.id === idToKeep) {
        const gridItem = document.getElementById(el.dataset.id);
        const btns = gridItem.getElementsByClassName('btn');
        Array.prototype.forEach.call(btns, btn => {
          btn.style.display = 'block';
        });
      }
    });
    checkedIds = [];
    checkedUrls = [];
  }
};

const onMenuStarClicked = () => {
  checkedIds.forEach(id => {
    const starBtn = document.getElementById(`star_${id}`);
    const { url } = starBtn.dataset;
    browser.bookmarks.create({
      url,
      title: url
    });
  });
  setMenuVisibility(false);
};

const onMenuFileClicked = () => {
  document.getElementById('curtain').style.display = 'grid';
  document.getElementById('search').focus();
};

const onImageRemoved = tabId => {
  const element = document.getElementById(tabId);
  element.parentNode.removeChild(element);
};

const onXClicked = async e => {
  const tabId = parseInt(e.target.dataset.id, 10);
  await browser.tabs.remove(tabId);
  onImageRemoved(tabId);
};

const onMenuXClicked = () => {
  checkedIds.forEach(id => {
    onXClicked({ target: { dataset: { id } } });
  });
  setMenuVisibility(false);
};

const onMenuCheckboxClicked = e => {
  const isChecked = e.target.classList.contains('checked');
  checkedIds = [];
  checkedUrls = [];
  const checkboxes = document.getElementsByClassName('checkbox');
  Array.prototype.forEach.call(checkboxes, el => {
    if (el.id === 'menuCheckbox') {
      if (isChecked) {
        el.classList.remove('checked');
      } else {
        el.classList.add('checked');
      }
    }
    if (isChecked) {
      setMenuVisibility(false);
    } else {
      el.setAttribute('class', 'checkbox checked');
      checkedIds.push(el.dataset.id);
      checkedUrls.push(el.dataset.url);
    }
  });
};

const onCheckBoxClicked = e => {
  const { id, url } = e.target.dataset;
  if (checkedIds.includes(id)) {
    checkedIds.splice(checkedIds.indexOf(id), 1);
    checkedUrls.splice(checkedUrls.indexOf(url), 1);
    e.target.classList.remove('checked');
  } else {
    checkedIds.push(id);
    checkedUrls.push(url);
    e.target.classList.add('checked');
  }

  if (checkedIds.length === 0) {
    setMenuVisibility(false, id);
  }
  if (checkedIds.length === 1) {
    setMenuVisibility(true);
  }
};

const createListElement = (name, fid, isCreateButton) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  if (isCreateButton) {
    const plusIcon = document.createElement('span');
    plusIcon.appendChild(document.createTextNode('+ '));
    plusIcon.setAttribute('class', 'plus');
    a.appendChild(plusIcon);
    a.setAttribute('data-name', fid);
  } else {
    a.setAttribute('data-fid', fid);
  }
  a.appendChild(document.createTextNode(name));
  li.appendChild(a);
  return li;
};

const createResultElement = folder => {
  const li = createListElement(folder.title, folder.id);
  results.appendChild(li);
};

const createNewFolderElement = name => {
  const li = createListElement('Create New', name, true);
  results.appendChild(li);
};

const clearResults = () => {
  while (results.hasChildNodes()) {
    results.removeChild(results.lastChild);
  }
};

const onInputChange = async e => {
  clearResults();
  const value = e && e.target.value;
  if (value) {
    createNewFolderElement(value);
    const bkmNode = await browser.bookmarks.search(value);
    if (bkmNode && bkmNode.length) {
      bkmNode
        .filter(b => b.type === 'folder')
        .forEach(f => {
          createResultElement(f);
        });
    }
  }
};

const onCloseButtonClicked = e => {
  document.getElementById('curtain').style.display = 'none';
  setMenuVisibility(false);
  // clear previous state
  document.getElementById('search').value = '';
  onInputChange(e);
};

const onFileClicked = e => {
  document.getElementById('curtain').style.display = 'grid';
  results.dataset.url = e.target.dataset.url;
  document.getElementById('search').focus();
};

const onStarClicked = async e => {
  const { url } = e.target.dataset;
  const bkmNode = await browser.bookmarks.search({ url });
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
};

const onImageClicked = e => {
  if (e.target.classList[0] === 'overlay') {
    const tabId = parseInt(e.target.dataset.id, 10);
    const windowId = parseInt(e.target.dataset.windowid, 10);
    browser.windows.update(windowId, { focused: true });
    browser.tabs.update(tabId, { active: true });
  }
};

const onImageEnter = async e => {
  const { url, id } = e.target.dataset;
  if (checkedIds.length === 0) {
    const elms = e.target.getElementsByClassName('btn');
    Array.prototype.forEach.call(elms, el => {
      el.style.display = 'block';
    });
    const starButton = document.getElementById(`star_${id}`);
    const bkmNode = await browser.bookmarks.search({ url });
    if (bkmNode && bkmNode.length > 0) {
      starButton.style.backgroundImage = starBtnFullUri;
    } else {
      starButton.style.backgroundImage = starBtnUri;
    }
  }
  const checkbox = document.getElementById(`checkbox_${id}`);
  checkbox.style.display = 'block';
};

const onImageLeave = e => {
  const elms = e.target.getElementsByClassName('btn');
  Array.prototype.forEach.call(elms, el => {
    el.style.display = 'none';
  });
  if (!checkedIds.length) {
    const checkbox = document.getElementById(`checkbox_${e.target.dataset.id}`);
    checkbox.style.display = 'none';
  }
};

const addAndClose = parentId => {
  if (results.dataset.url) {
    browser.bookmarks.create({ url: results.dataset.url, parentId });
  } else {
    checkedUrls.forEach(url => {
      browser.bookmarks.create({ url, parentId });
    });
  }
  onCloseButtonClicked();
};

// Listener for search results clicks
const addResultsClickedListener = () => {
  results.addEventListener('click', async e => {
    const { fid, name } = e.target.dataset;
    // existing folder case
    if (fid) {
      addAndClose(fid);
    }
    // new folder case
    if (name) {
      const folder = await browser.bookmarks.create({ title: name });
      addAndClose(folder.id);
    }
    e.stopPropagation();
  });
};
