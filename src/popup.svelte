<script lang="ts">
  import { onMount } from "svelte"
  import browser from "webextension-polyfill"

  import "./style.css"

  let alerts = []
  let loading = true

  onMount(() => {
    browser.runtime.sendMessage({
      action: "get_source"
    })

    browser.runtime.onMessage.addListener(function (req) {
      if (req.action === "analysis_complete") {
        alerts = req.alerts
        loading = false
      }
    })
  })
</script>

{#if loading}
  <div class="popup flex items-center justify-center py-2">
    <div
      class="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
      role="status"
      aria-label="loading">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
{:else if alerts.length > 0}
  <div class="popup">
    <div
      class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >Rule</th>
            <th
              scope="col"
              class="px-3 py-2 text-left text-sm font-semibold text-gray-900"
              >Message</th>
            <th
              scope="col"
              class="px-3 py-2 text-left text-sm font-semibold text-gray-900"
              >Location</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {#each alerts as alert}
            <tr>
              {#if alert.Severity === "error"}
                <td
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                  ><span
                    class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
                    >{alert.Check}</span
                  ></td>
              {:else if alert.Severity === "warning"}
                <span
                  class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
                  >{alert.Check}</span>
              {:else}
                <span
                  class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                  >{alert.Check}</span>
              {/if}
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                >{alert.Message}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                >{alert.Line + ":" + alert.Span[0] + "-" + alert.Span[1]}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{:else}
  <div class="popup">
    <div class="rounded-md bg-green-50 p-4 min-w-full">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">No issues found</p>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .popup {
    min-width: 400px;
    overflow: auto;
    max-height: 400px;
  }
</style>
