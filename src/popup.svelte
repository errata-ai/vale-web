<script lang="ts">
  import { onMount } from "svelte"
  import browser from "webextension-polyfill"

  import "./style.css"

  onMount(() => {
    browser.runtime.sendMessage({
      action: "get_source"
    })
  })

  browser.runtime.onMessage.addListener(function (req) {
    if (req.action === "analysis_complete") {
      /*for (alert in req.alerts) {
        var a = req.alerts[alert]
      }
      console.log(rows)*/
    }
  })
</script>

<div id="wrapper" class="popup">
  <table class="table-fixed">
    <thead>
      <tr>
        <th>Song</th>
        <th>Artist</th>
        <th>Year</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
        <td>Malcolm Lockyer</td>
        <td>1961</td>
      </tr>
      <tr>
        <td>Witchy Woman</td>
        <td>The Eagles</td>
        <td>1972</td>
      </tr>
      <tr>
        <td>Shining Star</td>
        <td>Earth, Wind, and Fire</td>
        <td>1975</td>
      </tr>
    </tbody>
  </table>
</div>

<style>
  .popup {
    min-width: 400px;
    overflow: auto;
    max-height: 400px;
  }
</style>
