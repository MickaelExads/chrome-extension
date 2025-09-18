// Alternative approach: Open extension in a new tab
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('popup.html')
  });
});
