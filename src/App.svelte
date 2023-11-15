<script lang="ts">
  import { afterUpdate } from "svelte";
  import Prompt from "./Prompt.svelte";
  import { exec } from "./client";

  type CommandResult = {
    cmd: string
    res: string
  }

  let resultElem: HTMLDivElement;
  
  let results: CommandResult[] = [
    // 'asdsakdlksaj\nsadsadsasdsakdlksaj\nsadsadsasdsakdlksaj\nsadsadsasdsakdlksaj\nsadsadsasdsakdlksaj\nsadsadsasdsakdlksaj\nsadsads'
  ]

  const submit = (cmd: string) => {
    console.log(cmd)
    if (cmd === '') {
      return
    }
    exec(cmd).then(res => {
      results = [{ res, cmd }, ...results]
    })
  }
  
  afterUpdate(() => resultElem.scrollTo({ top: 10000 }))
</script>

<div class="flex flex-col flex-1 h-screen bg-gray-100 dark:bg-gray-700 gap-4">

  <div bind:this={resultElem} class="px-4 pt-4 flex-1 flex flex-col-reverse gap-4 overflow-y-scroll">
    {#each results as result}
      <div class="text-gray-200 text-xs bg-gray-600 rounded-md">
        <pre class="overflow-x-scroll p-2"><code>{result.res}</code></pre>
      </div>
    {/each}
  </div>

  <div class="px-4 pb-4">
    <Prompt {submit} />
  </div>
</div>
