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

// همگام سازی متراژ بین لوله‌ها
function syncLengths(sourceInput) {
  const length1 = document.getElementById("length1");
  const length2 = document.getElementById("length2");
  const enable1 = document.getElementById("enable1");
  const enable2 = document.getElementById("enable2");

  // اگر متراژ پر شده باشد و فیلد دیگر خالی باشد، مقدار را کپی کن
  if (sourceInput === 1 && length1.value && !length2.value && enable2.checked) {
    length2.value = length1.value;
  } else if (
    sourceInput === 2 &&
    length2.value &&
    !length1.value &&
    enable1.checked
  ) {
    length1.value = length2.value;
  }

  calculatePrice();
}

// محاسبه قیمت لوله مسی
function calculatePrice() {
  // بررسی وضعیت دکمه‌های فعال/غیرفعال
  const enable1 = document.getElementById("enable1").checked;
  const enable2 = document.getElementById("enable2").checked;
  const enableInsulation = document.getElementById("enableInsulation").checked;
  const enablePrimer = document.getElementById("enablePrimer").checked;

  // محاسبه قیمت لوله 1
  const pipe1Price = enable1 ? calculatePipePrice(1) : 0;

  // محاسبه قیمت لوله 2
  const pipe2Price = enable2 ? calculatePipePrice(2) : 0;

  // محاسبه قیمت عایق
  const insulationPrice = enableInsulation ? calculateInsulationPrice() : 0;

  // محاسبه قیمت پرایمر
  const primerPrice = enablePrimer ? calculatePrimerPrice() : 0;

  // محاسبه قیمت کل
  const totalPrice = pipe1Price + pipe2Price + insulationPrice + primerPrice;

  // نمایش قیمت کل
  document.getElementById("totalPrice").textContent = `جمع کل: ${formatNumber(
    totalPrice
  )} ریال`;

  // ذخیره مقادیر در حافظه محلی
  saveToLocalStorage();
}

// محاسبه قیمت یک لوله
function calculatePipePrice(pipeNumber) {
  // بررسی کنیم آیا این لوله فعال است یا خیر
  const isEnabled = document.getElementById(`enable${pipeNumber}`).checked;
  if (!isEnabled) {
    const resultBox = document.getElementById(`result${pipeNumber}`);
    resultBox.innerHTML = "<p>این بخش غیرفعال شده است.</p>";
    return 0;
  }

  const size = document.getElementById(`size${pipeNumber}`).value;
  const thickness = document.getElementById(`thickness${pipeNumber}`).value;
  const length = document.getElementById(`length${pipeNumber}`).value;
  const unitPrice = document.getElementById("unitPrice").value;
  const resultBox = document.getElementById(`result${pipeNumber}`);

  if (!size || !thickness || !length || !unitPrice) {
    resultBox.innerHTML = "<p>لطفاً تمام مقادیر را وارد کنید.</p>";
    return 0;
  }

  const key = `${size}-${thickness}`;
  const weight = weights[key];
  if (!weight) {
    resultBox.innerHTML = "<p>ترکیب سایز و ضخامت انتخاب شده معتبر نیست.</p>";
    return 0;
  }

  const pricePerMeter = (weight * unitPrice) / 50;
  const totalPrice = pricePerMeter * length;

  resultBox.innerHTML = `
    <div class="price-item">
      <span class="price-label">قیمت هر متر:</span>
      <span class="price-value">${formatNumber(pricePerMeter)} ریال</span>
    </div>
    <div class="price-item total-price-item">
      <span class="price-label">قیمت کل:</span>
      <span class="price-value">${formatNumber(totalPrice)} ریال</span>
    </div>
  `;

  return totalPrice;
}

