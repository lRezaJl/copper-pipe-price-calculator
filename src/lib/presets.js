import {
  DEFAULT_PIPE_WEIGHTS,
  DEFAULT_INSULATION_BASE_PRICES,
  DEFAULT_PRIMER_TYPES,
} from "./calculator.js";

/**
 * =========================================================================
 * تنظیمات و مقادیر پیش‌فرض الگوها (Presets Configuration)
 * -------------------------------------------------------------------------
 * در این بخش مقادیر پیش‌فرض الگوها (به‌ویژه الگو ۱ و ۲) تعریف شده‌اند.
 * شما می‌توانید نام‌ها، قیمت‌ها و وزن‌های دیفالت را همینجا تغییر دهید،
 * یا اینکه مستقیماً از داخل رابط کاربری برنامه آن‌ها را ویرایش فرمایید.
 * =========================================================================
 */

// مقادیر اولیه و پیش‌فرض برای الگو ۱
export const PRESET_1_DEFAULTS = {
  id: "preset_1",
  name: "مهراصل - متری",
  unitPrice: 55000000,
  pipe1: {
    enabled: true,
    size: "1/4",
    thickness: "0.25",
    length: "",
  },
  pipe2: {
    enabled: true,
    size: "5/8",
    thickness: "0.25",
    length: "",
  },
  insulation: {
    enabled: true,
  },
  primer: {
    enabled: true,
    type: "high",
    manualCount: 1,
  },
  settings: {
    pipeWeights: {
      "1/4-0.25": 5.3, // سایز ۱/۴ ضخامت ۰.۲۵
      "1/4-0.30": 5.95, // سایز ۱/۴ ضخامت ۰.۳۰
      "3/8-0.25": 8.2, // سایز ۳/۸ ضخامت ۰.۲۵
      "3/8-0.30": 9.5, // سایز ۳/۸ ضخامت ۰.۳۰
      "1/2-0.25": 11.18, // سایز ۱/۲ ضخامت ۰.۲۵
      "1/2-0.30": 12.9, // سایز ۱/۲ ضخامت ۰.۳۰
      "5/8-0.25": 14.5, // سایز ۵/۸ ضخامت ۰.۲۵
      "5/8-0.30": 16.68, // سایز ۵/۸ ضخامت ۰.۳۰
    },
    insulationPrices: { ...DEFAULT_INSULATION_BASE_PRICES },
    primerTypes: {
      high: { ...DEFAULT_PRIMER_TYPES.high },
      low: { ...DEFAULT_PRIMER_TYPES.low },
      tableHigh: { ...DEFAULT_PRIMER_TYPES.tableHigh },
      tableLow: { ...DEFAULT_PRIMER_TYPES.tableLow },
    },
  },
};

// مقادیر اولیه و پیش‌فرض برای الگو ۲
export const PRESET_2_DEFAULTS = {
  id: "preset_2",
  name: "بابک - متری",
  unitPrice: 50000000,
  pipe1: {
    enabled: true,
    size: "3/8",
    thickness: "0.25",
    length: "",
  },
  pipe2: {
    enabled: true,
    size: "5/8",
    thickness: "0.25",
    length: "",
  },
  insulation: {
    enabled: true,
  },
  primer: {
    enabled: true,
    type: "high",
    manualCount: 1,
  },
  settings: {
    pipeWeights: { ...DEFAULT_PIPE_WEIGHTS },
    insulationPrices: { ...DEFAULT_INSULATION_BASE_PRICES },
    primerTypes: {
      high: { ...DEFAULT_PRIMER_TYPES.high },
      low: { ...DEFAULT_PRIMER_TYPES.low },
      tableHigh: { ...DEFAULT_PRIMER_TYPES.tableHigh },
      tableLow: { ...DEFAULT_PRIMER_TYPES.tableLow },
    },
  },
};

// مقادیر اولیه و پیش‌فرض برای الگو ۳
export const PRESET_3_DEFAULTS = {
  id: "preset_3",
  name: "الگو ۳",
  unitPrice: 53000000,
  pipe1: {
    enabled: true,
    size: "1/4",
    thickness: "0.30",
    length: "",
  },
  pipe2: {
    enabled: true,
    size: "1/2",
    thickness: "0.30",
    length: "",
  },
  insulation: {
    enabled: true,
  },
  primer: {
    enabled: true,
    type: "low",
    manualCount: 1,
  },
  settings: {
    pipeWeights: { ...DEFAULT_PIPE_WEIGHTS },
    insulationPrices: { ...DEFAULT_INSULATION_BASE_PRICES },
    primerTypes: {
      high: { ...DEFAULT_PRIMER_TYPES.high },
      low: { ...DEFAULT_PRIMER_TYPES.low },
      tableHigh: { ...DEFAULT_PRIMER_TYPES.tableHigh },
      tableLow: { ...DEFAULT_PRIMER_TYPES.tableLow },
    },
  },
};

// مقادیر اولیه و پیش‌فرض برای الگو ۴
export const PRESET_4_DEFAULTS = {
  id: "preset_4",
  name: "الگو ۴",
  unitPrice: 53000000,
  pipe1: {
    enabled: true,
    size: "3/8",
    thickness: "0.30",
    length: "",
  },
  pipe2: {
    enabled: true,
    size: "5/8",
    thickness: "0.30",
    length: "",
  },
  insulation: {
    enabled: true,
  },
  primer: {
    enabled: true,
    type: "tableHigh",
    manualCount: 1,
  },
  settings: {
    pipeWeights: { ...DEFAULT_PIPE_WEIGHTS },
    insulationPrices: { ...DEFAULT_INSULATION_BASE_PRICES },
    primerTypes: {
      high: { ...DEFAULT_PRIMER_TYPES.high },
      low: { ...DEFAULT_PRIMER_TYPES.low },
      tableHigh: { ...DEFAULT_PRIMER_TYPES.tableHigh },
      tableLow: { ...DEFAULT_PRIMER_TYPES.tableLow },
    },
  },
};

// لیست تجمیعی ۴ الگو دیفالت
export const DEFAULT_PRESETS = [
  PRESET_1_DEFAULTS,
  PRESET_2_DEFAULTS,
  PRESET_3_DEFAULTS,
  PRESET_4_DEFAULTS,
];

/**
 * ایجاد یک کپی عمیق از الگو
 */
export function clonePreset(preset) {
  return JSON.parse(JSON.stringify(preset));
}

/**
 * ایجاد مجموعه کامل ۴ الگو اولیه
 */
export function createDefaultPresets() {
  return DEFAULT_PRESETS.map((p) => clonePreset(p));
}
