document.addEventListener("DOMContentLoaded", () => {

  /* Tabs */
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove("is-active"));
      panels.forEach(panel => panel.classList.remove("is-active"));
      tab.classList.add("is-active");
      const targetPanel = document.getElementById(target);
      if (targetPanel) targetPanel.classList.add("is-active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });


  /* Reading progress */
  const readingProgress = document.getElementById("readingProgress");

  function updateReadingProgress() {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (documentHeight <= 0) {
      readingProgress.style.width = "0%";
      return;
    }
    const progress = (scrollTop / documentHeight) * 100;
    readingProgress.style.width = Math.min(100, Math.max(0, progress)) + "%";
  }

  window.addEventListener("scroll", updateReadingProgress);
  updateReadingProgress();


  /* Study slides */
  const slides = Array.from(document.querySelectorAll(".slide"));
  const slideNum = document.getElementById("slideNum");
  const slideTotal = document.getElementById("slideTotal");
  const deckDots = document.getElementById("deckDots");
  const prevSlide = document.getElementById("prevSlide");
  const nextSlide = document.getElementById("nextSlide");

  let currentSlide = 0;
  slideTotal.textContent = slides.length;

  function createSlideDots() {
    deckDots.innerHTML = "";
    slides.forEach((slide, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "deck-dot";
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.addEventListener("click", () => showSlide(index));
      deckDots.appendChild(dot);
    });
  }

  function showSlide(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    currentSlide = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === currentSlide);
    });

    slideNum.textContent = currentSlide + 1;

    const dots = document.querySelectorAll(".deck-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === currentSlide);
      dot.classList.toggle("is-done", i < currentSlide);
    });

    prevSlide.disabled = currentSlide === 0;
    nextSlide.disabled = currentSlide === slides.length - 1;

    window.scrollTo({
      top: document.querySelector(".deck").offsetTop - 20,
      behavior: "smooth"
    });
  }

  prevSlide.addEventListener("click", () => showSlide(currentSlide - 1));
  nextSlide.addEventListener("click", () => showSlide(currentSlide + 1));

  document.addEventListener("keydown", event => {
    const learnPanel = document.getElementById("learn");
    if (learnPanel && learnPanel.classList.contains("is-active")) {
      if (event.key === "ArrowRight") showSlide(currentSlide + 1);
      if (event.key === "ArrowLeft") showSlide(currentSlide - 1);
    }
  });

  createSlideDots();
  showSlide(0);


  /* Jeepney fare slider */
  const kmSlider = document.getElementById("kmSlider");
  const kmVal = document.getElementById("kmVal");
  const fareVal = document.getElementById("fareVal");
  const ruleUsed = document.getElementById("ruleUsed");

  function updateFare() {
    if (!kmSlider) return;
    const distance = Number(kmSlider.value);
    let fare, ruleText;

    if (distance <= 4) {
      fare = 12;
      ruleText = "Rule 1 applies: flat fare.";
    } else {
      fare = 12 + 1.5 * (distance - 4);
      ruleText = "Rule 2 applies: ₱12 + ₱1.50 per extra km.";
    }

    kmVal.textContent = distance;
    fareVal.textContent = `₱${fare.toFixed(2)}`;
    ruleUsed.textContent = ruleText;

    fareVal.classList.remove("is-pulsing");
    void fareVal.offsetWidth;
    fareVal.classList.add("is-pulsing");
  }

  if (kmSlider) {
    kmSlider.addEventListener("input", updateFare);
    updateFare();
  }


  /* ============================================================
     QUIZ DATA — 50 questions (43 scenario-based + 7 concept)
     ============================================================ */
  const questions = [
    /* ---- JEEPNEY FARE ---- */
    {
      tag: "Jeepney Fare",
      question:
        "Ana boards a jeepney and rides 3 km to school. The fare rule is ₱12.00 for the first 4 km (or any part of it), then ₱1.50 for every kilometre beyond 4 km. Which rule applies, and how much does Ana pay?",
      options: [
        "Rule 1 applies — she pays ₱12.00",
        "Rule 2 applies — she pays ₱16.50",
        "Rule 1 applies — she pays ₱9.00",
        "Rule 2 applies — she pays ₱12.00"
      ],
      answer: 0,
      explanation:
        "3 km falls inside the first 4 km, so 0 < x ≤ 4 is satisfied.\nRule 1 gives a flat ₱12.00.\nThe ₱1.50 rate only starts after the 4th kilometre."
    },
    {
      tag: "Jeepney Fare",
      question:
        "Ben rides a jeepney 6.5 km from the market to his barangay. The fare rule is ₱12.00 for the first 4 km, then ₱1.50 per kilometre beyond 4 km. How much does Ben pay?",
      options: ["₱21.75", "₱15.75", "₱12.00", "₱16.50"],
      answer: 1,
      explanation:
        "6.5 > 4, so rule 2 applies.\nExtra distance = 6.5 − 4 = 2.5 km.\nf(6.5) = 12 + 1.5(2.5) = 12 + 3.75 = ₱15.75."
    },
    {
      tag: "Jeepney Fare",
      question:
        "Carla handed the jeepney driver ₱21.00 for one ride. Using f(x) = 12 for 0 < x ≤ 4 and f(x) = 12 + 1.5(x − 4) for x > 4, how far did she travel?",
      options: ["10 km", "14 km", "6 km", "9 km"],
      answer: 0,
      explanation:
        "₱21 is more than ₱12, so the ride is in rule 2.\n12 + 1.5(x − 4) = 21\n1.5(x − 4) = 9\nx − 4 = 6\nx = 10 km.\nCheck: 12 + 1.5(6) = ₱21. Correct."
    },
    {
      tag: "Jeepney Fare",
      question:
        "Mario needs to cover 6 km. Option A is one jeepney ride for the full 6 km. Option B is two separate 3-km rides. The fare is ₱12 for the first 4 km, then ₱1.50 per extra km. How much does Mario save by choosing Option A?",
      options: ["₱9.00", "₱12.00", "₱3.75", "₱4.50"],
      answer: 0,
      explanation:
        "Option A: f(6) = 12 + 1.5(6 − 4) = 12 + 3 = ₱15.00.\nOption B: each 3-km ride is flat ₱12.00, so two rides = ₱24.00.\nSavings = 24.00 − 15.00 = ₱9.00.\nSplitting a trip costs more because each short ride pays the full ₱12 base."
    },
    {
      tag: "Jeepney Fare",
      question:
        "Lito travels 9 km. Using f(x) = 12 for 0 < x ≤ 4 and f(x) = 12 + 1.5(x − 4) for x > 4, what is his fare?",
      options: ["₱25.50", "₱19.50", "₱13.50", "₱18.00"],
      answer: 1,
      explanation:
        "9 > 4, so rule 2 applies.\nf(9) = 12 + 1.5(9 − 4) = 12 + 1.5(5) = 12 + 7.50 = ₱19.50."
    },
    {
      tag: "Jeepney Fare",
      question:
        "A student paid exactly ₱16.50 for a jeepney ride. Using f(x) = 12 + 1.5(x − 4) for x > 4, how many kilometres did the student travel?",
      options: ["7 km", "3 km", "11 km", "4.5 km"],
      answer: 0,
      explanation:
        "₱16.50 > ₱12, so rule 2 applies.\n12 + 1.5(x − 4) = 16.50\n1.5(x − 4) = 4.50\nx − 4 = 3\nx = 7 km.\nCheck: 12 + 1.5(3) = ₱16.50. Correct."
    },
    {
      tag: "Jeepney Fare",
      question:
        "Rosa rides a jeepney 4.5 km. The fare rule is ₱12 for the first 4 km, then ₱1.50 per extra km. How much of her fare comes from the extra half kilometre beyond the first 4 km?",
      options: ["₱0.75", "₱1.50", "₱12.75", "₱3.00"],
      answer: 0,
      explanation:
        "Only 0.5 km is beyond the 4-km boundary.\nCharge on that part = 1.5 × 0.5 = ₱0.75.\nTotal fare = 12.00 + 0.75 = ₱12.75."
    },

    /* ---- BULK PRICING ---- */
    {
      tag: "Bulk Pricing",
      question:
        "A bookstore sells pencils at ₱10 each, but if a customer buys 10 or more, every pencil drops to ₱8 each. Using C(p) = 10p for 0 < p < 10 and C(p) = 8p for p ≥ 10, how much do 7 pencils cost?",
      options: ["₱70", "₱56", "₱80", "₱63"],
      answer: 0,
      explanation:
        "7 is less than 10, so rule 1 applies.\nC(7) = 10 × 7 = ₱70.\nThe bulk discount has not yet been triggered."
    },
    {
      tag: "Bulk Pricing",
      question:
        "A student buys exactly 10 pencils. The price rule is C(p) = 10p for 0 < p < 10 and C(p) = 8p for p ≥ 10. How much does the student pay?",
      options: ["₱100", "₱80", "₱90", "₱88"],
      answer: 1,
      explanation:
        "The condition p ≥ 10 includes exactly 10, so rule 2 applies.\nC(10) = 8 × 10 = ₱80.\nNote: 10 pencils cost LESS than 9 pencils — that is the bulk discount at work."
    },
    {
      tag: "Bulk Pricing",
      question:
        "Nine pencils cost ₱90, while ten pencils cost ₱80. A customer who was about to buy 9 pencils decides to buy 10 instead. How much money does the customer save by buying one extra pencil?",
      options: ["₱10", "₱0 — the extra pencil costs ₱8 more", "₱18", "₱8"],
      answer: 0,
      explanation:
        "Cost of 9 pencils = 10 × 9 = ₱90.\nCost of 10 pencils = 8 × 10 = ₱80.\nDifference = 90 − 80 = ₱10 saved, and the customer gets one more pencil.\nThe 10th pencil switches the whole order to the discounted rate."
    },
    {
      tag: "Bulk Pricing",
      question:
        "A teacher buys 14 pencils for her class. The rule is C(p) = 10p for 0 < p < 10 and C(p) = 8p for p ≥ 10. What is the total cost?",
      options: ["₱140", "₱112", "₱120", "₱96"],
      answer: 1,
      explanation:
        "14 ≥ 10, so rule 2 applies to every pencil.\nC(14) = 8 × 14 = ₱112.\nThe discount applies to the whole purchase, not just the pencils beyond 10."
    },
    {
      tag: "Bulk Pricing",
      question:
        "A sari-sari store owner buys 25 pencils for resale. Using C(p) = 10p for 0 < p < 10 and C(p) = 8p for p ≥ 10, how much does the order cost?",
      options: ["₱250", "₱200", "₱180", "₱220"],
      answer: 1,
      explanation:
        "25 ≥ 10, so rule 2 applies.\nC(25) = 8 × 25 = ₱200.\nWithout the discount it would have been ₱250, so the owner saves ₱50."
    },
    {
      tag: "Bulk Pricing",
      question:
        "A customer paid exactly ₱160 for pencils. Using C(p) = 10p for 0 < p < 10 and C(p) = 8p for p ≥ 10, how many pencils did the customer buy?",
      options: ["20 pencils", "16 pencils", "18 pencils", "25 pencils"],
      answer: 0,
      explanation:
        "Try rule 2 first: 8p = 160 → p = 20.\nCheck the condition: 20 ≥ 10 ✓.\nRule 1 would give 10p = 160 → p = 16, but 16 is NOT less than 10, so rule 1 does not apply."
    },
    {
      tag: "Bulk Pricing",
      question:
        "A class needs at least 12 pencils. The store sells at ₱10 each for fewer than 10 pencils, and ₱8 each for 10 or more. What is the cheapest way to actually get at least 12 pencils, and how much does it cost?",
      options: [
        "Buy 12 pencils for ₱96",
        "Buy 10 pencils for ₱80",
        "Buy 9 pencils for ₱90",
        "Buy 15 pencils for ₱120"
      ],
      answer: 0,
      explanation:
        "Buying 10 pencils for ₱80 is cheaper, but it gives only 10 pencils — not enough.\nTo actually have at least 12 pencils, the customer must buy 12:\nC(12) = 8 × 12 = ₱96.\nThe rule is about how many you buy, not how many you need."
    },

    /* ---- MOBILE DATA PLAN ---- */
    {
      tag: "Data Plan",
      question:
        "A telecom company charges ₱300 per month for a plan that includes 5 GB of data. Any data beyond 5 GB costs ₱50 per gigabyte. Using D(g) = 300 for 0 ≤ g ≤ 5 and D(g) = 300 + 50(g − 5) for g > 5, how much does a subscriber who uses 2 GB pay?",
      options: ["₱300", "₱250", "₱350", "₱100"],
      answer: 0,
      explanation:
        "2 GB is inside the 5 GB allowance, so rule 1 applies.\nD(2) = ₱300.\nUnused data is not refunded — the monthly plan is flat."
    },
    {
      tag: "Data Plan",
      question:
        "A subscriber uses 7.5 GB in one month. The plan is D(g) = 300 for 0 ≤ g ≤ 5 and D(g) = 300 + 50(g − 5) for g > 5. What is the monthly bill?",
      options: ["₱375", "₱425", "₱450", "₱350"],
      answer: 1,
      explanation:
        "7.5 > 5, so rule 2 applies.\nExtra data = 7.5 − 5 = 2.5 GB.\nD(7.5) = 300 + 50(2.5) = 300 + 125 = ₱425."
    },
    {
      tag: "Data Plan",
      question:
        "A subscriber's monthly bill came to ₱700. Using D(g) = 300 for 0 ≤ g ≤ 5 and D(g) = 300 + 50(g − 5) for g > 5, how many gigabytes were used?",
      options: ["13 GB", "8 GB", "14 GB", "11 GB"],
      answer: 0,
      explanation:
        "₱700 is more than ₱300, so the usage is in rule 2.\n300 + 50(g − 5) = 700\n50(g − 5) = 400\ng − 5 = 8\ng = 13 GB.\nCheck: 300 + 50(8) = ₱700. Correct."
    },
    {
      tag: "Data Plan",
      question:
        "A heavy user consumes 11 GB in a month. The plan is D(g) = 300 for 0 ≤ g ≤ 5 and D(g) = 300 + 50(g − 5) for g > 5. What is the bill?",
      options: ["₱550", "₱600", "₱650", "₱500"],
      answer: 1,
      explanation:
        "11 > 5, so rule 2 applies.\nExtra data = 11 − 5 = 6 GB.\nD(11) = 300 + 50(6) = 300 + 300 = ₱600."
    },
    {
      tag: "Data Plan",
      question:
        "How much MORE does a subscriber who uses 10 GB pay compared with a subscriber who uses exactly 5 GB? Use D(g) = 300 for 0 ≤ g ≤ 5 and D(g) = 300 + 50(g − 5) for g > 5.",
      options: ["₱250", "₱500", "₱50", "₱300"],
      answer: 0,
      explanation:
        "D(5) = ₱300 (the ≤ includes 5).\nD(10) = 300 + 50(5) = ₱550.\nDifference = 550 − 300 = ₱250.\nThat ₱250 is the charge for the 5 extra gigabytes."
    },
    {
      tag: "Data Plan",
      question:
        "A subscriber uses 5.5 GB. Using D(g) = 300 for 0 ≤ g ≤ 5 and D(g) = 300 + 50(g − 5) for g > 5, what is the bill, and how much of it is the overage charge?",
      options: [
        "₱325 total, with ₱25 as the overage charge",
        "₱325 total, with ₱50 as the overage charge",
        "₱300 total, with no overage charge",
        "₱350 total, with ₱50 as the overage charge"
      ],
      answer: 0,
      explanation:
        "5.5 > 5, so rule 2 applies.\nExtra data = 0.5 GB.\nOverage charge = 50 × 0.5 = ₱25.\nTotal = 300 + 25 = ₱325."
    },
    {
      tag: "Data Plan",
      question:
        "Which statement about the data plan D(g) = 300 for 0 ≤ g ≤ 5 and D(g) = 300 + 50(g − 5) for g > 5 is TRUE?",
      options: [
        "A subscriber who uses no data at all pays ₱0",
        "The monthly bill can never go below ₱300",
        "Every gigabyte costs ₱50, including the first 5 GB",
        "Using exactly 5 GB triggers an extra ₱50 charge"
      ],
      answer: 1,
      explanation:
        "The first piece gives a flat ₱300 for any usage from 0 to 5 GB, so even a subscriber who uses almost nothing pays ₱300.\nThe ₱50 rate applies only to data above 5 GB."
    },

    /* ---- OVERTIME PAY ---- */
    {
      tag: "Overtime Pay",
      question:
        "An employee earns ₱80 per hour for up to 40 hours a week. Any hour beyond 40 is paid at 1.5 times the regular rate, or ₱120 per hour. Using W(h) = 80h for 0 ≤ h ≤ 40 and W(h) = 3200 + 120(h − 40) for h > 40, how much does a worker who logs 38 hours earn?",
      options: ["₱3,040", "₱3,200", "₱2,960", "₱3,120"],
      answer: 0,
      explanation:
        "38 ≤ 40, so rule 1 applies.\nW(38) = 80 × 38 = ₱3,040.\nNo overtime is involved because the worker stayed under 40 hours."
    },
    {
      tag: "Overtime Pay",
      question:
        "A worker renders 43 hours in one week. The pay rule is W(h) = 80h for 0 ≤ h ≤ 40 and W(h) = 3200 + 120(h − 40) for h > 40. What is the weekly pay?",
      options: ["₱3,440", "₱3,560", "₱3,800", "₱3,320"],
      answer: 1,
      explanation:
        "43 > 40, so rule 2 applies.\nOvertime hours = 43 − 40 = 3.\nW(43) = 3200 + 120(3) = 3200 + 360 = ₱3,560."
    },
    {
      tag: "Overtime Pay",
      question:
        "A worker received ₱4,160 for one week. Using W(h) = 80h for 0 ≤ h ≤ 40 and W(h) = 3200 + 120(h − 40) for h > 40, how many hours did the worker render?",
      options: ["48 hours", "52 hours", "45 hours", "50 hours"],
      answer: 0,
      explanation:
        "₱4,160 is more than ₱3,200, so rule 2 applies.\n3200 + 120(h − 40) = 4160\n120(h − 40) = 960\nh − 40 = 8\nh = 48 hours.\nCheck: 3200 + 120(8) = ₱4,160. Correct."
    },
    {
      tag: "Overtime Pay",
      question:
        "A worker renders exactly 40 hours. Using W(h) = 80h for 0 ≤ h ≤ 40 and W(h) = 3200 + 120(h − 40) for h > 40, what is the pay?",
      options: ["₱3,200", "₱3,320", "₱3,000", "₱3,120"],
      answer: 0,
      explanation:
        "The condition 0 ≤ h ≤ 40 includes 40, so rule 1 applies.\nW(40) = 80 × 40 = ₱3,200.\nBoth pieces meet at ₱3,200, so the graph has no jump at 40 hours."
    },
    {
      tag: "Overtime Pay",
      question:
        "A worker renders 46 hours in a week. The rule is W(h) = 80h for 0 ≤ h ≤ 40 and W(h) = 3200 + 120(h − 40) for h > 40. What is the weekly pay?",
      options: ["₱3,680", "₱3,920", "₱4,040", "₱3,800"],
      answer: 1,
      explanation:
        "46 > 40, so rule 2 applies.\nOvertime hours = 6.\nW(46) = 3200 + 120(6) = 3200 + 720 = ₱3,920."
    },
    {
      tag: "Overtime Pay",
      question:
        "A worker claims that 45 hours of work should earn ₱3,600, because 80 × 45 = 3,600. Using W(h) = 80h for 0 ≤ h ≤ 40 and W(h) = 3200 + 120(h − 40) for h > 40, what is wrong with this claim, and what is the correct pay?",
      options: [
        "Nothing is wrong; the correct pay is ₱3,600",
        "The 5 overtime hours must be paid at ₱120, not ₱80; the correct pay is ₱3,800",
        "The 5 overtime hours must be paid at ₱160; the correct pay is ₱4,000",
        "Only the 40th hour counts; the correct pay is ₱3,200"
      ],
      answer: 1,
      explanation:
        "Regular pay for the first 40 hours = 80 × 40 = ₱3,200.\nThe 5 extra hours are overtime at ₱120 each = ₱600.\nTotal = 3200 + 120(5) = 3200 + 600 = ₱3,800.\nMultiplying all 45 hours by ₱80 underpays the overtime."
    },

    /* ---- WATER BILL ---- */
    {
      tag: "Water Bill",
      question:
        "A water utility uses four tiers: W(x) = 200 for 0 < x ≤ 10; W(x) = 200 + 30(x − 10) for 10 < x ≤ 20; W(x) = 500 + 40(x − 20) for 20 < x ≤ 30; W(x) = 900 + 35(x − 30) for x > 30. A household uses 8 m³. What is the bill?",
      options: ["₱200", "₱240", "₱160", "₱300"],
      answer: 0,
      explanation:
        "8 m³ is inside the first tier (0 < x ≤ 10), so rule 1 applies.\nW(8) = ₱200.\nThe household pays only the minimum charge."
    },
    {
      tag: "Water Bill",
      question:
        "A household consumes 18 m³ of water. Using W(x) = 200 for 0 < x ≤ 10 and W(x) = 200 + 30(x − 10) for 10 < x ≤ 20, what is the bill?",
      options: ["₱540", "₱440", "₱480", "₱350"],
      answer: 1,
      explanation:
        "18 falls in the second tier (10 < x ≤ 20).\nAmount beyond 10 m³ = 8 m³.\nW(18) = 200 + 30(8) = 200 + 240 = ₱440."
    },
    {
      tag: "Water Bill",
      question:
        "A household uses 26 m³ of water. Using W(x) = 500 + 40(x − 20) for 20 < x ≤ 30, what is the bill?",
      options: ["₱660", "₱740", "₱800", "₱900"],
      answer: 1,
      explanation:
        "26 falls in the third tier (20 < x ≤ 30).\nAmount beyond 20 m³ = 6 m³.\nW(26) = 500 + 40(6) = 500 + 240 = ₱740."
    },
    {
      tag: "Water Bill",
      question:
        "A household consumes 33 m³ of water. Using the top tier W(x) = 900 + 35(x − 30) for x > 30, what is the bill?",
      options: ["₱1,005", "₱1,040", "₱1,155", "₱995"],
      answer: 0,
      explanation:
        "33 > 30, so the fourth tier applies.\nAmount beyond 30 m³ = 3 m³.\nW(33) = 900 + 35(3) = 900 + 105 = ₱1,005."
    },
    {
      tag: "Water Bill",
      question:
        "A household received a water bill of ₱660. Using W(x) = 500 + 40(x − 20) for 20 < x ≤ 30, how much water was consumed?",
      options: ["24 m³", "26 m³", "22 m³", "28 m³"],
      answer: 0,
      explanation:
        "₱660 is more than ₱500 but less than ₱900, so the usage is in the third tier.\n500 + 40(x − 20) = 660\n40(x − 20) = 160\nx − 20 = 4\nx = 24 m³.\nCheck: 500 + 40(4) = ₱660. Correct."
    },
    {
      tag: "Water Bill",
      question:
        "A household consumed 34 m³. Its bill under the top tier is W(34) = 900 + 35(4) = ₱1,040. An environmental tax of 15% is charged ONLY on the amount above 30 m³. What is the total amount payable?",
      options: ["₱1,061", "₱1,196", "₱1,040", "₱1,145"],
      answer: 0,
      explanation:
        "Taxable portion = consumption above 30 m³ = 4 m³.\nCharge on that portion = 35 × 4 = ₱140.\nTax = 0.15 × 140 = ₱21.\nTotal payable = 1,040 + 21 = ₱1,061."
    },
    {
      tag: "Water Bill",
      question:
        "A household uses exactly 20 m³ of water. Using W(x) = 200 + 30(x − 10) for 10 < x ≤ 20, what is the bill?",
      options: ["₱500", "₱440", "₱560", "₱300"],
      answer: 0,
      explanation:
        "The condition 10 < x ≤ 20 includes 20, so the second tier applies.\nW(20) = 200 + 30(10) = 200 + 300 = ₱500.\nThis is also the flat amount built into the third tier, so the bill does not jump at 20 m³."
    },

    /* ---- PARKING ---- */
    {
      tag: "Parking",
      question:
        "A parking garage charges ₱40 for the first 2 hours, then ₱20 for each extra hour or fraction of an hour. Using P(t) = 40 for 0 < t ≤ 2 and P(t) = 40 + 20⌈t − 2⌉ for t > 2, how much does a driver pay for 3.5 hours?",
      options: ["₱80", "₱70", "₱60", "₱100"],
      answer: 0,
      explanation:
        "3.5 > 2, so rule 2 applies.\nt − 2 = 1.5, and ⌈1.5⌉ = 2 (round up to the next whole hour).\nP(3.5) = 40 + 20(2) = 40 + 40 = ₱80."
    },
    {
      tag: "Parking",
      question:
        "A driver parks for 2 hours and 15 minutes. Using P(t) = 40 for 0 < t ≤ 2 and P(t) = 40 + 20⌈t − 2⌉ for t > 2, what is the parking fee?",
      options: ["₱60", "₱40", "₱80", "₱45"],
      answer: 0,
      explanation:
        "2.25 > 2, so rule 2 applies.\nt − 2 = 0.25, and ⌈0.25⌉ = 1.\nEven a 15-minute sliver counts as a full extra hour.\nP(2.25) = 40 + 20(1) = ₱60."
    },
    {
      tag: "Parking",
      question:
        "A driver paid ₱100 for parking. Using P(t) = 40 + 20⌈t − 2⌉ for t > 2, how long was the car parked?",
      options: ["5 hours", "4 hours", "6 hours", "3 hours"],
      answer: 0,
      explanation:
        "40 + 20⌈t − 2⌉ = 100\n20⌈t − 2⌉ = 60\n⌈t − 2⌉ = 3.\nSo 2 < t − 2 ≤ 3, which means 4 < t ≤ 5.\nThe shortest whole-hour answer is t = 5 hours.\nCheck: ⌈5 − 2⌉ = ⌈3⌉ = 3 → 40 + 60 = ₱100. Correct."
    },
    {
      tag: "Parking",
      question:
        "A car is parked for 5.1 hours. Using P(t) = 40 + 20⌈t − 2⌉ for t > 2, what is the fee?",
      options: ["₱120", "₱100", "₱140", "₱160"],
      answer: 0,
      explanation:
        "t − 2 = 3.1, and ⌈3.1⌉ = 4.\nThe garage rounds the 0.1-hour sliver up to a full hour.\nP(5.1) = 40 + 20(4) = 40 + 80 = ₱120."
    },

    /* ---- WARM-UP FUNCTION g(x) ---- */
    {
      tag: "Warm-Up",
      question:
        "Using g(x) = 3x + 1 if x < 0 and g(x) = x² + 3 if x ≥ 0, what is g(−4)?",
      options: ["−11", "19", "−13", "11"],
      answer: 0,
      explanation:
        "−4 < 0, so rule 1 applies.\ng(−4) = 3(−4) + 1 = −12 + 1 = −11.\nThe second rule would give (−4)² + 3 = 19, but it does not apply to negative inputs."
    },
    {
      tag: "Warm-Up",
      question:
        "Using g(x) = 3x + 1 if x < 0 and g(x) = x² + 3 if x ≥ 0, what is g(2)?",
      options: ["7", "5", "9", "1"],
      answer: 0,
      explanation:
        "2 ≥ 0, so rule 2 applies.\ng(2) = 2² + 3 = 4 + 3 = 7.\nThe first rule would give 3(2) + 1 = 7 by coincidence here, but rule 1 is not allowed for x = 2."
    },
    {
      tag: "Warm-Up",
      question:
        "Using g(x) = 3x + 1 if x < 0 and g(x) = x² + 3 if x ≥ 0, what is g(0)?",
      options: ["3", "1", "0", "−1"],
      answer: 0,
      explanation:
        "The condition x ≥ 0 includes 0, so rule 2 applies.\ng(0) = 0² + 3 = 3.\nRule 1 would have given 3(0) + 1 = 1, but rule 1 only covers x < 0."
    },
    {
      tag: "Warm-Up",
      question:
        "Using g(x) = 3x + 1 if x < 0 and g(x) = x² + 3 if x ≥ 0, what is g(−0.5)?",
      options: ["−0.5", "3.25", "−1.5", "0.5"],
      answer: 0,
      explanation:
        "−0.5 < 0, so rule 1 applies.\ng(−0.5) = 3(−0.5) + 1 = −1.5 + 1 = −0.5.\nThis is one of those cases where the output happens to equal the input."
    },
    {
      tag: "Warm-Up",
      question:
        "For g(x) = 3x + 1 if x < 0 and g(x) = x² + 3 if x ≥ 0, which statement about x = 0 is TRUE?",
      options: [
        "g(0) = 3, because the second rule includes x = 0, while the first rule approaches 1 just below 0",
        "g(0) = 1, because the first rule is always used at boundaries",
        "g(0) is undefined, because two rules claim the same point",
        "g(0) = 0, because 0² + 3 − 3 = 0"
      ],
      answer: 0,
      explanation:
        "The boundary x = 0 belongs to the second piece (x ≥ 0), so g(0) = 0² + 3 = 3.\nJust below 0 the first piece gives values approaching 3(0) + 1 = 1.\nBecause 1 ≠ 3, the graph jumps at x = 0 — a classic feature of piecewise functions."
    },

    /* ---- CONCEPT (7 questions) ---- */
    {
      tag: "Concept",
      question: "What is a piecewise function?",
      options: [
        "A function with only one value",
        "A function that uses different rules for different inputs",
        "A function that has no variables",
        "A function that always produces zero"
      ],
      answer: 1,
      explanation:
        "A piecewise function uses different rules depending on the condition or range of the input."
    },
    {
      tag: "Concept",
      question: "Which symbol means 'less than or equal to'?",
      options: ["<", ">", "≤", "≥"],
      answer: 2,
      explanation:
        "The symbol ≤ means less than or equal to."
    },
    {
      tag: "Concept",
      question:
        "What should you do FIRST when solving a piecewise function?",
      options: [
        "Add all the rules",
        "Choose the easiest rule",
        "Read the given input",
        "Graph everything"
      ],
      answer: 2,
      explanation:
        "First identify the input value. Then check which condition applies to that input."
    },
    {
      tag: "Concept",
      question:
        "Why should you check the condition before calculating?",
      options: [
        "Because only one rule applies to the given input",
        "Because multiplication is difficult",
        "Because every rule must be used",
        "Because conditions are optional"
      ],
      answer: 0,
      explanation:
        "A piecewise function assigns different rules to different conditions.\nThe condition tells you which rule to use."
    },
    {
      tag: "Concept",
      question: "Why are piecewise functions useful in real life?",
      options: [
        "Because real-world prices and rules can change at thresholds",
        "Because they eliminate all calculations",
        "Because they always have two answers",
        "Because they only work with money"
      ],
      answer: 0,
      explanation:
        "Piecewise functions model situations where different rules apply to different ranges, such as fares, taxes, parking, and overtime."
    },
    {
      tag: "Concept",
      question:
        "What determines which piece of a piecewise function you use?",
      options: [
        "The color of the formula",
        "The input and its condition",
        "The longest equation",
        "The first equation listed"
      ],
      answer: 1,
      explanation:
        "The input is checked against the conditions.\nThe condition that is true determines the rule."
    },
    {
      tag: "Concept",
      question:
        "If a condition says x ≥ 0, is x = 0 included?",
      options: ["Yes", "No", "Only sometimes", "Only when x is positive"],
      answer: 0,
      explanation:
        "Yes. ≥ means greater than OR equal to, so zero is included."
    }
  ];


  /* Quiz state */
  const qNum = document.getElementById("qNum");
  const streakDisplay = document.getElementById("streak");
  const scoreDisplay = document.getElementById("score");
  const barFill = document.getElementById("barFill");
  const questionCard = document.getElementById("questionCard");
  const qTag = document.getElementById("qTag");
  const qText = document.getElementById("qText");
  const optionsContainer = document.getElementById("options");
  const explain = document.getElementById("explain");
  const explainHead = document.getElementById("explainHead");
  const explainBody = document.getElementById("explainBody");
  const nextWrap = document.getElementById("nextWrap");
  const nextBtn = document.getElementById("nextBtn");
  const quizArea = document.getElementById("quizArea");
  const resultArea = document.getElementById("resultArea");
  const shuffleBtn = document.getElementById("shuffleBtn");

  let quizQuestions = [...questions];
  let currentQuestion = 0;
  let score = 0;
  let streak = 0;
  let answered = false;

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function loadQuestion() {
    if (currentQuestion >= quizQuestions.length) {
      finishQuiz();
      return;
    }

    answered = false;
    const question = quizQuestions[currentQuestion];

    qNum.textContent = currentQuestion + 1;
    streakDisplay.textContent = streak;
    scoreDisplay.textContent = score;
    barFill.style.width = `${(currentQuestion / quizQuestions.length) * 100}%`;

    qTag.textContent = question.tag;
    qText.textContent = question.question;
    optionsContainer.innerHTML = "";

    explain.classList.remove("is-visible", "is-correct", "is-wrong");
    explainHead.textContent = "";
    explainBody.textContent = "";
    nextWrap.classList.remove("is-visible");

    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "opt";
      button.innerHTML = `
        <span class="letter">${String.fromCharCode(65 + index)}</span>
        <span>${option}</span>
      `;
      button.addEventListener("click", () => answerQuestion(index));
      optionsContainer.appendChild(button);
    });

    questionCard.style.animation = "none";
    void questionCard.offsetWidth;
    questionCard.style.animation = "";
  }

  function answerQuestion(selectedIndex) {
    if (answered) return;
    answered = true;

    const question = quizQuestions[currentQuestion];
    const optionButtons = optionsContainer.querySelectorAll(".opt");
    optionButtons.forEach(button => { button.disabled = true; });

    const selectedButton = optionButtons[selectedIndex];
    const correctButton = optionButtons[question.answer];

    if (selectedIndex === question.answer) {
      selectedButton.classList.add("correct");
      score++;
      streak++;
      explain.classList.add("is-visible", "is-correct");
      explainHead.textContent = "Correct!";
      explainBody.textContent = question.explanation;
    } else {
      selectedButton.classList.add("wrong");
      correctButton.classList.add("correct");
      streak = 0;
      explain.classList.add("is-visible", "is-wrong");
      explainHead.textContent = "Not quite.";
      explainBody.textContent =
        `Correct answer: ${question.options[question.answer]}\n\n${question.explanation}`;
    }

    streakDisplay.textContent = streak;
    scoreDisplay.textContent = score;
    nextWrap.classList.add("is-visible");

    nextBtn.textContent =
      currentQuestion === quizQuestions.length - 1
        ? "See results"
        : "Next question";
  }

  nextBtn.addEventListener("click", () => {
    currentQuestion++;
    loadQuestion();
  });

  shuffleBtn.addEventListener("click", () => {
    shuffleBtn.classList.add("is-spinning");
    setTimeout(() => shuffleBtn.classList.remove("is-spinning"), 700);

    quizQuestions = shuffleArray([...questions]);
    currentQuestion = 0;
    score = 0;
    streak = 0;

    quizArea.hidden = false;
    resultArea.hidden = true;
    loadQuestion();
  });

  function finishQuiz() {
    const total = quizQuestions.length;
    const percentage = Math.round((score / total) * 100);
    let message;

    if (percentage >= 90) {
      message = "Excellent work! You have a strong grasp of piecewise functions.";
    } else if (percentage >= 80) {
      message = "Great job! You understand most of the important ideas.";
    } else if (percentage >= 75) {
      message = "Good work! A little more practice will strengthen your skills.";
    } else if (percentage >= 60) {
      message = "Keep practicing. Review the examples and try the quiz again.";
    } else {
      message = "Review the study notes carefully, then try the quiz again.";
    }

    quizArea.hidden = true;
    resultArea.hidden = false;

    resultArea.innerHTML = `
      <article class="card card-violet result-card">
        <h2>Quiz Complete</h2>
        <div class="result-score">${score}/${total}</div>
        <p class="result-msg">${message}</p>
        <p class="result-meta">
          Score: ${percentage}% &middot;
          Correct: ${score} &middot;
          Incorrect: ${total - score}
        </p>
        <div class="result-actions">
          <button class="btn" id="retryQuiz">Try Again</button>
          <button class="btn secondary" id="reviewNotes">Review Notes</button>
        </div>
      </article>
    `;

    barFill.style.width = "100%";
    launchConfetti();

    document.getElementById("retryQuiz").addEventListener("click", resetQuiz);
    document.getElementById("reviewNotes").addEventListener("click", () => {
      const learnTab = document.querySelector('[data-tab="learn"]');
      if (learnTab) learnTab.click();
    });
  }

  function resetQuiz() {
    quizQuestions = shuffleArray([...questions]);
    currentQuestion = 0;
    score = 0;
    streak = 0;
    quizArea.hidden = false;
    resultArea.hidden = true;
    loadQuestion();
  }

  loadQuestion();


  /* Formula sheet */
  const cheatSheet = document.getElementById("cheatSheet");
  const formulas = [
    { title: "Jeepney Fare", formula: "f(x) = 12, if 0 < x ≤ 4\nf(x) = 12 + 1.5(x − 4), if x > 4", note: "₱12 covers the first 4 km. Every kilometre beyond 4 costs ₱1.50." },
    { title: "Mobile Data Plan", formula: "D(g) = 300, if 0 ≤ g ≤ 5\nD(g) = 300 + 50(g − 5), if g > 5", note: "The plan costs ₱300 for up to 5 GB. Extra data costs ₱50 per GB." },
    { title: "Bulk Pencil Purchase", formula: "C(p) = 10p, if 0 < p < 10\nC(p) = 8p, if p ≥ 10", note: "Fewer than 10 pencils cost ₱10 each. Ten or more cost ₱8 each." },
    { title: "Overtime Wage", formula: "W(h) = 80h, if 0 ≤ h ≤ 40\nW(h) = 3200 + 120(h − 40), if h > 40", note: "Regular pay is ₱80/hour. Overtime is ₱120/hour after 40 hours." },
    { title: "Parking", formula: "P(t) = 40, if 0 < t ≤ 2\nP(t) = 40 + 20⌈t − 2⌉, if t > 2", note: "The first 2 hours cost ₱40. Each additional hour or fraction costs ₱20." },
    { title: "Water Bill", formula: "W(x) = 200, if 0 < x ≤ 10\nW(x) = 200 + 30(x − 10), if 10 < x ≤ 20\nW(x) = 500 + 40(x − 20), if 20 < x ≤ 30\nW(x) = 900 + 35(x − 30), if x > 30", note: "The bill increases according to the consumption tier." },
    { title: "Ceiling Function", formula: "⌈3.5⌉ = 4\n⌈2.1⌉ = 3\n⌈2.01⌉ = 3", note: "The ceiling function rounds a number UP to the nearest integer." },
    { title: "Floor Function", formula: "⌊3.9⌋ = 3\n⌊4.99⌋ = 4\n⌊6⌋ = 6", note: "The floor function rounds a number DOWN to the nearest integer." }
  ];

  formulas.forEach(item => {
    const div = document.createElement("article");
    div.className = "cheat-item";
    div.innerHTML = `
      <h4>${item.title}</h4>
      <div class="formula">
        <pre style="margin:0;white-space:pre-wrap;font:inherit;color:inherit;">${item.formula}</pre>
      </div>
      <p>${item.note}</p>
    `;
    cheatSheet.appendChild(div);
  });


  /* Glossary */
  const glossaryList = document.getElementById("glossaryList");
  const glossary = [
    { en: "Piecewise Function", enDef: "A function that uses different rules for different input conditions.", fil: "Punsiyong May Bahagi", filDef: "Isang function na gumagamit ng iba't ibang rule depende sa kondisyon ng input." },
    { en: "Function", enDef: "A relationship that assigns an output to an input.", fil: "Function / Punsiyon", filDef: "Isang relasyon kung saan ang isang input ay may katumbas na output." },
    { en: "Input", enDef: "The value placed into a function.", fil: "Input", filDef: "Ang halagang ipinapasok sa function." },
    { en: "Output", enDef: "The result produced by a function.", fil: "Output", filDef: "Ang sagot o resultang lumalabas mula sa function." },
    { en: "Condition", enDef: "A statement that determines when a particular rule applies.", fil: "Kondisyon", filDef: "Pahayag na nagsasabi kung kailan gagamitin ang isang rule." },
    { en: "Boundary", enDef: "A value where one piece or rule changes into another.", fil: "Hangganan", filDef: "Halagang nagsisilbing transition mula sa isang rule papunta sa isa." },
    { en: "Ceiling Function", enDef: "A function that rounds a number upward to the nearest integer.", fil: "Ceiling Function", filDef: "Function na nagro-round up sa pinakamalapit na whole number." },
    { en: "Floor Function", enDef: "A function that rounds a number downward to the nearest integer.", fil: "Floor Function", filDef: "Function na nagro-round down sa pinakamalapit na whole number." },
    { en: "Overtime", enDef: "Work performed beyond the regular working hours.", fil: "Overtime", filDef: "Trabahong ginagawa lampas sa regular na oras ng trabaho." },
    { en: "Rate", enDef: "The amount charged or earned per unit.", fil: "Rate / Singil", filDef: "Halagang binabayaran o kinikita bawat unit." },
    { en: "Threshold", enDef: "A point at which a rule or rate changes.", fil: "Hangganang Halaga", filDef: "Halagang kapag nalampasan ay maaaring magbago ang rule o rate." },
    { en: "Domain", enDef: "The set of possible input values.", fil: "Domain", filDef: "Set ng lahat ng posibleng input values." },
    { en: "Range", enDef: "The set of possible output values.", fil: "Range", filDef: "Set ng lahat ng posibleng output values." },
    { en: "Variable", enDef: "A symbol representing a value that can change.", fil: "Variable", filDef: "Simbolo na kumakatawan sa isang halagang maaaring magbago." }
  ];

  glossary.forEach(item => {
    const div = document.createElement("article");
    div.className = "gloss-item";
    div.innerHTML = `
      <div class="gloss-en">
        <span class="gloss-label">English</span>
        <div class="gloss-term">${item.en}</div>
        <div class="gloss-def">${item.enDef}</div>
      </div>
      <div class="gloss-fil">
        <span class="gloss-label">Filipino</span>
        <div class="gloss-term">${item.fil}</div>
        <div class="gloss-def">${item.filDef}</div>
      </div>
    `;
    glossaryList.appendChild(div);
  });


  /* Videos */
  const videoList = document.getElementById("videoList");
  const videos = [
    { lang: "EN", title: "Piecewise Functions", channel: "Khan Academy", description: "Introduction to piecewise functions and how different rules apply to different inputs.", url: "https://www.youtube.com/results?search_query=Khan+Academy+piecewise+functions" },
    { lang: "EN", title: "Piecewise Functions", channel: "The Organic Chemistry Tutor", description: "Worked examples showing how to evaluate and understand piecewise functions.", url: "https://www.youtube.com/results?search_query=Organic+Chemistry+Tutor+piecewise+functions" },
    { lang: "EN", title: "Evaluating Piecewise Functions", channel: "Math Tutorials", description: "Practice evaluating functions by identifying which condition applies.", url: "https://www.youtube.com/results?search_query=evaluating+piecewise+functions" },
    { lang: "FIL", title: "Piecewise Function Tagalog", channel: "YouTube Search", description: "Filipino-language search results for piecewise function lessons.", url: "https://www.youtube.com/results?search_query=piecewise+function+Tagalog" },
    { lang: "FIL", title: "Piecewise Function Filipino Tutorial", channel: "YouTube Search", description: "Search results for Filipino explanations and examples of piecewise functions.", url: "https://www.youtube.com/results?search_query=piecewise+function+Filipino+tutorial" }
  ];

  videos.forEach(video => {
    const div = document.createElement("article");
    div.className = "video-item";
    div.innerHTML = `
      <div class="video-thumb" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
      </div>
      <div class="video-body">
        <span class="video-lang ${video.lang === "EN" ? "en" : "fil"}">
          ${video.lang === "EN" ? "English" : "Filipino"}
        </span>
        <div class="video-title">${video.title}</div>
        <div class="video-channel">${video.channel}</div>
        <div class="video-desc">${video.description}</div>
        <a class="video-link" href="${video.url}" target="_blank" rel="noopener noreferrer">
          Watch on YouTube
          <svg viewBox="0 0 24 24">
            <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.59 5H14V3z"></path>
            <path d="M5 5h5v2H7v10h10v-3h2v5H5V5z"></path>
          </svg>
        </a>
      </div>
    `;
    videoList.appendChild(div);
  });


  /* Sound toggle */
  const muteBtn = document.getElementById("muteBtn");
  let soundOn = true;
  muteBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    muteBtn.textContent = soundOn ? "Sound: on" : "Sound: off";
  });


  /* Confetti */
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  let confettiPieces = [];
  let confettiAnimation = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function launchConfetti() {
    confettiPieces = [];
    for (let i = 0; i < 120; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.4,
        width: 6 + Math.random() * 7,
        height: 8 + Math.random() * 10,
        speedY: 2 + Math.random() * 4,
        speedX: -2 + Math.random() * 4,
        rotation: Math.random() * Math.PI,
        rotationSpeed: -0.08 + Math.random() * 0.16
      });
    }
    if (confettiAnimation) cancelAnimationFrame(confettiAnimation);
    animateConfetti();
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    const colors = ["#2563eb", "#0ea5e9", "#4f46e5", "#06b6d4", "#1e3a8a", "#334155"];

    confettiPieces.forEach(piece => {
      piece.y += piece.speedY;
      piece.x += piece.speedX;
      piece.rotation += piece.rotationSpeed;
      if (piece.y < canvas.height + 30) active = true;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
      ctx.restore();
    });

    if (active) {
      confettiAnimation = requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

});
