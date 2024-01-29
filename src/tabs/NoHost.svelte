<script lang="ts">
  import "../style.css"

  const browserName = process.env.PLASMO_BROWSER
</script>

<div class="hero text-base">
  <div class="hero-content">
    <div class="max-w-3xl">
      <div class="border dark:border-gray-800 mb-3 py-2 px-2 rounded">
        <strong>Vale</strong>
        <small><i>for the web</i></small>
      </div>
      <h1 class="text-3xl font-bold">Host not found</h1>
      <p class="py-3">
        The extension was unable to connect to the <a
          class="link"
          href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging"
          target="_blank">native messaging host</a
        >. This usually occurs when the host has not been installed.
      </p>
      <p class="pb-3">
        If you haven't already, please install it from the command-line:
      </p>
      <div class="mockup-code">
        <pre data-prefix="$"><code>vale setup-host {browserName}</code></pre>
        <pre data-prefix=">" class="text-info"><code>installing ...</code></pre>
        <pre data-prefix=">" class="text-success"><code>Done!</code></pre>
      </div>
      <p class="py-3">
        If the problem persists, please open an issue on <a
          class="link"
          href="https://github.com/errata-ai/vale-native/issues/new"
          target="_blank">GitHub</a
        >.
      </p>
    </div>
  </div>
</div>
