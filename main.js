const parent = document.getElementById("container");

const onCaptured = (imageUri, tabItem) => {
  const image = document.createElement('img');
  image.setAttribute('src', imageUri);
  image.setAttribute('class', 'image');
  tabItem.appendChild(image);
};

const createTabItems = (tabs) => {
  tabs.forEach((tab) => {
    const tabItem = document.createElement("div");
    tabItem.setAttribute('class', 'grid-item');
   /* const textNode = document.createTextNode(tab.url);
    node.appendChild(textNode);*/
    const capturing = browser.tabs.captureTab(tab.id);
    capturing.then((uri) =>{ onCaptured(uri, tabItem); });

    parent.appendChild(tabItem);
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
