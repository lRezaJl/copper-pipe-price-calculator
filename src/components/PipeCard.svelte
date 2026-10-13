<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { PIPE_SIZES, PIPE_THICKNESSES, formatNumber, toEnglishDigits } from '../lib/calculator.js';
  import { Switch } from '$lib/components/ui/switch';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import * as Select from '$lib/components/ui/select';
  import { ArrowLeftRight, Weight } from '@lucide/svelte';

  let { pipeNumber = 1 } = $props();

  const pipe = $derived(pipeNumber === 1 ? store.pipe1 : store.pipe2);
  const result = $derived(pipeNumber === 1 ? store.pipe1Result : store.pipe2Result);
  const otherPipeNumber = $derived(pipeNumber === 1 ? 2 : 1);
  const otherPipe = $derived(pipeNumber === 1 ? store.pipe2 : store.pipe1);

  function handleLengthInput(e) {
    const val = toEnglishDigits(e.target.value);
    pipe.length = val;
    store.syncLengths(pipeNumber);
  }

  function handleSizeChange(val) {
    if (val) {
      pipe.size = val;
      store.saveToStorage();
    }
  }

  function handleThicknessChange(val) {
    if (val) {
      pipe.thickness = val;
      store.saveToStorage();
    }
  }

  function copyFromOther() {
    store.copyLength(otherPipeNumber, pipeNumber);
  }
</script>

