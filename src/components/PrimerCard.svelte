<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { PRIMER_TYPES, formatNumber } from '../lib/calculator.js';
  import { Package, Info } from '@lucide/svelte';

  const result = $derived(store.primerResult);
  const typesList = Object.values(PRIMER_TYPES);

  function handleToggle(e) {
    store.primer.enabled = e.target.checked;
    store.saveToStorage();
  }

  function handleTypeChange(e) {
    store.primer.type = e.target.value;
    store.saveToStorage();
  }

  function handleManualCount(e) {
    const val = parseInt(e.target.value) || 1;
    store.primer.manualCount = val;
    store.saveToStorage();
  }
</script>

<div class="glass-card primer-card" class:disabled-card={!store.primer.enabled}>
  <div class="card-header">
    <div class="card-title-group">
      <div class="icon-badge">
        <Package size={20} />
      </div>
      <div>
        <h3 class="card-title">محاسبه پرایمر</h3>
        <span class="card-subtitle">چسب و عایق‌بندی تکمیلی لوله‌ها</span>
      </div>
    </div>

    <!-- سوئیچ فعال / غیرفعال سازی -->
    <label class="toggle-switch" title={store.primer.enabled ? 'غیرفعال کردن' : 'فعال کردن'}>
      <input type="checkbox" checked={store.primer.enabled} onchange={handleToggle} />
      <span class="toggle-slider"></span>
    </label>
  </div>

  {#if store.primer.enabled}
    <div class="form-grid">
      <!-- انتخاب نوع پرایمر -->
      <div class="input-field" class:full-width={!result.isManual}>
        <label for="primer-type-select">نوع پرایمر:</label>
        <div class="input-wrapper">
          <select id="primer-type-select" class="custom-select" value={store.primer.type} onchange={handleTypeChange}>
            {#each typesList as item}
              <option value={item.key}>
                {item.label} ({formatNumber(item.price)} ریال - هر {item.perLength} متر)
              </option>
            {/each}
          </select>
        </div>
      </div>

      <!-- فیلد دستی در صورت متراژهای نامساوی -->
      {#if result.isManual}
        <div class="input-field">
          <label for="manual-count-input">تعداد پرایمر (متراژ متفاوت):</label>
          <div class="input-wrapper">
            <input
              id="manual-count-input"
              type="number"
              min="1"
              class="custom-input"
              value={store.primer.manualCount}
              oninput={handleManualCount}
            />
            <span class="input-unit">عدد</span>
          </div>
        </div>
      {/if}
    </div>

    {#if !result.valid}
      <div class="info-box">
        <Info size={16} />
        <span>لطفاً متراژ لوله‌ها را وارد کنید تا تعداد پرایمر مورد نیاز برآورد شود.</span>
      </div>
    {:else}
      <div class="calc-result-box">
        {#if result.isManual}
          <div class="manual-notice">
            <Info size={14} />
            <span>به دلیل تفاوت متراژ لوله‌ها، تعداد پرایمر به صورت دستی قابل تنظیم است.</span>
          </div>
        {/if}

        <div class="result-row">
          <span class="result-label">تعداد مورد نیاز:</span>
          <span class="result-value">{result.count} <small>عدد</small></span>
        </div>

        <div class="result-row">
          <span class="result-label">قیمت هر واحد:</span>
          <span class="result-value">{formatNumber(result.primerInfo.price)} <small>ریال</small></span>
        </div>

        <div class="result-row highlight">
          <span class="result-label">قیمت کل پرایمر:</span>
          <span class="result-value">{formatNumber(result.totalPrice)} ریال</span>
        </div>
      </div>
    {/if}
  {:else}
    <div class="disabled-placeholder">
      <p>محاسبه پرایمر غیرفعال شده است.</p>
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
    background: var(--copper-glow);
    color: var(--copper-500);
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

  .full-width {
    grid-column: 1 / -1;
  }

  .info-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-secondary);
    border: 1px dashed var(--border-color);
    border-radius: var(--radius-md);
    padding: 14px;
    margin-top: 14px;
    font-size: 0.86rem;
    color: var(--text-muted);
  }

  .manual-notice {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: var(--copper-500);
    background: var(--copper-glow);
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    margin-bottom: 6px;
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
