<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { Copy, Check, MessageSquare, X, Share2 } from '@lucide/svelte';
  import confetti from 'canvas-confetti';

  let { isOpen = $bindable(false) } = $props();
  let copied = $state(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(store.invoiceText);
      copied = true;
      triggerConfetti();
      store.showToast("متن فاکتور با موفقیت در کلیپ‌بورد کپی شد!", "success");
      setTimeout(() => (copied = false), 2500);
    } catch (err) {
      // روش سنتی پشتیبان
      const ta = document.createElement('textarea');
      ta.value = store.invoiceText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copied = true;
      store.showToast("متن فاکتور در کلیپ‌بورد کپی شد!", "success");
      setTimeout(() => (copied = false), 2500);
    }
  }

  function handleWhatsApp() {
    const encoded = encodeURIComponent(store.invoiceText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  }

  function triggerConfetti() {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {}
  }

  function close() {
    isOpen = false;
  }
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div class="modal-backdrop" onclick={close} onkeydown={(e) => e.key === 'Escape' && close()} role="presentation">
    <div class="modal-content glass-card" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
      <div class="modal-header">
        <div class="modal-title-group">
          <Share2 size={20} class="header-icon" />
          <h3>پیش‌نمایش و اشتراک‌گذاری فاکتور</h3>
        </div>
        <button class="btn btn-ghost btn-icon close-btn" onclick={close}>
          <X size={20} />
        </button>
      </div>

      <div class="invoice-body">
        <pre class="invoice-pre">{store.invoiceText}</pre>
      </div>

      <div class="modal-footer">
        <button class="btn btn-copper copy-btn" onclick={handleCopy}>
          {#if copied}
            <Check size={18} />
            <span>کپی شد!</span>
          {:else}
            <Copy size={18} />
            <span>کپی در کلیپ‌بورد</span>
          {/if}
        </button>

        <button class="btn btn-primary wa-btn" onclick={handleWhatsApp}>
          <MessageSquare size={18} />
          <span>ارسال در واتساپ</span>
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 999;
  }

  .modal-content {
    width: 100%;
    max-width: 550px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    max-height: 85vh;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border-color);
  }

  .modal-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .modal-title-group h3 {
    font-size: 1.05rem;
    font-weight: 700;
  }

  :global(.header-icon) {
    color: var(--ice-500);
  }

  .invoice-body {
    padding: 14px 0;
    overflow-y: auto;
    flex: 1;
  }

  .invoice-pre {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 16px;
    font-size: 0.9rem;
    line-height: 1.7;
    white-space: pre-wrap;
    word-break: break-word;
    color: var(--text-primary);
  }

  .modal-footer {
    display: flex;
    gap: 12px;
    padding-top: 14px;
    border-top: 1px solid var(--border-color);
  }

  .copy-btn, .wa-btn {
    flex: 1;
  }

  .wa-btn {
    background: linear-gradient(135deg, #10b981, #059669);
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
  }

  @media (max-width: 480px) {
    .modal-footer {
      flex-direction: column;
    }
  }
</style>