// محاسبه قیمت عایق
function calculateInsulationPrice() {
  // بررسی آیا عایق فعال است
  const isEnabled = document.getElementById("enableInsulation").checked;
  if (!isEnabled) {
    document.getElementById("insulationResult").innerHTML =
      "<p>این بخش غیرفعال شده است.</p>";
    return 0;
  }

  // بررسی میکنیم آیا اصلاً نیاز به محاسبه عایق هست
  const insulationResultBox = document.getElementById("insulationResult");

  // بررسی کنیم آیا لوله‌ها فعال هستند
  const enable1 = document.getElementById("enable1").checked;
  const enable2 = document.getElementById("enable2").checked;

  // دریافت مقادیر متراژ
  const length1 = enable1
    ? parseFloat(document.getElementById("length1").value) || 0
    : 0;
  const length2 = enable2
    ? parseFloat(document.getElementById("length2").value) || 0
    : 0;

  if (length1 === 0 && length2 === 0) {
    insulationResultBox.innerHTML = "<p>لطفاً متراژ لوله‌ها را وارد کنید.</p>";
    return 0;
  }

  // دریافت سایز لوله‌ها
  const size1 = enable1 ? document.getElementById("size1").value : "";
  const size2 = enable2 ? document.getElementById("size2").value : "";

  if (!size1 && !size2) {
    insulationResultBox.innerHTML = "<p>لطفاً سایز لوله‌ها را انتخاب کنید.</p>";
    return 0;
  }

  // قیمت‌های پایه عایق بر اساس سایز
  const insulationBasePrice = {
    "1/4": 350000,
    "3/8": 440000,
    "1/2": 520000,
    "5/8": 580000,
  };

  // محاسبه برای حالت‌های مختلف
  let totalPrice = 0;

  // اگر هر دو لوله فعال هستند
  if (enable1 && enable2 && size1 && size2) {
    // بررسی می‌کنیم آیا متراژها یکسان هستند یا متفاوت
    const sameLength = length1 === length2;

    if (sameLength && length1 > 0) {
      // اگر متراژها یکسان باشند
      const pairsNeeded = Math.ceil(length1 / 1.8);
      const price1 = insulationBasePrice[size1] || 0;
      const price2 = insulationBasePrice[size2] || 0;
      const pairPrice = price1 + price2;
      totalPrice = pairPrice * pairsNeeded;

      insulationResultBox.innerHTML = `
        <div class="price-item">
          <span class="price-label">تعداد عایق:</span>
          <span class="price-value">${pairsNeeded} جفت</span>
        </div>
        <div class="price-item">
          <span class="price-label">قیمت یک جفت عایق:</span>
          <span class="price-value">${formatNumber(pairPrice)} ریال</span>
        </div>
        <div class="price-item total-price-item">
          <span class="price-label">قیمت کل عایق ها:</span>
          <span class="price-value">${formatNumber(totalPrice)} ریال</span>
        </div>
      `;
    } else if (length1 > 0 && length2 > 0) {
      // اگر متراژها متفاوت باشند، دو محاسبه جداگانه انجام می‌دهیم
      const pairs1Needed = Math.ceil(length1 / 1.8);
      const pairs2Needed = Math.ceil(length2 / 1.8);

      const price1 = insulationBasePrice[size1] || 0;
      const price2 = insulationBasePrice[size2] || 0;

      const totalPrice1 = price1 * pairs1Needed;
      const totalPrice2 = price2 * pairs2Needed;
      totalPrice = totalPrice1 + totalPrice2;

      insulationResultBox.innerHTML = `
        <h4>عایق برای لوله 1:</h4>
        <div class="price-item">
          <span class="price-label">تعداد عایق:</span>
          <span class="price-value">${pairs1Needed} عدد</span>
        </div>
        <div class="price-item">
          <span class="price-label">قیمت هر عایق:</span>
          <span class="price-value">${formatNumber(price1)} ریال</span>
        </div>
        <div class="price-item">
          <span class="price-label">قیمت کل:</span>
          <span class="price-value">${formatNumber(totalPrice1)} ریال</span>
        </div>
        
        <h4>عایق برای لوله 2:</h4>
        <div class="price-item">
          <span class="price-label">تعداد عایق:</span>
          <span class="price-value">${pairs2Needed} عدد</span>
        </div>
        <div class="price-item">
          <span class="price-label">قیمت هر عایق:</span>
          <span class="price-value">${formatNumber(price2)} ریال</span>
        </div>
        <div class="price-item">
          <span class="price-label">قیمت کل:</span>
          <span class="price-value">${formatNumber(totalPrice2)} ریال</span>
        </div>
        
        <div class="price-item total-price-item">
          <span class="price-label">جمع کل عایق ها:</span>
          <span class="price-value">${formatNumber(totalPrice)} ریال</span>
        </div>
      `;
    }
  } else {
    // اگر فقط یک لوله فعال است
    const activeSize = enable1 ? size1 : size2;
    const activeLength = enable1 ? length1 : length2;

    if (activeSize && activeLength > 0) {
      const pairsNeeded = Math.ceil(activeLength / 1.8);
      const price = insulationBasePrice[activeSize] || 0;
      totalPrice = price * pairsNeeded;

      insulationResultBox.innerHTML = `
        <div class="price-item">
          <span class="price-label">تعداد عایق:</span>
          <span class="price-value">${pairsNeeded} عدد</span>
        </div>
        <div class="price-item">
          <span class="price-label">قیمت هر عایق:</span>
          <span class="price-value">${formatNumber(price)} ریال</span>
        </div>
        <div class="price-item total-price-item">
          <span class="price-label">قیمت کل عایق ها:</span>
          <span class="price-value">${formatNumber(totalPrice)} ریال</span>
        </div>
      `;
    }
  }

  return totalPrice;
}

