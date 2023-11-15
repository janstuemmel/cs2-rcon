<script lang="ts">
  import { afterUpdate } from "svelte";
  import Prompt from "./Prompt.svelte";
  import { exec } from "./client";

  type CommandResult = {
    cmd: string
    res: string
  }

  let resultElem: HTMLDivElement;
  
  let results: CommandResult[] = []

  const submit = (cmd: string) => {
    if (cmd === '') {
      return
    }
    exec(cmd).then(res => {
      results = [{ res, cmd }, ...results]
    })
  }
  
  afterUpdate(() => resultElem.scrollTo({ top: 10000 }))
</script>

<div class="flex flex-col flex-1 h-screen bg-white dark:bg-nord-black gap-4">

  <div bind:this={resultElem} class="px-4 pt-4 flex-1 flex flex-col-reverse gap-4 overflow-y-scroll">
    {#each results as result}
      <div class="flex flex-col gap-1 py-2 text-xs bg-nord-6 dark:bg-nord-0 rounded-md">
        <div class="text-nord-3 dark:text-gray-400 px-2 font-mono">> {result.cmd}</div>
        <pre class="text-nord-black dark:text-nord-6 overflow-x-scroll px-2"><code>{result.res}</code></pre>
      </div>
    {/each}
  </div>

  <div class="px-4 pb-4">
    <Prompt {submit} historyData={results.map((r) => r.cmd)} />
  </div>
</div>
