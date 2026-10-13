<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import {
    PIPE_SIZES,
    DEFAULT_PIPE_WEIGHTS,
    DEFAULT_INSULATION_BASE_PRICES,
    DEFAULT_PRIMER_TYPES,
    formatNumber,
    toToman,
    toEnglishDigits
  } from '../lib/calculator.js';
  import { DEFAULT_PRESETS } from '../lib/presets.js';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Drawer from '$lib/components/ui/drawer';
  import * as Tabs from '$lib/components/ui/tabs';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import { Card } from '$lib/components/ui/card';
  import { useMediaQuery } from '$lib/hooks/use-media-query.svelte.js';
  import {
    Settings,
    X,
    Save,
    RotateCcw,
    Weight,
    Shield,
    Package,
    AlertCircle,
    Info
  } from '@lucide/svelte';

  let { isOpen = $bindable(false) } = $props();

  // تشخیص سایز نمایشگر: برای md و بزرگ‌تر (عرض >= 768px) از مودال دیالوگ استفاده می‌شود
  const isDesktop = useMediaQuery('(min-width: 768px)');

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
    const def =
      DEFAULT_PRESETS.find((p) => p.id === store.activePresetId) ||
      DEFAULT_PRESETS[0];
    draftPipeWeights = { ...def.settings.pipeWeights };
    draftInsulationPrices = { ...def.settings.insulationPrices };
    draftPrimerTypes = JSON.parse(JSON.stringify(def.settings.primerTypes));
    showResetConfirm = false;
    store.showToast(
      `مقادیر پیش‌فرض «${store.activePreset?.name}» در فرم بارگذاری شد`,
      "info"
    );
  }

  function updateWeight(key, val) {
    draftPipeWeights[key] = toEnglishDigits(val);
  }

  function updateInsulationPrice(size, val) {
    const raw = toEnglishDigits(String(val)).replace(/[^0-9]/g, '');
    draftInsulationPrices[size] = raw ? parseInt(raw, 10) : 0;
  }

  function updatePrimerPrice(typeKey, val) {
    const raw = toEnglishDigits(String(val)).replace(/[^0-9]/g, '');
    if (draftPrimerTypes[typeKey]) {
      draftPrimerTypes[typeKey].price = raw ? parseInt(raw, 10) : 0;
    }
  }

  function updatePrimerLength(typeKey, val) {
    const num = parseFloat(toEnglishDigits(val)) || 1;
    if (draftPrimerTypes[typeKey]) {
      draftPrimerTypes[typeKey].perLength = num;
    }
  }
</script>

