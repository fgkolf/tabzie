const parent = document.getElementById("container");

const addSearchInputChangeListener = () => {
  document.getElementById("search")
    .addEventListener('input', onInputChange);
}

// Close Button related
const addCloseBtnListener = () => {
  document.getElementById("close")
    .addEventListener("click", onCloseButtonClicked)
}

// Star, File and X Buttons related
const createButtons = (url, id) => {
  const overlay = document.createElement('div')
  overlay.setAttribute('class', 'overlay');
  overlay.setAttribute('data-id', id);
  overlay.setAttribute('data-url', url);
  overlay.addEventListener('mouseenter', onImageEnter);
  overlay.addEventListener('mouseleave', onImageLeave);
  overlay.addEventListener('click', onImageOverlayClicked);

  const starButton = document.createElement('button');
  starButton.setAttribute('class', 'btn star');
  starButton.setAttribute('data-url', url);
  starButton.addEventListener('click', onStarClicked);

  const fileButton = document.createElement('button');
  fileButton.setAttribute('class', 'btn file');
  fileButton.setAttribute('data-url', url);
  fileButton.addEventListener('click', onFileClicked);

  const xButton = document.createElement('button');
  xButton.setAttribute('class', 'btn x');
  xButton.setAttribute('data-id', id);
  xButton.addEventListener('click', onXClicked);

  overlay.appendChild(starButton);
  overlay.appendChild(fileButton);
  overlay.appendChild(xButton);
  return overlay;
}

// Image related
const createImage = (imageUri) => {
  const image = document.createElement('img');
  image.setAttribute('src', imageUri);
  return image;
};

const onCaptured = (imageUri, gridItem, tab) => {
  gridItem.appendChild(createImage(imageUri));
  gridItem.appendChild(createButtons(tab.url, tab.id));
};

const urlRegEx = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const isValidURLFormat = url => urlRegEx.test(url);

const createTabItems = (tabs) => {
  tabs.forEach((tab) => {
    if (isValidURLFormat(tab.url)) {
      const gridItem = document.createElement("div");
      gridItem.setAttribute('class', 'grid-item');
      gridItem.setAttribute('id', tab.id);
      const capturing = browser.tabs.captureTab(tab.id);
      capturing.then((uri) => { onCaptured(uri, gridItem, tab); });
      parent.appendChild(gridItem);
    }
  })
  ;
}

const getTabs = () => {
  const querying = browser.tabs.query({});
  querying.then(createTabItems);
}

const setPopupProperties = (windowInfo) => {
  if (windowInfo.width < 800) {
    document.getElementById('container').setAttribute('class', 'grid-list');
    document.getElementById('curtain').style.gridTemplateColumns = 'auto';
    document.getElementById('search').style.gridArea = '2 / 1';
    document.getElementById('search').style.left = '70px';
    document.getElementById('results').style.gridArea = '2 / 1';
    document.getElementById('results').style.left = '70px';
  }
}

const adjustPopup = () => {
  const getting = browser.windows.getCurrent({populate: true});
  getting.then(setPopupProperties);
}

/**
 * ENTRY POINT HERE
 */
adjustPopup();
getTabs();
addCloseBtnListener();
addSearchInputChangeListener();
