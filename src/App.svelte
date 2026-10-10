<script>
  import Navbar from './components/Navbar.svelte';
  import UnitPriceCard from './components/UnitPriceCard.svelte';
  import PipeCard from './components/PipeCard.svelte';
  import InsulationCard from './components/InsulationCard.svelte';
  import PrimerCard from './components/PrimerCard.svelte';
  import SummaryCard from './components/SummaryCard.svelte';
  import InvoiceModal from './components/InvoiceModal.svelte';
  import Toast from './components/Toast.svelte';
  import Footer from './components/Footer.svelte';

  let isInvoiceModalOpen = $state(false);

  function openInvoiceModal() {
    isInvoiceModalOpen = true;
  }
</script>

<main class="app-container">
  <!-- هدر و تغییر تم / PWA -->
  <Navbar />

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

  <!-- مودال و اعلان توست -->
  <InvoiceModal bind:isOpen={isInvoiceModalOpen} />
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

  @media (max-width: 720px) {
    .pipes-grid,
    .accessories-grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }
  }
</style>
