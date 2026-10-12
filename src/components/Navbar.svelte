<script>
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Sun, Moon, Flame, Snowflake, Download, Settings } from '@lucide/svelte';

  let { onOpenSettings } = $props();

  let isDark = $state(false);
  let deferredPrompt = $state(null);
  let canInstall = $state(false);

  function applyTheme(dark) {
    isDark = dark;
    const theme = dark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', theme);
  }

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    applyTheme(initialDark);

    // رویداد نصب PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      canInstall = true;
    });

    window.addEventListener('appinstalled', () => {
      canInstall = false;
      deferredPrompt = null;
    });
  });

  function toggleTheme() {
    applyTheme(!isDark);
  }

  async function installApp() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      canInstall = false;
    }
    deferredPrompt = null;
  }
</script>

<div class="relative group">
  <!-- گرادیان ملایم پشت هدر -->
  <div class="absolute -inset-0.5 bg-linear-to-r from-orange-500/20 via-sky-500/15 to-amber-500/20 rounded-3xl blur-lg -z-10 opacity-70 group-hover:opacity-90 transition-opacity"></div>

  <header class="relative flex items-center justify-between px-5 sm:px-6 py-4 bg-card/70 dark:bg-card/50 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-3xl shadow-lg shadow-black/5">
    <!-- لوگو و برندینگ فریزلند -->
    <div class="flex items-center gap-3.5">
      <img
        src="/FreezeLand-logo.png"
        alt="لوگوی فریزلند"
        class="size-10 sm:size-11 object-cover rounded-full shadow-sm"
      />
      <div>
        <h1 class="text-base sm:text-lg font-black text-foreground tracking-tight">ماشین حساب قیمت لوله مسی</h1>
        <a
          href="https://freezeland.shop"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-muted-foreground hover:text-sky-500 transition-colors flex items-center gap-1"
        >
          <span>فروشگاه برودتی</span>
          <span class="font-bold text-orange-500">فریزلند</span>
        </a>
      </div>
    </div>

    <!-- اکشن‌های بالای هدر با استایل پیش‌فرض شادسی‌ان -->
    <div class="flex items-center gap-2">
      {#if canInstall}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onclick={installApp}
          title="نصب اپلیکیشن روی دستگاه"
        >
          <Download />
          <span class="hidden sm:inline">نصب PWA</span>
        </Button>
      {/if}

      {#if onOpenSettings}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onclick={onOpenSettings}
          title="تنظیمات مقادیر اولیه (وزن، عایق، پرایمر)"
          aria-label="تنظیمات"
          class="max-sm:hidden"
        >
          <Settings />
        </Button>
      {/if}

      <Button
        type="button"
        variant="outline"
        size="icon"
        onclick={toggleTheme}
        title={isDark ? 'حالت روشن' : 'حالت تیره'}
        aria-label="تغییر تم"
      >
        {#if isDark}
          <Sun class="text-amber-400" />
        {:else}
          <Moon class="text-slate-700 dark:text-slate-300" />
        {/if}
      </Button>
    </div>
  </header>
</div>
