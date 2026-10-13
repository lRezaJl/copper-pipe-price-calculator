// وزن‌های استاندارد اولیه لوله‌های مسی (کیلوگرم در هر کلاف 50 متری)
export const DEFAULT_PIPE_WEIGHTS = {
  "1/4-0.25": 5.3, // سایز ۱/۴ ضخامت ۰.۲۵
  "1/4-0.30": 5.935, // سایز ۱/۴ ضخامت ۰.۳۰
  "3/8-0.25": 8.2, // سایز ۳/۸ ضخامت ۰.۲۵
  "3/8-0.30": 9.46, // سایز ۳/۸ ضخامت ۰.۳۰
  "1/2-0.25": 11.18, // سایز ۱/۲ ضخامت ۰.۲۵
  "1/2-0.30": 12.65, // سایز ۱/۲ ضخامت ۰.۳۰
  "5/8-0.25": 14.5, // سایز ۵/۸ ضخامت ۰.۲۵
  "5/8-0.30": 16.7, // سایز ۵/۸ ضخامت ۰.۳۰
};
export const PIPE_WEIGHTS = DEFAULT_PIPE_WEIGHTS;

// لیست سایزها و ضخامت‌های مجاز
export const PIPE_SIZES = [
  { value: "1/4", label: "1/4 اینچ" },
  { value: "3/8", label: "3/8 اینچ" },
  { value: "1/2", label: "1/2 اینچ" },
  { value: "5/8", label: "5/8 اینچ" },
];

export const PIPE_THICKNESSES = [
  { value: "0.25", label: "0.25 میلی‌متر" },
  { value: "0.30", label: "0.30 میلی‌متر" },
];

// قیمت‌های پایه عایق بر اساس سایز (شاخه 1.8 متری)
export const DEFAULT_INSULATION_BASE_PRICES = {
  "1/4": 1070000,
  "3/8": 1340000,
  "1/2": 1600000,
  "5/8": 1780000,
};
export const INSULATION_BASE_PRICES = DEFAULT_INSULATION_BASE_PRICES;

// قیمت و مشخصات انواع پرایمر
export const DEFAULT_PRIMER_TYPES = {
  high: { key: "high", label: "پرایمر دور بالا", price: 4050000, perLength: 5 },
  low: { key: "low", label: "پرایمر دور پایین", price: 2500000, perLength: 3 },
  tableHigh: {
    key: "tableHigh",
    label: "پرایمر سفره‌ای دور بالا",
    price: 2000000,
    perLength: 5,
  },
  tableLow: {
    key: "tableLow",
    label: "پرایمر سفره‌ای دور پایین",
    price: 1700000,
    perLength: 3,
  },
};
export const PRIMER_TYPES = DEFAULT_PRIMER_TYPES;

// تبدیل عدد به فرمت جداکننده سه‌رقمی
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// تبدیل ریال به تومان
export function toToman(rial) {
  if (!rial || isNaN(rial)) return 0;
  return Math.floor(rial / 10);
}

// تبدیل ارقام فارسی و عربی به ارقام انگلیسی و استانداردسازی اعشار
export function toEnglishDigits(str) {
  if (str === null || str === undefined) return "";
  const strVal = String(str);
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return strVal
    .replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d))
    .replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d))
    .replace(/٫/g, ".");
}

