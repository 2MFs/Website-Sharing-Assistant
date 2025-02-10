//創建右鍵選單
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "shareMenu",
    title: "分享此網站 Share this website",
    contexts: ["all"]
  });

});

// 當右鍵選單項目被點擊時執行
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // 檢查選單項目 ID 並驗證 URL
  if (info.menuItemId === "shareMenu") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const url = chrome.runtime.getURL("popup.html") +
        `?title=${encodeURIComponent(currentTab.title)}&url=${encodeURIComponent(currentTab.url)}`;

      chrome.windows.create({
        url: url,
        type: "popup",
      });
    });
  } else {
    //console.warn('這個頁面不允許執行腳本。');
    console.warn('這個頁面不允許執行腳本。');
  }
});



// 檢查 URL 是否有效的函數
function isValidUrl(url) {
  // 避免在 chrome:// 和 chrome-extension:// 頁面上執行腳本
  return !url.startsWith('chrome://') && !url.startsWith('chrome-extension://');
}


