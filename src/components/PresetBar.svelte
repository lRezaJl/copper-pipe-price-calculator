<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { formatNumber } from '../lib/calculator.js';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Card, CardContent } from '$lib/components/ui/card';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Drawer from '$lib/components/ui/drawer';
  import { useMediaQuery } from '$lib/hooks/use-media-query.svelte.js';
  import {
    SlidersHorizontal,
    Pencil,
    RotateCcw,
    Check,
    Sparkles,
    CheckCircle2,
    Layers,
    Tag,
    X,
  } from '@lucide/svelte';

  // تشخیص سایز نمایشگر: برای md و بزرگ‌تر از Dialog و برای max-md از Drawer استفاده می‌شود
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // وضعیت مودال تغییر نام
  let isRenameOpen = $state(false);
  let renamingPresetId = $state('');
  let draftPresetName = $state('');

  // وضعیت مودال تایید بازنشانی
  let isResetConfirmOpen = $state(false);
  let resettingPresetId = $state('');

  // برچسب‌های پیشنهادی سریع برای تغییر نام
  const SUGGESTED_NAMES = [
    'پیش‌فرض فریزلند',
    'مهر اصل',
    'بابک مس',
    'پروژه خانگی',
    'پروژه تجاری',
    'لوله ضخیم ۰.۳۰',
    'کولر ۱۲ تا ۱۸ هزار',
    'کولر ۲۴ تا ۳۰ هزار',
  ];

  function openRenameModal(preset, e) {
    if (e) e.stopPropagation();
    renamingPresetId = preset.id;
    draftPresetName = preset.name;
    isRenameOpen = true;
  }

  function handleSaveRename() {
    if (renamingPresetId && draftPresetName.trim()) {
      store.renamePreset(renamingPresetId, draftPresetName.trim());
      isRenameOpen = false;
    }
  }

  function applySuggestedName(name) {
    draftPresetName = name;
  }

  function openResetConfirm(presetId, e) {
    if (e) e.stopPropagation();
    resettingPresetId = presetId;
    isResetConfirmOpen = true;
  }

  function handleConfirmReset() {
    if (resettingPresetId) {
      store.resetPresetToDefault(resettingPresetId);
      isResetConfirmOpen = false;
    }
  }

  const renamingPreset = $derived(
    store.presets.find((p) => p.id === renamingPresetId) || store.activePreset
  );
  const resettingPreset = $derived(
    store.presets.find((p) => p.id === resettingPresetId) || store.activePreset
  );

  // شماره‌های فارسی
  const faNumbers = ['۱', '۲', '۳', '۴'];
</script>

