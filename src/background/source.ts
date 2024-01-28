export default function sourceFinder(): {
  id: string
  text: string
  markup: string
} {
  var target = document.activeElement

  function toText(element: HTMLElement): string {
    let text = element.innerText || ""
    let lines = []

    let buffer = text.match(/[^\r\n]+/g) || []
    buffer.forEach(function (line) {
      if (line === "" || !isNaN(Number(line))) {
        return
      }
      lines.push(line)
    })

    return lines.join("\n")
  }

  function isSupported(el: HTMLElement): boolean {
    if (el) {
      if (el.tagName.toLowerCase() === "textarea") {
        return true
      } else if (el.isContentEditable) {
        return true
      }
    }
    return false
  }

  if (target instanceof HTMLElement && isSupported(target)) {
    return {
      text: toText(target),
      markup: target.outerHTML,
      id: target.id || target.className
    }
  }

  return { id: "", text: "", markup: "" }
}
