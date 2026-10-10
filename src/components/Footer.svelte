<script>
  import { Heart, ExternalLink } from '@lucide/svelte';
</script>

<footer class="footer">
  <div class="footer-content">
    <p class="footer-title">ماشین حساب قیمت لوله مسی - نسخه ۳.۰ (Svelte 5 & Edge)</p>
    <p class="footer-sub">
      طراحی شده با
      <Heart size={14} class="heart-icon" />
      ویژه فروشگاه برودتی
      <a href="https://freezeland.shop" target="_blank" rel="noopener noreferrer" class="frezeld-link">
        فریزلنــد
        <ExternalLink size={12} />
      </a>
    </p>
  </div>
</footer>

<style>
  .footer {
    text-align: center;
    margin-top: 30px;
    padding: 20px 10px;
    border-top: 1px dashed var(--border-color);
  }

  .footer-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
  }

  .footer-title {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .footer-sub {
    font-size: 0.82rem;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  :global(.heart-icon) {
    color: var(--accent-rose);
    fill: var(--accent-rose);
  }

  .frezeld-link {
    color: var(--copper-500);
    text-decoration: none;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: var(--transition);
  }

  .frezeld-link:hover {
    color: var(--ice-500);
    text-decoration: underline;
  }
</style>