<div class="relative group">
  <!-- افکت گرادیان درخشان پشت کادر الگوها -->
  <div class="absolute -inset-0.5 bg-linear-to-r from-sky-500/20 via-orange-500/15 to-amber-500/20 rounded-2xl blur-xl -z-10 opacity-75 group-hover:opacity-95 transition-opacity"></div>

  <Card class="relative overflow-hidden rounded-2xl border-white/30 dark:border-white/10 bg-card/75 dark:bg-card/50 backdrop-blur-2xl shadow-xl shadow-black/5">
    <!-- نوار تزئینی بالای کارت -->
    <div class="absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-sky-500 via-orange-500 to-amber-500"></div>

    <CardContent class="p-4 sm:p-5 space-y-4">

    <!-- هدر بخش الگوها -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="size-9 sm:size-10 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20 shadow-xs">
          <Layers class="size-4.5 sm:size-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-sm sm:text-base font-bold text-foreground">الگوهای آماده محاسبه</h2>
            
          </div>
          <span class="text-xs text-muted-foreground block mt-0.5">
            روی هر الگو کلیک کنید تا کلیه قیمت‌ها، وزن‌ها و تنظیمات خاص آن الگو بارگذاری شوند.
          </span>
        </div>
      </div>

      <!-- دکمه‌های سریع برای الگو فعال -->
      <div class="flex items-center gap-1.5 self-end md:self-center shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          class="h-8 text-xs gap-1.5 cursor-pointer bg-background/50 hover:bg-background"
          onclick={(e) => openRenameModal(store.activePreset, e)}
          title="تغییر نام الگو فعال"
        >
          <Pencil class="size-3 text-orange-500" />
          <span>تغییر نام</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          class="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
          onclick={(e) => openResetConfirm(store.activePresetId, e)}
          title="بازنشانی این الگو به مقادیر اولیه کارخانه"
        >
          <RotateCcw class="size-3" />
          <span class="">بازنشانی مقادیر اولیه این الگو</span>
        </Button>
      </div>
    </div>

    <!-- گرید کارت‌های ۴ الگو -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
      {#each store.presets as preset, idx (preset.id)}
        {@const isActive = store.activePresetId === preset.id}
        <div
          role="button"
          tabindex="0"
          onclick={() => store.switchPreset(preset.id)}
          onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && store.switchPreset(preset.id)}
          class={`group/preset relative flex flex-col justify-between p-3 sm:p-3.5 rounded-2xl border border-border/35 dark:border-white/10 text-right transition-all duration-200 cursor-pointer select-none ${
            isActive
              ? 'bg-linear-to-b from-orange-500/15 via-amber-500/10 to-orange-500/5 dark:from-orange-500/25 dark:via-amber-500/15 dark:to-transparent border-orange-500/60 dark:border-orange-500/50 shadow-md shadow-orange-500/10 ring-2 ring-orange-500/30'
              : 'bg-background/40 hover:bg-muted/40 hover:border-border'
          }`}
        >
          <!-- بخش بالا: نشانگر شماره الگو و دکمه ویرایش نام -->
          <div class="flex items-center justify-between gap-1 mb-2">
            <div class="flex items-center gap-1.5">
              <span
                class={`size-6 rounded-lg text-xs font-black flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-muted text-muted-foreground group-hover/preset:bg-muted-foreground/20'
                }`}
              >
                {faNumbers[idx] || idx + 1}
              </span>
              {#if isActive}
                <span class="flex items-center gap-1 text-[10px] font-bold text-orange-600 dark:text-orange-400">
                  <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  فعال
                </span>
              {/if}
            </div>

            <!-- دکمه ویرایش نام -->
            <button
              type="button"
              onclick={(e) => openRenameModal(preset, e)}
              class="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/60 transition-colors opacity-70 group-hover/preset:opacity-100"
              title={`ویرایش نام «${preset.name}»`}
              aria-label={`تغییر نام ${preset.name}`}
            >
              <Pencil class="size-3.5 text-muted-foreground group-hover/preset:text-orange-500 transition-colors" />
            </button>
          </div>

          <!-- عنوان و نام الگو -->
          <div class="space-y-1">
            <h3 class={`text-sm sm:text-base font-bold truncate tracking-tight ${isActive ? 'text-foreground' : 'text-foreground/80'}`}>
              {preset.name}
            </h3>

            <!-- مشخصات خلاصه الگو -->
            <div class="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span>مس:</span>
              <span class="font-semibold text-foreground/90">
                {(preset.unitPrice / 1000000).toLocaleString('fa-IR')} م ریال
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </CardContent>
</Card>
</div>

<!-- محتوای فرم تغییر نام الگو (مشترک بین Dialog و Drawer) -->
{#snippet renameBody()}
  <div class="space-y-4">
    <div class="space-y-2">
      <label for="preset-name-input" class="text-xs font-semibold text-foreground block">
        نام الگو:
      </label>
      <Input
        id="preset-name-input"
        type="text"
        dir="rtl"
        placeholder="مثال: مهر اصل، پروژه فاز ۲، کولر ۲۴۰۰۰..."
        bind:value={draftPresetName}
        onkeydown={(e) => e.key === 'Enter' && handleSaveRename()}
        class="text-right font-medium"
        autofocus={isDesktop.current}
      />
    </div>

    <!-- پیشنهادهای آماده نام -->
    <div class="space-y-2">
      <span class="text-xs text-muted-foreground flex items-center gap-1">
        <Tag class="size-3 text-orange-500" />
        <span>پیشنهادهای سریع:</span>
      </span>
      <div class="flex flex-wrap gap-1.5">
        {#each SUGGESTED_NAMES as sug}
          <button
            type="button"
            onclick={() => applySuggestedName(sug)}
            class="text-xs px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-orange-500/15 hover:text-orange-600 dark:hover:text-orange-400 border border-transparent hover:border-orange-500/30 transition-colors cursor-pointer"
          >
            {sug}
          </button>
        {/each}
      </div>
    </div>
  </div>
{/snippet}

{#if isDesktop.current}
  <!-- حالت مودال دیالوگ برای دسکتاپ و اندازه‌های بزرگ‌تر از md -->
  <Dialog.Root bind:open={isRenameOpen}>
    <Dialog.Content class="sm:max-w-md">
      <Dialog.Header>
        <div class="flex items-center gap-2.5">
          <div class="size-9 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <Pencil class="size-4" />
          </div>
          <div>
            <Dialog.Title>تغییر نام الگو</Dialog.Title>
            <Dialog.Description>
              یک نام واضح و مشخص برای این الگوی محاسباتی وارد کنید.
            </Dialog.Description>
          </div>
        </div>
      </Dialog.Header>

      {@render renameBody()}

      <Dialog.Footer>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onclick={() => (isRenameOpen = false)}
          class="cursor-pointer"
        >
          انصراف
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          onclick={handleSaveRename}
          class="bg-orange-600 hover:bg-orange-700 text-white gap-1.5 cursor-pointer"
        >
          <Check class="size-4" />
          <span>ذخیره نام</span>
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <!-- حالت دراور (Drawer) برای اندازه‌های کوچک‌تر از md (max-md:*) -->
  <Drawer.Root bind:open={isRenameOpen}>
    <Drawer.Content class="max-w-lg mx-auto">
      <Drawer.Header class="px-4 pt-2 text-right">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="size-9 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Pencil class="size-4" />
            </div>
            <div class="text-right">
              <Drawer.Title class="text-base font-bold text-foreground">تغییر نام الگو</Drawer.Title>
              <Drawer.Description class="text-xs text-muted-foreground mt-0.5">
                یک نام واضح و مشخص برای این الگو وارد کنید.
              </Drawer.Description>
            </div>
          </div>
        </div>
      </Drawer.Header>

      <div class="px-5 py-4 overflow-y-auto">
        {@render renameBody()}
      </div>

      <Drawer.Footer class="pt-4 px-4 flex flex-row items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="default"
          onclick={() => (isRenameOpen = false)}
          class="flex-1 cursor-pointer"
        >
          انصراف
        </Button>
        <Button
          type="button"
          variant="default"
          size="default"
          onclick={handleSaveRename}
          class="flex-1 bg-orange-600 hover:bg-orange-700 text-white gap-1.5 cursor-pointer"
        >
          <Check class="size-4" />
          <span>ذخیره نام</span>
        </Button>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
{/if}

<!-- مودال تایید بازنشانی الگو به مقادیر پیش‌فرض کارخانه -->
<Dialog.Root bind:open={isResetConfirmOpen}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <div class="flex items-center gap-2.5">
        <div class="size-9 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
          <RotateCcw class="size-4" />
        </div>
        <div>
          <Dialog.Title>بازنشانی الگو به مقادیر اولیه</Dialog.Title>
          <Dialog.Description>
            بازگردانی قیمت‌ها، وزن‌ها و مقادیر ذخیره شده به حالت اولیه برنامه
          </Dialog.Description>
        </div>
      </div>
    </Dialog.Header>

    <div>
      <p class="text-sm text-foreground/90 leading-relaxed">
        آیا از بازنشانی کامل <span class="font-bold text-orange-600 dark:text-orange-400">«{resettingPreset?.name}»</span> به مقادیر پیش‌فرض اولیه اطمینان دارید؟ تمام تغییرات اعمال شده روی قیمت‌ها، سایزها و وزن‌های این الگو بازنویسی خواهد شد.
      </p>
    </div>

    <Dialog.Footer>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onclick={() => (isResetConfirmOpen = false)}
        class="cursor-pointer"
      >
        انصراف
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onclick={handleConfirmReset}
        class="gap-1.5 cursor-pointer"
      >
        <RotateCcw class="size-4" />
        <span>بله، بازنشانی شود</span>
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
