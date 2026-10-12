<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import {
    PIPE_SIZES,
    DEFAULT_PIPE_WEIGHTS,
    DEFAULT_INSULATION_BASE_PRICES,
    DEFAULT_PRIMER_TYPES,
    formatNumber,
    toToman
  } from '../lib/calculator.js';
  import {
    Settings,
    X,
    Save,
    RotateCcw,
    Weight,
    Shield,
    Package,
    Check,
    AlertCircle,
    Info
  } from '@lucide/svelte';

  let { isOpen = $bindable(false) } = $props();

  // تب فعال
  let activeTab = $state('pipes'); // 'pipes' | 'insulation' | 'primer'

  // پیش‌نویس‌های محلی برای ویرایش
  let draftPipeWeights = $state({ ...DEFAULT_PIPE_WEIGHTS });
  let draftInsulationPrices = $state({ ...DEFAULT_INSULATION_BASE_PRICES });
  let draftPrimerTypes = $state(JSON.parse(JSON.stringify(DEFAULT_PRIMER_TYPES)));

  // وضعیت پیام تایید بازنشانی
  let showResetConfirm = $state(false);

  // همگام‌سازی پیش‌نویس‌ها در هر باز شدن مودال
  $effect(() => {
    if (isOpen) {
      draftPipeWeights = { ...store.settings.pipeWeights };
      draftInsulationPrices = { ...store.settings.insulationPrices };
      draftPrimerTypes = JSON.parse(JSON.stringify(store.settings.primerTypes));
      showResetConfirm = false;
    }
  });

  function close() {
    isOpen = false;
    showResetConfirm = false;
  }

  function handleSave() {
    // پاک‌سازی و اطمینان از صحت اعداد
    const cleanWeights = {};
    for (const [key, val] of Object.entries(draftPipeWeights)) {
      cleanWeights[key] = parseFloat(val) || 0;
    }

    const cleanInsulation = {};
    for (const [key, val] of Object.entries(draftInsulationPrices)) {
      cleanInsulation[key] = parseFloat(val) || 0;
    }

    const cleanPrimer = {};
    for (const [key, item] of Object.entries(draftPrimerTypes)) {
      cleanPrimer[key] = {
        ...item,
        price: parseFloat(item.price) || 0,
        perLength: parseFloat(item.perLength) || 1,
      };
    }

    store.updateSettings({
      pipeWeights: cleanWeights,
      insulationPrices: cleanInsulation,
      primerTypes: cleanPrimer,
    });

    close();
  }

  function handleResetToDefaults() {
    draftPipeWeights = { ...DEFAULT_PIPE_WEIGHTS };
    draftInsulationPrices = { ...DEFAULT_INSULATION_BASE_PRICES };
    draftPrimerTypes = JSON.parse(JSON.stringify(DEFAULT_PRIMER_TYPES));
    showResetConfirm = false;
    store.showToast("مقادیر پیش‌فرض در فرم بارگذاری شد", "info");
  }

  // تغییر وزن یک لوله
  function updateWeight(key, val) {
    draftPipeWeights[key] = val;
  }

  // تغییر قیمت عایق
  function updateInsulationPrice(size, val) {
    const raw = String(val).replace(/[^0-9]/g, '');
    draftInsulationPrices[size] = raw ? parseInt(raw, 10) : 0;
  }

  // تغییر قیمت پرایمر
  function updatePrimerPrice(typeKey, val) {
    const raw = String(val).replace(/[^0-9]/g, '');
    if (draftPrimerTypes[typeKey]) {
      draftPrimerTypes[typeKey].price = raw ? parseInt(raw, 10) : 0;
    }
  }

  // تغییر متراژ پوشش پرایمر
  function updatePrimerLength(typeKey, val) {
    const num = parseFloat(val) || 1;
    if (draftPrimerTypes[typeKey]) {
      draftPrimerTypes[typeKey].perLength = num;
    }
  }
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div
    class="settings-backdrop"
    onclick={close}
    onkeydown={(e) => e.key === 'Escape' && close()}
    role="presentation"
  >
    <!-- کانتینر دیالوگ در دسکتاپ و دراور در موبایل -->
    <div
      class="settings-container glass-card"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <!-- دستگیره کشیدن برای حالت دراور در موبایل -->
      <div class="drawer-handle-bar">
        <span class="drawer-handle"></span>
      </div>

      <!-- هدر دیالوگ -->
      <div class="settings-header">
        <div class="title-group">
          <div class="header-icon-box">
            <Settings size={22} class="header-icon" />
          </div>
          <div>
            <h3 class="header-title">تنظیمات مقادیر اولیه</h3>
            <span class="header-subtitle">سفارشی‌سازی اوزان، قیمت‌های عایق و پرایمر</span>
          </div>
        </div>
        <button
          class="btn btn-ghost btn-icon close-btn"
          onclick={close}
          title="بستن تنظیمات"
          aria-label="بستن"
        >
          <X size={20} />
        </button>
      </div>

      <!-- تب‌های ناوبری -->
      <nav class="settings-tabs" aria-label="بخش‌های تنظیمات">
        <button
          type="button"
          class="tab-btn"
          class:active={activeTab === 'pipes'}
          onclick={() => (activeTab = 'pipes')}
        >
          <Weight size={17} />
          <span>وزن لوله‌ها</span>
        </button>

        <button
          type="button"
          class="tab-btn"
          class:active={activeTab === 'insulation'}
          onclick={() => (activeTab = 'insulation')}
        >
          <Shield size={17} />
          <span>قیمت عایق‌ها</span>
        </button>

        <button
          type="button"
          class="tab-btn"
          class:active={activeTab === 'primer'}
          onclick={() => (activeTab = 'primer')}
        >
          <Package size={17} />
          <span>قیمت و متراژ پرایمرها</span>
        </button>
      </nav>

      <!-- محتوای اسکرول‌شونده دیالوگ -->
      <div class="settings-body">
        <!-- ۱. تب وزن لوله‌ها -->
        {#if activeTab === 'pipes'}
          <div class="tab-panel">
            <div class="panel-intro">
              <Info size={16} />
              <span>وزن‌ها بر حسب <strong>کیلوگرم</strong> به ازای هر کلاف ۵۰ متری استاندارد محاسبه می‌شوند.</span>
            </div>

            <div class="cards-grid">
              {#each PIPE_SIZES as item}
                <div class="setting-item-card">
                  <div class="item-card-header">
                    <span class="size-pill">سایز {item.label}</span>
                  </div>

                  <div class="thickness-inputs-row">
                    <div class="input-col">
                      <label for={`weight-${item.value}-0.25`}>ضخامت ۰.۲۵ میلی‌متر:</label>
                      <div class="input-wrapper">
                        <input
                          id={`weight-${item.value}-0.25`}
                          type="number"
                          step="0.01"
                          min="0.1"
                          class="custom-input setting-input"
                          value={draftPipeWeights[`${item.value}-0.25`]}
                          oninput={(e) => updateWeight(`${item.value}-0.25`, e.target.value)}
                        />
                        <span class="input-unit">کیلوگرم</span>
                      </div>
                    </div>

                    <div class="input-col">
                      <label for={`weight-${item.value}-0.30`}>ضخامت ۰.۳۰ میلی‌متر:</label>
                      <div class="input-wrapper">
                        <input
                          id={`weight-${item.value}-0.30`}
                          type="number"
                          step="0.01"
                          min="0.1"
                          class="custom-input setting-input"
                          value={draftPipeWeights[`${item.value}-0.30`]}
                          oninput={(e) => updateWeight(`${item.value}-0.30`, e.target.value)}
                        />
                        <span class="input-unit">کیلوگرم</span>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>

        <!-- ۲. تب قیمت عایق‌ها -->
        {:else if activeTab === 'insulation'}
          <div class="tab-panel">
            <div class="panel-intro">
              <Info size={16} />
              <span>قیمت‌ها بر مبنای هر <strong>شاخه ۱.۸ متری استاندارد</strong> به ریال است.</span>
            </div>

            <div class="cards-grid">
              {#each PIPE_SIZES as item}
                <div class="setting-item-card">
                  <div class="item-card-header">
                    <span class="size-pill">عایق {item.label}</span>
                    <span class="price-preview-badge">
                      {formatNumber(toToman(draftInsulationPrices[item.value]))} تومان
                    </span>
                  </div>

                  <div class="input-col">
                    <label for={`insulation-${item.value}`}>قیمت هر شاخه (ریال):</label>
                    <div class="input-wrapper">
                      <input
                        id={`insulation-${item.value}`}
                        type="text"
                        inputmode="numeric"
                        class="custom-input setting-input"
                        value={formatNumber(draftInsulationPrices[item.value])}
                        oninput={(e) => updateInsulationPrice(item.value, e.target.value)}
                      />
                      <span class="input-unit">ریال</span>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>

        <!-- ۳. تب پرایمرها -->
        {:else if activeTab === 'primer'}
          <div class="tab-panel">
            <div class="panel-intro">
              <Info size={16} />
              <span>تنظیم قیمت واحد (ریال) و متراژ لوله‌ای که هر عدد پرایمر پوشش می‌دهد (متر).</span>
            </div>

            <div class="cards-grid">
              {#each Object.entries(draftPrimerTypes) as [key, item]}
                <div class="setting-item-card">
                  <div class="item-card-header">
                    <span class="size-pill primer-pill">{item.label}</span>
                    <span class="price-preview-badge">
                      {formatNumber(toToman(item.price))} تومان
                    </span>
                  </div>

                  <div class="thickness-inputs-row">
                    <div class="input-col">
                      <label for={`primer-price-${key}`}>قیمت هر عدد (ریال):</label>
                      <div class="input-wrapper">
                        <input
                          id={`primer-price-${key}`}
                          type="text"
                          inputmode="numeric"
                          class="custom-input setting-input"
                          value={formatNumber(item.price)}
                          oninput={(e) => updatePrimerPrice(key, e.target.value)}
                        />
                        <span class="input-unit">ریال</span>
                      </div>
                    </div>

                    <div class="input-col">
                      <label for={`primer-len-${key}`}>متراژ پوشش لوله (متر):</label>
                      <div class="input-wrapper">
                        <input
                          id={`primer-len-${key}`}
                          type="number"
                          step="0.5"
                          min="0.5"
                          class="custom-input setting-input"
                          value={item.perLength}
                          oninput={(e) => updatePrimerLength(key, e.target.value)}
                        />
                        <span class="input-unit">متر</span>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- پاپ‌آپ تایید بازنشانی به پیش‌فرض -->
      {#if showResetConfirm}
        <div class="reset-confirm-bar">
          <div class="confirm-text">
            <AlertCircle size={17} class="alert-icon" />
            <span>آیا می‌خواهید تمام مقادیر به حالت پیش‌فرض کارخانه بازگردند؟</span>
          </div>
          <div class="confirm-actions">
            <button class="btn btn-sm btn-rose" onclick={handleResetToDefaults}>
              بله، بازنشانی شود
            </button>
            <button class="btn btn-sm btn-ghost" onclick={() => (showResetConfirm = false)}>
              انصراف
            </button>
          </div>
        </div>
      {/if}

      <!-- فوتر دکمه‌های اقدام (استیکی در موبایل) -->
      <div class="settings-footer">
        <button
          type="button"
          class="btn btn-ghost reset-btn"
          onclick={() => (showResetConfirm = !showResetConfirm)}
          title="بازنشانی تمام مقادیر این فرم به پیش‌فرض کارخانه"
        >
          <RotateCcw size={17} />
          <span>مقادیر پیش‌فرض</span>
        </button>

        <div class="main-actions">
          <button type="button" class="btn btn-secondary cancel-btn" onclick={close}>
            انصراف
          </button>

          <button type="button" class="btn btn-primary save-btn" onclick={handleSave}>
            <Save size={18} />
            <span>ذخیره تغییرات</span>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* بک‌دراپ کلی دیالوگ */
  .settings-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 999;
    animation: fadeInBackdrop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* کانتینر اصلی دیالوگ (حالت دسکتاپ پیش‌فرض) */
  .settings-container {
    width: 100%;
    max-width: 660px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.45);
    display: flex;
    flex-direction: column;
    max-height: 88vh;
    border-radius: var(--radius-lg);
    animation: scaleInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }

  /* دستگیره دراور (فقط در موبایل نمایش داده می‌شود) */
  .drawer-handle-bar {
    display: none;
    justify-content: center;
    align-items: center;
    padding: 10px 0 2px 0;
  }

  .drawer-handle {
    width: 44px;
    height: 5px;
    border-radius: var(--radius-full);
    background: var(--border-color);
  }

  /* هدر دیالوگ */
  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 22px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-card);
    z-index: 2;
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .header-icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: var(--radius-md);
    background: var(--copper-glow);
    color: var(--copper-500);
    border: 1px solid rgba(234, 88, 12, 0.2);
  }

  .header-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--text-primary);
  }

  .header-subtitle {
    font-size: 0.78rem;
    color: var(--text-muted);
    display: block;
    margin-top: 2px;
  }

  .close-btn {
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    width: 36px;
    height: 36px;
    padding: 0;
  }

  /* تب‌ها */
  .settings-tabs {
    display: flex;
    gap: 8px;
    padding: 12px 20px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    overflow-x: auto;
    scrollbar-width: none;
  }

  .settings-tabs::-webkit-scrollbar {
    display: none;
  }

  .tab-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: var(--radius-full);
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
  }

  .tab-btn:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.08);
  }

  .tab-btn.active {
    background: var(--bg-card);
    color: var(--ice-500);
    border-color: var(--border-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  /* محتوای بدنه فرم */
  .settings-body {
    padding: 18px 20px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    -webkit-overflow-scrolling: touch;
  }

  .panel-intro {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-secondary);
    border: 1px dashed var(--border-color);
    border-radius: var(--radius-md);
    padding: 10px 14px;
    font-size: 0.84rem;
    color: var(--text-secondary);
    margin-bottom: 16px;
  }

  .cards-grid {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .setting-item-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: var(--transition);
  }

  .setting-item-card:hover {
    border-color: var(--border-focus);
    background: var(--bg-card-hover);
  }

  .item-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .size-pill {
    display: inline-flex;
    align-items: center;
    font-size: 0.84rem;
    font-weight: 700;
    color: var(--copper-500);
    background: var(--copper-glow);
    padding: 3px 10px;
    border-radius: var(--radius-full);
  }

  .primer-pill {
    color: var(--ice-600);
    background: var(--ice-light);
  }

  .price-preview-badge {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--accent-emerald);
    background: rgba(16, 185, 129, 0.1);
    padding: 3px 8px;
    border-radius: var(--radius-sm);
  }

  .thickness-inputs-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .input-col {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .input-col label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .setting-input {
    padding: 9px 12px;
    padding-left: 54px;
    font-size: 0.95rem;
    font-weight: 700;
    direction: ltr;
    text-align: right;
  }

  /* نوار تایید بازنشانی */
  .reset-confirm-bar {
    background: rgba(225, 29, 72, 0.08);
    border-top: 1px solid rgba(225, 29, 72, 0.3);
    border-bottom: 1px solid rgba(225, 29, 72, 0.3);
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    animation: fadeInBackdrop 0.2s ease;
  }

  .confirm-text {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.84rem;
    color: var(--accent-rose);
    font-weight: 600;
  }

  .confirm-actions {
    display: flex;
    gap: 8px;
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: 0.82rem;
  }

  .btn-rose {
    background: var(--accent-rose);
    color: white;
  }

  /* فوتر دیالوگ */
  .settings-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-top: 1px solid var(--border-color);
    background: var(--bg-card);
    z-index: 2;
  }

  .main-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .reset-btn {
    color: var(--text-muted);
    font-size: 0.85rem;
    padding: 8px 12px;
  }

  .reset-btn:hover {
    color: var(--copper-500);
  }

  .cancel-btn {
    padding: 9px 16px;
    font-size: 0.9rem;
  }

  .save-btn {
    padding: 9px 20px;
    font-size: 0.92rem;
  }

  /* انیمیشن‌ها */
  @keyframes fadeInBackdrop {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleInModal {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slideUpDrawer {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  /* =========================================================================
     ریسپانسیو موبایل: حالت داور (Bottom Sheet Drawer) برای max-md (عرض زیر 768px)
     ========================================================================= */
  @media (max-width: 768px) {
    .settings-backdrop {
      align-items: flex-end; /* چسبیدن به پایین صفحه */
      padding: 0;
    }

    .settings-container {
      max-width: 100%;
      border-radius: 24px 24px 0 0; /* گرد شدن گوشه‌های بالایی دراور */
      max-height: 88dvh;
      animation: slideUpDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border-bottom: none;
      border-left: none;
      border-right: none;
    }

    .drawer-handle-bar {
      display: flex;
    }

    .settings-header {
      padding: 12px 16px;
    }

    .header-title {
      font-size: 1.05rem;
    }

    .settings-tabs {
      padding: 8px 14px;
      gap: 6px;
    }

    .tab-btn {
      padding: 6px 12px;
      font-size: 0.8rem;
    }

    .settings-body {
      padding: 14px 16px;
    }

    .thickness-inputs-row {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .settings-footer {
      padding: 12px 16px;
      flex-direction: column-reverse;
      gap: 10px;
    }

    .main-actions {
      width: 100%;
    }

    .cancel-btn {
      flex: 1;
    }

    .save-btn {
      flex: 2;
    }

    .reset-btn {
      width: 100%;
      justify-content: center;
      padding: 6px;
    }

    .reset-confirm-bar {
      padding: 10px 14px;
      flex-direction: column;
      align-items: stretch;
    }

    .confirm-actions {
      justify-content: flex-end;
    }
  }
</style>
