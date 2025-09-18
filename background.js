// Handle action click to open side panel
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// Set up side panel for all tabs (optional - enables side panel for all tabs)
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({
    path: 'popup.html',
    enabled: true
  });
});