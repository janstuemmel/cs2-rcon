<script lang="ts">
  import { afterUpdate, tick } from 'svelte';
  import PromptSelectItem from './PromptSelectItem.svelte';
  import { findCvar } from './client';
  
  export let submit: (cmd: string) => any

  let value = ''
  
  let selectActive = false
  let inputFocus = false
  
  export let historyData: string[] = []
  
  let selectData: Cvar[] = []
  let selectIndex: number | null = null
  
  let promptElem: HTMLDivElement
  let selectElem: HTMLDivElement
  let selectHeight: number
  let selectTop: number

  const updateUi = () => {
    selectTop = promptElem.offsetTop - selectHeight;
    if (selectElem && selectIndex === null) {
      selectElem.scrollTo({ top: 100000, behavior: 'instant' })
    }
  }

  afterUpdate(updateUi);

  $: if (value === '') {
    selectData = []
    selectActive = false
  }

  $: if (selectActive) {
    findCvar(value).then((res) => {
      selectIndex = null
      selectData = res
    })
  }

  const keydown = async (e: KeyboardEvent) => {

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (selectIndex === null) {
        selectIndex = selectData.length - 1
      } else if (selectIndex - 1 >= 0) {
        selectIndex -= 1
      }
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (selectIndex === null) {
        return
      }

      if (selectIndex + 1 <= selectData.length - 1) {
        selectIndex += 1
      } else if (selectIndex + 1 > selectData.length - 1) {
        selectIndex = null
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      selectActive = true
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      selectActive = false
      selectIndex = null
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      
      if (selectIndex !== null) {
        value = selectData[selectIndex].name + ' '
        selectIndex = null
      } else {
        submit(value)
        historyData = [value, ...historyData]
        value = ''
      }

      selectActive = false
    }
  }
</script>

<svelte:window on:resize={updateUi} />

{#if selectData.length !== 0 && selectActive && inputFocus}  
  <div 
    bind:this={selectElem}
    bind:clientHeight={selectHeight}
    style:top={`${selectTop - 10}px`}
    style:left={`${0}px`}
    style:max-height={`${300}px`}
    class="absolute w-full overflow-y-scroll bg-white dark:bg-nord-black border-t-4 border-nord-4 dark:border-nord-1">
    <div class="">
      {#each selectData as item, idx}
        <PromptSelectItem 
          scrollTo={(top) => selectElem?.scrollTo({ top, behavior: 'instant' })}
          active={idx === selectIndex} 
          {...item} />
      {/each}
    </div>
  </div>
{/if}

<div class="flex bg-nord-5 dark:bg-nord-1 rounded-md items-center text-black dark:text-nord-6 p-3 gap-2" bind:this={promptElem}>
  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-terminal" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M5 7l5 5l-5 5" />
    <path d="M12 19l7 0" />
  </svg>
  <input 
    placeholder="type something..."
    bind:value={value}
    on:focus={() => inputFocus = true}
    on:blur={() => {
      inputFocus = false
      selectActive = false
    }}
    on:keydown={keydown}
    class="bg-transparent w-full text-sm focus:outline-none font-mono tracking-wider"
    type="text" />
</div>
