<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { formatNumber } from '../lib/calculator.js';
  import { Coins, RotateCcw, ChevronUp, ChevronDown, Plus, Minus } from '@lucide/svelte';

  const STEP = 500000; // گام ۵۰۰ هزار ریال

  // مقدار نمایشی با جداکننده سه رقمی
  let displayValue = $state(formatNumber(store.unitPrice));

  // همگام‌سازی دوطرفه با تغییرات store
  $effect(() => {
    displayValue = formatNumber(store.unitPrice);
  });

  function handleInput(e) {
    // حذف تمام کاراکترهای غیرعددی (شامل کاما)
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = raw ? parseInt(raw, 10) : 0;
    store.unitPrice = num;
    displayValue = formatNumber(num);
    store.saveToStorage();
  }

  function stepUp() {
    const current = Number(store.unitPrice) || 0;
    store.unitPrice = current + STEP;
    displayValue = formatNumber(store.unitPrice);
    store.saveToStorage();
  }

  function stepDown() {
    const current = Number(store.unitPrice) || 0;
    if (current > STEP) {
      store.unitPrice = current - STEP;
    } else {
      store.unitPrice = 0;
    }
    displayValue = formatNumber(store.unitPrice);
    store.saveToStorage();
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      stepUp();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      stepDown();
    }
  }
</script>

<div class="glass-card shared-card">
  <div class="card-header">
    <div class="card-title-group">
      <div class="icon-badge">
        <Coins size={20} />
      </div>
      <div>
        <h2 class="card-title">قیمت واحد مس</h2>
        <span class="card-subtitle">مبنای محاسبه نرخ لوله‌ها (به ازای هر کلاف ۵۰ متری استاندارد)</span>
      </div>
    </div>

    <div class="header-actions">
      <button class="btn btn-ghost btn-sm reset-btn" onclick={() => store.reset()} title="پاک کردن تمام فرم‌ها">
        <RotateCcw size={16} />
        <span>پاک کردن فرم</span>
      </button>
    </div>
  </div>

  <div class="input-section">
    <div class="input-field">
      <div class="label-row">
        <label for="unit-price-input">نرخ واحد (ریال):</label>
        <span class="step-hint">گام تغییر: ۵۰۰,۰۰۰ ریال</span>
      </div>
      <div class="input-wrapper-stepper">
        <!-- دکمه کاهش ۵۰۰ هزار -->
        <button
          type="button"
          class="stepper-btn step-down"
          onclick={stepDown}
          title="کاهش ۵۰۰,۰۰۰ ریال"
          aria-label="کاهش ۵۰۰ هزار ریال"
        >
          <Minus size={18} />
        </button>

        <div class="input-inner-box">
          <input
            id="unit-price-input"
            type="text"
            inputmode="numeric"
            class="custom-input unit-input"
            placeholder="مثال: 53,000,000"
            value={displayValue}
            oninput={handleInput}
            onkeydown={handleKeyDown}
          />
          <span class="input-unit">ریال</span>
        </div>

        <!-- دکمه افزایش ۵۰۰ هزار -->
        <button
          type="button"
          class="stepper-btn step-up"
          onclick={stepUp}
          title="افزایش ۵۰۰,۰۰۰ ریال"
          aria-label="افزایش ۵۰۰ هزار ریال"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .shared-card {
    border-top: 3px solid var(--copper-500);
  }

  .icon-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: var(--radius-md);
    background: var(--copper-glow);
    color: var(--copper-500);
  }

  .card-subtitle {
    font-size: 0.78rem;
    color: var(--text-muted);
    display: block;
    margin-top: 2px;
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: 0.82rem;
  }

  .reset-btn {
    color: var(--accent-rose);
  }

  .reset-btn:hover {
    background: rgba(225, 29, 72, 0.1);
  }

  .input-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 6px;
  }

  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .label-row label {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .step-hint {
    font-size: 0.76rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  .input-wrapper-stepper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .stepper-btn {
    width: 46px;
    height: 48px;
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
    flex-shrink: 0;
  }

  .stepper-btn:hover {
    background: var(--ice-500);
    border-color: var(--ice-500);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
  }

  .stepper-btn:active {
    transform: scale(0.95);
  }

  .step-down:hover {
    background: var(--copper-500);
    border-color: var(--copper-500);
    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
  }

  .input-inner-box {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .unit-input {
    width: 100%;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: var(--text-primary);
    padding: 12px 16px;
    padding-left: 50px;
    text-align: right;
    direction: ltr;
  }

  .input-unit {
    position: absolute;
    left: 16px;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-muted);
    pointer-events: none;
  }

  @media (max-width: 640px) {
    .reset-btn span {
      display: none;
    }
    .stepper-btn {
      width: 42px;
      height: 44px;
    }
    .unit-input {
      font-size: 1.1rem;
    }
  }
</style>
