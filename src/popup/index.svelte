<script lang="ts">
  import { onMount } from "svelte"
  // https://github.com/dasDaniel/svelte-table/issues/68
  import SvelteTable from "svelte-table/src/SvelteTable.svelte"
  import browser from "webextension-polyfill"
  import { spanFormatter, type AlertRow } from "./alert"

  import "../style.css"

  let loading: boolean = true
  let rows: AlertRow[] = []

  const columns = [
    {
      key: "rule",
      title: "Rule",
      value: (v: AlertRow) => v.rule,
      renderValue: (v: AlertRow) => spanFormatter(v),
      parseHTML: true
    },
    {
      key: "message",
      title: "Message",
      value: (v: AlertRow) => v.message
    },
    {
      key: "location",
      title: "Location",
      value: (v: AlertRow) => v.location
    }
  ]

  onMount(() => {
    browser.runtime.sendMessage({
      action: "get_source"
    })

    browser.runtime.onMessage.addListener(function (req) {
      if (req.action === "analysis_complete") {
        rows = []
        for (let [index, val] of req.alerts.entries()) {
          rows.push({
            id: index,
            rule: val.Check,
            message: val.Message,
            location: val.Line + ":" + val.Span[0] + "-" + val.Span[1],
            severity: val.Severity
          })
        }
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
    <div class="overflow-x-auto">
      <div class="min-w-full sm:px-6 lg:px-8">
        <div
          class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <SvelteTable
            {columns}
            {rows}
            showExpandIcon={true}
            expandSingle={true}
            rowKey="id"
            classNameTable={"min-w-full divide-y divide-gray-300"}
            classNameThead={"bg-gray-50"}
            classNameTbody={"divide-y divide-gray-200 bg-white"}
            classNameCell={"px-3 py-2 text-left text-sm text-gray-900"} />
        </div>
      </div>
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
