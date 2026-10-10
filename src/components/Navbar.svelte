<script>
  import { onMount } from 'svelte';
  import { Sun, Moon, Flame, Snowflake, Download } from '@lucide/svelte';

  let isDark = $state(false);
  let deferredPrompt = $state(null);
  let canInstall = $state(false);

  onMount(() => {
    // بررسی تم ترجیحی کاربر
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      isDark = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // بررسی رویداد نصب PWA
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
    isDark = !isDark;
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
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

<header class="navbar glass-card">
  <div class="brand">
    <div class="brand-icon">
      <Flame size={20} class="icon-copper" />
      <Snowflake size={18} class="icon-ice" />
    </div>
    <div class="brand-text">
      <h1>ماشین حساب قیمت لوله مسی</h1>
      <a href="https://freezeland.shop" target="_blank" rel="noopener noreferrer" class="brand-sub">
        فروشگاه برودتی و تاسیساتی <span class="brand-highlight">فریزلنــد</span>
      </a>
    </div>
  </div>

  <div class="actions">
    {#if canInstall}
      <button class="btn btn-secondary install-btn" onclick={installApp} title="نصب اپلیکیشن روی دستگاه">
        <Download size={17} />
        <span>نصب PWA</span>
      </button>
    {/if}

    <button class="btn btn-ghost theme-btn" onclick={toggleTheme} title={isDark ? 'حالت روشن' : 'حالت تیره'}>
      {#if isDark}
        <Sun size={20} class="sun-icon" />
      {:else}
        <Moon size={20} class="moon-icon" />
      {/if}
    </button>
  </div>
</header>

<style>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: var(--bg-card);
    border-radius: var(--radius-lg);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, rgba(234, 88, 12, 0.15), rgba(2, 132, 199, 0.15));
    border: 1px solid var(--border-color);
    position: relative;
  }

  :global(.icon-copper) {
    color: var(--copper-500);
    margin-left: -4px;
  }

  :global(.icon-ice) {
    color: var(--ice-500);
    margin-right: -4px;
  }

  .brand-text h1 {
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--text-primary);
    line-height: 1.3;
  }

  .brand-sub {
    font-size: 0.8rem;
    color: var(--text-secondary);
    text-decoration: none;
    display: block;
    transition: var(--transition);
  }

  .brand-sub:hover {
    color: var(--ice-500);
  }

  .brand-highlight {
    font-weight: 700;
    color: var(--copper-500);
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .install-btn {
    padding: 8px 14px;
    font-size: 0.85rem;
  }

  .theme-btn {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-color);
  }

  :global(.sun-icon) {
    color: #f59e0b;
  }

  :global(.moon-icon) {
    color: var(--ice-500);
  }

  @media (max-width: 640px) {
    .navbar {
      padding: 12px 14px;
    }
    .brand-text h1 {
      font-size: 1rem;
    }
    .brand-sub {
      font-size: 0.74rem;
    }
    .install-btn span {
      display: none;
    }
    .install-btn {
      padding: 8px;
    }
  }
</style>
