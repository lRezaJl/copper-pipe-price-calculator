<script>
  import Navbar from './components/Navbar.svelte';
  import UnitPriceCard from './components/UnitPriceCard.svelte';
  import PipeCard from './components/PipeCard.svelte';
  import InsulationCard from './components/InsulationCard.svelte';
  import PrimerCard from './components/PrimerCard.svelte';
  import SummaryCard from './components/SummaryCard.svelte';
  import InvoiceModal from './components/InvoiceModal.svelte';
  import SettingsModal from './components/SettingsModal.svelte';
  import Toast from './components/Toast.svelte';
  import Footer from './components/Footer.svelte';
  import { Settings } from '@lucide/svelte';

  let isInvoiceModalOpen = $state(false);
  let isSettingsModalOpen = $state(false);

  function openInvoiceModal() {
    isInvoiceModalOpen = true;
  }

  function openSettingsModal() {
    isSettingsModalOpen = true;
  }
</script>

<main class="app-container">
  <!-- هدر و تغییر تم / PWA / دکمه تنظیمات هدر -->
  <Navbar onOpenSettings={openSettingsModal} />

  <!-- کارت قیمت پایه مس -->
  <UnitPriceCard />

  <!-- بخش لوله‌ها به صورت گرید مدرن و ریسپانسیو -->
  <div class="pipes-grid">
    <PipeCard pipeNumber={1} />
    <PipeCard pipeNumber={2} />
  </div>

  <!-- بخش عایق و پرایمر به صورت دو ستونه یا ردیفی -->
  <div class="accessories-grid">
    <InsulationCard />
    <PrimerCard />
  </div>

  <!-- خلاصه فاکتور و دکمه‌های اشتراک‌گذاری -->
  <SummaryCard onOpenModal={openInvoiceModal} />

  <!-- پاورقی -->
  <Footer />

  <!-- دکمه شناور تنظیمات کنار صفحه -->
  <button
    type="button"
    class="side-settings-btn"
    onclick={openSettingsModal}
    title="تنظیمات مقادیر اولیه (وزن، عایق و پرایمر)"
    aria-label="تنظیمات اولیه"
  >
    <Settings size={20} class="gear-icon" />
    <span class="btn-text">تنظیمات</span>
  </button>

  <!-- مودال‌ها و اعلان توست -->
  <InvoiceModal bind:isOpen={isInvoiceModalOpen} />
  <SettingsModal bind:isOpen={isSettingsModalOpen} />
  <Toast />
</main>

<style>
  .pipes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 18px;
  }

  .accessories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 18px;
  }

  /* دکمه شناور تنظیمات کنار صفحه */
  .side-settings-btn {
    position: fixed;
    bottom: 24px;
    left: 24px;
    z-index: 95;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 18px;
    border-radius: var(--radius-full);
    background: var(--bg-card);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1.5px solid var(--border-color);
    color: var(--text-primary);
    font-size: 0.92rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow:
      0 10px 25px -5px rgba(0, 0, 0, 0.15),
      0 0 15px var(--copper-glow);
    transition: var(--transition);
  }

  .side-settings-btn:hover {
    transform: translateY(-2px);
    border-color: var(--copper-500);
    color: var(--copper-500);
    box-shadow:
      0 14px 28px -5px rgba(0, 0, 0, 0.22),
      0 0 22px var(--copper-glow);
  }

  .side-settings-btn:hover :global(.gear-icon) {
    transform: rotate(60deg);
  }

  .side-settings-btn:active {
    transform: scale(0.95);
  }

  :global(.gear-icon) {
    color: var(--copper-500);
    transition: transform 0.4s ease;
  }

  @media (max-width: 720px) {
    .pipes-grid,
    .accessories-grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }
  }

  @media (max-width: 640px) {
    .side-settings-btn {
      bottom: 18px;
      left: 16px;
      padding: 10px 14px;
      font-size: 0.85rem;
    }
  }
</style>
