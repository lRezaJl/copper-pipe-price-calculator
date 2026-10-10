import {
  calculatePipe,
  calculateInsulation,
  calculatePrimer,
  generateInvoiceText,
  toToman,
} from "./calculator.js";

const STORAGE_KEY = "copperPipeCalculator_v3";

export class CalculatorStore {
  // ورودی‌های واکنشی با استفاده از Runes اسولت ۵
  unitPrice = $state(53000000);

  pipe1 = $state({
    enabled: true,
    size: "1/4",
    thickness: "0.25",
    length: "",
  });

  pipe2 = $state({
    enabled: true,
    size: "5/8",
    thickness: "0.25",
    length: "",
  });

  insulation = $state({
    enabled: true,
  });

  primer = $state({
    enabled: true,
    type: "high",
    manualCount: 1,
  });

  toast = $state({
    show: false,
    message: "",
    type: "info",
  });

  // محاسبات مشتق شده (Derived Runes) - کاملاً خودکار و بدون نیاز به محاسبه دستی
  pipe1Result = $derived(
    calculatePipe({
      enabled: this.pipe1.enabled,
      size: this.pipe1.size,
      thickness: this.pipe1.thickness,
      length: this.pipe1.length,
      unitPrice: this.unitPrice,
    }),
  );

  pipe2Result = $derived(
    calculatePipe({
      enabled: this.pipe2.enabled,
      size: this.pipe2.size,
      thickness: this.pipe2.thickness,
      length: this.pipe2.length,
      unitPrice: this.unitPrice,
    }),
  );

  insulationResult = $derived(
    calculateInsulation({
      enabled: this.insulation.enabled,
      pipe1: this.pipe1,
      pipe2: this.pipe2,
    }),
  );

  primerResult = $derived(
    calculatePrimer({
      enabled: this.primer.enabled,
      type: this.primer.type,
      manualCount: this.primer.manualCount,
      pipe1: this.pipe1,
      pipe2: this.pipe2,
    }),
  );

  grandTotal = $derived(
    (this.pipe1Result.totalPrice || 0) +
      (this.pipe2Result.totalPrice || 0) +
      (this.insulationResult.totalPrice || 0) +
      (this.primerResult.totalPrice || 0),
  );

  totalToman = $derived(toToman(this.grandTotal));

  invoiceText = $derived(
    generateInvoiceText({
      pipe1Res: this.pipe1Result,
      pipe2Res: this.pipe2Result,
      insulationRes: this.insulationResult,
      primerRes: this.primerResult,
      grandTotal: this.grandTotal,
    }),
  );

  constructor() {
    this.loadFromStorage();
  }

  // همگام‌سازی متراژ لوله‌ها
  syncLengths(sourcePipe) {
    if (sourcePipe === 1) {
      if (this.pipe1.length && !this.pipe2.length && this.pipe2.enabled) {
        this.pipe2.length = this.pipe1.length;
      }
    } else if (sourcePipe === 2) {
      if (this.pipe2.length && !this.pipe1.length && this.pipe1.enabled) {
        this.pipe1.length = this.pipe2.length;
      }
    }
    this.saveToStorage();
  }

  // کپی سریع متراژ لوله ۱ به لوله ۲
  copyLength(from, to) {
    if (from === 1 && to === 2) {
      this.pipe2.length = this.pipe1.length;
      this.showToast("متراژ لوله ۱ روی لوله ۲ اعمال شد", "success");
    } else if (from === 2 && to === 1) {
      this.pipe1.length = this.pipe2.length;
      this.showToast("متراژ لوله ۲ روی لوله ۱ اعمال شد", "success");
    }
    this.saveToStorage();
  }

  // ذخیره در LocalStorage
  saveToStorage() {
    try {
      const data = {
        unitPrice: this.unitPrice,
        pipe1: { ...this.pipe1 },
        pipe2: { ...this.pipe2 },
        insulation: { ...this.insulation },
        primer: { ...this.primer },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }

  // بارگذاری از LocalStorage
  loadFromStorage() {
    try {
      // ابتدا نسخه جدید را بررسی می‌کنیم
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.unitPrice !== undefined)
          this.unitPrice = Number(data.unitPrice);
        if (data.pipe1) Object.assign(this.pipe1, data.pipe1);
        if (data.pipe2) Object.assign(this.pipe2, data.pipe2);
        if (data.insulation) Object.assign(this.insulation, data.insulation);
        if (data.primer) Object.assign(this.primer, data.primer);
        return;
      }

      // پشتیبانی از اطلاعات قدیمی کاربر در نسخه قبل (copperPipeCalculator)
      const legacySaved = localStorage.getItem("copperPipeCalculator");
      if (legacySaved) {
        const legacy = JSON.parse(legacySaved);
        if (legacy.unitPrice) this.unitPrice = Number(legacy.unitPrice);
        if (legacy.hasOwnProperty("enable1"))
          this.pipe1.enabled = Boolean(legacy.enable1);
        if (legacy.hasOwnProperty("enable2"))
          this.pipe2.enabled = Boolean(legacy.enable2);
        if (legacy.hasOwnProperty("enableInsulation"))
          this.insulation.enabled = Boolean(legacy.enableInsulation);
        if (legacy.hasOwnProperty("enablePrimer"))
          this.primer.enabled = Boolean(legacy.enablePrimer);
        if (legacy.pipe1) {
          if (legacy.pipe1.size) this.pipe1.size = legacy.pipe1.size;
          if (legacy.pipe1.thickness)
            this.pipe1.thickness = legacy.pipe1.thickness;
          if (legacy.pipe1.length) this.pipe1.length = legacy.pipe1.length;
        }
        if (legacy.pipe2) {
          if (legacy.pipe2.size) this.pipe2.size = legacy.pipe2.size;
          if (legacy.pipe2.thickness)
            this.pipe2.thickness = legacy.pipe2.thickness;
          if (legacy.pipe2.length) this.pipe2.length = legacy.pipe2.length;
        }
        if (legacy.primer?.type) this.primer.type = legacy.primer.type;
      }
    } catch (e) {
      console.warn("Error restoring state:", e);
    }
  }

  // ریست فرم به مقادیر اولیه
  reset() {
    this.unitPrice = 53000000;
    this.pipe1.enabled = true;
    this.pipe1.size = "1/4";
    this.pipe1.thickness = "0.25";
    this.pipe1.length = "";

    this.pipe2.enabled = true;
    this.pipe2.size = "5/8";
    this.pipe2.thickness = "0.25";
    this.pipe2.length = "";

    this.insulation.enabled = true;

    this.primer.enabled = true;
    this.primer.type = "high";
    this.primer.manualCount = 1;

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("copperPipeCalculator");
    } catch (e) {}

    this.showToast("تمام ورودی‌ها پاک شدند", "info");
  }

  showToast(message, type = "info") {
    this.toast.message = message;
    this.toast.type = type;
    this.toast.show = true;
    setTimeout(() => {
      this.toast.show = false;
    }, 3000);
  }
}

export const store = new CalculatorStore();
