<script>
  import Navbar from './components/Navbar.svelte';
  import PresetBar from './components/PresetBar.svelte';
  import UnitPriceCard from './components/UnitPriceCard.svelte';
  import PipeCard from './components/PipeCard.svelte';
  import InsulationCard from './components/InsulationCard.svelte';
  import PrimerCard from './components/PrimerCard.svelte';
  import SummaryCard from './components/SummaryCard.svelte';
  import InvoiceModal from './components/InvoiceModal.svelte';
  import SettingsModal from './components/SettingsModal.svelte';
  import Toast from './components/Toast.svelte';
  import Footer from './components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
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

<div class="relative w-full min-h-screen overflow-x-hidden">
  <!-- اورب‌ها و گرادیان‌های شناور پس‌زمینه برای عمق‌بخشی به گلس‌مورفیسم -->
  <div class="fixed top-[-5%] right-[-10%] size-112 sm:size-144 rounded-full bg-linear-to-br from-sky-500/15 via-cyan-400/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>
  <div class="fixed top-[40%] left-[-15%] size-112 sm:size-160 rounded-full bg-linear-to-tr from-orange-500/15 via-amber-400/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>
  <div class="fixed bottom-[-10%] right-[10%] size-104 sm:size-136 rounded-full bg-linear-to-tl from-emerald-500/15 via-sky-500/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

  <main class="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 relative z-10">
    <!-- هدر و تغییر تم / PWA / دکمه تنظیمات -->
    <Navbar onOpenSettings={openSettingsModal} />

    <!-- بخش انتخاب و مدیریت الگوهای محاسبه -->
    <PresetBar />

    <!-- کارت نرخ پایه مس -->
    <UnitPriceCard />

    <!-- بخش لوله‌ها: در دسکتاپ دو ستونه با فضای کافی، در موبایل و تبلت تمام‌عرض -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      <PipeCard pipeNumber={1} />
      <PipeCard pipeNumber={2} />
    </div>

    <!-- بخش عایق و پرایمر -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      <InsulationCard />
      <PrimerCard />
    </div>

    <!-- کارت جامع خلاصه فاکتور و اکشن‌های اشتراک‌گذاری -->
    <SummaryCard onOpenModal={openInvoiceModal} />

    <!-- فوتر -->
    <Footer />

    <!-- دکمه شناور تنظیمات کنار صفحه با کامپوننت Button شادسی‌ان -->
    <Button
      type="button"
      variant="outline"
      size="lg"
      class="fixed bottom-6 left-6 z-40 bg-card/75 dark:bg-card/60 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-xl group gap-2 cursor-pointer"
      onclick={openSettingsModal}
      title="تنظیمات مقادیر اولیه (وزن، عایق و پرایمر)"
      aria-label="تنظیمات اولیه"
    >
      <Settings class="text-orange-500 group-hover:rotate-60 transition-transform duration-300" />
      <span>تنظیمات</span>
    </Button>

    <!-- مودال‌ها و اعلان توست -->
    <InvoiceModal bind:isOpen={isInvoiceModalOpen} />
    <SettingsModal bind:isOpen={isSettingsModalOpen} />
    <Toast />
  </main>
</div>
