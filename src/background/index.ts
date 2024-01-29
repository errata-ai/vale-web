import browser from "webextension-polyfill"
import lintElement from "./lint"
import sourceFinder from "./source"

export {}

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
            console.log("Found source", result[0].result)
            lintElement(result[0].result)
          })
      })
  }
})
