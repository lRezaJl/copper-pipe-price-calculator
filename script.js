// وزن‌های مختلف لوله‌های مسی
const weights = {
  "1/4-0.25": 5.23,
  "1/4-0.30": 5.95,
  "3/8-0.25": 8.17,
  "3/8-0.30": 9.5,
  "1/2-0.25": 11.18,
  "1/2-0.30": 12.86,
  "5/8-0.25": 14.21,
  "5/8-0.30": 16.28,
};

// قیمت‌های پرایمر
const primerPrices = {
  high: { price: 1100000, perLength: 5 }, // پرایمر دور بالا
  low: { price: 800000, perLength: 3 }, // پرایمر دور پایین
  tableHigh: { price: 700000, perLength: 5 }, // پرایمر سفره‌ای دور بالا
  tableLow: { price: 500000, perLength: 3 }, // پرایمر سفره‌ای دور پایین
};

// محاسبه قیمت لوله مسی
function calculatePrice(calculatorId) {
  // اگر این بخش غیرفعال است، صفر برگردان
  if (!document.getElementById("enable" + calculatorId).checked) {
    document.getElementById("output" + calculatorId).innerHTML =
      "این بخش غیرفعال است";
    return 0;
  }

  const length = parseFloat(document.getElementById("length").value) || 0;
  const unitPrice = parseFloat(document.getElementById("unitPrice").value) || 0;
  const size = document.getElementById("size" + calculatorId).value;
  const thickness = document.getElementById("thickness" + calculatorId).value;
  const key = `${size}-${thickness}`;
  const weight = weights[key] || 0;
  const pricePerMeter = (weight * unitPrice) / 50;
  const totalPrice = pricePerMeter * length;

  // نمایش نتایج به صورت مرتب‌تر و زیباتر
  document.getElementById("output" + calculatorId).innerHTML = `
    <div class="price-item">
      <div class="price-label">قیمت هر متر:</div>
      <div class="price-value">${Math.round(
        pricePerMeter
      ).toLocaleString()} ریال</div>
    </div>
    <div class="price-item total-price-item">
      <div class="price-label">قیمت کل:</div>
      <div class="price-value">${Math.round(
        totalPrice
      ).toLocaleString()} ریال</div>
    </div>
  `;

  return totalPrice;
}

// محاسبه قیمت عایق
function calculateInsulation() {
  // اگر این بخش غیرفعال است، صفر برگردان
  if (!document.getElementById("enableInsulation").checked) {
    document.getElementById("insulation-count").textContent = "0";
    document.getElementById("pair-price").textContent = "0";
    document.getElementById("total-price").textContent = "0";
    return 0;
  }

  const length = parseFloat(document.getElementById("length").value) || 0;
  const pairsNeeded = Math.ceil(length / 1.8);
  const price1 = {
    "1/4": 350000,
    "3/8": 440000,
    "1/2": 520000,
    "5/8": 580000,
  }[document.getElementById("size1").value];
  const price2 = {
    "1/4": 350000,
    "3/8": 440000,
    "1/2": 520000,
    "5/8": 580000,
  }[document.getElementById("size2").value];
  const pairPrice = price1 + price2;
  const totalPrice = pairPrice * pairsNeeded;

  // نمایش نتایج به صورت مرتب‌تر
  document.getElementById("insulation-count").textContent = pairsNeeded;
  document.getElementById("pair-price").textContent =
    pairPrice.toLocaleString();
  document.getElementById("total-price").textContent =
    totalPrice.toLocaleString();

  return totalPrice;
}

