<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { CheckCircle2, Info, AlertCircle } from '@lucide/svelte';
</script>

{#if store.toast.show}
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div class="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-card/95 text-card-foreground backdrop-blur-xl border border-border shadow-2xl">
      {#if store.toast.type === 'success'}
        <CheckCircle2 class="size-4.5 text-emerald-500 shrink-0" />
      {:else}
        <Info class="size-4.5 text-sky-500 shrink-0" />
      {/if}
      <span class="text-xs sm:text-sm font-bold text-foreground">{store.toast.message}</span>
    </div>
  </div>
{/if}
