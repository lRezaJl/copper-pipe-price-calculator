<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { CheckCircle2, Info, AlertCircle } from '@lucide/svelte';
</script>

{#if store.toast.show}
  <div class="toast-wrapper">
    <div class="toast-card glass-card" class:success={store.toast.type === 'success'} class:info={store.toast.type === 'info'}>
      {#if store.toast.type === 'success'}
        <CheckCircle2 size={18} class="toast-icon success" />
      {:else}
        <Info size={18} class="toast-icon info" />
      {/if}
      <span class="toast-msg">{store.toast.message}</span>
    </div>
  </div>
{/if}

<style>
  .toast-wrapper {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    pointer-events: none;
    animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .toast-card {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 22px;
    border-radius: var(--radius-full);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
  }

  .toast-msg {
    font-size: 0.92rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  :global(.toast-icon.success) {
    color: var(--accent-emerald);
  }

  :global(.toast-icon.info) {
    color: var(--ice-500);
  }

  @keyframes toastIn {
    from {
      opacity: 0;
      transform: translate(-50%, 20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0) scale(1);
    }
  }
</style>
