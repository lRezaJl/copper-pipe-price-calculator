<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { formatNumber } from '../lib/calculator.js';
  import { Share2, Copy, Eye, RotateCcw, Check, Sparkles } from '@lucide/svelte';
  import confetti from 'canvas-confetti';

  let { onOpenModal } = $props();
  let copied = $state(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(store.invoiceText);
      copied = true;
      triggerConfetti();
      store.showToast("متن فاکتور در کلیپ‌بورد کپی شد!", "success");
      setTimeout(() => (copied = false), 2500);
    } catch (e) {
      onOpenModal();
    }
  }

  async function handleShare() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: "فاکتور لوله مسی و اتصالات",
          text: store.invoiceText,
        });
        store.showToast("فاکتور به اشتراک گذاشته شد", "success");
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          onOpenModal();
        }
      }
    } else {
      onOpenModal();
    }
  }

  function triggerConfetti() {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.85 },
      });
    } catch (e) {}
  }
</script>

<div class="glass-card summary-card">
  <div class="summary-top">
    <div class="total-label-group">
      <span class="total-badge">
        <Sparkles size={14} /> جمع کل فاکتور
      </span>
      <div class="total-amounts">
        <div class="rial-line">
          <span class="total-number">{formatNumber(store.grandTotal)}</span>
          <span class="unit-text">ریال</span>
        </div>
      </div>
    </div>

    <!-- ریز اقلام محاسبه‌شده -->
    <div class="breakdown-pills">
      {#if store.pipe1Result.enabled && store.pipe1Result.totalPrice > 0}
        <div class="pill">
          <span class="pill-title">لوله ۱:</span>
          <span class="pill-val">{formatNumber(store.pipe1Result.totalPrice)} ریال</span>
        </div>
      {/if}
      {#if store.pipe2Result.enabled && store.pipe2Result.totalPrice > 0}
        <div class="pill">
          <span class="pill-title">لوله ۲:</span>
          <span class="pill-val">{formatNumber(store.pipe2Result.totalPrice)} ریال</span>
        </div>
      {/if}
      {#if store.insulationResult.enabled && store.insulationResult.totalPrice > 0}
        <div class="pill">
          <span class="pill-title">عایق:</span>
          <span class="pill-val">{formatNumber(store.insulationResult.totalPrice)} ریال</span>
        </div>
      {/if}
      {#if store.primerResult.enabled && store.primerResult.totalPrice > 0}
        <div class="pill">
          <span class="pill-title">پرایمر:</span>
          <span class="pill-val">{formatNumber(store.primerResult.totalPrice)} ریال</span>
        </div>
      {/if}
    </div>
  </div>

  <div class="summary-actions">
    <button class="btn btn-copper share-main-btn" onclick={handleShare}>
      <Share2 size={18} />
      <span>اشتراک‌گذاری فاکتور</span>
    </button>

    <button class="btn btn-secondary copy-btn" onclick={handleCopy}>
      {#if copied}
        <Check size={18} class="check-icon" />
        <span>کپی شد</span>
      {:else}
        <Copy size={18} />
        <span>کپی متن</span>
      {/if}
    </button>

    <button class="btn btn-ghost preview-btn" onclick={onOpenModal} title="پیش‌نمایش کامل">
      <Eye size={18} />
      <span>مشاهده</span>
    </button>

    <button class="btn btn-ghost reset-btn" onclick={() => store.reset()} title="شروع مجدد">
      <RotateCcw size={18} />
    </button>
  </div>
</div>

<style>
  .summary-card {
    background: linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(234, 88, 12, 0.06)), var(--bg-card);
    border: 1px solid rgba(2, 132, 199, 0.3);
    box-shadow: var(--glow-shadow);
  }

  .summary-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--border-color);
  }

  .total-label-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .total-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--ice-600);
  }

  .rial-line {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .total-number {
    font-size: 2.2rem;
    font-weight: 900;
    color: var(--copper-500);
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  .unit-text {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-secondary);
  }


  .breakdown-pills {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-end;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--bg-secondary);
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    border: 1px solid var(--border-color);
  }

  .pill-title {
    color: var(--text-muted);
  }

  .pill-val {
    font-weight: 700;
    color: var(--text-primary);
  }

  .summary-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 18px;
    flex-wrap: wrap;
  }

  .share-main-btn {
    flex: 2;
    min-width: 170px;
  }

  .copy-btn {
    flex: 1;
    min-width: 110px;
  }

  .preview-btn {
    border: 1px solid var(--border-color);
  }

  .reset-btn {
    color: var(--accent-rose);
  }

  :global(.check-icon) {
    color: var(--accent-emerald);
  }

  @media (max-width: 640px) {
    .summary-top {
      flex-direction: column;
      align-items: stretch;
    }
    .breakdown-pills {
      align-items: flex-start;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .total-number {
      font-size: 1.8rem;
    }
  }
</style>