// محاسبه قیمت پرایمر
function calculatePrimer() {
  // اگر این بخش غیرفعال است، صفر برگردان
  if (!document.getElementById("enablePrimer").checked) {
    document.getElementById("primer-count").textContent = "0";
    document.getElementById("primer-unit-price").textContent = "0";
    document.getElementById("primer-total-price").textContent = "0";
    return 0;
  }

  const length = parseFloat(document.getElementById("length").value) || 0;
  const primerType = document.getElementById("primerType").value;
  const primerInfo = primerPrices[primerType];

  const unitsNeeded = Math.ceil(length / primerInfo.perLength);
  const unitPrice = primerInfo.price;
  const totalPrice = unitPrice * unitsNeeded;

  // نمایش نتایج به صورت مرتب‌تر
  document.getElementById("primer-count").textContent = unitsNeeded;
  document.getElementById("primer-unit-price").textContent =
    unitPrice.toLocaleString();
  document.getElementById("primer-total-price").textContent =
    totalPrice.toLocaleString();

  return totalPrice;
}

// به‌روزرسانی تمام محاسبات
function updateAll() {
  const total =
    calculatePrice(1) +
    calculatePrice(2) +
    calculateInsulation() +
    calculatePrimer();
  document.getElementById("totalPrice").textContent = `جمع کل: ${Math.round(
    total
  ).toLocaleString()} ریال`;

  // ذخیره مقادیر در localStorage
  saveFormData();
}

// پاک کردن فرم
function resetForm() {
  document.getElementById("length").value = "";
  document.getElementById("unitPrice").value = "";
  document.getElementById("size1").selectedIndex = 0;
  document.getElementById("thickness1").selectedIndex = 0;
  document.getElementById("size2").selectedIndex = 0;
  document.getElementById("thickness2").selectedIndex = 0;
  document.getElementById("primerType").selectedIndex = 0;

  // بازنشانی چک‌باکس‌ها
  document.getElementById("enable1").checked = true;
  document.getElementById("enable2").checked = true;
  document.getElementById("enableInsulation").checked = true;
  document.getElementById("enablePrimer").checked = true;

  document.getElementById("output1").innerHTML = "";
  document.getElementById("output2").innerHTML = "";
  document.getElementById("insulation-count").textContent = "0";
  document.getElementById("pair-price").textContent = "0";
  document.getElementById("total-price").textContent = "0";
  document.getElementById("primer-count").textContent = "0";
  document.getElementById("primer-unit-price").textContent = "0";
  document.getElementById("primer-total-price").textContent = "0";
  document.getElementById("totalPrice").textContent = "جمع کل: 0 ریال";

  // پاک کردن داده‌های ذخیره شده
  localStorage.removeItem("calculatorFormData");
}

// ذخیره داده‌های فرم در localStorage
function saveFormData() {
  const formData = {
    length: document.getElementById("length").value,
    unitPrice: document.getElementById("unitPrice").value,
    size1: document.getElementById("size1").value,
    thickness1: document.getElementById("thickness1").value,
    size2: document.getElementById("size2").value,
    thickness2: document.getElementById("thickness2").value,
    primerType: document.getElementById("primerType").value,
    enable1: document.getElementById("enable1").checked,
    enable2: document.getElementById("enable2").checked,
    enableInsulation: document.getElementById("enableInsulation").checked,
    enablePrimer: document.getElementById("enablePrimer").checked,
  };

  localStorage.setItem("calculatorFormData", JSON.stringify(formData));
}

// بازیابی داده‌های فرم از localStorage
function loadFormData() {
  const savedData = localStorage.getItem("calculatorFormData");

  if (savedData) {
    const formData = JSON.parse(savedData);

    document.getElementById("length").value = formData.length || "";
    document.getElementById("unitPrice").value = formData.unitPrice || "";

    // تنظیم مقادیر select
    setSelectValue("size1", formData.size1);
    setSelectValue("thickness1", formData.thickness1);
    setSelectValue("size2", formData.size2);
    setSelectValue("thickness2", formData.thickness2);
    setSelectValue("primerType", formData.primerType);

    // تنظیم وضعیت چک‌باکس‌ها
    document.getElementById("enable1").checked =
      formData.enable1 !== undefined ? formData.enable1 : true;
    document.getElementById("enable2").checked =
      formData.enable2 !== undefined ? formData.enable2 : true;
    document.getElementById("enableInsulation").checked =
      formData.enableInsulation !== undefined
        ? formData.enableInsulation
        : true;
    document.getElementById("enablePrimer").checked =
      formData.enablePrimer !== undefined ? formData.enablePrimer : true;

    // به‌روزرسانی محاسبات
    updateAll();
  }
}

