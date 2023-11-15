<script lang="ts">
  export let active: boolean;
  export let name: string;
  export let value: string = '';
  export let defaultValue: string = '';
  export let description: string;
  let elem: HTMLDivElement;
  
  export let scrollTo: (top: number) => any

  $: if (active && elem) {
    scrollTo(elem.offsetTop)
  }
</script>

<div bind:this={elem} class="p-4 min-h-[50px] flex flex-col gap-1" class:dark:bg-nord-2={active} class:bg-nord-5={active}>
  <div class="flex items-center gap-2">
    <div class="truncate text-sm font-mono text-nord-0 dark:text-nord-4 font-semibold tracking-wider">{name}</div>
    {#if value.length < 10 && value !== ''}
      <div class="truncate text-xs font-mono text-nord-3 dark:text-gray-400 w-30">= {value}</div>
    {/if}
    {#if defaultValue.length < 10 && defaultValue !== ''}
      <div class="truncate text-xs font-mono text-nord-3 dark:text-gray-400">(default: {defaultValue})</div>
    {/if}
  </div>
  <div class="text-xs font-mono text-nord-3 dark:text-gray-400">{description || 'n/a'}</div>
</div>