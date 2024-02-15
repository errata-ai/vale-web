export default function sourceFinder(): {
  id: string
  text: string
  markup: string
} {
  var target = document.activeElement

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
    const targetObj = <HTMLInputElement>target;

    var text = targetObj.innerText || targetObj.value || "";
    var html = "";

    if (text === "" || text === undefined) {
      html = target.outerHTML;
    }

    return {
      text: text,
      // TODO: Add support for markup?
      markup: "",
      id: target.id || target.className
    }
  }

  return { id: "", text: "", markup: "" }
}
