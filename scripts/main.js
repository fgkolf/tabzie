const parent = document.getElementById("container");

// Star Button related
const createStarBtn = (url) => {
  const hoverIcon = document.createElement('span')
  hoverIcon.setAttribute('class', 'overlay');
  hoverIcon.setAttribute('data-url', url);
  hoverIcon.addEventListener('mouseover', onStarHovered);
  hoverIcon.addEventListener('mouseout', onStarOut);
  hoverIcon.addEventListener('click', onStarClicked);
  return hoverIcon;
}

// Image related
const createImage = (imageUri) => {
  const image = document.createElement('img');
  image.setAttribute('src', imageUri);
  return image;
};

const onCaptured = (imageUri, gridItem, tab) => {
  gridItem.appendChild(createImage(imageUri));
  gridItem.appendChild(createStarBtn(tab.url));
};

const createTabItems = (tabs) => {
  tabs.forEach((tab) => {
    const gridItem = document.createElement("div");
    gridItem.setAttribute('class', 'grid-item');
   /* const textNode = document.createTextNode(tab.url);
    node.appendChild(textNode);*/
    const capturing = browser.tabs.captureTab(tab.id);
    capturing.then((uri) =>{ onCaptured(uri, gridItem, tab); });
    parent.appendChild(gridItem);
  })
  ;
}

const getTabs = () => {
  const querying = browser.tabs.query({});
  querying.then(createTabItems);
}

/**
 * ENTRY POINT HERE
 */
getTabs();
