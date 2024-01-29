<script lang="ts">
  import { onMount } from "svelte"
  // https://github.com/dasDaniel/svelte-table/issues/68
  import SvelteTable from "svelte-table/src/SvelteTable.svelte"
  import browser from "webextension-polyfill"
  import type { ValeAlert } from "./alert"

  import "./style.css"

  let loading = true
  let rows = []

  const columns = [
    {
      key: "rule",
      title: "Rule",
      value: (v) => v.rule
      //renderValue: (v) => {}, // add spans
    },
    {
      key: "message",
      title: "Message",
      value: (v) => v.message
    },
    {
      key: "location",
      title: "Location",
      value: (v) => v.location
    }
  ]

  onMount(() => {
    browser.runtime.sendMessage({
      action: "get_source"
    })

    browser.runtime.onMessage.addListener(function (req) {
      if (req.action === "analysis_complete") {
        rows = req.alerts.map((alert: ValeAlert) => {
          return {
            rule: alert.Check,
            message: alert.Message,
            location: alert.Line + ":" + alert.Span[0] + "-" + alert.Span[1]
          }
        })
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
{:else if rows.length > 0}
  <div class="popup">
    <SvelteTable {columns} {rows}></SvelteTable>
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
