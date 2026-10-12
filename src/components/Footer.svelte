<script>
  import { Heart, ExternalLink } from '@lucide/svelte';
</script>

<footer class="mt-8 pt-6 pb-16 border-t border-dashed border-border/70 text-center space-y-2">
  <p class="text-xs font-medium text-muted-foreground">
    ماشین حساب قیمت لوله مسی - نسخه ۳.۰ (Svelte 5 & Edge)
  </p>
  <p class="text-xs text-muted-foreground flex items-center justify-center gap-1.5 flex-wrap">
    <span>طراحی شده با</span>
    <Heart class="size-3.5 text-rose-500 fill-rose-500 inline-block animate-pulse" />
    <span>ویژه فروشگاه برودتی</span>
    <a
      href="https://freezeland.shop"
      target="_blank"
      rel="noopener noreferrer"
      class="text-orange-500 hover:text-sky-500 dark:text-orange-400 font-bold inline-flex items-center gap-1 transition-colors"
    >
      <span>فریزلنــد</span>
      <ExternalLink class="size-3" />
    </a>
  </p>
</footer>
