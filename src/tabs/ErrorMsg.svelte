<script lang="ts">
  import "../style.css"

  const urlParams = new URLSearchParams(window.location.search)
  const errMsg = urlParams.get("msg") as string
</script>

<div class="hero text-base">
  <div class="hero-content">
    <div class="max-w-3xl">
      <div class="border dark:border-gray-800 mb-3 py-2 px-2 rounded">
        <strong>Vale</strong>
        <small><i>for the web</i></small>
      </div>
      <h1 class="text-3xl font-bold">Unable to connect</h1>
      <p class="py-3">
        The extension was unable to connect to the <a
          class="link"
          href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging"
          target="_blank">native messaging host</a
        >. The following error was returned by either the host or the browser
        itself:
      </p>
      <div role="alert" class="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{errMsg}</span>
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
