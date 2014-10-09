chrome.extension.onMessage.addListener(
  fuction(request, sender, sendResponse) {
    if (request.action === "prefs") {
      var prefsString = localStorage.prefs;
      if (prefsString === undefined) {
        sendResponse(undefined);
      } else {
        sendResponse(JSON.parse(localStorage.prefs));
      }
    }
  });


chrome.broswerAction.onClicked.addListener(click);