// محاسبه قیمت پرایمر
function calculatePrimerPrice() {
  // بررسی آیا پرایمر فعال است
  const isEnabled = document.getElementById("enablePrimer").checked;
  if (!isEnabled) {
    document.getElementById("primerResult").innerHTML =
      "<p>این بخش غیرفعال شده است.</p>";
    return 0;
  }

  const primerType = document.getElementById("primerType").value;
  const primerResultBox = document.getElementById("primerResult");

  if (!primerType) {
    primerResultBox.innerHTML = "<p>لطفاً نوع پرایمر را انتخاب کنید.</p>";
    return 0;
  }

  // بررسی کنیم آیا لوله‌ها فعال هستند
  const enable1 = document.getElementById("enable1").checked;
  const enable2 = document.getElementById("enable2").checked;

  // دریافت مقادیر متراژ فقط از لوله‌های فعال
  const length1 = enable1
    ? parseFloat(document.getElementById("length1").value) || 0
    : 0;
  const length2 = enable2
    ? parseFloat(document.getElementById("length2").value) || 0
    : 0;

  // اگر هیچ متراژی وارد نشده باشد، نتیجه را خالی می‌کنیم
  if (length1 === 0 && length2 === 0) {
    primerResultBox.innerHTML = "<p>لطفاً متراژ لوله‌ها را وارد کنید.</p>";
    return 0;
  }

  const primerInfo = primerPrices[primerType];
  let unitsNeeded = 1;
  let showManualInput = false;

  // بررسی شرایط متراژ لوله‌ها
  if (enable1 && enable2 && length1 > 0 && length2 > 0) {
    // اگر هر دو لوله فعال هستند
    if (length1 === length2) {
      // اگر متراژها یکسان هستند، فقط یکی را حساب کن (جفتی)
      unitsNeeded = Math.ceil(length1 / primerInfo.perLength);

      // اگر فیلد دستی وجود دارد، آن را حذف کنیم
      const manualInputContainer = document.getElementById(
        "manualInputContainer"
      );
      if (manualInputContainer) {
        manualInputContainer.style.display = "none";
      }
    } else {
      // اگر متراژها متفاوت هستند، نمایش فیلد دستی
      showManualInput = true;

      // چک کنیم آیا فیلد دستی وجود دارد
      let manualInputContainer = document.getElementById(
        "manualInputContainer"
      );

      if (!manualInputContainer) {
        // اگر فیلد دستی وجود ندارد، آن را ایجاد کنیم
        manualInputContainer = document.createElement("div");
        manualInputContainer.id = "manualInputContainer";
        manualInputContainer.className = "input-group mb-2";
        manualInputContainer.innerHTML = `
          <label for="manualPrimerCount">تعداد پرایمر (دستی):</label>
          <input type="number" id="manualPrimerCount" min="1" value="1" />
        `;

        // افزودن فیلد به ابتدای primerResultBox
        if (primerResultBox.firstChild) {
          primerResultBox.insertBefore(
            manualInputContainer,
            primerResultBox.firstChild
          );
        } else {
          primerResultBox.appendChild(manualInputContainer);
        }

        // افزودن event listener برای تغییر مقدار
        document
          .getElementById("manualPrimerCount")
          .addEventListener("input", function () {
            // فقط قسمت های مربوط به قیمت را به روز کن، نه کل HTML
            updatePrimerPriceDisplay();
          });
      } else {
        // اگر فیلد دستی وجود دارد، آن را نمایش بده
        manualInputContainer.style.display = "block";
      }

      // استفاده از مقدار فیلد دستی
      const manualField = document.getElementById("manualPrimerCount");
      if (manualField) {
        unitsNeeded = parseInt(manualField.value) || 1;
      }
    }
  } else if (enable1 && length1 > 0) {
    // فقط لوله 1 فعال است
    unitsNeeded = Math.ceil(length1 / primerInfo.perLength);

    // اگر فیلد دستی وجود دارد، آن را مخفی کنیم
    const manualInputContainer = document.getElementById(
      "manualInputContainer"
    );
    if (manualInputContainer) {
      manualInputContainer.style.display = "none";
    }
  } else if (enable2 && length2 > 0) {
    // فقط لوله 2 فعال است
    unitsNeeded = Math.ceil(length2 / primerInfo.perLength);

    // اگر فیلد دستی وجود دارد، آن را مخفی کنیم
    const manualInputContainer = document.getElementById(
      "manualInputContainer"
    );
    if (manualInputContainer) {
      manualInputContainer.style.display = "none";
    }
  }

  const unitPrice = primerInfo.price;
  const totalPrice = unitPrice * unitsNeeded;

  // به روز رسانی نمایش قیمت ها بدون بازنویسی کل HTML
  updatePrimerPriceDisplay(unitsNeeded, unitPrice, totalPrice);

  return totalPrice;

  // تابع داخلی برای به روز رسانی نمایش قیمت ها
  function updatePrimerPriceDisplay() {
    // دریافت مقدار جدید از فیلد دستی اگر وجود داشته باشد
    const manualField = document.getElementById("manualPrimerCount");
    const currentUnits =
      showManualInput && manualField
        ? parseInt(manualField.value) || 1
        : unitsNeeded;

    const currentPrice = primerInfo.price * currentUnits;

    // چک کنیم آیا المان های نمایش قیمت وجود دارند
    let priceDisplay = document.getElementById("primerUnitCount");
    if (!priceDisplay) {
      // اگر المان های نمایش قیمت وجود ندارند، آنها را ایجاد کنیم
      const priceContainer = document.createElement("div");
      priceContainer.id = "primerPriceContainer";
      priceContainer.innerHTML = `
        <div class="price-item">
          <span class="price-label">تعداد پرایمر مورد نیاز:</span>
          <span class="price-value" id="primerUnitCount">${currentUnits} عدد</span>
        </div>
        <div class="price-item">
          <span class="price-label">قیمت هر واحد:</span>
          <span class="price-value">${formatNumber(
            primerInfo.price
          )} ریال</span>
        </div>
        <div class="price-item total-price-item">
          <span class="price-label">قیمت کل پرایمر:</span>
          <span class="price-value" id="primerTotalPrice">${formatNumber(
            currentPrice
          )} ریال</span>
        </div>
      `;
      primerResultBox.appendChild(priceContainer);
    } else {
      // اگر المان های نمایش قیمت وجود دارند، فقط مقادیر را به روز کنیم
      document.getElementById(
        "primerUnitCount"
      ).textContent = `${currentUnits} عدد`;
      document.getElementById("primerTotalPrice").textContent = `${formatNumber(
        currentPrice
      )} ریال`;
    }

    // محاسبه مجدد قیمت کل بدون بازنویسی کل صفحه
    const pipe1Price = document.getElementById("enable1").checked
      ? calculatePipePrice(1)
      : 0;
    const pipe2Price = document.getElementById("enable2").checked
      ? calculatePipePrice(2)
      : 0;
    const insulationPrice = document.getElementById("enableInsulation").checked
      ? calculateInsulationPrice()
      : 0;

    // محاسبه قیمت کل
    const totalAllPrice =
      pipe1Price + pipe2Price + insulationPrice + currentPrice;

    // نمایش قیمت کل
    document.getElementById("totalPrice").textContent = `جمع کل: ${formatNumber(
      totalAllPrice
    )} ریال`;

    // ذخیره مقادیر در حافظه محلی
    saveToLocalStorage();

    return currentPrice;
  }
}

