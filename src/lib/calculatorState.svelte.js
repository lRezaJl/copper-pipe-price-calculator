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
import {
  DEFAULT_PRESETS,
  createDefaultPresets,
  clonePreset,
} from "./presets.js";

const STORAGE_KEY = "copperPipeCalculator_v4";

export class CalculatorStore {
  // شناسه الگو فعال (از بین ۴ الگو)
  activePresetId = $state("preset_1");

  // لیست ۴ الگو با اطلاعات و نام مستقل هر یک
  presets = $state(createDefaultPresets());

  // ورودی‌های واکنشی وضعیت فعال با استفاده از Runes اسولت ۵
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

  // تنظیمات مقادیر اولیه الگو فعال (وزن لوله‌ها، قیمت عایق‌ها، قیمت و متراژ پرایمرها)
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

  // ارجاع واکنشی به آبجکت الگو فعال
  activePreset = $derived(
    this.presets.find((p) => p.id === this.activePresetId) || this.presets[0],
  );

  // محاسبات مشتق شده (Derived Runes) - کاملاً خودکار و همگام با الگو فعال
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
      presetName: this.activePreset?.name,
    }),
  );

  constructor() {
    this.loadFromStorage();
  }

  // همگام‌سازی وضعیت کنونی لایو در آبجکت الگو مربوطه
  syncCurrentToPreset(presetId = this.activePresetId) {
    const preset = this.presets.find((p) => p.id === presetId);
    if (!preset) return;

    preset.unitPrice = this.unitPrice;
    preset.pipe1 = { ...this.pipe1 };
    preset.pipe2 = { ...this.pipe2 };
    preset.insulation = { ...this.insulation };
    preset.primer = { ...this.primer };
    preset.settings = {
      pipeWeights: { ...this.settings.pipeWeights },
      insulationPrices: { ...this.settings.insulationPrices },
      primerTypes: {
        high: { ...this.settings.primerTypes.high },
        low: { ...this.settings.primerTypes.low },
        tableHigh: { ...this.settings.primerTypes.tableHigh },
        tableLow: { ...this.settings.primerTypes.tableLow },
      },
    };
  }

  // بارگذاری داده‌های یک الگو در وضعیت واکنشی لایو
  loadPresetIntoActiveState(preset) {
    if (!preset) return;

    this.unitPrice = Number(preset.unitPrice) || 0;

    this.pipe1.enabled = Boolean(preset.pipe1?.enabled);
    this.pipe1.size = preset.pipe1?.size || "1/4";
    this.pipe1.thickness = preset.pipe1?.thickness || "0.25";
    this.pipe1.length = preset.pipe1?.length ?? "";

    this.pipe2.enabled = Boolean(preset.pipe2?.enabled);
    this.pipe2.size = preset.pipe2?.size || "5/8";
    this.pipe2.thickness = preset.pipe2?.thickness || "0.25";
    this.pipe2.length = preset.pipe2?.length ?? "";

    this.insulation.enabled = Boolean(preset.insulation?.enabled);

    this.primer.enabled = Boolean(preset.primer?.enabled);
    this.primer.type = preset.primer?.type || "high";
    this.primer.manualCount = Number(preset.primer?.manualCount) || 1;

    this.settings.pipeWeights = {
      ...DEFAULT_PIPE_WEIGHTS,
      ...(preset.settings?.pipeWeights || {}),
    };
    this.settings.insulationPrices = {
      ...DEFAULT_INSULATION_BASE_PRICES,
      ...(preset.settings?.insulationPrices || {}),
    };
    this.settings.primerTypes = {
      high: {
        ...DEFAULT_PRIMER_TYPES.high,
        ...(preset.settings?.primerTypes?.high || {}),
      },
      low: {
        ...DEFAULT_PRIMER_TYPES.low,
        ...(preset.settings?.primerTypes?.low || {}),
      },
      tableHigh: {
        ...DEFAULT_PRIMER_TYPES.tableHigh,
        ...(preset.settings?.primerTypes?.tableHigh || {}),
      },
      tableLow: {
        ...DEFAULT_PRIMER_TYPES.tableLow,
        ...(preset.settings?.primerTypes?.tableLow || {}),
      },
    };
  }

  // تغییر الگو فعال
  switchPreset(targetPresetId) {
    if (targetPresetId === this.activePresetId) return;

    // ذخیره وضعیت فعلی روی الگو قبلی
    this.syncCurrentToPreset(this.activePresetId);

    const target = this.presets.find((p) => p.id === targetPresetId);
    if (!target) return;

    this.activePresetId = targetPresetId;
    this.loadPresetIntoActiveState(target);
    this.saveToStorage();
    this.showToast(`الگو «${target.name}» فعال شد`, "info");
  }

  // تغییر نام الگو
  renamePreset(presetId, newName) {
    const trimmed = (newName || "").trim();
    if (!trimmed) {
      this.showToast("نام الگو نمی‌تواند خالی باشد", "error");
      return false;
    }

    const preset = this.presets.find((p) => p.id === presetId);
    if (!preset) return false;

    preset.name = trimmed;
    this.saveToStorage();
    this.showToast(`نام الگو به «${trimmed}» تغییر یافت`, "success");
    return true;
  }

  // بازنشانی یک الگو خاص به مقادیر پیش‌فرض اولیه
  resetPresetToDefault(presetId) {
    const defaultPreset = DEFAULT_PRESETS.find((p) => p.id === presetId);
    if (!defaultPreset) return;

    const idx = this.presets.findIndex((p) => p.id === presetId);
    if (idx !== -1) {
      this.presets[idx] = clonePreset(defaultPreset);
    }

    if (this.activePresetId === presetId) {
      this.loadPresetIntoActiveState(this.presets[idx]);
    }

    this.saveToStorage();
    this.showToast(
      `الگو «${defaultPreset.name}» به مقادیر اولیه بازگردانی شد`,
      "info",
    );
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
      this.syncCurrentToPreset(this.activePresetId);
      const data = {
        version: 4,
        activePresetId: this.activePresetId,
        presets: this.presets.map((p) => clonePreset(p)),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }

  // بارگذاری از LocalStorage
  loadFromStorage() {
    try {
      // ۱. بررسی نسخه ۴ (سیستم الگوها)
      const savedV4 = localStorage.getItem(STORAGE_KEY);
      if (savedV4) {
        const data = JSON.parse(savedV4);
        const defaults = createDefaultPresets();

        // تطبیق هر ۴ الگو و پر کردن کمبودهای احتمالی
        const mergedPresets = defaults.map((defPreset) => {
          const found = data.presets?.find((p) => p.id === defPreset.id);
          if (!found) return defPreset;

          return {
            id: defPreset.id,
            name: found.name || defPreset.name,
            unitPrice:
              found.unitPrice !== undefined
                ? Number(found.unitPrice)
                : defPreset.unitPrice,
            pipe1: {
              ...defPreset.pipe1,
              ...(found.pipe1 || {}),
            },
            pipe2: {
              ...defPreset.pipe2,
              ...(found.pipe2 || {}),
            },
            insulation: {
              ...defPreset.insulation,
              ...(found.insulation || {}),
            },
            primer: {
              ...defPreset.primer,
              ...(found.primer || {}),
            },
            settings: {
              pipeWeights: {
                ...defPreset.settings.pipeWeights,
                ...(found.settings?.pipeWeights || {}),
              },
              insulationPrices: {
                ...defPreset.settings.insulationPrices,
                ...(found.settings?.insulationPrices || {}),
              },
              primerTypes: {
                high: {
                  ...defPreset.settings.primerTypes.high,
                  ...(found.settings?.primerTypes?.high || {}),
                },
                low: {
                  ...defPreset.settings.primerTypes.low,
                  ...(found.settings?.primerTypes?.low || {}),
                },
                tableHigh: {
                  ...defPreset.settings.primerTypes.tableHigh,
                  ...(found.settings?.primerTypes?.tableHigh || {}),
                },
                tableLow: {
                  ...defPreset.settings.primerTypes.tableLow,
                  ...(found.settings?.primerTypes?.tableLow || {}),
                },
              },
            },
          };
        });

        this.presets = mergedPresets;
        const targetId = data.activePresetId || "preset_1";
        const foundActive =
          this.presets.find((p) => p.id === targetId) || this.presets[0];
        this.activePresetId = foundActive.id;
        this.loadPresetIntoActiveState(foundActive);
        return;
      }

      // ۲. مهاجرت از نسخه ۳ (copperPipeCalculator_v3) به عنوان الگو ۱
      const savedV3 = localStorage.getItem("copperPipeCalculator_v3");
      if (savedV3) {
        const data = JSON.parse(savedV3);
        const presets = createDefaultPresets();
        const p1 = presets[0];

        if (data.unitPrice !== undefined) p1.unitPrice = Number(data.unitPrice);
        if (data.pipe1) Object.assign(p1.pipe1, data.pipe1);
        if (data.pipe2) Object.assign(p1.pipe2, data.pipe2);
        if (data.insulation) Object.assign(p1.insulation, data.insulation);
        if (data.primer) Object.assign(p1.primer, data.primer);
        if (data.settings?.pipeWeights) {
          p1.settings.pipeWeights = {
            ...p1.settings.pipeWeights,
            ...data.settings.pipeWeights,
          };
        }
        if (data.settings?.insulationPrices) {
          p1.settings.insulationPrices = {
            ...p1.settings.insulationPrices,
            ...data.settings.insulationPrices,
          };
        }
        if (data.settings?.primerTypes) {
          p1.settings.primerTypes = {
            high: {
              ...p1.settings.primerTypes.high,
              ...data.settings.primerTypes.high,
            },
            low: {
              ...p1.settings.primerTypes.low,
              ...data.settings.primerTypes.low,
            },
            tableHigh: {
              ...p1.settings.primerTypes.tableHigh,
              ...data.settings.primerTypes.tableHigh,
            },
            tableLow: {
              ...p1.settings.primerTypes.tableLow,
              ...data.settings.primerTypes.tableLow,
            },
          };
        }

        this.presets = presets;
        this.activePresetId = "preset_1";
        this.loadPresetIntoActiveState(p1);
        this.saveToStorage();
        return;
      }

      // ۳. مهاجرت از نسخه‌های اولیه بسیار قدیمی
      const legacySaved = localStorage.getItem("copperPipeCalculator");
      if (legacySaved) {
        const legacy = JSON.parse(legacySaved);
        const presets = createDefaultPresets();
        const p1 = presets[0];

        if (legacy.unitPrice) p1.unitPrice = Number(legacy.unitPrice);
        if (legacy.hasOwnProperty("enable1"))
          p1.pipe1.enabled = Boolean(legacy.enable1);
        if (legacy.hasOwnProperty("enable2"))
          p1.pipe2.enabled = Boolean(legacy.enable2);
        if (legacy.hasOwnProperty("enableInsulation"))
          p1.insulation.enabled = Boolean(legacy.enableInsulation);
        if (legacy.hasOwnProperty("enablePrimer"))
          p1.primer.enabled = Boolean(legacy.enablePrimer);
        if (legacy.pipe1) {
          if (legacy.pipe1.size) p1.pipe1.size = legacy.pipe1.size;
          if (legacy.pipe1.thickness)
            p1.pipe1.thickness = legacy.pipe1.thickness;
          if (legacy.pipe1.length) p1.pipe1.length = legacy.pipe1.length;
        }
        if (legacy.pipe2) {
          if (legacy.pipe2.size) p1.pipe2.size = legacy.pipe2.size;
          if (legacy.pipe2.thickness)
            p1.pipe2.thickness = legacy.pipe2.thickness;
          if (legacy.pipe2.length) p1.pipe2.length = legacy.pipe2.length;
        }
        if (legacy.primer?.type) p1.primer.type = legacy.primer.type;

        this.presets = presets;
        this.activePresetId = "preset_1";
        this.loadPresetIntoActiveState(p1);
        this.saveToStorage();
        return;
      }

      // ۴. بارگذاری پیش‌فرض تازه
      this.presets = createDefaultPresets();
      this.activePresetId = "preset_1";
      this.loadPresetIntoActiveState(this.presets[0]);
    } catch (e) {
      console.warn("Error restoring state:", e);
      this.presets = createDefaultPresets();
      this.activePresetId = "preset_1";
      this.loadPresetIntoActiveState(this.presets[0]);
    }
  }

  // به‌روزرسانی تنظیمات مقادیر اولیه برای الگو فعال
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
    this.showToast(
      `تنظیمات «${this.activePreset?.name || "الگو"}» با موفقیت ذخیره شد`,
      "success",
    );
  }

  // بازنشانی تنظیمات مقادیر اولیه الگو فعال به مقادیر کارخانه همان الگو
  resetSettings() {
    const def =
      DEFAULT_PRESETS.find((p) => p.id === this.activePresetId) ||
      DEFAULT_PRESETS[0];
    this.settings.pipeWeights = { ...def.settings.pipeWeights };
    this.settings.insulationPrices = { ...def.settings.insulationPrices };
    this.settings.primerTypes = {
      high: { ...def.settings.primerTypes.high },
      low: { ...def.settings.primerTypes.low },
      tableHigh: { ...def.settings.primerTypes.tableHigh },
      tableLow: { ...def.settings.primerTypes.tableLow },
    };
    this.saveToStorage();
    this.showToast(
      `تنظیمات «${this.activePreset?.name || "الگو"}» به مقادیر اولیه بازگردانی شد`,
      "info",
    );
  }

  // پاک کردن فرم ورودی‌های الگو جاری
  reset() {
    const def =
      DEFAULT_PRESETS.find((p) => p.id === this.activePresetId) ||
      DEFAULT_PRESETS[0];
    this.pipe1.length = "";
    this.pipe2.length = "";
    this.saveToStorage();
    this.showToast(
      `متراژ ورودی‌های «${this.activePreset?.name || "الگو"}» پاک شد`,
      "info",
    );
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
