<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { formatNumber, toEnglishDigits } from '../lib/calculator.js';
  import { Switch } from '$lib/components/ui/switch';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import * as Select from '$lib/components/ui/select';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
  } from '$lib/components/ui/card';
  import { Package, Info } from '@lucide/svelte';

  const result = $derived(store.primerResult);
  const typesList = $derived(Object.values(store.settings.primerTypes));
  const primerItems = $derived(
    typesList.map((item) => ({
      value: item.key,
      label: `${item.label} (${formatNumber(item.price)} ریال - هر ${item.perLength} متر)`,
    }))
  );

  function handleTypeChange(val) {
    if (val) {
      store.primer.type = val;
      store.saveToStorage();
    }
  }

  function handleManualCount(e) {
    const raw = toEnglishDigits(e.target.value);
    const val = parseInt(raw, 10) || 1;
    store.primer.manualCount = val;
    store.saveToStorage();
  }
</script>

<div class="relative group h-full">
  <!-- گرادیان ملایم پشت کارت پرایمر -->
  <div class={`absolute -inset-0.5 rounded-2xl blur-xl -z-10 opacity-70 group-hover:opacity-90 transition-opacity ${store.primer.enabled ? 'bg-linear-to-br from-sky-500/25 via-sky-400/10 to-transparent' : 'bg-transparent'}`}></div>

  <Card class={`relative overflow-hidden rounded-2xl border-white/30 dark:border-white/10 bg-card/75 dark:bg-card/50 backdrop-blur-2xl shadow-xl shadow-black/5 transition-all duration-300 flex flex-col justify-between h-full ${!store.primer.enabled ? 'opacity-65' : ''}`}>
    <div class={`absolute top-0 right-0 left-0 h-1.5 transition-colors ${store.primer.enabled ? 'bg-sky-500' : 'bg-muted'}`}></div>

    <div>
      <!-- هدر پرایمر با شادسی‌ان -->
      <CardHeader class="flex flex-row items-center justify-between gap-3 p-5 sm:p-6 pb-2 sm:pb-3 space-y-0">
        <div class="flex items-center gap-3">
          <div class="size-10 sm:size-11 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20 shadow-xs">
            <Package class="size-5 sm:size-6" />
          </div>
          <div>
            <CardTitle class="text-base sm:text-lg font-bold">محاسبه پرایمر</CardTitle>
            <CardDescription class="text-xs mt-0.5">
              چسب و عایق‌بندی تکمیلی لوله‌ها
            </CardDescription>
          </div>
        </div>

        <!-- سوئیچ بدون بیرون‌زدگی دکمه در RTL -->
        <div title={store.primer.enabled ? 'غیرفعال کردن' : 'فعال کردن'} class="shrink-0">
          <Switch
            bind:checked={store.primer.enabled}
            onCheckedChange={(val) => {
              store.primer.enabled = val;
              store.saveToStorage();
            }}
            aria-label={store.primer.enabled ? 'غیرفعال کردن' : 'فعال کردن'}
          />
        </div>
      </CardHeader>

      <CardContent class="p-5 sm:p-6 pt-2 sm:pt-3">
        {#if store.primer.enabled}
          <div class="space-y-3.5">
            <!-- انتخاب نوع پرایمر -->
            <div class="space-y-1.5">
              <label for="primer-type-select" class="text-xs sm:text-sm font-semibold text-foreground block">
                نوع پرایمر:
              </label>
              <Select.Root
                type="single"
                bind:value={store.primer.type}
                items={primerItems}
                onValueChange={handleTypeChange}
              >
                <Select.Trigger
                  id="primer-type-select"
                  class="w-full"
                >
                  <Select.Value placeholder="انتخاب نوع پرایمر" />
                </Select.Trigger>
                <Select.Content>
                  {#each typesList as item}
                    <Select.Item
                      value={item.key}
                      label={`${item.label} (${formatNumber(item.price)} ریال - هر ${item.perLength} متر)`}
                      class="cursor-pointer"
                    >
                      {item.label} ({formatNumber(item.price)} ریال - هر {item.perLength} متر)
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>

            <!-- فیلد دستی در صورت متراژهای نامساوی -->
            {#if result.isManual}
              <div class="space-y-1.5">
                <label for="manual-count-input" class="text-xs sm:text-sm font-semibold text-foreground block">
                  تعداد پرایمر (متراژ متفاوت):
                </label>
                <div class="relative">
                  <Input
                    id="manual-count-input"
                    type="number"
                    min="1"
                    dir="ltr"
                    class="text-center font-bold text-base sm:text-lg pl-12 pr-12 bg-background/40 backdrop-blur-sm tabular-nums"
                    placeholder="1"
                    value={store.primer.manualCount}
                    oninput={handleManualCount}
                  />
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground select-none pointer-events-none">
                    عدد
                  </span>
                </div>
              </div>
            {/if}

            {#if !result.valid}
              <div class="flex items-center gap-2.5 p-3.5 rounded-2xl bg-muted/30 backdrop-blur-sm text-muted-foreground text-xs sm:text-sm border border-dashed border-border">
                <Info class="size-4 shrink-0 text-sky-500" />
                <span>لطفاً متراژ لوله‌ها را وارد کنید تا تعداد پرایمر مورد نیاز برآورد شود.</span>
              </div>
            {:else}
              <!-- کادر نتایج پرایمر -->
              <div class="p-3.5 sm:p-4 rounded-2xl bg-muted/30 backdrop-blur-sm border border-white/20 dark:border-white/10 space-y-2.5 text-xs sm:text-sm">
                {#if result.isManual}
                  <div class="flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400 bg-sky-500/10 p-2.5 rounded-xl border border-sky-500/20">
                    <Info class="size-3.5 text-sky-500 shrink-0" />
                    <span>به دلیل تفاوت متراژ لوله‌ها، تعداد پرایمر به صورت دستی قابل تنظیم است.</span>
                  </div>
                {/if}

                <div class="flex items-center justify-between text-muted-foreground">
                  <span>تعداد مورد نیاز:</span>
                  <span class="font-bold text-foreground">{result.count} <small class="text-xs text-muted-foreground">عدد</small></span>
                </div>

                <div class="flex items-center justify-between text-muted-foreground">
                  <span>قیمت هر واحد:</span>
                  <span class="font-bold text-foreground">{formatNumber(result.primerInfo.price)} <small class="text-xs text-muted-foreground">ریال</small></span>
                </div>

                <div class="pt-2 border-t border-border/70 flex items-center justify-between">
                  <span class="font-bold text-foreground">قیمت کل پرایمر:</span>
                  <span class="text-sm sm:text-base font-extrabold text-sky-600 dark:text-sky-400">{formatNumber(result.totalPrice)} ریال</span>
                </div>
              </div>
            {/if}
          </div>
        {:else}
          <div class="py-8 text-center text-xs sm:text-sm text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border mt-2">
            <p>محاسبه پرایمر غیرفعال شده است.</p>
          </div>
        {/if}
      </CardContent>
    </div>
  </Card>
</div>
