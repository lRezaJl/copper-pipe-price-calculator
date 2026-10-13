<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import { formatNumber } from '../lib/calculator.js';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Card, CardContent } from '$lib/components/ui/card';
  import { Share2, Copy, Eye, RotateCcw, Check, Sparkles } from '@lucide/svelte';

  let { onOpenModal } = $props();
  let copied = $state(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(store.invoiceText);
      copied = true;
      store.showToast("متن فاکتور در کلیپ‌بورد کپی شد!", "success");
      setTimeout(() => (copied = false), 2500);
    } catch (e) {
      onOpenModal();
    }
  }

  async function handleShare() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: "فاکتور لوله مسی و اتصالات",
          text: store.invoiceText,
        });
        store.showToast("فاکتور به اشتراک گذاشته شد", "success");
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          onOpenModal();
        }
      }
    } else {
      onOpenModal();
    }
  }
</script>

<div class="relative group">
  <!-- گرادیان درخشان پشت کارت جمع کل فاکتور -->
  <div class="absolute -inset-1 bg-linear-to-r from-orange-500/30 via-sky-500/25 to-emerald-500/30 rounded-2xl blur-2xl -z-10 opacity-75 group-hover:opacity-100 transition-opacity"></div>

  <Card class="relative overflow-hidden rounded-2xl border-white/30 dark:border-white/10 bg-card/75 dark:bg-card/50 backdrop-blur-2xl shadow-2xl shadow-black/10">
    <!-- نوار گرادیان بالای کارت -->
    <div class="absolute top-0 right-0 left-0 h-1.5 bg-linear-to-r from-orange-500 via-sky-500 to-emerald-500"></div>

    <CardContent class="p-6 sm:p-8 space-y-6">

    <!-- بخش اصلی جمع کل و تفکیک اقلام -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <!-- مبلغ کل فاکتور -->
      <div class="space-y-2">
        <Badge variant="secondary" class="gap-1.5">
          <Sparkles class="size-3.5 text-sky-500" />
          <span>جمع کل فاکتور</span>
        </Badge>

        <div class="flex items-baseline gap-2.5 flex-wrap">
          <span class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            {formatNumber(store.grandTotal)}
          </span>
          <span class="text-base sm:text-lg font-bold text-muted-foreground">ریال</span>
        </div>
      </div>

      <!-- ریز اقلام محاسبه‌شده با استفاده از کامپوننت Badge پیش‌فرض شادسی‌ان -->
      <div class="flex flex-wrap gap-2 text-xs">
        {#if store.pipe1Result.enabled && store.pipe1Result.totalPrice > 0}
          <Badge variant="outline" class="gap-1.5 py-1 px-2.5">
            <span class="text-muted-foreground font-normal">لوله ۱:</span>
            <span class="font-bold">{formatNumber(store.pipe1Result.totalPrice)} ریال</span>
          </Badge>
        {/if}

        {#if store.pipe2Result.enabled && store.pipe2Result.totalPrice > 0}
          <Badge variant="outline" class="gap-1.5 py-1 px-2.5">
            <span class="text-muted-foreground font-normal">لوله ۲:</span>
            <span class="font-bold">{formatNumber(store.pipe2Result.totalPrice)} ریال</span>
          </Badge>
        {/if}

        {#if store.insulationResult.enabled && store.insulationResult.totalPrice > 0}
          <Badge variant="outline" class="gap-1.5 py-1 px-2.5">
            <span class="text-muted-foreground font-normal">عایق:</span>
            <span class="font-bold">{formatNumber(store.insulationResult.totalPrice)} ریال</span>
          </Badge>
        {/if}

        {#if store.primerResult.enabled && store.primerResult.totalPrice > 0}
          <Badge variant="outline" class="gap-1.5 py-1 px-2.5">
            <span class="text-muted-foreground font-normal">پرایمر:</span>
            <span class="font-bold">{formatNumber(store.primerResult.totalPrice)} ریال</span>
          </Badge>
        {/if}
      </div>
    </div>

    <!-- دکمه‌های اقدام شادسی‌ان بدون کلاس‌های تکراری اضافه -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <!-- دکمه اشتراک‌گذاری اصلی -->
      <Button
        type="button"
        size="lg"
        class="sm:flex-1 font-bold shadow-lg shadow-primary/20 gap-2 cursor-pointer"
        onclick={handleShare}
      >
        <Share2 />
        <span>اشتراک‌گذاری فاکتور</span>
      </Button>

      <!-- دکمه کپی متن -->
      <Button
        type="button"
        variant="outline"
        size="lg"
        onclick={handleCopy}
      >
        {#if copied}
          <Check class="text-emerald-500" />
          <span class="text-emerald-600 dark:text-emerald-400">کپی شد</span>
        {:else}
          <Copy />
          <span>کپی متن</span>
        {/if}
      </Button>

      <!-- دکمه مشاهده مودال فاکتور -->
      <Button
        type="button"
        variant="outline"
        size="lg"
        onclick={onOpenModal}
        title="پیش‌نمایش کامل"
      >
        <Eye />
        <span>مشاهده</span>
      </Button>

      <!-- دکمه ریست فرم -->
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        onclick={() => store.reset()}
        title="شروع مجدد"
        aria-label="شروع مجدد"
      >
        <RotateCcw />
      </Button>
    </div>
  </CardContent>
</Card>
</div>
