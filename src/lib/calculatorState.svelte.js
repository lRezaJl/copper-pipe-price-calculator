import {
  calculatePipe,
  calculateInsulation,
  calculatePrimer,
  generateInvoiceText,
  toToman,
  DEFAULT_PIPE_WEIGHTS,
  DEFAULT_INSULATION_BASE_PRICES,
  DEFAULT_PRIMER_TYPES,
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

  // تنظیمات مقادیر اولیه (وزن لوله‌ها، قیمت عایق‌ها، قیمت و متراژ پرایمرها)
  settings = $state({
    pipeWeights: { ...DEFAULT_PIPE_WEIGHTS },
    insulationPrices: { ...DEFAULT_INSULATION_BASE_PRICES },
    primerTypes: {
      high: { ...DEFAULT_PRIMER_TYPES.high },
      low: { ...DEFAULT_PRIMER_TYPES.low },
      tableHigh: { ...DEFAULT_PRIMER_TYPES.tableHigh },
      tableLow: { ...DEFAULT_PRIMER_TYPES.tableLow },
    },
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
      pipeWeights: this.settings.pipeWeights,
    }),
  );

  pipe2Result = $derived(
    calculatePipe({
      enabled: this.pipe2.enabled,
      size: this.pipe2.size,
      thickness: this.pipe2.thickness,
      length: this.pipe2.length,
      unitPrice: this.unitPrice,
      pipeWeights: this.settings.pipeWeights,
    }),
  );

  insulationResult = $derived(
    calculateInsulation({
      enabled: this.insulation.enabled,
      pipe1: this.pipe1,
      pipe2: this.pipe2,
      insulationPrices: this.settings.insulationPrices,
    }),
  );

  primerResult = $derived(
    calculatePrimer({
      enabled: this.primer.enabled,
      type: this.primer.type,
      manualCount: this.primer.manualCount,
      pipe1: this.pipe1,
      pipe2: this.pipe2,
      primerTypes: this.settings.primerTypes,
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
        settings: {
          pipeWeights: { ...this.settings.pipeWeights },
          insulationPrices: { ...this.settings.insulationPrices },
          primerTypes: {
            high: { ...this.settings.primerTypes.high },
            low: { ...this.settings.primerTypes.low },
            tableHigh: { ...this.settings.primerTypes.tableHigh },
            tableLow: { ...this.settings.primerTypes.tableLow },
          },
        },
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

        if (data.settings) {
          if (data.settings.pipeWeights) {
            this.settings.pipeWeights = {
              ...DEFAULT_PIPE_WEIGHTS,
              ...data.settings.pipeWeights,
            };
          }
          if (data.settings.insulationPrices) {
            this.settings.insulationPrices = {
              ...DEFAULT_INSULATION_BASE_PRICES,
              ...data.settings.insulationPrices,
            };
          }
          if (data.settings.primerTypes) {
            this.settings.primerTypes = {
              high: { ...DEFAULT_PRIMER_TYPES.high, ...data.settings.primerTypes?.high },
              low: { ...DEFAULT_PRIMER_TYPES.low, ...data.settings.primerTypes?.low },
              tableHigh: { ...DEFAULT_PRIMER_TYPES.tableHigh, ...data.settings.primerTypes?.tableHigh },
              tableLow: { ...DEFAULT_PRIMER_TYPES.tableLow, ...data.settings.primerTypes?.tableLow },
            };
          }
        }
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

  // به‌روزرسانی تنظیمات مقادیر اولیه
  updateSettings(newSettings) {
    if (newSettings.pipeWeights) {
      this.settings.pipeWeights = { ...newSettings.pipeWeights };
    }
    if (newSettings.insulationPrices) {
      this.settings.insulationPrices = { ...newSettings.insulationPrices };
    }
    if (newSettings.primerTypes) {
      this.settings.primerTypes = {
        high: { ...newSettings.primerTypes.high },
        low: { ...newSettings.primerTypes.low },
        tableHigh: { ...newSettings.primerTypes.tableHigh },
        tableLow: { ...newSettings.primerTypes.tableLow },
      };
    }
    this.saveToStorage();
    this.showToast("تنظیمات با موفقیت ذخیره شد", "success");
  }

  // بازنشانی تنظیمات مقادیر اولیه به حالت کارخانه
  resetSettings() {
    this.settings.pipeWeights = { ...DEFAULT_PIPE_WEIGHTS };
    this.settings.insulationPrices = { ...DEFAULT_INSULATION_BASE_PRICES };
    this.settings.primerTypes = {
      high: { ...DEFAULT_PRIMER_TYPES.high },
      low: { ...DEFAULT_PRIMER_TYPES.low },
      tableHigh: { ...DEFAULT_PRIMER_TYPES.tableHigh },
      tableLow: { ...DEFAULT_PRIMER_TYPES.tableLow },
    };
    this.saveToStorage();
    this.showToast("تنظیمات به مقادیر اولیه بازگردانی شد", "info");
  }

  // ریست فرم به مقادیر اولیه ورودی (بدون پاک کردن تنظیمات پایه‌ای کاربر)
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

    this.saveToStorage();
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