{#snippet modalBody()}
  <!-- بدنه اسکرول‌خور با تب‌های شادسی‌ان -->
  <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
    <Tabs.Root bind:value={activeTab} class="w-full">
      <Tabs.List class="grid grid-cols-3 w-full bg-muted/60 p-1 rounded-2xl h-11">
        <Tabs.Trigger value="pipes" class="rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-xs">
          <Weight class="size-3.5" />
          <span>وزن لوله‌ها</span>
        </Tabs.Trigger>
        <Tabs.Trigger value="insulation" class="rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-xs">
          <Shield class="size-3.5" />
          <span>قیمت عایق‌ها</span>
        </Tabs.Trigger>
        <Tabs.Trigger value="primer" class="rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:shadow-xs">
          <Package class="size-3.5" />
          <span>قیمت و متراژ پرایمرها</span>
        </Tabs.Trigger>
      </Tabs.List>

      <!-- ۱. تب وزن لوله‌ها -->
      <Tabs.Content value="pipes" class="pt-4 space-y-3 outline-none">
        <div class="flex items-center gap-2 p-3 rounded-2xl bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs border border-sky-500/20">
          <Info class="size-4 shrink-0 text-sky-500" />
          <span>وزن‌ها بر حسب <strong>کیلوگرم</strong> به ازای هر کلاف ۵۰ متری استاندارد محاسبه می‌شوند.</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-px">
          {#each PIPE_SIZES as item}
            <Card class="border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors p-3.5 rounded-2xl shadow-none">
              <div class="flex items-center justify-between mb-2.5">
                <Badge variant="outline" class="font-bold text-xs bg-card border-border/80 px-2.5 py-0.5 rounded-lg">
                  سایز {item.label}
                </Badge>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="space-y-1">
                  <span class="text-muted-foreground block text-[11px]">ضخامت ۰.۲۵ میلی‌متر:</span>
                  <div class="relative">
                    <Input
                      type="number"
                      step="0.01"
                      min="0.1"
                      dir="ltr"
                      class="h-8 pl-8 pr-2.5 text-xs bg-card rounded-xl text-left tabular-nums"
                      value={draftPipeWeights[`${item.value}-0.25`]}
                      oninput={(e) => updateWeight(`${item.value}-0.25`, e.target.value)}
                    />
                    <span class="absolute left-2.5 top-2 text-[10px] text-muted-foreground select-none pointer-events-none">kg</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <span class="text-muted-foreground block text-[11px]">ضخامت ۰.۳۰ میلی‌متر:</span>
                  <div class="relative">
                    <Input
                      type="number"
                      step="0.01"
                      min="0.1"
                      dir="ltr"
                      class="h-8 pl-8 pr-2.5 text-xs bg-card rounded-xl text-left tabular-nums"
                      value={draftPipeWeights[`${item.value}-0.30`]}
                      oninput={(e) => updateWeight(`${item.value}-0.30`, e.target.value)}
                    />
                    <span class="absolute left-2.5 top-2 text-[10px] text-muted-foreground select-none pointer-events-none">kg</span>
                  </div>
                </div>
              </div>
            </Card>
          {/each}
        </div>
      </Tabs.Content>

      <!-- ۲. تب قیمت عایق‌ها -->
      <Tabs.Content value="insulation" class="pt-4 space-y-3 outline-none">
        <div class="flex items-center gap-2 p-3 rounded-2xl bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs border border-sky-500/20">
          <Info class="size-4 shrink-0 text-sky-500" />
          <span>قیمت‌ها بر مبنای هر <strong>شاخه ۱.۸ متری استاندارد</strong> به ریال است.</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-px">
          {#each PIPE_SIZES as item}
            <Card class="border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors p-3.5 rounded-2xl shadow-none">
              <div class="flex items-center justify-between mb-2">
                <Badge variant="outline" class="font-bold text-xs bg-card border-border/80 px-2.5 py-0.5 rounded-lg">
                  عایق {item.label}
                </Badge>
                <span class="text-xs text-primary font-bold">
                  {formatNumber(toToman(draftInsulationPrices[item.value]))} تومان
                </span>
              </div>

              <div class="space-y-1">
                <span class="text-muted-foreground block text-[11px]">قیمت هر شاخه:</span>
                <div class="relative">
                  <Input
                    type="text"
                    inputmode="numeric"
                    dir="ltr"
                    class="h-8 pl-10 pr-2.5 text-xs bg-card rounded-xl text-left tabular-nums"
                    value={formatNumber(draftInsulationPrices[item.value])}
                    oninput={(e) => updateInsulationPrice(item.value, e.target.value)}
                  />
                  <span class="absolute left-2.5 top-2 text-[10px] text-muted-foreground select-none pointer-events-none">ریال</span>
                </div>
              </div>
            </Card>
          {/each}
        </div>
      </Tabs.Content>

      <!-- ۳. تب پرایمرها -->
      <Tabs.Content value="primer" class="pt-4 space-y-3 outline-none">
        <div class="flex items-center gap-2 p-3 rounded-2xl bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs border border-sky-500/20">
          <Info class="size-4 shrink-0 text-sky-500" />
          <span>تنظیم قیمت واحد (ریال) و متراژ لوله‌ای که هر عدد پرایمر پوشش می‌دهد (متر).</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-px">
          {#each Object.entries(draftPrimerTypes) as [key, item]}
            <Card class="border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors p-3.5 rounded-2xl shadow-none">
              <div class="flex items-center justify-between mb-2">
                <Badge variant="outline" class="font-bold text-xs bg-card border-border/80 px-2.5 py-0.5 rounded-lg">
                  {item.label}
                </Badge>
                <span class="text-xs text-primary font-bold">
                  {formatNumber(toToman(item.price))} تومان
                </span>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="space-y-1">
                  <span class="text-muted-foreground block text-[11px]">قیمت هر عدد:</span>
                  <div class="relative">
                    <Input
                      type="text"
                      inputmode="numeric"
                      dir="ltr"
                      class="h-8 pl-10 pr-2.5 text-xs bg-card rounded-xl text-left tabular-nums"
                      value={formatNumber(item.price)}
                      oninput={(e) => updatePrimerPrice(key, e.target.value)}
                    />
                    <span class="absolute left-2.5 top-2 text-[10px] text-muted-foreground select-none pointer-events-none">ریال</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <span class="text-muted-foreground block text-[11px]">پوشش (متر):</span>
                  <div class="relative">
                    <Input
                      type="number"
                      step="0.5"
                      min="0.5"
                      dir="ltr"
                      class="h-8 pl-7 pr-2.5 text-xs bg-card rounded-xl text-left tabular-nums"
                      value={item.perLength}
                      oninput={(e) => updatePrimerLength(key, e.target.value)}
                    />
                    <span class="absolute left-2.5 top-2 text-[10px] text-muted-foreground select-none pointer-events-none">m</span>
                  </div>
                </div>
              </div>
            </Card>
          {/each}
        </div>
      </Tabs.Content>
    </Tabs.Root>

    <!-- هشدار تایید بازنشانی -->
    {#if showResetConfirm}
      <div class="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in zoom-in-95">
        <div class="flex items-center gap-2 text-destructive font-medium">
          <AlertCircle class="size-4 shrink-0" />
          <span>آیا از بازنشانی تمام مقادیر این فرم به پیش‌فرض کارخانه مطمئنید؟</span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <Button size="xs" variant="destructive" class="rounded-xl font-bold" onclick={handleResetToDefaults}>
            بله، بازنشانی شود
          </Button>
          <Button size="xs" variant="ghost" class="rounded-xl" onclick={() => (showResetConfirm = false)}>
            انصراف
          </Button>
        </div>
      </div>
    {/if}
  </div>
{/snippet}

{#snippet footerButtons()}
  <Button
    variant="ghost"
    size="sm"
    class="text-xs text-muted-foreground hover:text-foreground rounded-xl flex items-center gap-1.5"
    onclick={() => (showResetConfirm = !showResetConfirm)}
  >
    <RotateCcw class="size-3.5" />
    <span>مقادیر پیش‌فرض</span>
  </Button>

  <div class="flex items-center gap-2">
    <Button variant="outline" size="sm" class="rounded-xl text-xs" onclick={close}>
      انصراف
    </Button>
    <Button size="sm" class="rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/20" onclick={handleSave}>
      <Save class="size-3.5" />
      <span>ذخیره تغییرات</span>
    </Button>
  </div>
{/snippet}

{#if isDesktop.current}
  <!-- حالت مودال دیالوگ برای اندازه‌های بزرگ‌تر از md (تبلت و دسکتاپ) -->
  <Dialog.Root bind:open={isOpen}>
    <Dialog.Content
      showCloseButton={false}
      class="sm:max-w-2xl max-w-2xl p-0 gap-0 overflow-hidden flex flex-col max-h-[85vh]"
    >
      <Dialog.Header class="px-6 py-4 border-b border-border/70 flex flex-row items-center justify-between text-right bg-card/60 backdrop-blur-md">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
            <Settings class="size-5 text-primary" />
          </div>
          <div class="text-right">
            <div class="flex items-center gap-2">
              <Dialog.Title>تنظیمات مقادیر اولیه</Dialog.Title>
              <Badge variant="outline" class="text-[10px] font-bold text-orange-600 dark:text-orange-400 border-orange-500/30">
                {store.activePreset?.name}
              </Badge>
            </div>
            <Dialog.Description>سفارشی‌سازی اوزان، قیمت‌های عایق و پرایمر برای این الگو</Dialog.Description>
          </div>
        </div>
        <Button variant="ghost" size="icon" class="rounded-full size-8 cursor-pointer hover:bg-muted" onclick={close} title="بستن">
          <X class="size-4" />
        </Button>
      </Dialog.Header>

      {@render modalBody()}

      <Dialog.Footer class="px-6 py-3.5 border-t border-border/70 flex flex-row items-center justify-between bg-card/90 backdrop-blur-md sm:justify-between">
        {@render footerButtons()}
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <!-- حالت دراور از پایین برای اندازه‌های کوچک‌تر از md (موبایل) -->
  <Drawer.Root bind:open={isOpen}>
    <Drawer.Content class="sm:max-w-2xl sm:mx-auto">
      <Drawer.Header class="px-6 pt-2 pb-3.5 border-b border-border/70 flex flex-row items-center justify-between text-right bg-card/60 backdrop-blur-md">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
            <Settings class="size-5 text-primary" />
          </div>
          <div class="text-right">
            <div class="flex items-center gap-2">
              <Drawer.Title class="text-base font-bold text-foreground">تنظیمات مقادیر اولیه</Drawer.Title>
              <Badge variant="outline" class="text-[10px] font-bold text-orange-600 dark:text-orange-400 border-orange-500/30">
                {store.activePreset?.name}
              </Badge>
            </div>
            <Drawer.Description class="text-xs text-muted-foreground">سفارشی‌سازی اوزان، قیمت‌های عایق و پرایمر برای این الگو</Drawer.Description>
          </div>
        </div>
        <Button variant="ghost" size="icon" class="rounded-full size-8" onclick={close} title="بستن">
          <X class="size-4" />
        </Button>
      </Drawer.Header>

      {@render modalBody()}

      <Drawer.Footer class="flex-row items-center justify-between!">
        {@render footerButtons()}
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
{/if}
