/* eslint-disable no-undef */
const container = document.getElementById('container');

const addSearchInputChangeListener = () => {
  document.getElementById('search').addEventListener('input', onInputChange);
};

// Menu buttons related
const addMenuButtonsListeners = () => {
  document.getElementById('menu').addEventListener('click', (e) => {
    if (e.target.id === 'menuStar') {
      onMenuStarClicked();
    }
    if (e.target.id === 'menuFile') {
      onMenuFileClicked();
    }
    if (e.target.id === 'menuX') {
      onMenuXClicked();
    }
    if (e.target.id === 'menuCheckbox') {
      onMenuCheckboxClicked(e);
    }
    e.stopPropagation();
  });
};

// Grid images related
const addGridContainerListeners = () => {
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('overlay')) {
      onImageClicked(e);
    }
    if (e.target.classList.contains('star')) {
      onStarClicked(e);
    }
    if (e.target.classList.contains('file')) {
      onFileClicked(e);
    }
    if (e.target.classList.contains('x')) {
      onXClicked(e);
    }
    if (e.target.classList.contains('checkbox')) {
      onCheckBoxClicked(e);
    }
    e.stopPropagation();
  });
};

// Close Button related
const addCloseBtnListener = () => {
  document
    .getElementById('close')
    .addEventListener('click', onCloseButtonClicked);
};

// Star, File and X Buttons related
const createOverlay = ({ url, id, title, windowId }) => {
  const overlay = document.createElement('div');
  overlay.setAttribute('class', 'overlay');
  overlay.setAttribute('data-id', id);
  overlay.setAttribute('data-url', url);
  overlay.setAttribute('data-windowid', windowId);
  overlay.addEventListener('mouseenter', onImageEnter);
  overlay.addEventListener('mouseleave', onImageLeave);

  const starButton = document.createElement('button');
  starButton.setAttribute('class', 'btn star');
  starButton.setAttribute('id', `star_${id}`);
  starButton.setAttribute('data-url', url);

  const fileButton = document.createElement('button');
  fileButton.setAttribute('class', 'btn file');
  fileButton.setAttribute('data-url', url);

  const xButton = document.createElement('button');
  xButton.setAttribute('class', 'btn x');
  xButton.setAttribute('data-id', id);

  const checkbox = document.createElement('span');
  checkbox.setAttribute('class', 'checkbox');
  checkbox.setAttribute('id', `checkbox_${id}`);
  checkbox.setAttribute('data-id', id);
  checkbox.setAttribute('data-url', url);

  const header = document.createElement('h2');
  header.innerText = title;

  overlay.appendChild(header);
  overlay.appendChild(checkbox);
  overlay.appendChild(starButton);
  overlay.appendChild(fileButton);
  overlay.appendChild(xButton);
  return overlay;
};

// Image related
const createImage = (imageUri) => {
  const image = document.createElement('img');
  image.setAttribute('src', imageUri);
  return image;
};

const onCaptured = (imageUri, tab) => {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createImage(imageUri));
  fragment.appendChild(createOverlay(tab));
  return fragment;
};

const urlRegEx =
  /[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/;
const isValidURLFormat = (url) => urlRegEx.test(url);

function* yieldMyTabs(tabs) {
  // eslint-disable-next-line no-restricted-syntax
  for (const tab of tabs) {
    yield tab;
  }
}

const createLazyTabItems = async (tabs) => {
  const tabsIterator = yieldMyTabs(tabs);
  let nextIteration = tabsIterator.next();
  while (!nextIteration.done) {
    const tab = nextIteration.value;
    const gridItem = document.createElement('div');
    gridItem.setAttribute('class', 'grid-item');
    gridItem.setAttribute('id', tab.id);
    // eslint-disable-next-line no-await-in-loop
    const uri = await browser.tabs.captureTab(tab.id);
    gridItem.appendChild(onCaptured(uri, tab));
    container.appendChild(gridItem);
    nextIteration = tabsIterator.next();
  }
};

const getTabs = async () => {
  const tabs = await browser.tabs.query({ pinned: false });
  const validTabs = tabs.filter((tab) => isValidURLFormat(tab.url));
  if (validTabs.length > 0) {
    createLazyTabItems(validTabs);
    addGridContainerListeners();
  } else {
    const emptyContainer = document.createElement('div');
    emptyContainer.setAttribute('class', 'grid-item empty');
    emptyContainer.innerText = 'Start browsing and come back!';
    container.appendChild(emptyContainer);
  }
};

const setPopupProperties = (windowInfo) => {
  if (windowInfo.width < 800) {
    document.getElementById('container').setAttribute('class', 'grid-list');
    document.getElementById('curtain').style.gridTemplateColumns = 'auto';
    document.getElementById('search').style.gridArea = '2 / 1';
    document.getElementById('search').style.left = '35px';
    document.getElementById('results').style.gridArea = '2 / 1';
    document.getElementById('results').style.left = '35px';
  }
};

const adjustPopup = async () => {
  const windowInfo = await browser.windows.getCurrent({ populate: true });
  setPopupProperties(windowInfo);
};

const loadContent = () => {
  adjustPopup();
  getTabs();
  addCloseBtnListener();
  addMenuButtonsListeners();
  addSearchInputChangeListener();
  addResultsClickedListener();
};

/**
 * ENTRY POINT HERE
 */
loadContent();
