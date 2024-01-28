import browser from "webextension-polyfill"
import sourceFinder from "./source"
import lintElement from "./lint"

export {}

/*
On startup, connect to Vale's native messaging host.
*/
var port = browser.runtime.connectNative("sh.vale.native")

port.onMessage.addListener(function (msg) {
  var payload = JSON.parse(msg.data)
  console.log("Received", payload)
})

port.onDisconnect.addListener(function () {
  console.log("Disconnected")
})

browser.runtime.onMessage.addListener(function (request) {
  if (request.action === "get_source") {
    browser.tabs
      .query({
        active: true,
        currentWindow: true
      })
      .then(async (tabs) => {
        if (tabs.length === 0) {
          console.log("No active tab found")
          return
        }
        await browser.scripting
          .executeScript({
            target: { tabId: tabs[0].id },
            func: sourceFinder
          })
          .then((result) => {
            lintElement(result[0].result)
          })
      })
  }
})