<div class="relative group">
  <!-- گرادیان ملایم پشت کارت لوله -->
  <div class={`absolute -inset-0.5 rounded-3xl blur-xl -z-10 opacity-70 group-hover:opacity-90 transition-opacity ${pipe.enabled ? 'bg-linear-to-br from-orange-500/25 via-amber-400/10 to-transparent' : 'bg-transparent'}`}></div>

  <div class={`relative rounded-3xl border border-white/30 dark:border-white/10 bg-card/70 dark:bg-card/50 backdrop-blur-2xl p-5 sm:p-7 shadow-xl shadow-black/5 transition-all duration-300 overflow-hidden flex flex-col justify-between ${!pipe.enabled ? 'opacity-65' : ''}`}>
    <!-- نوار نشانگر لوله مسی -->
    <div class={`absolute top-0 right-0 left-0 h-1.5 transition-colors ${pipe.enabled ? 'bg-orange-500' : 'bg-muted'}`}></div>

    <div>
      <!-- هدر کارت لوله -->
      <div class="flex items-center justify-between pb-4 border-b border-border/60 gap-3">
        <div class="flex items-center gap-3">
          <div class={`size-10 sm:size-11 rounded-2xl flex items-center justify-center font-black text-base shrink-0 border shadow-xs transition-colors ${pipe.enabled ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25' : 'bg-muted text-muted-foreground border-border'}`}>
            {pipeNumber}
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-bold text-foreground">لوله مسی شماره {pipeNumber}</h3>
            <span class="text-xs text-muted-foreground block mt-0.5">
              {pipe.enabled ? `${pipe.size} اینچ - ضخامت ${pipe.thickness} میلی‌متر` : 'غیرفعال شده'}
            </span>
          </div>
        </div>

        <!-- سوئیچ بدون بیرون‌زدگی دکمه در RTL -->
        <div title={pipe.enabled ? 'غیرفعال کردن' : 'فعال کردن'} class="shrink-0">
          <Switch
            bind:checked={pipe.enabled}
            onCheckedChange={(val) => {
              pipe.enabled = val;
              store.saveToStorage();
            }}
            aria-label={pipe.enabled ? 'غیرفعال کردن' : 'فعال کردن'}
          />
        </div>
      </div>

      {#if pipe.enabled}
        <div class="pt-4 space-y-3.5">
          <!-- انتخاب سایز و ضخامت -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- انتخاب سایز با کامپوننت شادسی‌ان -->
            <div class="space-y-1.5">
              <label for={`size-${pipeNumber}`} class="text-xs sm:text-sm font-semibold text-foreground block">
                سایز لوله:
              </label>
              <Select.Root
                type="single"
                bind:value={pipe.size}
                items={PIPE_SIZES}
                onValueChange={handleSizeChange}
              >
                <Select.Trigger
                  id={`size-${pipeNumber}`}
                  class="w-full"
                >
                  <Select.Value placeholder="انتخاب سایز" />
                </Select.Trigger>
                <Select.Content>
                  {#each PIPE_SIZES as item}
                    <Select.Item value={item.value} label={item.label} class="cursor-pointer">
                      {item.label}
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>

            <!-- انتخاب ضخامت با کامپوننت شادسی‌ان -->
            <div class="space-y-1.5">
              <label for={`thickness-${pipeNumber}`} class="text-xs sm:text-sm font-semibold text-foreground block">
                ضخامت لوله:
              </label>
              <Select.Root
                type="single"
                bind:value={pipe.thickness}
                items={PIPE_THICKNESSES}
                onValueChange={handleThicknessChange}
              >
                <Select.Trigger
                  id={`thickness-${pipeNumber}`}
                  class="w-full"
                >
                  <Select.Value placeholder="انتخاب ضخامت" />
                </Select.Trigger>
                <Select.Content>
                  {#each PIPE_THICKNESSES as item}
                    <Select.Item value={item.value} label={item.label} class="cursor-pointer">
                      {item.label}
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>
          </div>

          <!-- ورودی متراژ -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for={`length-${pipeNumber}`} class="text-xs sm:text-sm font-semibold text-foreground">
                متراژ لوله (متر):
              </label>
              {#if otherPipe.enabled && otherPipe.length && otherPipe.length !== pipe.length}
                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  onclick={copyFromOther}
                >
                  <ArrowLeftRight />
                  <span>کپی متراژ از لوله {otherPipeNumber} ({otherPipe.length} متر)</span>
                </Button>
              {/if}
            </div>

            <div class="relative">
              <Input
                id={`length-${pipeNumber}`}
                type="number"
                min="0"
                step="any"
                dir="ltr"
                class="text-center font-bold text-base sm:text-lg pl-12 pr-12 bg-background/40 backdrop-blur-sm tabular-nums"
                placeholder="10"
                value={pipe.length}
                oninput={handleLengthInput}
              />
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground select-none pointer-events-none">
                متر
              </span>
            </div>
          </div>
        </div>
      {:else}
        <div class="py-8 text-center text-xs sm:text-sm text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border mt-4">
          این بخش غیرفعال است و در جمع کل لحاظ نمی‌شود.
        </div>
      {/if}
    </div>

    {#if pipe.enabled}
      <!-- کادر نمایش نتایج این لوله -->
      <div class="mt-4 p-3.5 sm:p-4 rounded-2xl bg-muted/30 backdrop-blur-sm border border-white/20 dark:border-white/10 space-y-2 text-xs sm:text-sm">
      <div class="flex items-center justify-between text-muted-foreground">
        <span class="flex items-center gap-1.5">
          <Weight class="size-3.5 text-muted-foreground" />
          وزن کلاف (۵۰ متر):
        </span>
        <span class="font-bold text-foreground">
          {result.weight || '—'} <small class="text-xs text-muted-foreground">کیلوگرم</small>
        </span>
      </div>

      <div class="flex items-center justify-between text-muted-foreground">
        <span>قیمت هر متر:</span>
        <span class="font-bold text-foreground">
          {formatNumber(result.pricePerMeter)} <small class="text-xs text-muted-foreground">ریال</small>
        </span>
      </div>

      <div class="pt-2 border-t border-border/70 flex items-center justify-between">
        <span class="font-bold text-foreground">قیمت کل لوله {pipeNumber}:</span>
        <span class="text-sm sm:text-base font-extrabold text-orange-600 dark:text-orange-400">
          {formatNumber(result.totalPrice)} ریال
        </span>
      </div>
    </div>
  {/if}
  </div>
</div>
