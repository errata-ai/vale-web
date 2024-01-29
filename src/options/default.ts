import { Storage } from "@plasmohq/storage";
import { EditorView } from "codemirror";

const storage = new Storage()

const ymlConfig = {
  lineNumbers: true,
  lineWrapping: false,
  indentWithTabs: false,
  indentUnit: 2,
  tabSize: 2,
  value:
    "---\n\
# Configure how the extension will treat content from\n\
# specific websites. The default is to treat content\n\
# as plain text (`.txt`), but some sites support markup\n\
# content (e.g., Markdown on GitHub and Reddit).\n\
#\n\
# The supported values are `.md` (Markdown), `.adoc` (AsciiDoc),\n\
# `.rst` (reStructuredText), and `.html` (HTML).\n\
sites:\n\
  github.com: '.md'\n\
  reddit.com: '.md'\n\
",
  mode: "yaml",
  theme: "github",
};

export async function save_options(editor: EditorView) {
  await storage.set("config", editor.state.doc.toString())
}

export async function restore_options(): Promise<string> {
  const data = await storage.get("config")
  if (data) {
    return data
  }
  return ymlConfig.value;
}

export function reset_options(editor: EditorView) {
  editor.dispatch({
    changes: {
      from: 0,
      to: editor.state.doc.length,
      insert: ymlConfig.value,
    },
  });
}
