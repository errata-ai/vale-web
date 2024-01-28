import jsyaml from "js-yaml"
import browser from "webextension-polyfill"
import { defaultSettings, ExtSettings } from "./settings"

/*
On startup, connect to Vale's native messaging host.
*/
var port = browser.runtime.connectNative("sh.vale.native")

port.onMessage.addListener(function (msg) {
  const payload = JSON.parse(msg.data)
  if (msg.command === "lint") {
    showResults(payload)
  }
})

port.onDisconnect.addListener(function () {
  console.log("Disconnected")
})

function showResults(payload: any) {
  const keys = Object.keys(payload)
  if (keys.length === 0) {
    browser.runtime.sendMessage({
      action: "analysis_complete",
      alerts: [],
      status: '<span class="p-2">✅</span>No alerts found!',
    });
  } else {
    browser.runtime.sendMessage({
      action: "analysis_complete",
      alerts: payload[keys[0]],
    });
  }
}

function postVale(request: any, settings: ExtSettings, target: string) {
  const ext = settings.sites[target] || ".txt"
  console.log("Linting text as", ext, request)
  port.postMessage({
    command: "lint",
    text: request.text,
    format: ext,
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
      console.log("Loading saved config ...")
      settings = jsyaml.load(items.config) as ExtSettings
    }
    if (resp.text) {
      postVale(resp, settings, target)
    } else {
      postHTML(resp, settings)
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
