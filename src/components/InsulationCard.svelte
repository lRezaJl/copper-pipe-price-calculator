<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { formatNumber } from '../lib/calculator.js';
  import { Shield, Info } from '@lucide/svelte';

  const result = $derived(store.insulationResult);

  function handleToggle(e) {
    store.insulation.enabled = e.target.checked;
    store.saveToStorage();
  }
</script>

<div class="glass-card insulation-card" class:disabled-card={!store.insulation.enabled}>
  <div class="card-header">
    <div class="card-title-group">
      <div class="icon-badge">
        <Shield size={20} />
      </div>
      <div>
        <h3 class="card-title">محاسبه عایق</h3>
        <span class="card-subtitle">بر اساس طول شاخه‌های استاندارد ۱.۸ متری</span>
      </div>
    </div>

    <!-- سوئیچ فعال / غیرفعال سازی -->
    <label class="toggle-switch" title={store.insulation.enabled ? 'غیرفعال کردن' : 'فعال کردن'}>
      <input type="checkbox" checked={store.insulation.enabled} onchange={handleToggle} />
      <span class="toggle-slider"></span>
    </label>
  </div>

  {#if store.insulation.enabled}
    {#if !result.valid}
      <div class="info-box">
        <Info size={16} />
        <span>لطفاً متراژ لوله‌ها را در بخش بالا وارد کنید تا عایق به صورت خودکار محاسبه شود.</span>
      </div>
    {:else}
      <div class="calc-result-box">
        {#if result.mode === 'paired'}

          <div class="result-row">
            <span class="result-label">تعداد عایق مورد نیاز:</span>
            <span class="result-value">{result.pairsNeeded} <small>جفت</small></span>
          </div>

          <div class="result-row">
            <span class="result-label">قیمت هر جفت ({result.size1} + {result.size2}):</span>
            <span class="result-value">{formatNumber(result.pairPrice)} <small>ریال</small></span>
          </div>

          <div class="result-row highlight">
            <span class="result-label">قیمت کل عایق‌ها:</span>
            <span class="result-value">{formatNumber(result.totalPrice)} ریال</span>
          </div>

        {:else if result.mode === 'separate' && result.pipe1 && result.pipe2}
          <!-- حالت متراژهای مجزا -->
          <div class="badge-mode separate">
            <span>محاسبه مجزا (متراژهای نامساوی)</span>
          </div>

          <div class="sub-pipe-calc">
            <span class="sub-title">عایق برای لوله ۱ (سایز {result.pipe1.size}):</span>
            <div class="result-row">
              <span class="result-label">تعداد:</span>
              <span class="result-value">{result.pipe1.pairs} <small>عدد</small></span>
            </div>
            <div class="result-row">
              <span class="result-label">قیمت هر عایق:</span>
              <span class="result-value">{formatNumber(result.pipe1.unitPrice)} <small>ریال</small></span>
            </div>
            <div class="result-row">
              <span class="result-label">مجموع لوله ۱:</span>
              <span class="result-value">{formatNumber(result.pipe1.total)} <small>ریال</small></span>
            </div>
          </div>

          <div class="sub-pipe-calc">
            <span class="sub-title">عایق برای لوله ۲ (سایز {result.pipe2.size}):</span>
            <div class="result-row">
              <span class="result-label">تعداد:</span>
              <span class="result-value">{result.pipe2.pairs} <small>عدد</small></span>
            </div>
            <div class="result-row">
              <span class="result-label">قیمت هر عایق:</span>
              <span class="result-value">{formatNumber(result.pipe2.unitPrice)} <small>ریال</small></span>
            </div>
            <div class="result-row">
              <span class="result-label">مجموع لوله ۲:</span>
              <span class="result-value">{formatNumber(result.pipe2.total)} <small>ریال</small></span>
            </div>
          </div>

          <div class="result-row highlight">
            <span class="result-label">جمع کل عایق‌ها:</span>
            <span class="result-value">{formatNumber(result.totalPrice)} ریال</span>
          </div>

        {:else if result.mode === 'single'}
          <!-- حالت تک لوله -->
          <div class="result-row">
            <span class="result-label">تعداد عایق (سایز {result.activeSize}):</span>
            <span class="result-value">{result.pairsNeeded} <small>عدد</small></span>
          </div>

          <div class="result-row">
            <span class="result-label">قیمت هر شاخه:</span>
            <span class="result-value">{formatNumber(result.price)} <small>ریال</small></span>
          </div>

          <div class="result-row highlight">
            <span class="result-label">قیمت کل عایق:</span>
            <span class="result-value">{formatNumber(result.totalPrice)} ریال</span>
          </div>
        {/if}
      </div>
    {/if}
  {:else}
    <div class="disabled-placeholder">
      <p>محاسبه عایق غیرفعال شده است.</p>
    </div>
  {/if}
</div>

<style>
  .icon-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: var(--radius-md);
    background: var(--ice-light);
    color: var(--ice-600);
  }

  .card-subtitle {
    font-size: 0.78rem;
    color: var(--text-muted);
    display: block;
    margin-top: 2px;
  }

  .disabled-card {
    opacity: 0.65;
    background: var(--bg-secondary);
  }

  .info-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-secondary);
    border: 1px dashed var(--border-color);
    border-radius: var(--radius-md);
    padding: 14px;
    font-size: 0.86rem;
    color: var(--text-muted);
  }

  .badge-mode {
    display: inline-flex;
    padding: 3px 10px;
    border-radius: var(--radius-full);
    font-size: 0.76rem;
    font-weight: 600;
    margin-bottom: 6px;
    width: fit-content;
  }


  .badge-mode.separate {
    background: rgba(245, 158, 11, 0.12);
    color: #d97706;
  }

  .sub-pipe-calc {
    background: var(--bg-primary);
    border-radius: var(--radius-sm);
    padding: 10px 12px;
    margin: 4px 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sub-title {
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--ice-600);
  }



  .disabled-placeholder {
    padding: 20px;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.9rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
  }
</style>
