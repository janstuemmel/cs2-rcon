<script lang="ts">
  import { afterUpdate, tick } from 'svelte';
  import PromptSelectItem from './PromptSelectItem.svelte';
  import { findCvar } from './client';
  
  export let submit: (cmd: string) => any

  let value = ''
  let active = false
  let history: string[] = ['status', 'mp_']
  let data: Cvar[] = []
  let selectHeight: number
  let selectWidth: number
  let selectLeft: number
  let selectTop: number
  let promptElem: HTMLDivElement
  let selectElem: HTMLDivElement
  let selectIndex: number | null = null

  const updateUi = () => {
    selectTop = promptElem.offsetTop - selectHeight;
    selectLeft = promptElem.offsetLeft;
    selectWidth = promptElem.clientWidth;
    if (selectElem && selectIndex === null) {
      selectElem.scrollTo({ top: 100000 })
    }
  }

  afterUpdate(updateUi);

  const keydown = async (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (selectIndex === null) {
        selectIndex = data.length - 1
      } else if (selectIndex - 1 >= 0) {
        selectIndex -= 1
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (selectIndex === null) {
        return
      }
      if (selectIndex + 1 <= data.length - 1) {
        selectIndex += 1
      }
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (selectIndex !== null) {
        value = data[selectIndex].name + ' '
        selectIndex = null
        data = []
      } else {
        submit(value)
        history = [value, ...history]
        value = ''
      }
    }
  }

  let timer: number;

  $: if (value === '') {
    data = []
  }

  const setData = (v: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => {

      // TODO: cleanup
      if (v.length < 2 || v.includes(' ')) {
        selectIndex = null
        data = []
        return;
      }

      findCvar(v).then((res) => {
        selectIndex = null
        data = value === '' ? [] : res.reverse()
          .sort((a, b) => (a.name.includes(v) ? 1 : 0) - (b.name.includes(v) ? 1 : 0))
          .sort((a, b) => (a.name.startsWith(v) ? 1 : 0) - (b.name.startsWith(v) ? 1 : 0))
      })

    }, 100);
  }
</script>

<svelte:window on:resize={updateUi} />

{#if data.length !== 0 && active}  
  <div 
    bind:this={selectElem}
    bind:clientHeight={selectHeight}
    style:top={`${selectTop - 10}px`}
    style:left={`${selectLeft}px`}
    style:max-height={`${300}px`}
    style:width={`${selectWidth}px`}
    class="absolute bg-gray-800 w-full rounded-md overflow-y-scroll shadow-md">
    {#each data as item, idx}
      <PromptSelectItem 
        scrollTo={(top) => selectElem?.scrollTo({ top, behavior: 'instant' })}
        active={idx === selectIndex} 
        {...item} />
    {/each}
  </div>
{/if}

<div class="flex bg-gray-800 rounded-md items-center text-white p-3 gap-2" bind:this={promptElem}>
  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-terminal" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M5 7l5 5l-5 5" />
    <path d="M12 19l7 0" />
  </svg>
  <input 
    placeholder="type something..."
    bind:value={value}
    on:focus={() => active = true}
    on:blur={() => {active = false; selectIndex = null}}
    on:input={(e) => setData(e.currentTarget.value)}
    on:keydown={keydown}
    class="bg-transparent w-full text-sm focus:outline-none font-mono"
    type="text" />
</div>
