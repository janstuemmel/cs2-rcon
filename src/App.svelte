<script lang="ts">
  import Console from "./Console.svelte";
</script>

<div class="flex-1 flex flex-col h-screen bg-gray-100 dark:bg-gray-700">
  <div class="flex-1 p-2 text-center tracking-widest text-gray-500 font-mono font-bold">
    CS<sup class="text-xs">2</sup> RCON
  </div>

  <div class="p-4">
    <div class="p-4 rounded-md bg-gray-800">
      <Console />
    </div>
  </div>
</div>
