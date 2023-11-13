<script lang="ts">
  import 'xterm/css/xterm.css';
  import { Terminal } from 'xterm';
  import { FitAddon } from '@xterm/addon-fit';
  // @ts-ignore
  import LocalEchoController from 'local-echo';
  import * as api from './client.js';

  let termElem: HTMLDivElement;
  let complete: string[] = [];
  let localEcho: any = null
  let innerHeight: number;

  api.getCvarList()
    .then((cmds) => complete = cmds)
    .catch(console.error)

  const completeHandler = (idx: number) => idx === 0 ? complete : []
  
  $: if (termElem && localEcho) {
    localEcho.removeAutocompleteHandler(completeHandler)
    localEcho.addAutocompleteHandler(completeHandler)
  }

  $: if (termElem) {
    const term = new Terminal({
      cursorBlink: true,
      allowTransparency: true,
      fontSize: 16,
      theme: {
        foreground: "white",
        cursor: 'white',
        background: "rgba(0,0,0,0)"
      }
    })

    const fitAddon = new FitAddon();
    localEcho = new LocalEchoController();
    
    term.open(termElem)
    term.loadAddon(fitAddon);
    term.loadAddon(localEcho);

    setTimeout(() => fitAddon.fit(), 100)
    window.addEventListener('resize', () => fitAddon.fit())

    const exec = async (cmd: string) => cmd && api.exec(cmd)
      .then(res => res ? localEcho.println(res) : null)
      .catch(err => localEcho.println(`${err}`));
      
    const read = () => localEcho.read("> ")
      .then(exec)
      .finally(read);

    read();
  }

</script>

<svelte:window bind:innerHeight={innerHeight} />

<div style:height={`${innerHeight - 150}px`} bind:this={termElem}></div>
