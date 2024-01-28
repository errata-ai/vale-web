import jsyaml from "js-yaml"
import browser from "webextension-polyfill"
import { defaultSettings, ExtSettings } from "./settings"

function postVale(request: any, settings: ExtSettings, target: string) {
  const ext = settings.sites[target] || ".txt"
  console.log("Linting text as", ext, request)
}

function postHTML(request: any, settings: ExtSettings): void {
  console.log("Linting HTML", request)
  //port.postMessage({ command: "ls-config" })
}

function doLint(target, resp) {
  browser.storage.local.get("config").then(function (items) {
    var settings = defaultSettings
    console.log("LOADED", items)
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
