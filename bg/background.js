
chrome.runtime.onMessage.addListener(onRuntimeMessage);
chrome.browserAction.onClicked.addListener(function(tab) {
  var optionUrl = chrome.extension.getURL('settings/index.html');
  chrome.tabs.query({
    url: optionUrl
  }, function(tabs) {
    var props;
    if (tabs.length > 0) {
      props = {
        active: true
      };
      chrome.tabs.update(tabs[0].id, props);
    } else {
      chrome.tabs.create({
        url: optionUrl
      });
    }
  });
});
/*chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'r.kamihimeproject.net', schemes: ["https", "http"] },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'g.kamihimeproject.net', schemes: ["https", "http"] },
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});*/

function onRuntimeMessage (msg, sender, sendResponse) {
    if (chrome.runtime.lastError)
        log(chrome.runtime.lastError);            

    var key = msg.type;

    switch (key) {
        case "getSettings":
            sendResponse(getSettings());
            break;
        default:
            log("Unknown message " + key);
            sendResponse({error: true});
            break;
    }
};
function getSettings(){
    var values = {};
    values.queueConfig = JSON.parse(localStorage["queueConfig"]||"[]");
    values.enableHotkey = localStorage["enableHotkey"]=="true";
	values.autoStartBattle = localStorage["autoStartBattle"] == "true";
	values.autoUseSkill = localStorage["autoUseSkill"] == "true";
	values.extensionId = chrome.i18n.getMessage("@@extension_id");
    return values;
}


function store(key,value){
    if(value===undefined){
        return window.localStorage[key];
    }else{
        window.localStorage[key] = value;
    }
}    
