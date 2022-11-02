/* eslint-disable no-undef */
const container = document.getElementById('container');
const loading = document.getElementById('loading');

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
    if (e.target.type === 'checkbox') {
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

  const checkboxWrap = document.createElement('label');
  checkboxWrap.setAttribute('class', 'checkbox-wrap');
  checkboxWrap.setAttribute('for', `checkbox_${id}`);
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('id', `checkbox_${id}`);
  checkbox.setAttribute('data-id', id);
  checkbox.setAttribute('data-url', url);
  checkboxWrap.appendChild(checkbox);

  const header = document.createElement('h2');
  header.innerText = title;

  overlay.appendChild(header);
  overlay.appendChild(checkboxWrap);
  overlay.appendChild(starButton);
  overlay.appendChild(fileButton);
  overlay.appendChild(xButton);
  return overlay;
};

// Image related
const createImage = (imageUri) => {
  const image = document.createElement('img');
  image.setAttribute('loading', 'lazy');
  image.setAttribute('src', imageUri);
  return image;
};

const onCaptured = (imageUri, tab) => {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createImage(imageUri));
  fragment.appendChild(createOverlay(tab));
  return fragment;
};

const handleLoading = () => {
  setTimeout(() => {
    container.classList.remove('hidden');
    loading.remove();
  }, 1500);
};

const urlRegEx =
  /[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/;
const isValidURLFormat = (url) => urlRegEx.test(url);

const createTabItems = (tabs) => {
  while (tabs.length) {
    const fragment = document.createDocumentFragment();
    tabs.splice(0, 4).forEach(async (tab) => {
      const gridItem = document.createElement('div');
      fragment.appendChild(gridItem);
      gridItem.setAttribute('class', 'grid-item');
      gridItem.setAttribute('id', tab.id);
      const uri = await browser.tabs.captureTab(tab.id);
      gridItem.appendChild(onCaptured(uri, tab));
    });
    container.appendChild(fragment);
  }
};

const getTabs = async () => {
  const tabs = await browser.tabs.query({ pinned: false });
  const validTabs = tabs.filter((tab) => isValidURLFormat(tab.url));
  if (validTabs.length > 0) {
    handleLoading();
    createTabItems(validTabs);
    addGridContainerListeners();
  } else {
    loading.innerText = 'Start browsing and come back!';
  }
};

const setPopupProperties = (windowInfo) => {
  if (windowInfo.width < 800) {
    document
      .getElementById('container')
      .setAttribute('class', 'grid-list hidden');
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
  getTabs();
  adjustPopup();
  addCloseBtnListener();
  addMenuButtonsListeners();
  addSearchInputChangeListener();
  addResultsClickedListener();
};

/**
 * ENTRY POINT HERE
 */
loadContent();
