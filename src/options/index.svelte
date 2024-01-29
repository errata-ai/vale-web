<script lang="ts">
  import { StreamLanguage } from "@codemirror/language"
  import { yaml } from "@codemirror/legacy-modes/mode/yaml"
  import { SvelteToast, toast } from "@zerodevx/svelte-toast"
  import { basicDark } from "cm6-theme-basic-dark"
  import { basicLight } from "cm6-theme-basic-light"
  import { EditorView, minimalSetup } from "codemirror"
  import { onDestroy, onMount } from "svelte"

  import { reset_options, restore_options, save_options } from "./default"

  import "../style.css"

  let fullpageTheme = EditorView.theme({
    "&": {
      height: "100%",
      fontSize: "10pt"
    },
    ".cm-gutters": {
      backgroundColor: "transparent"
    },
    "&.cm-editor.cm-focused": {
      outline: "none"
    }
  })

  let colorScheme = basicDark
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    colorScheme = basicLight
  }

  let editor: EditorView

  onMount(async () => {
    editor = new EditorView({
      doc: await restore_options(),
      extensions: [
        minimalSetup,
        StreamLanguage.define(yaml),
        fullpageTheme,
        colorScheme
      ],
      parent: document.querySelector("#editor") as HTMLDivElement
    })
  })

  onDestroy(() => {
    editor.destroy()
  })
</script>

<SvelteToast />

<div class="container mx-auto sm:px-4 py-5">
  <div class="flex flex-wrap">
    <div class="relative flex-grow flex-1">
      <div
        class="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300">
        <div
          class="py-3 px-3 mb-0 bg-gray-200 border-b-1 border-gray-300 text-gray-900">
          <strong>Vale</strong>
          <small>for the web</small>
        </div>
        <div class="flex-auto">
          <div id="editor" class="w-full" />
        </div>
        <div class="py-1 px-1 bg-gray-200 border-t-1 border-gray-300">
          <button
            class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline py-1 px-2 leading-tight text-xs bg-gray-600 text-white hover:bg-gray-700"
            type="button"
            on:click={async () => {
              await save_options(editor)
              toast.push("Configuration saved sucessfully!", {
                theme: {}
              })
            }}>
            Save Configuration
          </button>
          <button
            class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline py-1 px-2 leading-tight text-xs bg-gray-600 text-white hover:bg-gray-700 float-right"
            type="button"
            on:click={() => {
              reset_options(editor)
            }}>
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-wrap py-3 text-center">
    <div class="relative flex-grow flex-1">
      <p class="muted">
        To ask questions, report bugs, or request features, please visit the
        <a href="https://github.com/errata-ai/vale-native" class="underline"
          >GitHub respository</a
        >.
      </p>
      <p class="muted my-2 text-md">
        Created by <a href="https://github.com/jdkato" class="underline"
          ><b>@jdkato</b></a
        >.
      </p>
    </div>
  </div>
</div>
