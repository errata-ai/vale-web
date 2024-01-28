<script lang="ts">
  import { onMount } from "svelte"
  import browser from "webextension-polyfill"

  import "./style.css"

  var status = "idle"

  onMount(() => {
    browser.runtime.sendMessage({
      action: "get_source"
    })

    browser.runtime.onMessage.addListener(function (request) {
      if (request.action === "analysis_complete") {
        status = "complete"
      }
    })
  })
</script>

<div>
  <h2 class="text-center text-red-100">Welcome to your Vale Extension!</h2>
  <p class="text-center text-red-100">
    {status}
  </p>
</div>
