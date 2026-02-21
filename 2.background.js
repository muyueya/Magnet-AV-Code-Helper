chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ 
    id: "missav_direct", 
    title: "📺 MissAV 搜索: %s", 
    contexts: ["selection"] 
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "missav_direct") {
    const code = info.selectionText.trim().toUpperCase();
    chrome.tabs.create({ url: "https://missav.ws/search/" + encodeURIComponent(code) });
  }
});