// تبدیل تاریخ میلادی به شمسی (الگوریتم دقیق هجری شمسی)
export function gregorianToJalali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    ~~((gy2 + 3) / 4) -
    ~~((gy2 + 99) / 100) +
    ~~((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  let jy = -1595 + 33 * ~~(days / 12053);
  days %= 12053;
  jy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += ~~((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + ~~(days / 31) : 7 + ~~((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

// دریافت تاریخ شمسی امروز
export function getTodayJalali() {
  const now = new Date();
  const [jy, jm, jd] = gregorianToJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );
  const pad = (n) => String(n).padStart(2, "0");
  return `${jy}/${pad(jm)}/${pad(jd)}`;
}

// محاسبه قیمت یک لوله
export function calculatePipe({
  enabled,
  size,
  thickness,
  length,
  unitPrice,
  pipeWeights = DEFAULT_PIPE_WEIGHTS,
}) {
  if (!enabled) {
    return {
      enabled: false,
      valid: false,
      pricePerMeter: 0,
      totalPrice: 0,
      weight: 0,
    };
  }

  const numLength = parseFloat(length) || 0;
  const numUnitPrice = parseFloat(unitPrice) || 0;
  const key = `${size}-${thickness}`;
  const weights = pipeWeights || DEFAULT_PIPE_WEIGHTS;
  const weight = weights[key] !== undefined ? parseFloat(weights[key]) : 0;

  if (weight === 0 || numLength <= 0 || numUnitPrice <= 0) {
    return {
      enabled: true,
      valid: false,
      weight,
      pricePerMeter:
        weight > 0 && numUnitPrice > 0 ? (weight * numUnitPrice) / 50 : 0,
      totalPrice: 0,
    };
  }

  const pricePerMeter = (weight * numUnitPrice) / 50;
  const totalPrice = pricePerMeter * numLength;

  return {
    enabled: true,
    valid: true,
    weight,
    pricePerMeter,
    totalPrice,
    length: numLength,
    size,
    thickness,
  };
}

// محاسبه قیمت عایق
export function calculateInsulation({
  enabled,
  pipe1,
  pipe2,
  insulationPrices = DEFAULT_INSULATION_BASE_PRICES,
}) {
  if (!enabled) {
    return { enabled: false, valid: false, totalPrice: 0, details: null };
  }

  const p1Active = pipe1.enabled && (parseFloat(pipe1.length) || 0) > 0;
  const p2Active = pipe2.enabled && (parseFloat(pipe2.length) || 0) > 0;

  if (!p1Active && !p2Active) {
    return { enabled: true, valid: false, totalPrice: 0, details: null };
  }

  const len1 = p1Active ? parseFloat(pipe1.length) || 0 : 0;
  const len2 = p2Active ? parseFloat(pipe2.length) || 0 : 0;
  const size1 = pipe1.size;
  const size2 = pipe2.size;
  const prices = insulationPrices || DEFAULT_INSULATION_BASE_PRICES;

  // اگر هر دو لوله فعال باشند
  if (p1Active && p2Active) {
    const sameLength = len1 === len2;

    if (sameLength) {
      const pairsNeeded = Math.ceil(len1 / 1.8);
      const price1 = parseFloat(prices[size1]) || 0;
      const price2 = parseFloat(prices[size2]) || 0;
      const pairPrice = price1 + price2;
      const totalPrice = pairPrice * pairsNeeded;

      return {
        enabled: true,
        valid: true,
        totalPrice,
        mode: "paired",
        pairsNeeded,
        pairPrice,
        size1,
        size2,
        length: len1,
        invoiceText: `عایق ${size1} و ${size2}  |  ${pairsNeeded} جفت  |  ${formatNumber(pairPrice)} ریال  |  ${formatNumber(totalPrice)} ریال`,
      };
    } else {
      // متراژهای متفاوت
      const pairs1 = Math.ceil(len1 / 1.8);
      const pairs2 = Math.ceil(len2 / 1.8);
      const price1 = parseFloat(prices[size1]) || 0;
      const price2 = parseFloat(prices[size2]) || 0;
      const total1 = price1 * pairs1;
      const total2 = price2 * pairs2;
      const totalPrice = total1 + total2;

      return {
        enabled: true,
        valid: true,
        totalPrice,
        mode: "separate",
        pipe1: { size: size1, pairs: pairs1, unitPrice: price1, total: total1 },
        pipe2: { size: size2, pairs: pairs2, unitPrice: price2, total: total2 },
        invoiceText:
          `عایق ${size1}  |  ${pairs1} عدد  |  ${formatNumber(price1)} ریال  |  ${formatNumber(total1)} ریال\n` +
          `عایق ${size2}  |  ${pairs2} عدد  |  ${formatNumber(price2)} ریال  |  ${formatNumber(total2)} ریال`,
      };
    }
  }

  // فقط یک لوله فعال باشد
  const activeSize = p1Active ? size1 : size2;
  const activeLen = p1Active ? len1 : len2;
  const pairsNeeded = Math.ceil(activeLen / 1.8);
  const price = parseFloat(prices[activeSize]) || 0;
  const totalPrice = price * pairsNeeded;

  return {
    enabled: true,
    valid: true,
    totalPrice,
    mode: "single",
    activeSize,
    pairsNeeded,
    price,
    invoiceText: `عایق ${activeSize}  |  ${pairsNeeded} عدد  |  ${formatNumber(price)} ریال  |  ${formatNumber(totalPrice)} ریال`,
  };
}

// محاسبه قیمت پرایمر
export function calculatePrimer({
  enabled,
  type,
  manualCount,
  pipe1,
  pipe2,
  primerTypes = DEFAULT_PRIMER_TYPES,
}) {
  if (!enabled) {
    return {
      enabled: false,
      valid: false,
      totalPrice: 0,
      count: 0,
      isManual: false,
    };
  }

  const p1Active = pipe1.enabled && (parseFloat(pipe1.length) || 0) > 0;
  const p2Active = pipe2.enabled && (parseFloat(pipe2.length) || 0) > 0;

  if (!p1Active && !p2Active) {
    return {
      enabled: true,
      valid: false,
      totalPrice: 0,
      count: 0,
      isManual: false,
    };
  }

  const types = primerTypes || DEFAULT_PRIMER_TYPES;
  const primerInfo = types[type] || types.high || DEFAULT_PRIMER_TYPES.high;
  const len1 = p1Active ? parseFloat(pipe1.length) || 0 : 0;
  const len2 = p2Active ? parseFloat(pipe2.length) || 0 : 0;

  let unitsNeeded = 1;
  let isManualMode = false;
  const perLength = parseFloat(primerInfo.perLength) || 1;
  const price = parseFloat(primerInfo.price) || 0;

  if (p1Active && p2Active) {
    if (len1 === len2) {
      unitsNeeded = Math.ceil(len1 / perLength);
      isManualMode = false;
    } else {
      isManualMode = true;
      unitsNeeded = parseInt(manualCount) || 1;
    }
  } else if (p1Active) {
    unitsNeeded = Math.ceil(len1 / perLength);
  } else if (p2Active) {
    unitsNeeded = Math.ceil(len2 / perLength);
  }

  const totalPrice = unitsNeeded * price;

  return {
    enabled: true,
    valid: true,
    totalPrice,
    count: unitsNeeded,
    isManual: isManualMode,
    primerInfo,
    invoiceText: `پرایمر ${primerInfo.label}  |  ${unitsNeeded} عدد  |  ${formatNumber(totalPrice)} ریال`,
  };
}

// ساخت متن فاکتور رسمی و اشتراک‌گذاری
export function generateInvoiceText({
  pipe1Res,
  pipe2Res,
  insulationRes,
  primerRes,
  grandTotal,
  presetName,
}) {
  const dateFormatted = getTodayJalali();
  let text = `*فروشگاه فریزلنــد*    *${dateFormatted}*\n`;
  if (presetName) {
    text += `*الگو / الگو: ${presetName}*\n`;
  }

  if (pipe1Res?.enabled && pipe1Res?.valid) {
    text += `لوله سایز ${pipe1Res.size} - ضخامت ${pipe1Res.thickness}  |  ${pipe1Res.length} متر  |  ${formatNumber(pipe1Res.pricePerMeter)} ریال  |  ${formatNumber(pipe1Res.totalPrice)} ریال\n`;
  }

  if (pipe2Res?.enabled && pipe2Res?.valid) {
    text += `لوله سایز ${pipe2Res.size} - ضخامت ${pipe2Res.thickness}  |  ${pipe2Res.length} متر  |  ${formatNumber(pipe2Res.pricePerMeter)} ریال  |  ${formatNumber(pipe2Res.totalPrice)} ریال\n`;
  }

  if (
    insulationRes?.enabled &&
    insulationRes?.valid &&
    insulationRes?.invoiceText
  ) {
    text += `\n${insulationRes.invoiceText}\n`;
  }

  if (primerRes?.enabled && primerRes?.valid && primerRes?.invoiceText) {
    text += `\n${primerRes.invoiceText}\n`;
  }

  text += `\n*جمع کل: ${formatNumber(grandTotal)} ریال*`;
  text += `\n(معادل ${formatNumber(toToman(grandTotal))} تومان)`;

  return text;
}
