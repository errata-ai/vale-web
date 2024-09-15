import jsyaml from "js-yaml"
import browser from "webextension-polyfill"
import { defaultSettings, type ExtSettings } from "./settings"

/*
On startup, connect to Vale's native messaging host.
*/
const port = browser.runtime.connectNative("sh.vale.native")

port.onMessage.addListener(function (msg) {
  const payload = JSON.parse(msg.output)
  if (msg.command === "lint") {
    showResults(msg.input, payload)
  } else if (msg.command === "error") {
    browser.runtime.sendMessage({
      action: "analysis_failed",
      alerts: [],
      source: payload.Text,
    });
  }
})

port.onDisconnect.addListener(function () {
  if (browser.runtime.lastError) {
    if (browser.runtime.lastError.message === "Specified native messaging host not found.") {
      browser.tabs.create({
        url: "./tabs/NoHost.html"
      })
    } else {
      browser.tabs.create({
        url: "./tabs/ErrorMsg.html?msg=" + browser.runtime.lastError.message
      })
    }
  }
  console.log("Disconnected")
})

function showResults(text: string, payload: any) {
  const keys = Object.keys(payload)
  if (keys.length === 0) {
    browser.runtime.sendMessage({
      action: "analysis_complete",
      alerts: [],
      source: text,
    });
  } else {
    browser.runtime.sendMessage({
      action: "analysis_complete",
      alerts: payload[keys[0]],
      source: text,
    });
  }
}

function postVale(request: any, settings: ExtSettings, target: string) {
  const ext = settings.sites[target] || ".txt"
  port.postMessage({
    command: "lint",
    text: request.text,
    format: ext,
    url: target,
  })
}

function postHTML(request: any, settings: ExtSettings): void {
  console.log("Linting HTML", request)
  //port.postMessage({ command: "ls-config" })
}

function doLint(target, resp) {
  browser.storage.local.get("config").then(function (items) {
    var settings = defaultSettings
    if (items.config) {
      settings = jsyaml.load(items.config) as ExtSettings
    }
    if (resp.markup) {
      postHTML(resp, settings)
    } else {
      postVale(resp, settings, target)
    }
  })
}

export default function lintElement(resp: {
  text: string
  markup: string
  id: any
}): void {
  if (resp.text !== "" || resp.markup !== "") {
    browser.tabs
      .query({
        active: true,
        currentWindow: true
      })
      .then(function (tabs) {
        const target = new URL(tabs[0].url).hostname.replace("www.", "")
        doLint(target, resp)
      })
  } else {
    browser.runtime.sendMessage({
      action: "analysis_complete",
      alerts: [],
      source: "",
      status:
        '<span class="p-2">🔎</span> No content found; try editing some text and then clicking the icon.'
    })
  }
}
