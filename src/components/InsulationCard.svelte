<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { formatNumber } from '../lib/calculator.js';
  import { Switch } from '$lib/components/ui/switch';
  import { Badge } from '$lib/components/ui/badge';
  import { Shield, Info } from '@lucide/svelte';

  const result = $derived(store.insulationResult);
</script>

<div class="relative group">
  <!-- گرادیان ملایم پشت کارت عایق -->
  <div class={`absolute -inset-0.5 rounded-3xl blur-xl -z-10 opacity-70 group-hover:opacity-90 transition-opacity ${store.insulation.enabled ? 'bg-linear-to-br from-sky-500/25 via-sky-400/10 to-transparent' : 'bg-transparent'}`}></div>

  <div class={`relative rounded-3xl border border-white/30 dark:border-white/10 bg-card/70 dark:bg-card/50 backdrop-blur-2xl p-5 sm:p-7 shadow-xl shadow-black/5 transition-all duration-300 overflow-hidden flex flex-col justify-between ${!store.insulation.enabled ? 'opacity-65' : ''}`}>
    <div class={`absolute top-0 right-0 left-0 h-1.5 transition-colors ${store.insulation.enabled ? 'bg-sky-500' : 'bg-muted'}`}></div>

    <div>
      <!-- هدر کارت عایق -->
      <div class="flex items-center justify-between pb-4 border-b border-border/60 gap-3">
        <div class="flex items-center gap-3">
          <div class="size-10 sm:size-11 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20 shadow-xs">
            <Shield class="size-5 sm:size-6" />
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-bold text-foreground">محاسبه عایق</h3>
            <span class="text-xs text-muted-foreground block mt-0.5">
              بر اساس طول شاخه‌های استاندارد ۱.۸ متری
            </span>
          </div>
        </div>

        <!-- سوئیچ بدون بیرون‌زدگی دکمه در RTL -->
        <div title={store.insulation.enabled ? 'غیرفعال کردن' : 'فعال کردن'} class="shrink-0">
          <Switch
            bind:checked={store.insulation.enabled}
            onCheckedChange={(val) => {
              store.insulation.enabled = val;
              store.saveToStorage();
            }}
            aria-label={store.insulation.enabled ? 'غیرفعال کردن' : 'فعال کردن'}
          />
        </div>
      </div>

      {#if store.insulation.enabled}
        <div class="pt-4">
          {#if !result.valid}
            <div class="flex items-center gap-2.5 p-3.5 rounded-2xl bg-muted/30 backdrop-blur-sm text-muted-foreground text-xs sm:text-sm border border-dashed border-border">
              <Info class="size-4 shrink-0 text-sky-500" />
              <span>لطفاً متراژ لوله‌ها را در بخش بالا وارد کنید تا عایق به صورت خودکار محاسبه شود.</span>
            </div>
          {:else}
            <!-- کادر نتایج عایق -->
            <div class="p-3.5 sm:p-4 rounded-2xl bg-muted/30 backdrop-blur-sm border border-white/20 dark:border-white/10 space-y-2.5 text-xs sm:text-sm">
              {#if result.mode === 'paired'}
                <div class="flex items-center justify-between text-muted-foreground">
                  <span>تعداد عایق مورد نیاز:</span>
                  <span class="font-bold text-foreground">{result.pairsNeeded} <small class="text-xs text-muted-foreground">جفت</small></span>
                </div>

                <div class="flex items-center justify-between text-muted-foreground">
                  <span>قیمت هر جفت ({result.size1} + {result.size2}):</span>
                  <span class="font-bold text-foreground">{formatNumber(result.pairPrice)} <small class="text-xs text-muted-foreground">ریال</small></span>
                </div>

                <div class="pt-2 border-t border-border/70 flex items-center justify-between">
                  <span class="font-bold text-foreground">قیمت کل عایق‌ها:</span>
                  <span class="text-sm sm:text-base font-extrabold text-sky-600 dark:text-sky-400">{formatNumber(result.totalPrice)} ریال</span>
                </div>

              {:else if result.mode === 'separate' && result.pipe1 && result.pipe2}
                <Badge variant="outline" class="h-auto px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs font-semibold">
                  محاسبه مجزا (متراژهای نامساوی)
                </Badge>

                <div class="p-2.5 rounded-xl bg-background/50 backdrop-blur-sm border border-white/20 dark:border-white/10 space-y-1 text-xs">
                  <span class="font-bold text-foreground block">عایق برای لوله ۱ (سایز {result.pipe1.size}):</span>
                  <div class="flex justify-between text-muted-foreground">
                    <span>تعداد:</span>
                    <span class="font-bold text-foreground">{result.pipe1.pairs} <small>عدد</small></span>
                  </div>
                  <div class="flex justify-between text-muted-foreground">
                    <span>قیمت هر عایق:</span>
                    <span class="font-bold text-foreground">{formatNumber(result.pipe1.unitPrice)} <small>ریال</small></span>
                  </div>
                  <div class="flex justify-between text-muted-foreground">
                    <span>مجموع لوله ۱:</span>
                    <span class="font-bold text-foreground">{formatNumber(result.pipe1.total)} <small>ریال</small></span>
                  </div>
                </div>

                <div class="p-2.5 rounded-xl bg-background/50 backdrop-blur-sm border border-white/20 dark:border-white/10 space-y-1 text-xs">
                  <span class="font-bold text-foreground block">عایق برای لوله ۲ (سایز {result.pipe2.size}):</span>
                  <div class="flex justify-between text-muted-foreground">
                    <span>تعداد:</span>
                    <span class="font-bold text-foreground">{result.pipe2.pairs} <small>عدد</small></span>
                  </div>
                  <div class="flex justify-between text-muted-foreground">
                    <span>قیمت هر عایق:</span>
                    <span class="font-bold text-foreground">{formatNumber(result.pipe2.unitPrice)} <small>ریال</small></span>
                  </div>
                  <div class="flex justify-between text-muted-foreground">
                    <span>مجموع لوله ۲:</span>
                    <span class="font-bold text-foreground">{formatNumber(result.pipe2.total)} <small>ریال</small></span>
                  </div>
                </div>

                <div class="pt-2 border-t border-border/70 flex items-center justify-between">
                  <span class="font-bold text-foreground">جمع کل عایق‌ها:</span>
                  <span class="text-sm sm:text-base font-extrabold text-sky-600 dark:text-sky-400">{formatNumber(result.totalPrice)} ریال</span>
                </div>

              {:else if result.mode === 'single'}
                <div class="flex items-center justify-between text-muted-foreground">
                  <span>تعداد عایق (سایز {result.activeSize}):</span>
                  <span class="font-bold text-foreground">{result.pairsNeeded} <small class="text-xs text-muted-foreground">عدد</small></span>
                </div>

                <div class="flex items-center justify-between text-muted-foreground">
                  <span>قیمت هر شاخه:</span>
                  <span class="font-bold text-foreground">{formatNumber(result.price)} <small class="text-xs text-muted-foreground">ریال</small></span>
                </div>

                <div class="pt-2 border-t border-border/70 flex items-center justify-between">
                  <span class="font-bold text-foreground">قیمت کل عایق:</span>
                  <span class="text-sm sm:text-base font-extrabold text-sky-600 dark:text-sky-400">{formatNumber(result.totalPrice)} ریال</span>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {:else}
        <div class="py-8 text-center text-xs sm:text-sm text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border mt-4">
          <p>محاسبه عایق غیرفعال شده است.</p>
        </div>
      {/if}
    </div>
  </div>
</div>
