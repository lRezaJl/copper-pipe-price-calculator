<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { formatNumber, toEnglishDigits } from '../lib/calculator.js';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import { Coins, RotateCcw, Plus, Minus } from '@lucide/svelte';

  const STEP = 500000; // گام ۵۰۰ هزار ریال

  let displayValue = $state(formatNumber(store.unitPrice));

  $effect(() => {
    displayValue = formatNumber(store.unitPrice);
  });

  function handleInput(e) {
    const english = toEnglishDigits(e.target.value);
    const raw = english.replace(/[^0-9]/g, '');
    if (!raw) {
      store.unitPrice = 0;
      displayValue = '';
      store.saveToStorage();
      return;
    }
    const num = parseInt(raw, 10);
    store.unitPrice = num;
    displayValue = formatNumber(num);
    store.saveToStorage();
  }

  function handleBlur() {
    if (!displayValue || store.unitPrice === 0) {
      displayValue = formatNumber(store.unitPrice);
    }
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

<div class="relative group">
  <!-- گرادیان ملایم پشت کارت نرخ پایه -->
  <div class="absolute -inset-0.5 bg-linear-to-r from-orange-500/20 via-amber-500/15 to-sky-500/20 rounded-3xl blur-xl -z-10 opacity-70 group-hover:opacity-90 transition-opacity"></div>

  <div class="relative rounded-3xl border border-white/30 dark:border-white/10 bg-card/70 dark:bg-card/50 backdrop-blur-2xl p-5 sm:p-7 shadow-xl shadow-black/5 overflow-hidden">
    <!-- نوار بالای کارت -->
    <div class="absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-orange-500 via-sky-500 to-amber-500"></div>

    <!-- هدر کارت -->
    <div class="flex items-center justify-between pb-4 border-b border-border/60 gap-3">
      <div class="flex items-center gap-3">
        <div class="size-10 sm:size-11 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-xs">
          <Coins class="size-5 sm:size-6" />
        </div>
        <div>
          <h2 class="text-base sm:text-lg font-bold text-foreground">قیمت واحد مس</h2>
          <span class="text-xs text-muted-foreground block mt-0.5">
            مبنای محاسبه نرخ لوله‌ها (به ازای هر کلاف ۵۰ متری استاندارد)
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onclick={() => store.reset()}
        title="پاک کردن تمام فرم‌ها"
      >
        <RotateCcw />
        <span class="hidden sm:inline">پاک کردن فرم</span>
      </Button>
    </div>

    <!-- بخش ورودی نرخ -->
    <div class="pt-4 space-y-2.5">
      <div class="flex items-center justify-between text-xs sm:text-sm">
        <label for="unit-price-input" class="font-semibold text-foreground">
          نرخ واحد (ریال):
        </label>
        <Badge variant="outline">
          گام تغییر: ۵۰۰,۰۰۰ ریال
        </Badge>
      </div>

      <!-- استپر با کامپوننت‌های پیش‌فرض شادسی‌ان -->
      <div class="flex items-center gap-2 sm:gap-2.5 w-full">
        <!-- دکمه کاهش ۵۰۰ هزار -->
        <Button
          type="button"
          variant="outline"
          size="icon"
          onclick={stepDown}
          title="کاهش ۵۰۰,۰۰۰ ریال"
          aria-label="کاهش ۵۰۰ هزار ریال"
        >
          <Minus />
        </Button>

        <!-- فیلد ورودی عدد گلس‌مورفیک شادسی‌ان -->
        <div class="relative flex-1 min-w-0">
          <Input
            id="unit-price-input"
            type="text"
            inputmode="numeric"
            dir="ltr"
            class="text-center font-bold text-base sm:text-lg pl-12 pr-12 bg-background/40 backdrop-blur-sm tabular-nums"
            placeholder="53,000,000"
            value={displayValue}
            oninput={handleInput}
            onblur={handleBlur}
            onkeydown={handleKeyDown}
          />
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground select-none pointer-events-none">
            ریال
          </span>
        </div>

        <!-- دکمه افزایش ۵۰۰ هزار -->
        <Button
          type="button"
          variant="outline"
          size="icon"
          onclick={stepUp}
          title="افزایش ۵۰۰,۰۰۰ ریال"
          aria-label="افزایش ۵۰۰ هزار ریال"
        >
          <Plus />
        </Button>
      </div>
    </div>
  </div>
</div>
