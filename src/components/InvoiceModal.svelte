<script>
  import { store } from '../lib/calculatorState.svelte.js';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Copy, Check, MessageSquare, Share2 } from '@lucide/svelte';
  import confetti from 'canvas-confetti';

  let { isOpen = $bindable(false) } = $props();
  let copied = $state(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(store.invoiceText);
      copied = true;
      triggerConfetti();
      store.showToast("متن فاکتور با موفقیت در کلیپ‌بورد کپی شد!", "success");
      setTimeout(() => (copied = false), 2500);
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = store.invoiceText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copied = true;
      store.showToast("متن فاکتور در کلیپ‌بورد کپی شد!", "success");
      setTimeout(() => (copied = false), 2500);
    }
  }

  function handleWhatsApp() {
    const encoded = encodeURIComponent(store.invoiceText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  }

  function triggerConfetti() {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {}
  }

  function close() {
    isOpen = false;
  }
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content class="sm:max-w-xl">
    <Dialog.Header>
      <div class="flex items-center gap-2.5">
        <div class="size-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Share2 class="size-4.5" />
        </div>
        <div>
          <Dialog.Title>پیش‌نمایش و اشتراک‌گذاری فاکتور</Dialog.Title>
          <Dialog.Description class="sr-only">پیش‌نمایش و اشتراک‌گذاری فاکتور</Dialog.Description>
        </div>
      </div>
    </Dialog.Header>

    <div class="max-h-[55vh] overflow-y-auto">
      <pre class="bg-muted/40 border border-border/70 rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap wrap-break-word text-foreground selection:bg-primary/20 select-text">{store.invoiceText}</pre>
    </div>

    <Dialog.Footer class="flex flex-col sm:flex-row gap-2.5">
      <Button
        type="button"
        variant="default"
        class="flex-1 rounded-2xl font-bold gap-2 bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md shadow-orange-500/20"
        onclick={handleCopy}
      >
        {#if copied}
          <Check class="size-4" />
          <span>کپی شد!</span>
        {:else}
          <Copy class="size-4" />
          <span>کپی در کلیپ‌بورد</span>
        {/if}
      </Button>

      <Button
        type="button"
        variant="outline"
        class="flex-1 rounded-2xl font-bold gap-2 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
        onclick={handleWhatsApp}
      >
        <MessageSquare class="size-4" />
        <span>ارسال در واتساپ</span>
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
