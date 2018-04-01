function onExecuted(result) {
}

function onError(error) {
}

function myFunc(e) {
  browser.tabs.executeScript({
    file: "/content_scripts/shakira.js"
  });
}
document.getElementById("btn").addEventListener('click', myFunc);

let parent = document.getElementById("myList");

const onCaptured = (imageUri, node) => {
  var image = document.createElement('IMG');
  image.setAttribute('src', imageUri);
  image.style.height = '200px';
  image.style.width = '200px';
  node.appendChild(image);
};

function logTabs(tabs) {
  for (let tab of tabs) {
    console.log(tab.id);
    let node = document.createElement("LI");
    let textnode = document.createTextNode(tab.url);
    node.appendChild(textnode);
    parent.appendChild(node);
    const capturing = browser.tabs.captureTab(tab.id);
    capturing.then((uri) =>{ onCaptured(uri, node); });
  }
}

function getTabs() {
  var querying = browser.tabs.query({});
  querying.then(logTabs);
}

getTabs();