// تابع تبدیل تاریخ میلادی به شمسی
function gregorianToJalali(gy, gm, gd) {
  var g_d_m, jy, jm, jd, gy2, days;
  g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  gy2 = gm > 2 ? gy + 1 : gy;
  days =
    355666 +
    365 * gy +
    ~~((gy2 + 3) / 4) -
    ~~((gy2 + 99) / 100) +
    ~~((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  jy = -1595 + 33 * ~~(days / 12053);
  days %= 12053;
  jy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += ~~((days - 1) / 365);
    days = (days - 1) % 365;
  }
  jm = days < 186 ? 1 + ~~(days / 31) : 7 + ~~((days - 186) / 30);
  jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

// تابع اشتراک گذاری نتایج
function shareResults() {
  // تاریخ امروز
  const today = new Date();
  const jalaliDate = gregorianToJalali(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );
  const dateFormatted = `${jalaliDate[0]}/${jalaliDate[1]}/${jalaliDate[2]}`;

  // بررسی کنیم آیا لوله‌ها فعال هستند
  const enable1 = document.getElementById("enable1").checked;
  const enable2 = document.getElementById("enable2").checked;
  const enableInsulation = document.getElementById("enableInsulation").checked;
  const enablePrimer = document.getElementById("enablePrimer").checked;

  // دریافت اطلاعات لوله 1
  const size1 = enable1 ? document.getElementById("size1").value || "-" : "-";
  const thickness1 = enable1
    ? document.getElementById("thickness1").value || "-"
    : "-";
  const length1 = enable1
    ? document.getElementById("length1").value || "0"
    : "0";

  let pipe1PricePerMeter = 0;
  let pipe1TotalPrice = 0;

  if (enable1 && size1 !== "-" && thickness1 !== "-" && length1 !== "0") {
    const key1 = `${size1}-${thickness1}`;
    const weight1 = weights[key1];
    const unitPrice = document.getElementById("unitPrice").value;
    pipe1PricePerMeter = (weight1 * unitPrice) / 50;
    pipe1TotalPrice = pipe1PricePerMeter * length1;
  }

  // دریافت اطلاعات لوله 2
  const size2 = enable2 ? document.getElementById("size2").value || "-" : "-";
  const thickness2 = enable2
    ? document.getElementById("thickness2").value || "-"
    : "-";
  const length2 = enable2
    ? document.getElementById("length2").value || "0"
    : "0";

  let pipe2PricePerMeter = 0;
  let pipe2TotalPrice = 0;

  if (enable2 && size2 !== "-" && thickness2 !== "-" && length2 !== "0") {
    const key2 = `${size2}-${thickness2}`;
    const weight2 = weights[key2];
    const unitPrice = document.getElementById("unitPrice").value;
    pipe2PricePerMeter = (weight2 * unitPrice) / 50;
    pipe2TotalPrice = pipe2PricePerMeter * length2;
  }

  // قیمت‌های پایه عایق بر اساس سایز
  const insulationBasePrice = {
    "1/4": 350000,
    "3/8": 440000,
    "1/2": 520000,
    "5/8": 580000,
  };

  // محاسبه تعداد و قیمت کل عایق
  let insulationInfo = "";
  let totalInsulationPrice = 0;

  if (enableInsulation && (enable1 || enable2)) {
    // بررسی می‌کنیم آیا متراژها یکسان هستند یا متفاوت
    const sameLength =
      length1 === length2 || length1 === "0" || length2 === "0";
    const effectiveLength = Math.max(
      parseFloat(length1) || 0,
      parseFloat(length2) || 0
    );

    if (
      enable1 &&
      enable2 &&
      size1 !== "-" &&
      size2 !== "-" &&
      effectiveLength > 0
    ) {
      if (sameLength) {
        // اگر متراژها یکسان باشند، یا فقط یکی وارد شده باشد
        const pairsNeeded = Math.ceil(effectiveLength / 1.8);
        const price1 = insulationBasePrice[size1] || 0;
        const price2 = insulationBasePrice[size2] || 0;
        const pairPrice = price1 + price2;
        totalInsulationPrice = pairPrice * pairsNeeded;

        insulationInfo = `عایق ${size1} و ${size2}  |  ${pairsNeeded} جفت  |  ${formatNumber(
          pairPrice
        )} ریال  |  ${formatNumber(totalInsulationPrice)} ریال`;
      } else if (parseFloat(length1) > 0 && parseFloat(length2) > 0) {
        // اگر متراژها متفاوت باشند، دو محاسبه جداگانه انجام می‌دهیم
        const pairs1Needed = Math.ceil(parseFloat(length1) / 1.8);
        const pairs2Needed = Math.ceil(parseFloat(length2) / 1.8);

        const price1 = insulationBasePrice[size1] || 0;
        const price2 = insulationBasePrice[size2] || 0;

        const totalPrice1 = price1 * pairs1Needed;
        const totalPrice2 = price2 * pairs2Needed;
        totalInsulationPrice = totalPrice1 + totalPrice2;

        insulationInfo =
          `عایق ${size1}  |  ${pairs1Needed} عدد  |  ${formatNumber(
            price1
          )} ریال  |  ${formatNumber(totalPrice1)} ریال\n` +
          `عایق ${size2}  |  ${pairs2Needed} عدد  |  ${formatNumber(
            price2
          )} ریال  |  ${formatNumber(totalPrice2)} ریال`;
      }
    } else if (enable1 && size1 !== "-" && parseFloat(length1) > 0) {
      // فقط لوله 1 فعال است
      const pairsNeeded = Math.ceil(parseFloat(length1) / 1.8);
      const price = insulationBasePrice[size1] || 0;
      totalInsulationPrice = price * pairsNeeded;
      insulationInfo = `عایق ${size1}  |  ${pairsNeeded} عدد  |  ${formatNumber(
        price
      )} ریال  |  ${formatNumber(totalInsulationPrice)} ریال`;
    } else if (enable2 && size2 !== "-" && parseFloat(length2) > 0) {
      // فقط لوله 2 فعال است
      const pairsNeeded = Math.ceil(parseFloat(length2) / 1.8);
      const price = insulationBasePrice[size2] || 0;
      totalInsulationPrice = price * pairsNeeded;
      insulationInfo = `عایق ${size2}  |  ${pairsNeeded} عدد  |  ${formatNumber(
        price
      )} ریال  |  ${formatNumber(totalInsulationPrice)} ریال`;
    }
  }

  // دریافت اطلاعات پرایمر
  const primerTypeSelect = document.getElementById("primerType");
  const primerType = enablePrimer ? primerTypeSelect.value || "-" : "-";
  const primerTypeText = enablePrimer
    ? primerTypeSelect.options[primerTypeSelect.selectedIndex].text || "-"
    : "-";

  // محاسبه تعداد و قیمت کل پرایمر
  let totalPrimerPrice = 0;
  let primerCount = 0;

  if (enablePrimer && primerType !== "-") {
    const primerInfo = primerPrices[primerType];

    // بررسی حالت های مختلف متراژ
    if (
      enable1 &&
      enable2 &&
      parseFloat(length1) > 0 &&
      parseFloat(length2) > 0
    ) {
      if (parseFloat(length1) === parseFloat(length2)) {
        // اگر متراژها یکسان هستند، فقط یکی را حساب کن
        primerCount = Math.ceil(parseFloat(length1) / primerInfo.perLength);
      } else {
        // اگر متراژها متفاوت هستند، از مقدار فیلد دستی استفاده کن
        const manualField = document.getElementById("manualPrimerCount");
        primerCount = manualField ? parseInt(manualField.value) || 1 : 1;
      }
    } else if (enable1 && parseFloat(length1) > 0) {
      // فقط لوله 1 فعال است
      primerCount = Math.ceil(parseFloat(length1) / primerInfo.perLength);
    } else if (enable2 && parseFloat(length2) > 0) {
      // فقط لوله 2 فعال است
      primerCount = Math.ceil(parseFloat(length2) / primerInfo.perLength);
    }

    totalPrimerPrice = primerCount * primerInfo.price;
  }

  // محاسبه جمع کل
  const grandTotal =
    pipe1TotalPrice + pipe2TotalPrice + totalInsulationPrice + totalPrimerPrice;

  // ساخت متن فاکتور
  let invoiceText = `*فروشگاه فریزلنــد*    *${dateFormatted}*\n`;

  if (enable1 && size1 !== "-" && length1 !== "0") {
    invoiceText += `لوله سایز ${size1} - ضخامت ${thickness1}  |  ${length1} متر  |  ${formatNumber(
      pipe1PricePerMeter
    )} ریال  |  ${formatNumber(pipe1TotalPrice)} ریال\n`;
  }

  if (enable2 && size2 !== "-" && length2 !== "0") {
    invoiceText += `لوله سایز ${size2} - ضخامت ${thickness2}  |  ${length2} متر  |  ${formatNumber(
      pipe2PricePerMeter
    )} ریال  |  ${formatNumber(pipe2TotalPrice)} ریال\n`;
  }

  if (enableInsulation && insulationInfo) {
    invoiceText += `\n${insulationInfo}\n`;
  }

  if (enablePrimer && primerType !== "-") {
    invoiceText += `\nپرایمر ${primerTypeText}  |  ${primerCount} عدد  |  ${formatNumber(
      totalPrimerPrice
    )} ریال\n`;
  }

  invoiceText += `\n*جمع کل: ${formatNumber(grandTotal)} ریال*`;

  // بررسی اینکه آیا موبایل است یا دسکتاپ
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // اشتراک گذاری متن فاکتور
  if (isMobile && navigator.share) {
    navigator
      .share({
        title: "فاکتور لوله مسی",
        text: invoiceText,
      })
      .catch((error) => {
        copyToClipboard(invoiceText);
        showToast("متن فاکتور در کلیپ‌بورد کپی شد!");
      });
  } else {
    copyToClipboard(invoiceText);
    showToast("متن فاکتور در کلیپ‌بورد کپی شد!");
  }
}

// تابع کپی کردن متن در کلیپ‌بورد
function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

// نمایش پیام توست
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = "toast show";

  // پس از 3 ثانیه پنهان می‌شود
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

// پاک کردن تمام فرم‌ها
function resetForm() {
  // پاک کردن ورودی‌های مشترک
  document.getElementById("unitPrice").value = "16000000";

  // فعال کردن تمام بخش‌ها
  document.getElementById("enable1").checked = true;
  document.getElementById("enable2").checked = true;
  document.getElementById("enableInsulation").checked = true;
  document.getElementById("enablePrimer").checked = true;

  // پاک کردن ورودی‌های لوله 1
  document.getElementById("size1").selectedIndex = 0;
  document.getElementById("thickness1").selectedIndex = 0;
  document.getElementById("length1").value = "";
  document.getElementById("result1").innerHTML = "";

  // پاک کردن ورودی‌های لوله 2
  document.getElementById("size2").selectedIndex = 3;
  document.getElementById("thickness2").selectedIndex = 0;
  document.getElementById("length2").value = "";
  document.getElementById("result2").innerHTML = "";

  // پاک کردن محاسبات عایق
  if (document.getElementById("insulationResult")) {
    document.getElementById("insulationResult").innerHTML = "";
  }

  // پاک کردن ورودی‌های پرایمر
  if (document.getElementById("primerType")) {
    document.getElementById("primerType").selectedIndex = 0;
  }
  if (document.getElementById("primerResult")) {
    document.getElementById("primerResult").innerHTML = "";
  }

  // پاک کردن قیمت کل
  document.getElementById("totalPrice").textContent = "جمع کل: 0 ریال";

  // پاک کردن حافظه محلی
  localStorage.removeItem("copperPipeCalculator");
}

// فرمت کردن اعداد با جداکننده هزارگان
function formatNumber(num) {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

// ذخیره مقادیر در حافظه محلی
function saveToLocalStorage() {
  const data = {
    unitPrice: document.getElementById("unitPrice").value,
    enable1: document.getElementById("enable1").checked,
    enable2: document.getElementById("enable2").checked,
    enableInsulation: document.getElementById("enableInsulation").checked,
    enablePrimer: document.getElementById("enablePrimer").checked,
    pipe1: {
      size: document.getElementById("size1").value,
      thickness: document.getElementById("thickness1").value,
      length: document.getElementById("length1").value,
    },
    pipe2: {
      size: document.getElementById("size2").value,
      thickness: document.getElementById("thickness2").value,
      length: document.getElementById("length2").value,
    },
    primer: {
      type: document.getElementById("primerType").value,
    },
  };

  localStorage.setItem("copperPipeCalculator", JSON.stringify(data));
}

// بازیابی مقادیر از حافظه محلی
function loadFromLocalStorage() {
  const savedData = localStorage.getItem("copperPipeCalculator");
  if (!savedData) return;

  const data = JSON.parse(savedData);

  // بازیابی قیمت واحد
  if (data.unitPrice) {
    document.getElementById("unitPrice").value = data.unitPrice;
  }

  // بازیابی وضعیت فعال/غیرفعال
  if (data.hasOwnProperty("enable1")) {
    document.getElementById("enable1").checked = data.enable1;
  }
  if (data.hasOwnProperty("enable2")) {
    document.getElementById("enable2").checked = data.enable2;
  }
  if (data.hasOwnProperty("enableInsulation")) {
    document.getElementById("enableInsulation").checked = data.enableInsulation;
  }
  if (data.hasOwnProperty("enablePrimer")) {
    document.getElementById("enablePrimer").checked = data.enablePrimer;
  }

  // بازیابی لوله 1
  if (data.pipe1) {
    if (data.pipe1.size) {
      document.getElementById("size1").value = data.pipe1.size;
    }
    if (data.pipe1.thickness) {
      document.getElementById("thickness1").value = data.pipe1.thickness;
    }
    if (data.pipe1.length) {
      document.getElementById("length1").value = data.pipe1.length;
    }
  }

  // بازیابی لوله 2
  if (data.pipe2) {
    if (data.pipe2.size) {
      document.getElementById("size2").value = data.pipe2.size;
    }
    if (data.pipe2.thickness) {
      document.getElementById("thickness2").value = data.pipe2.thickness;
    }
    if (data.pipe2.length) {
      document.getElementById("length2").value = data.pipe2.length;
    }
  }

  // بازیابی پرایمر در صورت وجود
  if (data.primer && document.getElementById("primerType")) {
    if (data.primer.type) {
      document.getElementById("primerType").value = data.primer.type;
    }
  }

  // محاسبه مجدد قیمت‌ها
  calculatePrice();
}

// اجرای محاسبه اولیه و بارگذاری اطلاعات ذخیره شده هنگام بارگذاری صفحه
document.addEventListener("DOMContentLoaded", function () {
  // تنظیم مقدار پیش‌فرض برای قیمت واحد
  document.getElementById("unitPrice").value = "16000000";

  // بارگذاری اطلاعات ذخیره شده
  loadFromLocalStorage();
});
