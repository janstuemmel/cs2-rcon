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
    .catch(err => console.log(err.message))

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
    fitAddon.fit();

    window.addEventListener('resize', () => fitAddon.fit())

    const exec = async (cmd: string) => {
      const res = await api.exec(cmd);
      if (res !== '') localEcho.println(res);
      read();
    }

    const read = () => localEcho.read("> ")
      .then(exec)
      .catch((err: Error) => localEcho.println(err.message))

    read()
  }

</script>

<svelte:window bind:innerHeight={innerHeight} />

<div style:height={`${innerHeight - 150}px`} bind:this={termElem}></div>