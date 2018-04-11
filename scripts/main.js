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

// Star and File Buttons related
const createButtons = (url) => {
  const overlay = document.createElement('div')
  overlay.setAttribute('class', 'overlay');
  overlay.setAttribute('data-url', url);
  overlay.addEventListener('mouseenter', onImageEnter);
  overlay.addEventListener('mouseleave', onImageLeave);

  const starButton = document.createElement('button');
  starButton.setAttribute('class', 'btn star');
  starButton.setAttribute('data-url', url);
  starButton.addEventListener('click', onStarClicked);

  const fileButton = document.createElement('button');
  fileButton.setAttribute('class', 'btn file');
  fileButton.setAttribute('data-url', url);
  fileButton.addEventListener('click', onFileClicked);

  overlay.appendChild(starButton);
  overlay.appendChild(fileButton);
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
  gridItem.appendChild(createButtons(tab.url));
};

const urlRegEx = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const isValidURLFormat = url => urlRegEx.test(url);

const createTabItems = (tabs) => {
  tabs.forEach((tab) => {
    if (isValidURLFormat(tab.url)) {
      const gridItem = document.createElement("div");
      gridItem.setAttribute('class', 'grid-item');
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

// TODO check media property
function logTabs(windowInfo) {
  if (windowInfo.width < 500) {
    document.getElementById('container').style.gridTemplateColumns = 'auto';
  }
}

const getting = browser.windows.getCurrent({populate: true});
getting.then(logTabs);
/**
 * ENTRY POINT HERE
 */
getTabs();
addCloseBtnListener();
addSearchInputChangeListener();
