document.addEventListener("DOMContentLoaded", function () {

  /* ============ TABS ============ */
  var tabs = document.querySelectorAll(".tab");
  var panels = document.querySelectorAll(".panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-tab");
      tabs.forEach(function (t) { t.classList.remove("is-active"); });
      panels.forEach(function (p) { p.classList.remove("is-active"); });
      tab.classList.add("is-active");
      var targetPanel = document.getElementById(target);
      if (targetPanel) targetPanel.classList.add("is-active");
      document.querySelectorAll(".deck").forEach(function (d) {
        requestAnimationFrame(function () { updateDeckHeight(d); });
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });


  /* ============ READING PROGRESS ============ */
  var readingProgress = document.getElementById("readingProgress");

  function updateReadingProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) { readingProgress.style.width = "0%"; return; }
    var p = (scrollTop / docHeight) * 100;
    readingProgress.style.width = Math.min(100, Math.max(0, p)) + "%";
  }
  window.addEventListener("scroll", updateReadingProgress);
  updateReadingProgress();


  /* ============ DECK SETUP ============ */
  function updateDeckHeight(deckEl) {
    var stage = deckEl.querySelector(".deck-stage");
    var active = deckEl.querySelector(".slide.is-active");
    if (!stage || !active) return;
    var h = active.offsetHeight;
    if (h > 0) stage.style.height = h + "px";
  }

  function setupDeck(deckEl) {
    var slides = Array.prototype.slice.call(deckEl.querySelectorAll(".slide"));
    var slideNum = deckEl.querySelector(".slide-num");
    var slideTotal = deckEl.querySelector(".slide-total");
    var dotsWrap = deckEl.querySelector(".deck-dots");
    var prevBtn = deckEl.querySelector(".deck-prev");
    var nextBtn = deckEl.querySelector(".deck-next");
    var stage = deckEl.querySelector(".deck-stage");
    if (!slides.length || !stage) return;

    var current = 0;
    if (slideTotal) slideTotal.textContent = slides.length;

    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach(function (s, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "deck-dot";
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        dot.addEventListener("click", function () { showSlide(i); });
        dotsWrap.appendChild(dot);
      });
    }

    function showSlide(index) {
      if (index < 0) index = 0;
      if (index >= slides.length) index = slides.length - 1;
      current = index;

      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === current); });
      if (slideNum) slideNum.textContent = current + 1;

      if (dotsWrap) {
        Array.prototype.slice.call(dotsWrap.children).forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === current);
          dot.classList.toggle("is-done", i < current);
        });
      }

      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current === slides.length - 1;

      requestAnimationFrame(function () { updateDeckHeight(deckEl); });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { showSlide(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { showSlide(current + 1); });

    var touchStartX = 0, touchStartY = 0;
    stage.addEventListener("touchstart", function (e) {
      var t = e.changedTouches[0];
      touchStartX = t.screenX;
      touchStartY = t.screenY;
    }, { passive: true });

    stage.addEventListener("touchend", function (e) {
      var t = e.changedTouches[0];
      var dx = t.screenX - touchStartX;
      var dy = t.screenY - touchStartY;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) showSlide(current + 1);
        else showSlide(current - 1);
      }
    }, { passive: true });

    deckEl._getCurrent = function () { return current; };
    deckEl._showSlide = showSlide;
    showSlide(0);
  }

  var decks = Array.prototype.slice.call(document.querySelectorAll(".deck"));
  decks.forEach(setupDeck);

  document.addEventListener("keydown", function (event) {
    var visiblePanel = document.querySelector(".panel.is-active");
    if (!visiblePanel) return;
    var deck = visiblePanel.querySelector(".deck");
    if (!deck || !deck._showSlide) return;
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (event.key === "ArrowRight") deck._showSlide(deck._getCurrent() + 1);
    if (event.key === "ArrowLeft") deck._showSlide(deck._getCurrent() - 1);
  });

  window.addEventListener("resize", function () { decks.forEach(updateDeckHeight); });
  window.addEventListener("load", function () { decks.forEach(updateDeckHeight); });
  requestAnimationFrame(function () { decks.forEach(updateDeckHeight); });


  /* ============ JEEPNEY SLIDER ============ */
  var kmSlider = document.getElementById("kmSlider");
  var kmVal = document.getElementById("kmVal");
  var fareVal = document.getElementById("fareVal");
  var ruleUsed = document.getElementById("ruleUsed");

  function updateFare() {
    if (!kmSlider) return;
    var distance = Number(kmSlider.value);
    var fare, ruleText;
    if (distance <= 5) {
      fare = 13;
      ruleText = "Case 1 applies: flat ₱13 for the first 5 km.";
    } else {
      fare = 13 + 1 * (distance - 5);
      ruleText = "Case 2 applies: ₱13 + ₱1 for every km beyond 5.";
    }
    kmVal.textContent = distance;
    fareVal.textContent = "₱" + fare.toFixed(2);
    ruleUsed.textContent = ruleText;
    fareVal.classList.remove("is-pulsing");
    void fareVal.offsetWidth;
    fareVal.classList.add("is-pulsing");
  }
  if (kmSlider) {
    kmSlider.addEventListener("input", updateFare);
    updateFare();
  }


  /* ============ QUIZ QUESTIONS (75) ============ */
  var questions = [

    /* ---------- CONCEPT (5) ---------- */
    {
      tag: "Concept",
      question: "Why can a single linear equation like y = 2x not describe a jeepney fare for every possible distance?",
      options: [
        "Because linear equations are too difficult to apply in real life",
        "Because the fare follows two different rules — a flat rate for the first 5 km, then an increasing rate beyond 5 km",
        "Because jeepney drivers set their own pricing",
        "Because y = 2x does not pass through the origin"
      ],
      answer: 1,
      explanation: "A single linear equation expresses only one rate. A jeepney fare needs two rates — one for the first 5 km and another beyond — so a piecewise function is used instead."
    },
    {
      tag: "Concept",
      question: "Which of the following best describes a piecewise function?",
      options: [
        "A function with only one rule that applies to every input",
        "A single function made of multiple sub-functions, where each sub-function applies to a specific interval of the input",
        "A function whose graph is always a straight line",
        "A function whose input is always a whole number"
      ],
      answer: 1,
      explanation: "A piecewise function is one function defined by multiple sub-functions (sub-rules), each covering a specific interval or domain."
    },
    {
      tag: "Concept",
      question: "In the rule f(x) = 13 for 0 < x ≤ 5, what does the value 13 represent?",
      options: [
        "The number of kilometres the jeepney travels",
        "The flat minimum fare charged for any trip of 5 km or less",
        "The speed of the jeepney in kilometres per hour",
        "The number of passengers inside the jeepney"
      ],
      answer: 1,
      explanation: "13 pesos is the minimum fare. The driver charges a flat 13 pesos for the first 5 kilometres, no matter how short the trip is."
    },
    {
      tag: "Concept",
      question: "The rule f(x) = 13 + 1(x − 5) can be simplified to f(x) = x + 8 for x > 5. Where does the 8 come from?",
      options: [
        "It is a random number assigned to the formula",
        "It is the result of combining 13 and −5, since 13 + (x − 5) = x + 8",
        "It is the number of kilometres beyond 5",
        "It is the number of stops between terminals"
      ],
      answer: 1,
      explanation: "Distributing and combining like terms: 13 + 1(x − 5) = 13 + x − 5 = x + 8. The 8 is the constant that remains after combining 13 and −5."
    },
    {
      tag: "Concept",
      question: "What makes a piecewise function more practical than a single-rule function for describing real-world pricing?",
      options: [
        "Piecewise functions look more complicated",
        "Real-world prices change at specific thresholds, and a piecewise function describes each pricing rule separately",
        "Single-rule functions cannot be graphed",
        "Piecewise functions do not require any calculations"
      ],
      answer: 1,
      explanation: "Real pricing systems — jeepney fares, print shops, parking, and internet plans — all change their rate at specific cut-off points. A piecewise function captures each rule as its own sub-function."
    },

    /* ---------- WARM-UP FUNCTION (5) ---------- */
    {
      tag: "Warm-Up",
      question: "Given f(x) = 2x + 1 if x < 0 and f(x) = x² + 3 if x ≥ 0, find f(2).",
      options: ["7", "5", "4", "1"],
      answer: 0,
      explanation: "Since 2 ≥ 0, use the second rule: f(x) = x² + 3.\nf(2) = 2² + 3 = 4 + 3 = 7."
    },
    {
      tag: "Warm-Up",
      question: "Given f(x) = 2x + 1 if x < 0 and f(x) = x² + 3 if x ≥ 0, find f(−5).",
      options: ["−9", "28", "−11", "9"],
      answer: 0,
      explanation: "Since −5 < 0, use the first rule: f(x) = 2x + 1.\nf(−5) = 2(−5) + 1 = −10 + 1 = −9."
    },
    {
      tag: "Warm-Up",
      question: "Given f(x) = 2x + 1 if x < 0 and f(x) = x² + 3 if x ≥ 0, find f(−1).",
      options: ["−1", "4", "−3", "1"],
      answer: 0,
      explanation: "Since −1 < 0, use the first rule: f(x) = 2x + 1.\nf(−1) = 2(−1) + 1 = −2 + 1 = −1."
    },
    {
      tag: "Warm-Up",
      question: "Given f(x) = 2x + 1 if x < 0 and f(x) = x² + 3 if x ≥ 0, find f(0).",
      options: ["3", "1", "0", "5"],
      answer: 0,
      explanation: "The condition x ≥ 0 includes 0, so use the second rule: f(x) = x² + 3.\nf(0) = 0² + 3 = 3."
    },
    {
      tag: "Warm-Up",
      question: "Given f(x) = 2x + 1 if x < 0 and f(x) = x² + 3 if x ≥ 0, find f(−3).",
      options: ["−5", "12", "−6", "6"],
      answer: 0,
      explanation: "Since −3 < 0, use the first rule: f(x) = 2x + 1.\nf(−3) = 2(−3) + 1 = −6 + 1 = −5."
    },

    /* ---------- JEEPNEY FARE (6) ---------- */
    {
      tag: "Jeepney Fare",
      question: "A student rides a jeepney 12 km to school. The fare is ₱13 for the first 5 km, then ₱1 for each additional kilometre. Using f(x) = 13 for 0 < x ≤ 5 and f(x) = x + 8 for x > 5, how much does the student pay?",
      options: ["₱20", "₱17", "₱25", "₱13"],
      answer: 0,
      explanation: "Since 12 > 5, use the second rule.\nf(12) = 12 + 8 = ₱20."
    },
    {
      tag: "Jeepney Fare",
      question: "A passenger rides a jeepney 3 km from home to the barangay hall. The fare is ₱13 for the first 5 km, then ₱1 per extra km. Using f(x) = 13 for 0 < x ≤ 5 and f(x) = x + 8 for x > 5, how much is the fare?",
      options: ["₱13", "₱16", "₱11", "₱8"],
      answer: 0,
      explanation: "Since 3 ≤ 5, use the first rule.\nf(3) = ₱13. The passenger pays only the minimum fare."
    },
    {
      tag: "Jeepney Fare",
      question: "A passenger rides exactly 5 km. Using f(x) = 13 for 0 < x ≤ 5 and f(x) = x + 8 for x > 5, how much is the fare?",
      options: ["₱13", "₱18", "₱8", "₱5"],
      answer: 0,
      explanation: "The symbol ≤ includes 5, so the first rule applies.\nf(5) = ₱13. The extra charge only begins after 5 km."
    },
    {
      tag: "Jeepney Fare",
      question: "A passenger rides 7 km from the market to the terminal. Using f(x) = 13 for 0 < x ≤ 5 and f(x) = x + 8 for x > 5, how much is the fare?",
      options: ["₱15", "₱13", "₱20", "₱11"],
      answer: 0,
      explanation: "Since 7 > 5, use the second rule.\nf(7) = 7 + 8 = ₱15."
    },
    {
      tag: "Jeepney Fare",
      question: "A passenger rides 10 km. Using f(x) = 13 for 0 < x ≤ 5 and f(x) = x + 8 for x > 5, how much is the fare?",
      options: ["₱18", "₱23", "₱13", "₱8"],
      answer: 0,
      explanation: "Since 10 > 5, use the second rule.\nf(10) = 10 + 8 = ₱18."
    },
    {
      tag: "Jeepney Fare",
      question: "A passenger paid exactly ₱20 to the driver. Using f(x) = x + 8 for x > 5, how many kilometres did the passenger travel?",
      options: ["12 km", "20 km", "8 km", "13 km"],
      answer: 0,
      explanation: "Set up the equation: x + 8 = 20.\nSubtract 8 from both sides: x = 12 km."
    },

    /* ---------- BULK BUY (6) ---------- */
    {
      tag: "Bulk Buy",
      question: "A student prints a 25-page project. The shop charges ₱5 per page for up to 50 pages, then ₱3 per extra page beyond 50 (with a ₱250 base for the first 50 pages). Using C(p) = 5p for 0 < p ≤ 50 and C(p) = 250 + 3(p − 50) for p > 50, how much is the total cost?",
      options: ["₱125", "₱75", "₱250", "₱100"],
      answer: 0,
      explanation: "Since 25 ≤ 50, use the first rule.\nC(25) = 5 × 25 = ₱125."
    },
    {
      tag: "Bulk Buy",
      question: "A teacher prints exactly 50 pages of modules. Using C(p) = 5p for 0 < p ≤ 50 and C(p) = 250 + 3(p − 50) for p > 50, how much does she pay?",
      options: ["₱250", "₱150", "₱300", "₱500"],
      answer: 0,
      explanation: "The condition 0 < p ≤ 50 includes exactly 50.\nC(50) = 5 × 50 = ₱250, which matches the base amount in the second rule."
    },
    {
      tag: "Bulk Buy",
      question: "A student council prints 60 pages of programs. Using C(p) = 5p for 0 < p ≤ 50 and C(p) = 250 + 3(p − 50) for p > 50, how much do they pay?",
      options: ["₱280", "₱300", "₱250", "₱180"],
      answer: 0,
      explanation: "Since 60 > 50, use the second rule.\nC(60) = 250 + 3(60 − 50) = 250 + 3(10) = 250 + 30 = ₱280."
    },
    {
      tag: "Bulk Buy",
      question: "A researcher prints 100 pages of a thesis draft. Using C(p) = 5p for 0 < p ≤ 50 and C(p) = 250 + 3(p − 50) for p > 50, how much is the total cost?",
      options: ["₱400", "₱500", "₱300", "₱350"],
      answer: 0,
      explanation: "Since 100 > 50, use the second rule.\nC(100) = 250 + 3(100 − 50) = 250 + 3(50) = 250 + 150 = ₱400."
    },
    {
      tag: "Bulk Buy",
      question: "A student prints 40 pages of handouts. Using C(p) = 5p for 0 < p ≤ 50 and C(p) = 250 + 3(p − 50) for p > 50, how much does the student pay?",
      options: ["₱200", "₱120", "₱250", "₱220"],
      answer: 0,
      explanation: "Since 40 ≤ 50, use the first rule.\nC(40) = 5 × 40 = ₱200."
    },
    {
      tag: "Bulk Buy",
      question: "A customer paid exactly ₱400 to the print shop. Using C(p) = 250 + 3(p − 50) for p > 50, how many pages were printed?",
      options: ["100 pages", "80 pages", "50 pages", "60 pages"],
      answer: 0,
      explanation: "Set up the equation:\n250 + 3(p − 50) = 400\n3(p − 50) = 150\np − 50 = 50\np = 100 pages."
    },

    /* ---------- MALL PARKING (5) ---------- */
    {
      tag: "Parking",
      question: "A shopper parks at the mall for 1.5 hours. The garage charges ₱40 for the first 2 hours, then ₱15 for each extra hour or fraction of an hour. Using P(h) = 40 for 0 < h ≤ 2 and P(h) = 40 + 15⌈h − 2⌉ for h > 2, how much is the fee?",
      options: ["₱40", "₱55", "₱25", "₱30"],
      answer: 0,
      explanation: "Since 1.5 ≤ 2, use the first rule.\nP(1.5) = ₱40."
    },
    {
      tag: "Parking",
      question: "A moviegoer parks for 5 hours. Using P(h) = 40 for 0 < h ≤ 2 and P(h) = 40 + 15⌈h − 2⌉ for h > 2, how much is the parking fee?",
      options: ["₱85", "₱100", "₱70", "₱55"],
      answer: 0,
      explanation: "Since 5 > 2, use the second rule.\n⌈5 − 2⌉ = ⌈3⌉ = 3.\nP(5) = 40 + 15(3) = 40 + 45 = ₱85."
    },
    {
      tag: "Parking",
      question: "A driver parks for exactly 2 hours. Using P(h) = 40 for 0 < h ≤ 2 and P(h) = 40 + 15⌈h − 2⌉ for h > 2, how much is the fee?",
      options: ["₱40", "₱55", "₱15", "₱60"],
      answer: 0,
      explanation: "The condition 0 < h ≤ 2 includes exactly 2.\nP(2) = ₱40. The extra charge begins only after 2 hours."
    },
    {
      tag: "Parking",
      question: "A driver parks for 3.5 hours. Using P(h) = 40 for 0 < h ≤ 2 and P(h) = 40 + 15⌈h − 2⌉ for h > 2, how much is the fee?",
      options: ["₱70", "₱55", "₱85", "₱40"],
      answer: 0,
      explanation: "Since 3.5 > 2, use the second rule.\n⌈3.5 − 2⌉ = ⌈1.5⌉ = 2.\nP(3.5) = 40 + 15(2) = 40 + 30 = ₱70."
    },
    {
      tag: "Parking",
      question: "Why do parking garages use the ceiling function rather than a simple subtraction?",
      options: [
        "Because any fraction of an extra hour is charged as a full extra hour",
        "Because the ceiling function makes the price cheaper",
        "Because fractions of an hour are ignored in parking",
        "Because whole hours cannot be computed"
      ],
      answer: 0,
      explanation: "The phrase 'or fraction of an hour' means that even a few minutes into an extra hour is charged as a full hour. The ceiling function rounds the fraction up."
    },

    /* ---------- INTERNET PLAN (5) ---------- */
    {
      tag: "Internet Plan",
      question: "A household uses 75 GB of data in one month. The plan costs ₱999 per month for up to 100 GB, then ₱10 per extra GB. Using C(g) = 999 for 0 ≤ g ≤ 100 and C(g) = 999 + 10(g − 100) for g > 100, what is the monthly bill?",
      options: ["₱999", "₱1,000", "₱750", "₱1,200"],
      answer: 0,
      explanation: "Since 75 ≤ 100, use the first rule.\nC(75) = ₱999."
    },
    {
      tag: "Internet Plan",
      question: "A household uses 130 GB of data. Using C(g) = 999 for 0 ≤ g ≤ 100 and C(g) = 999 + 10(g − 100) for g > 100, what is the bill?",
      options: ["₱1,299", "₱1,300", "₱999", "₱1,030"],
      answer: 0,
      explanation: "Since 130 > 100, use the second rule.\nC(130) = 999 + 10(130 − 100) = 999 + 10(30) = 999 + 300 = ₱1,299."
    },
    {
      tag: "Internet Plan",
      question: "A household uses exactly 100 GB. Using C(g) = 999 for 0 ≤ g ≤ 100 and C(g) = 999 + 10(g − 100) for g > 100, what is the bill?",
      options: ["₱999", "₱1,009", "₱1,099", "₱100"],
      answer: 0,
      explanation: "The condition 0 ≤ g ≤ 100 includes exactly 100.\nC(100) = ₱999. The overage charge begins only beyond 100 GB."
    },
    {
      tag: "Internet Plan",
      question: "A household uses 150 GB. Using C(g) = 999 for 0 ≤ g ≤ 100 and C(g) = 999 + 10(g − 100) for g > 100, what is the bill?",
      options: ["₱1,499", "₱1,500", "₱1,050", "₱1,999"],
      answer: 0,
      explanation: "Since 150 > 100, use the second rule.\nC(150) = 999 + 10(50) = 999 + 500 = ₱1,499."
    },
    {
      tag: "Internet Plan",
      question: "A subscriber received a bill of ₱1,199 for the month. Using C(g) = 999 + 10(g − 100) for g > 100, how many GB were used?",
      options: ["120 GB", "119 GB", "100 GB", "99 GB"],
      answer: 0,
      explanation: "Since the bill is more than ₱999, the second rule applies.\n999 + 10(g − 100) = 1199\n10(g − 100) = 200\ng − 100 = 20\ng = 120 GB."
    },

    /* ---------- DATA TYPES (7) ---------- */
    {
      tag: "Data Types",
      question: "Blood type and favourite colour both describe attributes of a person rather than measurable quantities. What type of data do they represent?",
      options: [
        "Quantitative data",
        "Qualitative (categorical) data",
        "Continuous data",
        "Interval data"
      ],
      answer: 1,
      explanation: "Qualitative data describes attributes or categories. Blood type and favourite colour are labels, not numbers."
    },
    {
      tag: "Data Types",
      question: "A card reads 'Number of siblings = 3'. What type of data does this represent?",
      options: [
        "Qualitative data",
        "Quantitative, discrete — because it is a countable whole number",
        "Quantitative, continuous — because it can grow over time",
        "Nominal data"
      ],
      answer: 1,
      explanation: "The number of siblings is a count. Counts are discrete because they take only whole-number values."
    },
    {
      tag: "Data Types",
      question: "Two cards read 'Height = 165.2 cm' and 'Temperature = 28.5°C'. Why are both classified as continuous data?",
      options: [
        "Because they use decimals",
        "Because they are measurable values that can take any value within a range",
        "Because they can only be whole numbers",
        "Because they are categories"
      ],
      answer: 1,
      explanation: "Continuous data is measurable and can take any value within a range. Both height and temperature fit this description."
    },
    {
      tag: "Data Types",
      question: "Which of the following cards belongs to the category corner rather than the count corner?",
      options: [
        "Number of pets: 3",
        "Number of books: 15",
        "Favourite food: Adobo",
        "Number of siblings: 4"
      ],
      answer: 2,
      explanation: "Favourite food is a category, not a count. It is nominal data, so it belongs in the category group."
    },
    {
      tag: "Data Types",
      question: "Which of these cards represents a continuous measurement?",
      options: [
        "Number of school clubs: 3",
        "Height: 158 cm",
        "Blood type: A+",
        "Strand: HUMSS"
      ],
      answer: 1,
      explanation: "Height is a measurable value that can take any value within a range, so it is continuous. The others are a count, a category, and a category respectively."
    },
    {
      tag: "Data Types",
      question: "Satisfaction ratings of Very Satisfied, Satisfied, Neutral, and Dissatisfied belong to the rank group rather than the category group. Why?",
      options: [
        "Because satisfaction has no order",
        "Because satisfaction levels can be ranked from lowest to highest — Very Dissatisfied up to Very Satisfied",
        "Because satisfaction is a number",
        "Because satisfaction cannot be measured"
      ],
      answer: 1,
      explanation: "The rank group holds ordinal data — categories with a natural order. Satisfaction levels have that natural order."
    },
    {
      tag: "Data Types",
      question: "Why can heights be averaged but blood types cannot?",
      options: [
        "Because blood types are rare and heights are common",
        "Because heights are quantitative values that can be added, while blood types are categories that can only be counted",
        "Because blood types are harder to measure",
        "Because heights only appear in hospitals"
      ],
      answer: 1,
      explanation: "Only quantitative data can be averaged. Qualitative data such as blood type can only be counted and compared by frequency."
    },

    /* ---------- LEVELS OF MEASUREMENT (7) ---------- */
    {
      tag: "Data Levels",
      question: "What do the four letters of the NOIR framework stand for?",
      options: [
        "Number, Order, Integer, Rate",
        "Nominal, Ordinal, Interval, Ratio",
        "Natural, Objective, Integral, Real",
        "None, One, Interval, Ratio"
      ],
      answer: 1,
      explanation: "NOIR stands for Nominal, Ordinal, Interval, Ratio — arranged from least to most informative."
    },
    {
      tag: "Data Levels",
      question: "Blood type (A, B, AB, O) is a category with no natural order. Which level of measurement does it belong to?",
      options: ["Nominal", "Ordinal", "Interval", "Ratio"],
      answer: 0,
      explanation: "Nominal data are names or categories with no natural order. Blood type is a classic example."
    },
    {
      tag: "Data Levels",
      question: "Contest placement (1st, 2nd, 3rd) can be ranked. Which level of measurement applies?",
      options: ["Nominal", "Ordinal", "Interval", "Ratio"],
      answer: 1,
      explanation: "Ordinal data has a natural order. Ranks can be ordered, but the gap between ranks is not necessarily equal."
    },
    {
      tag: "Data Levels",
      question: "Temperature in Celsius is classified as which level of measurement, and why?",
      options: [
        "Nominal, because Celsius is just a name",
        "Interval, because it has equal intervals between values but no true zero — 0°C does not mean 'no temperature'",
        "Ratio, because 0°C means no heat",
        "Ordinal, because temperatures can be ranked"
      ],
      answer: 1,
      explanation: "Interval data has equal intervals between values but no true zero. 0°C is simply the freezing point of water, not the absence of temperature."
    },
    {
      tag: "Data Levels",
      question: "Height and monthly income are classified as which level of measurement, and what distinguishes this level from interval?",
      options: [
        "Nominal — because they are just labels",
        "Ordinal — because they can be ranked",
        "Ratio — because they have a true zero, so ratios between values are meaningful",
        "Interval — because they have equal intervals"
      ],
      answer: 2,
      explanation: "Ratio data has a true zero. This allows statements like '₱40,000 is twice ₱20,000' to be meaningful."
    },
    {
      tag: "Data Levels",
      question: "A barangay health center collects the 'Household ID number' of each family. Which level of measurement applies?",
      options: [
        "Nominal, because an ID number is just a label and adding two IDs has no meaning",
        "Ordinal, because higher ID numbers are 'later' than lower ones",
        "Interval, because the digits have equal spacing",
        "Ratio, because ID numbers can be compared"
      ],
      answer: 0,
      explanation: "ID numbers look like numbers, but they are labels without numerical meaning. Adding or averaging them produces nothing useful."
    },
    {
      tag: "Data Levels",
      question: "Nutritional status classifications (Severely Underweight, Underweight, Normal, Overweight) belong to which level of measurement?",
      options: [
        "Nominal, because they are categories",
        "Ordinal, because there is a natural order from severely underweight to overweight",
        "Interval, because the gaps between categories are equal",
        "Ratio, because there is a true zero"
      ],
      answer: 1,
      explanation: "There is a natural progression from severely underweight to overweight, so the data is ordinal. The gaps between categories are not necessarily equal."
    },

    /* ---------- DATA CARDS SORTING (7) ---------- */
    {
      tag: "Data Cards",
      question: "A student receives the card 'Livelihood type: Farming' and must place it in one of four corners: Category, Count, Rank, or Scale. Which corner is correct?",
      options: [
        "Category, because livelihood is a label with no natural order",
        "Count, because livelihood can be counted",
        "Rank, because some livelihoods are better than others",
        "Scale, because farming uses measurements"
      ],
      answer: 0,
      explanation: "Livelihood is nominal data — a label with no natural order. It belongs in the Category corner."
    },
    {
      tag: "Data Cards",
      question: "A student receives 'Captain rating: 4.5 / 5'. Which corner is correct?",
      options: [
        "Category, because a rating is just a label",
        "Rank, because a rating has a natural order (higher is better)",
        "Count, because 4.5 is a number",
        "Scale, because 4.5 is a measurement"
      ],
      answer: 1,
      explanation: "Ratings have a natural order, so they are ordinal. They belong in the Rank corner."
    },
    {
      tag: "Data Cards",
      question: "A student receives 'Number of siblings: 4'. Which corner is correct?",
      options: [
        "Category, because siblings are people",
        "Rank, because siblings can be ranked by age",
        "Count, because the number of siblings is a countable whole number",
        "Scale, because siblings can be measured"
      ],
      answer: 2,
      explanation: "The number of siblings is a count — discrete data. It belongs in the Count corner."
    },
    {
      tag: "Data Cards",
      question: "A student receives 'Temperature: 28°C'. Which corner is correct?",
      options: [
        "Category, because Celsius is just a name",
        "Rank, because temperatures can be ranked",
        "Count, because 28 is a whole number",
        "Scale, because temperature is a continuous measurement"
      ],
      answer: 3,
      explanation: "Temperature is continuous. It belongs in the Scale corner."
    },
    {
      tag: "Data Cards",
      question: "A student receives 'Blood type: O+'. Which corner is correct, and why?",
      options: [
        "Category, because blood type is a category with no natural order",
        "Rank, because blood types can be ranked by rarity",
        "Count, because you can count how many people have each blood type",
        "Scale, because blood can be measured"
      ],
      answer: 0,
      explanation: "Blood type is nominal — a category with no natural order. It belongs in the Category corner."
    },
    {
      tag: "Data Cards",
      question: "A student receives 'Monthly income: ₱15,000'. Which corner is correct, and why?",
      options: [
        "Category, because income is a label",
        "Rank, because incomes can be ranked",
        "Count, because you can count pesos",
        "Scale, because monthly income is measurable and has a true zero"
      ],
      answer: 3,
      explanation: "Monthly income is a ratio variable with a true zero, so it belongs on the Scale."
    },
    {
      tag: "Data Cards",
      question: "A student receives 'Zip code: 4000'. Which corner is correct?",
      options: [
        "Category, because a zip code is a label, not a count or a measurement",
        "Rank, because higher zip codes are 'later' than lower ones",
        "Count, because 4000 is a number",
        "Scale, because 4000 is a measurement"
      ],
      answer: 0,
      explanation: "Zip codes look like numbers, but they are labels. Adding or averaging two zip codes has no meaning, so they belong in the Category corner."
    },

    /* ---------- HEALTH METRICS (5) ---------- */
    {
      tag: "Health Metrics",
      question: "A barangay health center collects 'Household ID number' from each family. What is the data type and level of measurement?",
      options: [
        "Quantitative, ratio — because ID numbers look like numbers",
        "Qualitative, nominal — because an ID number is a label with no numerical meaning",
        "Qualitative, ordinal — because households can be ranked by ID",
        "Quantitative, interval — because ID numbers have equal spacing"
      ],
      answer: 1,
      explanation: "ID numbers are labels. Even though they look like numbers, adding or averaging them is meaningless."
    },
    {
      tag: "Health Metrics",
      question: "A health survey records 'Nutritional status: Severely Underweight, Underweight, Normal, Overweight'. What level of measurement applies, and why?",
      options: [
        "Nominal — because these are just labels",
        "Ordinal — because there is a natural order from severely underweight to overweight, but the gaps between categories are not equal",
        "Interval — because the categories are equally spaced",
        "Ratio — because there is a true zero"
      ],
      answer: 1,
      explanation: "There is a natural progression in nutritional status, so it is ordinal. The gap between Underweight and Normal is not necessarily equal to the gap between Normal and Overweight."
    },
    {
      tag: "Health Metrics",
      question: "A health survey records 'Exact weight of each child in kilograms'. What is the data type and level?",
      options: [
        "Qualitative, nominal — because weight is just a label",
        "Quantitative, ratio, continuous — because weight is measurable, has a true zero, and can take any value within a range",
        "Qualitative, ordinal — because weights can be ranked",
        "Quantitative, interval — because weight has no true zero"
      ],
      answer: 1,
      explanation: "Weight is measurable with a true zero (0 kg means no weight) and can take any value within a range. So it is quantitative, ratio, and continuous."
    },
    {
      tag: "Health Metrics",
      question: "A health survey records 'Body temperature in Celsius'. Which level of measurement applies?",
      options: [
        "Nominal — because Celsius is just a name",
        "Ordinal — because temperatures can be ranked",
        "Interval — because temperature has equal intervals between values but no true zero",
        "Ratio — because 0°C means no heat"
      ],
      answer: 2,
      explanation: "Temperature has equal intervals but no true zero. 0°C is the freezing point of water, not the absence of temperature."
    },
    {
      tag: "Health Metrics",
      question: "A health survey records 'Daily vegetable intake in number of servings'. What level of measurement applies, and is it discrete or continuous?",
      options: [
        "Nominal, continuous",
        "Ordinal, continuous",
        "Ratio, discrete — because servings are counted in whole numbers and 0 servings means none",
        "Interval, discrete — because servings are equally spaced"
      ],
      answer: 2,
      explanation: "Servings are counted in whole numbers (0, 1, 2, 3 ...), and 0 servings means no vegetables at all. The data is ratio and discrete."
    },

    /* ---------- DATA STORY / ROUTES & SECTIONS (5) ---------- */
    {
      tag: "Data Story",
      question: "Route A travel times: 20, 21, 22, 23, 24 minutes. Route B travel times: 15, 18, 20, 28, 34 minutes. Which route has more consistent travel time, and why?",
      options: [
        "Route A, because its travel times are much closer together, giving a smaller standard deviation",
        "Route B, because it has a faster minimum time (15 minutes)",
        "Both are equally consistent",
        "Neither is consistent because they are routes"
      ],
      answer: 0,
      explanation: "Route A's values range from 20 to 24 — a spread of only 4 minutes. Route B's values range from 15 to 34 — a spread of 19 minutes. Route A is far more consistent."
    },
    {
      tag: "Data Story",
      question: "Section A test scores: 40, 41, 40, 39, 40, 41, 39, 40, 40, 40. What is the mean score?",
      options: ["39", "40", "41", "42"],
      answer: 1,
      explanation: "Sum = 40 + 41 + 40 + 39 + 40 + 41 + 39 + 40 + 40 + 40 = 400.\nDivide by 10: 400 / 10 = 40."
    },
    {
      tag: "Data Story",
      question: "Section B test scores: 30, 35, 40, 45, 50, 35, 40, 45, 30, 50. What is the mean score?",
      options: ["35", "40", "45", "50"],
      answer: 1,
      explanation: "Sum = 30 + 35 + 40 + 45 + 50 + 35 + 40 + 45 + 30 + 50 = 400.\nDivide by 10: 400 / 10 = 40."
    },
    {
      tag: "Data Story",
      question: "Both Section A and Section B have a mean score of 40. Which section has more consistent scores, and why?",
      options: [
        "Section A, because its scores are all very close to 40, giving a smaller standard deviation",
        "Section B, because it has higher maximum scores",
        "Both are equally consistent because their means are the same",
        "Neither is consistent"
      ],
      answer: 0,
      explanation: "Section A's scores range from 39 to 41 — very tight around the mean. Section B's scores range from 30 to 50 — much more spread out. Section A is more consistent."
    },
    {
      tag: "Data Story",
      question: "A 'Data Story Pitch' recommends an administrative action based on statistical findings. What is the correct five-part structure?",
      options: [
        "Data, Center, Spread, Interpretation, Action",
        "Data, Guess, Hope, Conclusion, End",
        "Only numbers, then a conclusion",
        "Just the mean and the range"
      ],
      answer: 0,
      explanation: "The five-part structure is: 1) Data, 2) Center (mean and median), 3) Spread (standard deviation and range), 4) Interpretation, 5) Action."
    },

    /* ---------- CENTRAL TENDENCY (4) ---------- */
    {
      tag: "Central Tendency",
      question: "For nominal data such as blood type or favourite colour, only one measure of central tendency applies. Which one, and why?",
      options: [
        "Mean, because you add the values",
        "Median, because you find the middle value",
        "Mode, because you can only identify the most frequent category — you cannot average or rank categories",
        "Range, because you subtract the smallest from the largest"
      ],
      answer: 2,
      explanation: "For nominal data, only the mode is appropriate. Categories cannot be averaged or ranked, so mean and median do not apply."
    },
    {
      tag: "Central Tendency",
      question: "For ordinal data, the median is preferred over the mean. Why?",
      options: [
        "Because the median is faster to compute",
        "Because ordinal data has a natural order but unequal gaps between categories, so averaging does not make sense",
        "Because the mode does not exist for ordinal data",
        "Because the mean is always incorrect"
      ],
      answer: 1,
      explanation: "Ordinal data can be ranked, so the median (middle rank) works. But because the gaps between categories are not equal, the mean would be misleading."
    },
    {
      tag: "Central Tendency",
      question: "For interval and ratio data, the mean is preferred — but only when there are no extreme outliers. What should you use if outliers are present?",
      options: [
        "The mode",
        "The median, because it is not affected by extreme values",
        "The range",
        "No measure at all"
      ],
      answer: 1,
      explanation: "When outliers are present, use the median. Unlike the mean, the median is not pulled toward extreme values."
    },
    {
      tag: "Central Tendency",
      question: "Data set: 2, 4, 4, 7, 8. What is the mode?",
      options: ["4", "5", "7", "8"],
      answer: 0,
      explanation: "The mode is the most frequent value. In this set, 4 appears twice, while all others appear once."
    },

    /* ---------- COMPUTATION (5) ---------- */
    {
      tag: "Computation",
      question: "The mean is the sum of all values divided by the number of data points. Find the mean of 80, 85, 90, 95, 100.",
      options: ["85", "88", "90", "95"],
      answer: 2,
      explanation: "Sum = 80 + 85 + 90 + 95 + 100 = 450.\nNumber of data points (n) = 5.\nMean = 450 / 5 = 90."
    },
    {
      tag: "Computation",
      question: "The median is the middle value when data is arranged in ascending order. Find the median of 3, 5, 7, 9, 12.",
      options: ["5", "7", "9", "12"],
      answer: 1,
      explanation: "The data is already in ascending order. There are 5 values, so the middle one is the third: 7."
    },
    {
      tag: "Computation",
      question: "The range is the difference between the highest and lowest values (R = max − min). Find the range of 5, 8, 12, 17, 20.",
      options: ["5", "10", "15", "20"],
      answer: 2,
      explanation: "Highest value = 20. Lowest value = 5.\nRange = 20 − 5 = 15."
    },
    {
      tag: "Computation",
      question: "Group A has a standard deviation of 0.5, and Group B has a standard deviation of 4.8. What does this comparison indicate?",
      options: [
        "Group A has more variability than Group B",
        "Group B is much more spread out from its mean than Group A",
        "Group A has a higher mean than Group B",
        "Group B contains invalid data"
      ],
      answer: 1,
      explanation: "A higher standard deviation means greater spread. Group B's value is much higher, so its values are more spread out."
    },
    {
      tag: "Computation",
      question: "Sample variance is the average of the squared differences from the mean: s² = Σ(x − x̄)² / (n − 1). For the data set 2, 4, 4, 7, 8, what is the sample variance?",
      options: ["4", "5", "6", "7"],
      answer: 2,
      explanation: "Mean = (2 + 4 + 4 + 7 + 8) / 5 = 25 / 5 = 5.\nSquared deviations: (2−5)² = 9, (4−5)² = 1, (4−5)² = 1, (7−5)² = 4, (8−5)² = 9.\nSum = 9 + 1 + 1 + 4 + 9 = 24.\nSample variance = 24 / (5 − 1) = 24 / 4 = 6."
    },

    /* ---------- APPLICATION (5) ---------- */
    {
      tag: "Application",
      question: "Ten sari-sari stores report monthly earnings. Nine stores earn between ₱8,000 and ₱15,000, but one store earns ₱46,000. Which measure of central tendency best represents the typical store?",
      options: [
        "Mean, because it uses every data point",
        "Median, because the single outlier at ₱46,000 pulls the mean up and makes it misleading",
        "Mode, because it appears most often",
        "Range, because it shows the spread"
      ],
      answer: 1,
      explanation: "The mean is ₱15,000, but the median is only ₱12,000. The outlier pulls the mean up, so the median is the more honest summary."
    },
    {
      tag: "Application",
      question: "In the sari-sari store example, how does a single outlier at ₱46,000 affect the mean?",
      options: [
        "It has no effect on the mean",
        "It pulls the mean up, making the average appear higher than what a typical store actually earns",
        "It pulls the mean down",
        "It removes the mean entirely"
      ],
      answer: 1,
      explanation: "The mean is sensitive to extreme values. A very high value pulls the mean upward, so the reported average becomes misleading."
    },
    {
      tag: "Application",
      question: "The sari-sari store example gives a mean of ₱15,000 and a median of ₱12,000. Which measure should be reported as the typical store earnings, and why?",
      options: [
        "The mean, because it is higher and makes the stores look more successful",
        "The median, because the outlier distorts the mean — the median shows what a typical store actually earns",
        "The range, because it shows the difference between highest and lowest",
        "The mode, because it is the most common earning"
      ],
      answer: 1,
      explanation: "When a single outlier distorts the mean, the median gives a more honest picture of what is typical."
    },
    {
      tag: "Application",
      question: "The standard deviation of the sari-sari store earnings is about ₱11,447. What does this indicate about whether the stores have similar earning capacity?",
      options: [
        "The stores have similar earning capacity because the standard deviation is a whole number",
        "The stores do not have similar earning capacity — the large standard deviation shows their earnings are very spread out",
        "The standard deviation says nothing about earning capacity",
        "The stores all earn exactly the same amount"
      ],
      answer: 1,
      explanation: "A large standard deviation means the values are very spread out. Assuming all stores could repay the same loan would be misleading."
    },
    {
      tag: "Application",
      question: "Why is standard deviation preferred over range for assessing risk?",
      options: [
        "Because standard deviation is faster to compute",
        "Because standard deviation uses every data point, while the range only uses the two extreme values",
        "Because standard deviation ignores outliers",
        "Because range is not a real measure"
      ],
      answer: 1,
      explanation: "Range only considers the highest and lowest values. Standard deviation measures how far every value sits from the mean, giving a more complete picture."
    }

  ];


  /* ============ QUIZ ENGINE ============ */
  var qNum = document.getElementById("qNum");
  var qTotal = document.getElementById("qTotal");
  var streakDisplay = document.getElementById("streak");
  var scoreDisplay = document.getElementById("score");
  var barFill = document.getElementById("barFill");
  var questionCard = document.getElementById("questionCard");
  var qTag = document.getElementById("qTag");
  var qText = document.getElementById("qText");
  var optionsContainer = document.getElementById("options");
  var explain = document.getElementById("explain");
  var explainHead = document.getElementById("explainHead");
  var explainBody = document.getElementById("explainBody");
  var nextWrap = document.getElementById("nextWrap");
  var nextBtn = document.getElementById("nextBtn");
  var quizArea = document.getElementById("quizArea");
  var resultArea = document.getElementById("resultArea");
  var shuffleBtn = document.getElementById("shuffleBtn");

  var quizQuestions = questions.slice();
  var currentQuestion = 0;
  var score = 0;
  var streak = 0;
  var answered = false;

  if (qTotal) qTotal.textContent = quizQuestions.length;

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
    return array;
  }

  function loadQuestion() {
    if (currentQuestion >= quizQuestions.length) { finishQuiz(); return; }

    answered = false;
    var q = quizQuestions[currentQuestion];

    qNum.textContent = currentQuestion + 1;
    streakDisplay.textContent = streak;
    scoreDisplay.textContent = score;
    barFill.style.width = ((currentQuestion / quizQuestions.length) * 100) + "%";

    qTag.textContent = q.tag;
    qText.textContent = q.question;
    optionsContainer.innerHTML = "";

    explain.classList.remove("is-visible", "is-correct", "is-wrong");
    explainHead.textContent = "";
    explainBody.textContent = "";
    nextWrap.classList.remove("is-visible");

    q.options.forEach(function (option, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "opt";
      button.innerHTML = '<span class="letter">' + String.fromCharCode(65 + index) + '</span><span>' + option + '</span>';
      button.addEventListener("click", function () { answerQuestion(index); });
      optionsContainer.appendChild(button);
    });

    questionCard.style.animation = "none";
    void questionCard.offsetWidth;
    questionCard.style.animation = "";
  }

  function answerQuestion(selectedIndex) {
    if (answered) return;
    answered = true;

    var q = quizQuestions[currentQuestion];
    var optionButtons = optionsContainer.querySelectorAll(".opt");
    optionButtons.forEach(function (b) { b.disabled = true; });

    var selectedButton = optionButtons[selectedIndex];
    var correctButton = optionButtons[q.answer];

    if (selectedIndex === q.answer) {
      selectedButton.classList.add("correct");
      score++;
      streak++;
      explain.classList.add("is-visible", "is-correct");
      explainHead.textContent = "Correct!";
      explainBody.textContent = q.explanation;
    } else {
      selectedButton.classList.add("wrong");
      correctButton.classList.add("correct");
      streak = 0;
      explain.classList.add("is-visible", "is-wrong");
      explainHead.textContent = "Not quite.";
      explainBody.textContent = "Correct answer: " + q.options[q.answer] + "\n\n" + q.explanation;
    }

    streakDisplay.textContent = streak;
    scoreDisplay.textContent = score;
    nextWrap.classList.add("is-visible");
    nextBtn.textContent = currentQuestion === quizQuestions.length - 1 ? "See results" : "Next question";
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      currentQuestion++;
      loadQuestion();
    });
  }

  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", function () {
      shuffleBtn.classList.add("is-spinning");
      setTimeout(function () { shuffleBtn.classList.remove("is-spinning"); }, 700);
      quizQuestions = shuffleArray(questions.slice());
      currentQuestion = 0;
      score = 0;
      streak = 0;
      quizArea.hidden = false;
      resultArea.hidden = true;
      loadQuestion();
    });
  }

  function finishQuiz() {
    var total = quizQuestions.length;
    var pct = Math.round((score / total) * 100);
    var msg;
    if (pct >= 90) msg = "Excellent work. You have a strong grasp of both weeks.";
    else if (pct >= 80) msg = "Great job. You understand most of the important ideas.";
    else if (pct >= 75) msg = "Good work. A little more practice will strengthen your skills.";
    else if (pct >= 60) msg = "Keep practicing. Review the examples and try again.";
    else msg = "Review the study notes carefully, then try the quiz again.";

    quizArea.hidden = true;
    resultArea.hidden = false;
    resultArea.innerHTML =
      '<article class="card card-violet result-card">' +
        '<h2>Quiz Complete</h2>' +
        '<div class="result-score">' + score + '/' + total + '</div>' +
        '<p class="result-msg">' + msg + '</p>' +
        '<p class="result-meta">Score: ' + pct + '% &middot; Correct: ' + score + ' &middot; Incorrect: ' + (total - score) + '</p>' +
        '<div class="result-actions">' +
          '<button class="btn" id="retryQuiz">Try Again</button>' +
          '<button class="btn secondary" id="reviewNotes">Review Notes</button>' +
        '</div>' +
      '</article>';

    barFill.style.width = "100%";
    launchConfetti();

    var retryBtn = document.getElementById("retryQuiz");
    var reviewBtn = document.getElementById("reviewNotes");
    if (retryBtn) retryBtn.addEventListener("click", resetQuiz);
    if (reviewBtn) {
      reviewBtn.addEventListener("click", function () {
        var learnTab = document.querySelector('[data-tab="week1"]');
        if (learnTab) learnTab.click();
      });
    }
  }

  function resetQuiz() {
    quizQuestions = shuffleArray(questions.slice());
    currentQuestion = 0;
    score = 0;
    streak = 0;
    quizArea.hidden = false;
    resultArea.hidden = true;
    loadQuestion();
  }

  if (questionCard && optionsContainer) {
    loadQuestion();
  }


  /* ============ FORMULA SHEET ============ */
  var cheatSheet = document.getElementById("cheatSheet");
    var formulas = [
    {
      title: "1. Jeepney Fare",
      formula: "f(x) = 13, if 0 < x <= 5\nf(x) = x + 8, if x > 5",
      note: "The fare is flat at P13 for the first 5 km. After 5 km, it becomes P13 plus P1 for each extra km. Simplified, that second rule is x + 8.\n\nExample 1: Ride 3 km -> 3 <= 5, so use rule 1 -> P13.\nExample 2: Ride 5 km -> 5 <= 5, so use rule 1 -> P13.\nExample 3: Ride 6 km -> 6 > 5, so use rule 2 -> 6 + 8 = P14.\nExample 4: Ride 12 km -> 12 > 5, so use rule 2 -> 12 + 8 = P20."
    },
    {
      title: "2. Print Shop Bulk Buy",
      formula: "C(p) = 5p, if 0 < p <= 50\nC(p) = 250 + 3(p - 50), if p > 50",
      note: "Up to 50 pages costs P5 each. Past 50 pages, the first 50 cost P250 flat, and each extra page costs P3.\n\nExample 1: Print 25 pages -> 25 <= 50, so rule 1 -> 5 x 25 = P125.\nExample 2: Print 50 pages -> 50 <= 50, so rule 1 -> 5 x 50 = P250.\nExample 3: Print 60 pages -> 60 > 50, so rule 2 -> 250 + 3(10) = P280.\nExample 4: Print 100 pages -> 100 > 50, so rule 2 -> 250 + 3(50) = P400."
    },
    {
      title: "3. Mall Parking Fee",
      formula: "P(h) = 40, if 0 < h <= 2\nP(h) = 40 + 15*ceil(h - 2), if h > 2",
      note: "P40 for the first 2 hours. Every extra hour, or any part of an extra hour, costs P15. That 'or part' means we round up with the ceiling function.\n\nExample 1: Park 1.5 hours -> 1.5 <= 2, so rule 1 -> P40.\nExample 2: Park 2 hours -> 2 <= 2, so rule 1 -> P40.\nExample 3: Park 3.5 hours -> 3.5 > 2, ceil(3.5 - 2) = ceil(1.5) = 2 -> 40 + 15(2) = P70.\nExample 4: Park 5 hours -> 5 > 2, ceil(5 - 2) = 3 -> 40 + 15(3) = P85."
    },
    {
      title: "4. Internet Plan",
      formula: "C(g) = 999, if 0 <= g <= 100\nC(g) = 999 + 10(g - 100), if g > 100",
      note: "P999 per month covers up to 100 GB. Any data past 100 GB costs P10 per extra GB.\n\nExample 1: Use 75 GB -> 75 <= 100, so rule 1 -> P999.\nExample 2: Use 100 GB -> 100 <= 100, so rule 1 -> P999.\nExample 3: Use 130 GB -> 130 > 100, so rule 2 -> 999 + 10(30) = P1,299.\nExample 4: Use 150 GB -> 150 > 100, so rule 2 -> 999 + 10(50) = P1,499."
    },
    {
      title: "5. Warm-Up Function",
      formula: "f(x) = 2x + 1, if x < 0\nf(x) = x^2 + 3, if x >= 0",
      note: "If the input is negative, use 2x + 1. If the input is zero or positive, use x^2 + 3.\n\nExample 1: f(-5) -> negative -> 2(-5) + 1 = -9.\nExample 2: f(-1) -> negative -> 2(-1) + 1 = -1.\nExample 3: f(0) -> zero -> 0^2 + 3 = 3.\nExample 4: f(2) -> positive -> 2^2 + 3 = 7.\nExample 5: f(3) -> positive -> 3^2 + 3 = 12."
    },
    {
      title: "6. Tiered Water Bill",
      formula: "W(x) = 200, if 0 < x <= 10\nW(x) = 200 + 30(x - 10), if 10 < x <= 20\nW(x) = 500 + 40(x - 20), if 20 < x <= 30\nW(x) = 900 + 35(x - 30), if x > 30",
      note: "The bill grows in tiers. Each tier has a flat base plus a per-cubic-metre charge for anything beyond the tier's start.\n\nExample 1: 5 m^3 -> rule 1 -> P200.\nExample 2: 15 m^3 -> rule 2 -> 200 + 30(5) = P350.\nExample 3: 24 m^3 -> rule 3 -> 500 + 40(4) = P660.\nExample 4: 30 m^3 -> rule 3 -> 500 + 40(10) = P900.\nExample 5: 34 m^3 -> rule 4 -> 900 + 35(4) = P1,040."
    },
    {
      title: "7. Ceiling Function",
      formula: "ceil(3.5) = 4\nceil(2.1) = 3\nceil(2.01) = 3\nceil(7) = 7",
      note: "Ceiling always rounds UP to the next whole number, no matter how small the decimal part is. Used when any part of a unit counts as a full unit.\n\nExample 1: ceil(3.5) = 4, because 3.5 is past 3.\nExample 2: ceil(2.1) = 3, because 2.1 is past 2.\nExample 3: ceil(2.01) = 3, because even a tiny bit past 2 rounds up.\nExample 4: ceil(7) = 7, because whole numbers stay the same."
    },
    {
      title: "8. Floor Function",
      formula: "floor(3.9) = 3\nfloor(4.99) = 4\nfloor(6) = 6",
      note: "Floor always rounds DOWN to the whole number below, dropping the decimal entirely. Used when only complete units are counted.\n\nExample 1: floor(3.9) = 3, because 3.9 is not yet 4.\nExample 2: floor(4.99) = 4, because 4.99 is still below 5.\nExample 3: floor(6) = 6, because whole numbers stay the same."
    },
    {
      title: "9. Mean (Average)",
      formula: "mean = (sum of all values) / (how many values)",
      note: "The mean is the value you would get if everyone shared equally. It uses every number in the data set, so it is sensitive to very large or very small values.\n\nExample 1: 2, 4, 4, 7, 8 -> sum = 25, count = 5 -> mean = 25 / 5 = 5.\nExample 2: 80, 85, 90, 95, 100 -> sum = 450, count = 5 -> mean = 450 / 5 = 90.\nExample 3: 3, 5, 7 -> sum = 15, count = 3 -> mean = 15 / 3 = 5."
    },
    {
      title: "10. Median (Middle Value)",
      formula: "Order the data from smallest to largest. The median is the middle value.",
      note: "The median is not affected by outliers. If there is an even number of values, average the two middle ones.\n\nExample 1 (odd count): 3, 5, 7, 9, 12 -> middle is 7 -> median = 7.\nExample 2 (odd count): 2, 4, 4, 7, 8 -> middle is 4 -> median = 4.\nExample 3 (even count): 1, 3, 5, 7 -> middle two are 3 and 5 -> median = (3+5)/2 = 4.\nExample 4 (with an outlier): 8, 9, 10, 11, 12, 12, 13, 14, 15, 46 -> middle two are 12 and 12 -> median = 12."
    },
    {
      title: "11. Mode (Most Frequent)",
      formula: "The mode is the value that appears most often.",
      note: "The mode is the only measure that works for categories (nominal data). A data set can have no mode, one mode, or several modes.\n\nExample 1: 2, 4, 4, 7, 8 -> 4 appears twice -> mode = 4.\nExample 2: 12, 12, 13, 14, 15 -> 12 appears twice -> mode = 12.\nExample 3: 1, 2, 3, 4, 5 -> every value appears once -> no mode.\nExample 4: 1, 1, 2, 2, 3 -> both 1 and 2 appear twice -> two modes."
    },
    {
      title: "12. Range",
      formula: "range = highest value - lowest value",
      note: "The range is a quick way to see how spread out the data is. But it only uses two numbers, so it can be misleading if there is an outlier.\n\nExample 1: 5, 8, 12, 17, 20 -> range = 20 - 5 = 15.\nExample 2: 2, 4, 4, 7, 8 -> range = 8 - 2 = 6.\nExample 3: 8, 9, 10, 11, 12, 12, 13, 14, 15, 46 -> range = 46 - 8 = 38."
    },
    {
      title: "13. Sample Variance",
      formula: "s^2 = sum of (each value - mean)^2 / (n - 1)",
      note: "Variance measures how far each value sits from the mean, on average. Because the gaps are squared, variance is in squared units — harder to interpret directly.\n\nExample: data 2, 4, 4, 7, 8 -> mean = 5.\nGaps from mean: -3, -1, -1, 2, 3.\nSquared gaps: 9, 1, 1, 4, 9.\nSum of squared gaps = 24.\nVariance = 24 / (5 - 1) = 24 / 4 = 6."
    },
    {
      title: "14. Sample Standard Deviation",
      formula: "s = sqrt(variance)",
      note: "Standard deviation is the square root of the variance, so it goes back to the original units. A smaller standard deviation means the data is closer to the mean. A larger one means the data is more spread out.\n\nExample 1: variance = 6 -> s = sqrt(6) ~ 2.45.\nExample 2: Group A has s = 0.5 and Group B has s = 4.8 -> Group B is more spread out.\nExample 3: variance = 25 -> s = sqrt(25) = 5."
    },
    {
      title: "15. Levels of Measurement (NOIR)",
      formula: "Nominal -> Ordinal -> Interval -> Ratio",
      note: "Nominal (N): names only, no order. Example: blood type. Only mode works.\nOrdinal (O): names with order, unequal gaps. Example: class rank. Use median.\nInterval (I): equal gaps, no true zero. Example: temperature in Celsius. Use mean (or median if outliers).\nRatio (R): equal gaps with a true zero. Example: height, income. Use mean (or median if outliers)."
    },
    {
      title: "16. Choosing the Right Measure",
      formula: "Nominal -> Mode\nOrdinal -> Median\nInterval -> Mean or Median\nRatio -> Mean or Median",
      note: "Match the measure to the data level, and check for outliers.\n\nExample 1: Blood type -> nominal -> mode only. You can say the most common blood type, but not the average blood type.\nExample 2: Satisfaction rating -> ordinal -> median. You can say the middle rating, but not the average of 'very satisfied' and 'neutral'.\nExample 3: Test scores with no outliers -> interval -> mean. The average is the best summary.\nExample 4: Income with one very high earner -> ratio -> median. The outlier would distort the mean, so the median is more honest."
    }
  ];

  if (cheatSheet) {
    formulas.forEach(function (item) {
      var div = document.createElement("article");
      div.className = "cheat-item";
      div.innerHTML =
        '<h4>' + item.title + '</h4>' +
        '<div class="formula"><pre style="margin:0;white-space:pre-wrap;font:inherit;color:inherit;">' + item.formula + '</pre></div>' +
        '<p>' + item.note + '</p>';
      cheatSheet.appendChild(div);
    });
  }


  /* ============ GLOSSARY ============ */
  var glossaryList = document.getElementById("glossaryList");
  var glossary = [
    { en: "Piecewise Function", enDef: "A function that uses different rules for different input conditions.", fil: "Punsiyong May Bahagi", filDef: "Isang function na gumagamit ng iba't ibang rule depende sa kondisyon ng input." },
    { en: "Function", enDef: "A relationship that assigns an output to an input.", fil: "Function / Punsiyon", filDef: "Isang relasyon kung saan ang input ay may katumbas na output." },
    { en: "Input", enDef: "The value placed into a function.", fil: "Input", filDef: "Ang halagang ipinapasok sa function." },
    { en: "Output", enDef: "The result produced by a function.", fil: "Output", filDef: "Ang resultang lumalabas mula sa function." },
    { en: "Condition", enDef: "A statement that determines when a particular rule applies.", fil: "Kondisyon", filDef: "Pahayag na nagsasabi kung kailan gagamitin ang isang rule." },
    { en: "Boundary", enDef: "A value where one rule changes into another.", fil: "Hangganan", filDef: "Halagang nagsisilbing transition mula sa isang rule papunta sa isa." },
    { en: "Ceiling Function", enDef: "A function that rounds a number up to the nearest integer.", fil: "Ceiling Function", filDef: "Function na nagro-round up sa pinakamalapit na whole number." },
    { en: "Floor Function", enDef: "A function that rounds a number down to the nearest integer.", fil: "Floor Function", filDef: "Function na nagro-round down sa pinakamalapit na whole number." },
    { en: "Overtime", enDef: "Work performed beyond the regular working hours.", fil: "Overtime", filDef: "Trabahong ginagawa lampas sa regular na oras ng trabaho." },
    { en: "Threshold", enDef: "A point at which a rule or rate changes.", fil: "Hangganang Halaga", filDef: "Halagang kapag nalampasan ay nagbabago ang rule o rate." },
    { en: "Statistics", enDef: "The branch of mathematics that deals with collecting, organising, analysing, and interpreting data.", fil: "Estadistika", filDef: "Sangay ng matematika na tumatalakay sa pangongolekta, pag-aayos, pagsusuri, at pagpapakahulugan ng datos." },
    { en: "Qualitative Data", enDef: "Data that describes attributes or categories. Cannot be averaged.", fil: "Kwalitatibong Datos", filDef: "Datos na naglalarawan ng katangian o kategorya. Hindi maaaring i-average." },
    { en: "Quantitative Data", enDef: "Data that represents counts or measurements. Can be averaged.", fil: "Kwantitatibong Datos", filDef: "Datos na kumakatawan sa bilang o sukat. Maaaring i-average." },
    { en: "Discrete Data", enDef: "Countable values with a limited number of possibilities.", fil: "Discrete na Datos", filDef: "Mga halagang mabibilang at may limitadong posibilidad." },
    { en: "Continuous Data", enDef: "Measurable values that can take any value within a range.", fil: "Continuous na Datos", filDef: "Mga halagang masusukat at maaaring tumanggap ng kahit anong halaga sa loob ng range." },
    { en: "Nominal Data", enDef: "Categories with no natural order. Only mode applies.", fil: "Nominal na Datos", filDef: "Mga kategoryang walang natural na pagkakasunod-sunod. Mode lamang ang naaangkop." },
    { en: "Ordinal Data", enDef: "Categories with a natural order, but unequal gaps between them.", fil: "Ordinal na Datos", filDef: "Mga kategoryang may pagkakasunod-sunod, ngunit hindi pantay ang agwat." },
    { en: "Interval Data", enDef: "Equal intervals between values, but no true zero.", fil: "Interval na Datos", filDef: "Pantay ang agwat sa pagitan ng mga halaga, ngunit walang tunay na zero." },
    { en: "Ratio Data", enDef: "Equal intervals with a true zero. Ratios are meaningful.", fil: "Ratio na Datos", filDef: "Pantay ang agwat at may tunay na zero. Makabuluhan ang ratio." },
    { en: "Mean", enDef: "The average of all values. Sensitive to outliers.", fil: "Mean / Katamtaman", filDef: "Ang average ng lahat ng halaga. Apektado ng outliers." },
    { en: "Median", enDef: "The middle value when data is ordered. Robust to outliers.", fil: "Median / Gitna", filDef: "Ang gitnang halaga kapag nakaayos ang datos. Hindi apektado ng outliers." },
    { en: "Mode", enDef: "The most frequently occurring value.", fil: "Mode / Pinakamadalas", filDef: "Ang pinakamadalas na lumalabas na halaga." },
    { en: "Range", enDef: "The difference between the highest and lowest values.", fil: "Range / Saklaw", filDef: "Ang pagkakaiba ng pinakamataas at pinakamababang halaga." },
    { en: "Variance", enDef: "The average of the squared differences from the mean.", fil: "Variance / Pagkakaiba-iba", filDef: "Ang average ng mga squared differences mula sa mean." },
    { en: "Standard Deviation", enDef: "The square root of the variance. Spread in original units.", fil: "Standard Deviation", filDef: "Ang square root ng variance. Nasa orihinal na yunit ang spread." },
    { en: "Outlier", enDef: "A value that sits very far from the rest of the data.", fil: "Outlier / Labis na Halaga", filDef: "Halagang napakalayo sa iba pang datos." }
  ];

  if (glossaryList) {
    glossary.forEach(function (item) {
      var div = document.createElement("article");
      div.className = "gloss-item";
      div.innerHTML =
        '<div class="gloss-en"><span class="gloss-label">English</span><div class="gloss-term">' + item.en + '</div><div class="gloss-def">' + item.enDef + '</div></div>' +
        '<div class="gloss-fil"><span class="gloss-label">Filipino</span><div class="gloss-term">' + item.fil + '</div><div class="gloss-def">' + item.filDef + '</div></div>';
      glossaryList.appendChild(div);
    });
  }


  /* ============ LIVE PPT EMBED ============ */
  var presentations = [
    {
      title: "Week 1 - Piecewise Functions",
      embed: "T2_W1_PIECEWISE-FUNCTION.pdf"
    },
    {
      title: "Week 2 Day 1 - Data & Measurement",
      embed: "GM_T2_W2_DAY1.pdf"
    },
    {
      title: "Week 2 Day 2 - Central Tendency",
      embed: "GM_T2_W2_DAY2.pdf"
    }
  ];

  var pptSwitch = document.getElementById("pptSwitch");
  var pptFrame = document.getElementById("pptFrame");

  function loadPpt(index) {
    var item = presentations[index];
    if (!item || !pptFrame) return;
    pptFrame.src = item.embed;
    if (pptSwitch) {
      Array.prototype.slice.call(pptSwitch.children).forEach(function (btn, i) {
        btn.classList.toggle("is-active", i === index);
      });
    }
  }

  if (pptSwitch && pptFrame) {
    pptSwitch.innerHTML = "";
    presentations.forEach(function (item, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = item.title;
      btn.addEventListener("click", function () { loadPpt(i); });
      pptSwitch.appendChild(btn);
    });
    loadPpt(0);
  }


  /* ============ SOUND TOGGLE ============ */
  var muteBtn = document.getElementById("muteBtn");
  var soundOn = true;
  if (muteBtn) {
    muteBtn.addEventListener("click", function () {
      soundOn = !soundOn;
      muteBtn.textContent = soundOn ? "Sound: on" : "Sound: off";
    });
  }


  /* ============ CONFETTI ============ */
  var canvas = document.getElementById("confetti");
  var ctx = canvas.getContext("2d");
  var confettiPieces = [];
  var confettiAnimation = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function launchConfetti() {
    confettiPieces = [];
    for (var i = 0; i < 120; i++) {
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
    var active = false;
    var colors = ["#2563eb", "#0ea5e9", "#4f46e5", "#06b6d4", "#1e3a8a", "#334155"];

    confettiPieces.forEach(function (piece) {
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