// تابع کمکی برای تنظیم مقدار select
function setSelectValue(selectId, value) {
  if (!value) return;

  const selectElement = document.getElementById(selectId);
  for (let i = 0; i < selectElement.options.length; i++) {
    if (selectElement.options[i].value === value) {
      selectElement.selectedIndex = i;
      break;
    }
  }
}

// اشتراک‌گذاری نتایج
function shareResults() {
  // جمع‌آوری اطلاعات برای اشتراک‌گذاری
  const length = document.getElementById("length").value;
  const unitPrice = document.getElementById("unitPrice").value;
  const totalPrice = document.getElementById("totalPrice").textContent;

  let resultText = `محاسبه قیمت لوله مسی\n`;
  resultText += `متراژ: ${length} متر\n`;
  resultText += `قیمت واحد: ${parseInt(unitPrice).toLocaleString()} ریال\n\n`;

  // اضافه کردن اطلاعات لوله 1 اگر فعال است
  if (document.getElementById("enable1").checked) {
    const size1 = document.getElementById("size1").value;
    const thickness1 = document.getElementById("thickness1").value;
    resultText += `لوله ۱: سایز ${size1} - ضخامت ${thickness1}\n`;
  }

  // اضافه کردن اطلاعات لوله 2 اگر فعال است
  if (document.getElementById("enable2").checked) {
    const size2 = document.getElementById("size2").value;
    const thickness2 = document.getElementById("thickness2").value;
    resultText += `لوله ۲: سایز ${size2} - ضخامت ${thickness2}\n`;
  }

  // اضافه کردن اطلاعات عایق اگر فعال است
  if (document.getElementById("enableInsulation").checked) {
    resultText += `تعداد عایق: ${
      document.getElementById("insulation-count").textContent
    }\n`;
    resultText += `قیمت کل عایق: ${
      document.getElementById("total-price").textContent
    } ریال\n`;
  }

  // اضافه کردن اطلاعات پرایمر اگر فعال است
  if (document.getElementById("enablePrimer").checked) {
    const primerType =
      document.getElementById("primerType").options[
        document.getElementById("primerType").selectedIndex
      ].text;
    resultText += `نوع پرایمر: ${primerType}\n`;
    resultText += `تعداد پرایمر: ${
      document.getElementById("primer-count").textContent
    }\n`;
    resultText += `قیمت کل پرایمر: ${
      document.getElementById("primer-total-price").textContent
    } ریال\n`;
  }

  resultText += `\n${totalPrice}`;

  // استفاده از Web Share API اگر در مرورگر پشتیبانی می‌شود
  if (navigator.share) {
    navigator
      .share({
        title: "محاسبه قیمت لوله مسی",
        text: resultText,
      })
      .catch((error) => {
        fallbackShare(resultText);
      });
  } else {
    fallbackShare(resultText);
  }
}

// روش جایگزین برای اشتراک‌گذاری در صورت عدم پشتیبانی از Web Share API
function fallbackShare(text) {
  // ایجاد یک المان textarea موقت
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed"; // خارج از دید کاربر
  document.body.appendChild(textarea);
  textarea.select();

  try {
    // کپی متن به کلیپ‌بورد
    const successful = document.execCommand("copy");
    if (successful) {
      alert(
        "نتایج در کلیپ‌بورد کپی شد. اکنون می‌توانید آن را در برنامه دلخواه خود پیست کنید."
      );
    } else {
      alert(
        "کپی کردن ناموفق بود. لطفاً به صورت دستی متن را انتخاب و کپی کنید."
      );
    }
  } catch (err) {
    alert("خطا در کپی کردن: " + err);
  }

  document.body.removeChild(textarea);
}

// اجرای بازیابی داده‌ها هنگام بارگذاری صفحه
window.onload = function () {
  loadFormData();
};
