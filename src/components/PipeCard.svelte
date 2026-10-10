<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { PIPE_SIZES, PIPE_THICKNESSES, formatNumber } from '../lib/calculator.js';
  import { ArrowLeftRight, Weight, Layers, Ruler } from '@lucide/svelte';

  let { pipeNumber = 1 } = $props();

  const pipe = $derived(pipeNumber === 1 ? store.pipe1 : store.pipe2);
  const result = $derived(pipeNumber === 1 ? store.pipe1Result : store.pipe2Result);
  const otherPipeNumber = $derived(pipeNumber === 1 ? 2 : 1);
  const otherPipe = $derived(pipeNumber === 1 ? store.pipe2 : store.pipe1);

  function handleLengthInput(e) {
    pipe.length = e.target.value;
    store.syncLengths(pipeNumber);
  }

  function handleToggle(e) {
    pipe.enabled = e.target.checked;
    store.saveToStorage();
  }

  function handleSizeChange(e) {
    pipe.size = e.target.value;
    store.saveToStorage();
  }

  function handleThicknessChange(e) {
    pipe.thickness = e.target.value;
    store.saveToStorage();
  }

  function copyFromOther() {
    store.copyLength(otherPipeNumber, pipeNumber);
  }
</script>

<div class="glass-card pipe-card" class:disabled-card={!pipe.enabled}>
  <div class="card-header">
    <div class="card-title-group">
      <div class="pipe-indicator">
        {pipeNumber}
      </div>
      <div>
        <h3 class="card-title">لوله مسی شماره {pipeNumber}</h3>
        <span class="card-subtitle">
          {pipe.enabled ? `${pipe.size} اینچ - ضخامت ${pipe.thickness} میلی‌متر` : 'غیرفعال شده'}
        </span>
      </div>
    </div>

    <!-- سوئیچ فعال / غیرفعال سازی -->
    <label class="toggle-switch" title={pipe.enabled ? 'غیرفعال کردن' : 'فعال کردن'}>
      <input type="checkbox" checked={pipe.enabled} onchange={handleToggle} />
      <span class="toggle-slider"></span>
    </label>
  </div>

  {#if pipe.enabled}
    <div class="form-grid">
      <!-- انتخاب سایز -->
      <div class="input-field">
        <label for={`size-${pipeNumber}`}>سایز لوله:</label>
        <div class="input-wrapper">
          <select id={`size-${pipeNumber}`} class="custom-select" value={pipe.size} onchange={handleSizeChange}>
            {#each PIPE_SIZES as item}
              <option value={item.value}>{item.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- انتخاب ضخامت -->
      <div class="input-field">
        <label for={`thickness-${pipeNumber}`}>ضخامت لوله:</label>
        <div class="input-wrapper">
          <select id={`thickness-${pipeNumber}`} class="custom-select" value={pipe.thickness} onchange={handleThicknessChange}>
            {#each PIPE_THICKNESSES as item}
              <option value={item.value}>{item.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- ورودی متراژ -->
      <div class="input-field full-width">
        <div class="length-header">
          <label for={`length-${pipeNumber}`}>متراژ لوله (متر):</label>
          {#if otherPipe.enabled && otherPipe.length && otherPipe.length !== pipe.length}
            <button type="button" class="sync-btn" onclick={copyFromOther}>
              <ArrowLeftRight size={13} />
              <span>کپی متراژ از لوله {otherPipeNumber} ({otherPipe.length} متر)</span>
            </button>
          {/if}
        </div>
        <div class="input-wrapper">
          <input
            id={`length-${pipeNumber}`}
            type="number"
            min="0"
            step="any"
            class="custom-input"
            placeholder="مثال: 10"
            value={pipe.length}
            oninput={handleLengthInput}
          />
          <span class="input-unit">متر</span>
        </div>
      </div>
    </div>

    <!-- کادر نمایش نتایج این لوله -->
    <div class="calc-result-box">
      <div class="result-row">
        <span class="result-label">
          <Weight size={15} class="inline-icon" /> وزن کلاف (۵۰ متر):
        </span>
        <span class="result-value">
          {result.weight || '—'} <small>کیلوگرم</small>
        </span>
      </div>

      <div class="result-row">
        <span class="result-label">قیمت هر متر:</span>
        <span class="result-value">
          {formatNumber(result.pricePerMeter)} <small>ریال</small>
        </span>
      </div>

      <div class="result-row highlight">
        <span class="result-label">قیمت کل لوله {pipeNumber}:</span>
        <span class="result-value">{formatNumber(result.totalPrice)} ریال</span>
      </div>
    </div>
  {:else}
    <div class="disabled-placeholder">
      <p>این بخش غیرفعال است و در جمع کل لحاظ نمی‌شود.</p>
    </div>
  {/if}
</div>

<style>
  .pipe-card {
    transition: var(--transition);
  }

  .pipe-indicator {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    background: linear-gradient(135deg, var(--ice-500), var(--ice-600));
    color: white;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);
  }

  .disabled-card {
    opacity: 0.65;
    background: var(--bg-secondary);
  }

  .card-subtitle {
    font-size: 0.78rem;
    color: var(--text-muted);
    display: block;
    margin-top: 2px;
  }

  .full-width {
    grid-column: 1 / -1;
  }

  .length-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sync-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: var(--ice-light);
    color: var(--ice-600);
    border: none;
    border-radius: var(--radius-full);
    padding: 3px 10px;
    font-size: 0.76rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
  }

  .sync-btn:hover {
    background: var(--ice-500);
    color: white;
  }

  :global(.inline-icon) {
    vertical-align: middle;
    margin-left: 4px;
    color: var(--text-muted);
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
