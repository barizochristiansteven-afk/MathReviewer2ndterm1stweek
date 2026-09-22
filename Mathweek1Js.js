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

      if (targetPanel) {
        targetPanel.classList.add("is-active");
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  });


  /* Reading progress */

  const readingProgress = document.getElementById("readingProgress");

  function updateReadingProgress() {
    const scrollTop = window.scrollY;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (documentHeight <= 0) {
      readingProgress.style.width = "0%";
      return;
    }

    const progress = (scrollTop / documentHeight) * 100;

    readingProgress.style.width =
      Math.min(100, Math.max(0, progress)) + "%";
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

      dot.setAttribute(
        "aria-label",
        `Go to slide ${index + 1}`
      );

      dot.addEventListener("click", () => {
        showSlide(index);
      });

      deckDots.appendChild(dot);
    });
  }


  function showSlide(index) {

    if (index < 0) {
      index = 0;
    }

    if (index >= slides.length) {
      index = slides.length - 1;
    }

    currentSlide = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle(
        "is-active",
        i === currentSlide
      );
    });

    slideNum.textContent = currentSlide + 1;

    const dots = document.querySelectorAll(".deck-dot");

    dots.forEach((dot, i) => {
      dot.classList.toggle(
        "is-active",
        i === currentSlide
      );

      dot.classList.toggle(
        "is-done",
        i < currentSlide
      );
    });

    prevSlide.disabled = currentSlide === 0;
    nextSlide.disabled = currentSlide === slides.length - 1;

    window.scrollTo({
      top: document.querySelector(".deck").offsetTop - 20,
      behavior: "smooth"
    });
  }


  prevSlide.addEventListener("click", () => {
    showSlide(currentSlide - 1);
  });


  nextSlide.addEventListener("click", () => {
    showSlide(currentSlide + 1);
  });


  document.addEventListener("keydown", event => {

    const learnPanel = document.getElementById("learn");

    if (
      learnPanel &&
      learnPanel.classList.contains("is-active")
    ) {

      if (event.key === "ArrowRight") {
        showSlide(currentSlide + 1);
      }

      if (event.key === "ArrowLeft") {
        showSlide(currentSlide - 1);
      }
    }
  });


  createSlideDots();
  showSlide(0);


  /* Jeepney fare */

  const kmSlider = document.getElementById("kmSlider");
  const kmVal = document.getElementById("kmVal");
  const fareVal = document.getElementById("fareVal");
  const ruleUsed = document.getElementById("ruleUsed");

  function updateFare() {

    if (!kmSlider) return;

    const distance = Number(kmSlider.value);

    let fare;
    let ruleText;

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


  /* Quiz data */

  const questions = [

    {
      tag: "Warm-Up",
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
      tag: "Warm-Up",
      question: "Which symbol means 'less than or equal to'?",
      options: [
        "<",
        ">",
        "≤",
        "≥"
      ],
      answer: 2,
      explanation:
        "The symbol ≤ means less than or equal to."
    },

    {
      tag: "Warm-Up",
      question: "Which symbol means 'greater than or equal to'?",
      options: [
        "≤",
        "≥",
        "<",
        ">"
      ],
      answer: 1,
      explanation:
        "The symbol ≥ means greater than or equal to."
    },

    {
      tag: "Warm-Up",
      question:
        "If f(x) = 5 when x < 10, what is f(3)?",
      options: [
        "3",
        "5",
        "10",
        "15"
      ],
      answer: 1,
      explanation:
        "Since 3 < 10, use the rule f(x) = 5. Therefore f(3) = 5."
    },

    {
      tag: "Warm-Up",
      question:
        "If f(x) = 5 + 2(x − 10) when x ≥ 10, what is f(13)?",
      options: [
        "8",
        "10",
        "11",
        "13"
      ],
      answer: 2,
      explanation:
        "f(13) = 5 + 2(13 − 10) = 5 + 6 = 11."
    },

    {
      tag: "Jeepney Fare",
      question:
        "A jeepney charges ₱12 for up to 4 km. How much is a 3 km ride?",
      options: [
        "₱3",
        "₱4.50",
        "₱12",
        "₱16.50"
      ],
      answer: 2,
      explanation:
        "3 km is within the first 4 km, so the flat fare of ₱12 applies."
    },

    {
      tag: "Jeepney Fare",
      question:
        "How much is a 4 km jeepney ride?",
      options: [
        "₱6",
        "₱12",
        "₱13.50",
        "₱16.50"
      ],
      answer: 1,
      explanation:
        "The first rule says 0 < x ≤ 4. Since 4 is included, the fare is ₱12."
    },

    {
      tag: "Jeepney Fare",
      question:
        "How much is a 5 km ride if the fare is ₱12 for the first 4 km and ₱1.50 for every extra km?",
      options: [
        "₱12",
        "₱13",
        "₱13.50",
        "₱15"
      ],
      answer: 2,
      explanation:
        "The extra distance is 5 − 4 = 1 km. Fare = 12 + 1.50(1) = ₱13.50."
    },

    {
      tag: "Jeepney Fare",
      question:
        "How much is a 7 km ride?",
      options: [
        "₱16.50",
        "₱17.50",
        "₱19.50",
        "₱21"
      ],
      answer: 0,
      explanation:
        "f(7) = 12 + 1.50(7 − 4) = 12 + 4.50 = ₱16.50."
    },

    {
      tag: "Jeepney Fare",
      question:
        "How much is a 10 km ride?",
      options: [
        "₱18",
        "₱20",
        "₱21",
        "₱25"
      ],
      answer: 2,
      explanation:
        "f(10) = 12 + 1.50(10 − 4) = 12 + 9 = ₱21."
    },

    {
      tag: "Jeepney Fare",
      question:
        "A passenger paid ₱18. How far did they travel?",
      options: [
        "6 km",
        "7 km",
        "8 km",
        "10 km"
      ],
      answer: 2,
      explanation:
        "18 = 12 + 1.50(x − 4). Therefore 6 = 1.50(x − 4), x − 4 = 4, so x = 8 km."
    },

    {
      tag: "Piecewise Rules",
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
      tag: "Piecewise Rules",
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
        "A piecewise function assigns different rules to different conditions. The condition tells you which rule to use."
    },

    {
      tag: "Function g(x)",
      question:
        "Given g(x) = 3x + 1 if x < 0, what is g(−1)?",
      options: [
        "−4",
        "−2",
        "2",
        "4"
      ],
      answer: 1,
      explanation:
        "−1 < 0, so use g(x) = 3x + 1. g(−1) = 3(−1) + 1 = −2."
    },

    {
      tag: "Function g(x)",
      question:
        "Given g(x) = 3x + 1 if x < 0, what is g(−3)?",
      options: [
        "−9",
        "−8",
        "−6",
        "−2"
      ],
      answer: 1,
      explanation:
        "g(−3) = 3(−3) + 1 = −9 + 1 = −8."
    },

    {
      tag: "Function g(x)",
      question:
        "Given g(x) = x² + 3 if x ≥ 0, what is g(0)?",
      options: [
        "0",
        "1",
        "3",
        "4"
      ],
      answer: 2,
      explanation:
        "Because x ≥ 0 includes zero, use x² + 3. g(0) = 0² + 3 = 3."
    },

    {
      tag: "Function g(x)",
      question:
        "Given g(x) = x² + 3 if x ≥ 0, what is g(5)?",
      options: [
        "8",
        "25",
        "28",
        "30"
      ],
      answer: 2,
      explanation:
        "g(5) = 5² + 3 = 25 + 3 = 28."
    },

    {
      tag: "Function g(x)",
      question:
        "Given g(x) = x² + 3 if x ≥ 0, what is g(10)?",
      options: [
        "100",
        "103",
        "110",
        "130"
      ],
      answer: 1,
      explanation:
        "g(10) = 10² + 3 = 100 + 3 = 103."
    },

    {
      tag: "Data Plan",
      question:
        "A data plan costs ₱300 for up to 5 GB. What is the cost for 3 GB?",
      options: [
        "₱150",
        "₱250",
        "₱300",
        "₱350"
      ],
      answer: 2,
      explanation:
        "3 GB is within the included 5 GB, so the cost remains ₱300."
    },

    {
      tag: "Data Plan",
      question:
        "How much does 5 GB cost?",
      options: [
        "₱250",
        "₱300",
        "₱350",
        "₱500"
      ],
      answer: 1,
      explanation:
        "The first rule includes 5 GB because the condition is g ≤ 5."
    },

    {
      tag: "Data Plan",
      question:
        "How much does 6 GB cost if every GB beyond 5 costs ₱50?",
      options: [
        "₱300",
        "₱325",
        "₱350",
        "₱400"
      ],
      answer: 2,
      explanation:
        "One GB is beyond the included 5 GB. ₱300 + ₱50(1) = ₱350."
    },

    {
      tag: "Data Plan",
      question:
        "How much does 8 GB cost?",
      options: [
        "₱400",
        "₱450",
        "₱500",
        "₱550"
      ],
      answer: 1,
      explanation:
        "8 − 5 = 3 extra GB. ₱300 + ₱50(3) = ₱450."
    },

    {
      tag: "Data Plan",
      question:
        "How much does 10 GB cost?",
      options: [
        "₱500",
        "₱550",
        "₱600",
        "₱650"
      ],
      answer: 1,
      explanation:
        "10 − 5 = 5 extra GB. ₱300 + ₱50(5) = ₱550."
    },

    {
      tag: "Data Plan",
      question:
        "How much does 15 GB cost?",
      options: [
        "₱700",
        "₱750",
        "₱800",
        "₱850"
      ],
      answer: 2,
      explanation:
        "15 − 5 = 10 extra GB. ₱300 + ₱50(10) = ₱800."
    },

    {
      tag: "Bulk Pricing",
      question:
        "A pencil costs ₱10 each when fewer than 10 are bought. What is the cost of 8 pencils?",
      options: [
        "₱60",
        "₱70",
        "₱80",
        "₱90"
      ],
      answer: 2,
      explanation:
        "Since 8 < 10, use C(p) = 10p. C(8) = ₱80."
    },

    {
      tag: "Bulk Pricing",
      question:
        "How much do 9 pencils cost?",
      options: [
        "₱72",
        "₱80",
        "₱90",
        "₱100"
      ],
      answer: 2,
      explanation:
        "9 pencils are still below 10, so 9 × ₱10 = ₱90."
    },

    {
      tag: "Bulk Pricing",
      question:
        "How much do 10 pencils cost?",
      options: [
        "₱70",
        "₱80",
        "₱90",
        "₱100"
      ],
      answer: 1,
      explanation:
        "The second rule applies at 10 or more. 10 × ₱8 = ₱80."
    },

    {
      tag: "Bulk Pricing",
      question:
        "How much do 12 pencils cost?",
      options: [
        "₱80",
        "₱90",
        "₱96",
        "₱120"
      ],
      answer: 2,
      explanation:
        "12 × ₱8 = ₱96."
    },

    {
      tag: "Bulk Pricing",
      question:
        "How much do 20 pencils cost?",
      options: [
        "₱160",
        "₱180",
        "₱200",
        "₱220"
      ],
      answer: 0,
      explanation:
        "20 × ₱8 = ₱160."
    },

    {
      tag: "Overtime",
      question:
        "What is the regular hourly wage?",
      options: [
        "₱40",
        "₱60",
        "₱80",
        "₱120"
      ],
      answer: 2,
      explanation:
        "The regular rate is ₱80 per hour."
    },

    {
      tag: "Overtime",
      question:
        "How much does an employee earn for 40 hours?",
      options: [
        "₱2,800",
        "₱3,000",
        "₱3,200",
        "₱3,600"
      ],
      answer: 2,
      explanation:
        "80 × 40 = ₱3,200."
    },

    {
      tag: "Overtime",
      question:
        "What is the overtime hourly rate?",
      options: [
        "₱80",
        "₱100",
        "₱120",
        "₱160"
      ],
      answer: 2,
      explanation:
        "Overtime is paid at 1.5 times ₱80, which is ₱120 per hour."
    },

    {
      tag: "Overtime",
      question:
        "How much does an employee earn for 41 hours?",
      options: [
        "₱3,280",
        "₱3,320",
        "₱3,400",
        "₱3,520"
      ],
      answer: 1,
      explanation:
        "The first 40 hours earn ₱3,200. The extra hour earns ₱120. Total = ₱3,320."
    },

    {
      tag: "Overtime",
      question:
        "How much does an employee earn for 45 hours?",
      options: [
        "₱3,600",
        "₱3,700",
        "₱3,800",
        "₱4,000"
      ],
      answer: 2,
      explanation:
        "₱3,200 + ₱120(5) = ₱3,800."
    },

    {
      tag: "Overtime",
      question:
        "A worker earns ₱4,400. How many hours did they work?",
      options: [
        "45",
        "48",
        "50",
        "55"
      ],
      answer: 2,
      explanation:
        "4,400 = 3,200 + 120(h − 40). Solving gives h = 50 hours."
    },

    {
      tag: "Parking",
      question:
        "How much does parking cost for exactly 2 hours?",
      options: [
        "₱20",
        "₱30",
        "₱40",
        "₱60"
      ],
      answer: 2,
      explanation:
        "The first 2 hours cost a flat ₱40."
    },

    {
      tag: "Parking",
      question:
        "How much does parking cost for 2.5 hours?",
      options: [
        "₱40",
        "₱50",
        "₱60",
        "₱80"
      ],
      answer: 2,
      explanation:
        "The extra 0.5 hour counts as one extra hour. Ceiling(0.5) = 1. Total = ₱60."
    },

    {
      tag: "Parking",
      question:
        "How much does parking cost for 3.5 hours?",
      options: [
        "₱60",
        "₱70",
        "₱80",
        "₱100"
      ],
      answer: 2,
      explanation:
        "Ceiling(3.5 − 2) = ceiling(1.5) = 2. ₱40 + ₱20(2) = ₱80."
    },

    {
      tag: "Parking",
      question:
        "How much does parking cost for 6 hours?",
      options: [
        "₱100",
        "₱120",
        "₱140",
        "₱160"
      ],
      answer: 1,
      explanation:
        "6 − 2 = 4. ₱40 + ₱20(4) = ₱120."
    },

    {
      tag: "Rounding",
      question:
        "What is ⌈3.5⌉?",
      options: [
        "3",
        "3.5",
        "4",
        "5"
      ],
      answer: 2,
      explanation:
        "The ceiling function rounds a number UP to the nearest integer. ⌈3.5⌉ = 4."
    },

    {
      tag: "Rounding",
      question:
        "What is ⌊3.9⌋?",
      options: [
        "3",
        "3.9",
        "4",
        "5"
      ],
      answer: 0,
      explanation:
        "The floor function rounds DOWN to the nearest integer. ⌊3.9⌋ = 3."
    },

    {
      tag: "Water Bill",
      question:
        "What is the water bill for 5 m³?",
      options: [
        "₱100",
        "₱150",
        "₱200",
        "₱250"
      ],
      answer: 2,
      explanation:
        "5 m³ is within the first tier, so the bill is ₱200."
    },

    {
      tag: "Water Bill",
      question:
        "What is the water bill for 10 m³?",
      options: [
        "₱200",
        "₱250",
        "₱300",
        "₱350"
      ],
      answer: 0,
      explanation:
        "The first tier includes 10 m³. The bill is ₱200."
    },

    {
      tag: "Water Bill",
      question:
        "What is the water bill for 12 m³?",
      options: [
        "₱230",
        "₱260",
        "₱290",
        "₱300"
      ],
      answer: 1,
      explanation:
        "200 + 30(12 − 10) = 200 + 60 = ₱260."
    },

    {
      tag: "Water Bill",
      question:
        "What is the water bill for 20 m³?",
      options: [
        "₱400",
        "₱450",
        "₱500",
        "₱550"
      ],
      answer: 2,
      explanation:
        "200 + 30(20 − 10) = 200 + 300 = ₱500."
    },

    {
      tag: "Water Bill",
      question:
        "What is the water bill for 24 m³?",
      options: [
        "₱580",
        "₱620",
        "₱660",
        "₱700"
      ],
      answer: 2,
      explanation:
        "500 + 40(24 − 20) = 500 + 160 = ₱660."
    },

    {
      tag: "Water Bill",
      question:
        "What is the water bill for 30 m³?",
      options: [
        "₱800",
        "₱850",
        "₱900",
        "₱950"
      ],
      answer: 2,
      explanation:
        "500 + 40(30 − 20) = 500 + 400 = ₱900."
    },

    {
      tag: "Water Bill",
      question:
        "What is the water bill for 34 m³?",
      options: [
        "₱1,000",
        "₱1,020",
        "₱1,040",
        "₱1,080"
      ],
      answer: 2,
      explanation:
        "900 + 35(34 − 30) = 900 + 140 = ₱1,040."
    },

    {
      tag: "Water Bill",
      question:
        "A household has a ₱1,040 water bill. How much water did they use?",
      options: [
        "30 m³",
        "32 m³",
        "34 m³",
        "36 m³"
      ],
      answer: 2,
      explanation:
        "1,040 = 900 + 35(x − 30). Solving gives x = 34 m³."
    },

    {
      tag: "Concept",
      question:
        "Why are piecewise functions useful in real life?",
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
        "The input is checked against the conditions. The condition that is true determines the rule."
    },

    {
      tag: "Concept",
      question:
        "What is the most important thing to check at a boundary such as x = 10?",
      options: [
        "Whether the condition uses <, ≤, >, or ≥",
        "Whether the equation is colorful",
        "Whether the number is even",
        "Whether there are decimals"
      ],
      answer: 0,
      explanation:
        "Symbols such as ≤ and ≥ determine whether the boundary value belongs to that piece."
    },

    {
      tag: "Concept",
      question:
        "If a condition says x ≥ 0, is x = 0 included?",
      options: [
        "Yes",
        "No",
        "Only sometimes",
        "Only when x is positive"
      ],
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

      [array[i], array[j]] =
        [array[j], array[i]];
    }

    return array;
  }


  function loadQuestion() {

    if (currentQuestion >= quizQuestions.length) {
      finishQuiz();
      return;
    }

    answered = false;

    const question =
      quizQuestions[currentQuestion];

    qNum.textContent = currentQuestion + 1;
    streakDisplay.textContent = streak;
    scoreDisplay.textContent = score;

    barFill.style.width =
      `${(currentQuestion / quizQuestions.length) * 100}%`;

    qTag.textContent = question.tag;
    qText.textContent = question.question;

    optionsContainer.innerHTML = "";

    explain.classList.remove(
      "is-visible",
      "is-correct",
      "is-wrong"
    );

    explainHead.textContent = "";
    explainBody.textContent = "";

    nextWrap.classList.remove("is-visible");

    question.options.forEach((option, index) => {

      const button = document.createElement("button");

      button.type = "button";
      button.className = "opt";

      button.innerHTML = `
        <span class="letter">
          ${String.fromCharCode(65 + index)}
        </span>
        <span>${option}</span>
      `;

      button.addEventListener("click", () => {
        answerQuestion(index);
      });

      optionsContainer.appendChild(button);
    });

    questionCard.style.animation = "none";
    void questionCard.offsetWidth;
    questionCard.style.animation = "";
  }


  function answerQuestion(selectedIndex) {

    if (answered) return;

    answered = true;

    const question =
      quizQuestions[currentQuestion];

    const optionButtons =
      optionsContainer.querySelectorAll(".opt");

    optionButtons.forEach(button => {
      button.disabled = true;
    });

    const selectedButton =
      optionButtons[selectedIndex];

    const correctButton =
      optionButtons[question.answer];

    if (selectedIndex === question.answer) {

      selectedButton.classList.add("correct");

      score++;
      streak++;

      explain.classList.add(
        "is-visible",
        "is-correct"
      );

      explainHead.textContent =
        "Correct!";

      explainBody.textContent =
        question.explanation;

    } else {

      selectedButton.classList.add("wrong");
      correctButton.classList.add("correct");

      streak = 0;

      explain.classList.add(
        "is-visible",
        "is-wrong"
      );

      explainHead.textContent =
        "Not quite.";

      explainBody.textContent =
        `Correct answer: ${
          question.options[question.answer]
        }\n\n${question.explanation}`;
    }

    streakDisplay.textContent = streak;
    scoreDisplay.textContent = score;

    nextWrap.classList.add("is-visible");

    if (
      currentQuestion ===
      quizQuestions.length - 1
    ) {
      nextBtn.textContent = "See results";
    } else {
      nextBtn.textContent = "Next question";
    }
  }


  nextBtn.addEventListener("click", () => {

    currentQuestion++;

    loadQuestion();
  });


  /* Shuffle quiz */

  shuffleBtn.addEventListener("click", () => {

    shuffleBtn.classList.add("is-spinning");

    setTimeout(() => {
      shuffleBtn.classList.remove("is-spinning");
    }, 700);

    quizQuestions = shuffleArray([...questions]);

    currentQuestion = 0;
    score = 0;
    streak = 0;

    quizArea.hidden = false;
    resultArea.hidden = true;

    loadQuestion();
  });


  /* Quiz results */

  function finishQuiz() {

    const total = quizQuestions.length;

    const percentage =
      Math.round((score / total) * 100);

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

        <div class="result-score">
          ${score}/${total}
        </div>

        <p class="result-msg">
          ${message}
        </p>

        <p class="result-meta">
          Score: ${percentage}% &middot;
          Correct: ${score} &middot;
          Incorrect: ${total - score}
        </p>

        <div class="result-actions">
          <button class="btn" id="retryQuiz">
            Try Again
          </button>

          <button class="btn secondary" id="reviewNotes">
            Review Notes
          </button>
        </div>
      </article>
    `;

    barFill.style.width = "100%";

    launchConfetti();

    document
      .getElementById("retryQuiz")
      .addEventListener("click", resetQuiz);

    document
      .getElementById("reviewNotes")
      .addEventListener("click", () => {

        const learnTab =
          document.querySelector('[data-tab="learn"]');

        if (learnTab) {
          learnTab.click();
        }
      });
  }


  function resetQuiz() {

    quizQuestions =
      shuffleArray([...questions]);

    currentQuestion = 0;
    score = 0;
    streak = 0;

    quizArea.hidden = false;
    resultArea.hidden = true;

    loadQuestion();
  }


  loadQuestion();


  /* Formulas */

  const cheatSheet =
    document.getElementById("cheatSheet");

  const formulas = [

    {
      title: "Jeepney Fare",
      formula:
        "f(x) = 12, if 0 < x ≤ 4\nf(x) = 12 + 1.5(x − 4), if x > 4",
      note:
        "₱12 covers the first 4 km. Every kilometre beyond 4 costs ₱1.50."
    },

    {
      title: "Mobile Data Plan",
      formula:
        "D(g) = 300, if 0 ≤ g ≤ 5\nD(g) = 300 + 50(g − 5), if g > 5",
      note:
        "The plan costs ₱300 for up to 5 GB. Extra data costs ₱50 per GB."
    },

    {
      title: "Bulk Pencil Purchase",
      formula:
        "C(p) = 10p, if 0 < p < 10\nC(p) = 8p, if p ≥ 10",
      note:
        "Fewer than 10 pencils cost ₱10 each. Ten or more cost ₱8 each."
    },

    {
      title: "Overtime Wage",
      formula:
        "W(h) = 80h, if 0 ≤ h ≤ 40\nW(h) = 3200 + 120(h − 40), if h > 40",
      note:
        "Regular pay is ₱80/hour. Overtime is ₱120/hour after 40 hours."
    },

    {
      title: "Parking",
      formula:
        "P(t) = 40, if 0 < t ≤ 2\nP(t) = 40 + 20⌈t − 2⌉, if t > 2",
      note:
        "The first 2 hours cost ₱40. Each additional hour or fraction costs ₱20."
    },

    {
      title: "Water Bill",
      formula:
        "W(x) = 200, if 0 < x ≤ 10\nW(x) = 200 + 30(x − 10), if 10 < x ≤ 20\nW(x) = 500 + 40(x − 20), if 20 < x ≤ 30\nW(x) = 900 + 35(x − 30), if x > 30",
      note:
        "The bill increases according to the consumption tier."
    },

    {
      title: "Ceiling Function",
      formula:
        "⌈3.5⌉ = 4\n⌈2.1⌉ = 3\n⌈2.01⌉ = 3",
      note:
        "The ceiling function rounds a number UP to the nearest integer."
    },

    {
      title: "Floor Function",
      formula:
        "⌊3.9⌋ = 3\n⌊4.99⌋ = 4\n⌊6⌋ = 6",
      note:
        "The floor function rounds a number DOWN to the nearest integer."
    }

  ];


  formulas.forEach(item => {

    const div = document.createElement("article");

    div.className = "cheat-item";

    div.innerHTML = `
      <h4>${item.title}</h4>

      <div class="formula">
        <pre style="
          margin:0;
          white-space:pre-wrap;
          font:inherit;
          color:inherit;
        ">${item.formula}</pre>
      </div>

      <p>${item.note}</p>
    `;

    cheatSheet.appendChild(div);
  });


  /* Glossary */

  const glossaryList =
    document.getElementById("glossaryList");

  const glossary = [

    {
      en: "Piecewise Function",
      enDef: "A function that uses different rules for different input conditions.",
      fil: "Punsiyong May Bahagi",
      filDef: "Isang function na gumagamit ng iba't ibang rule depende sa kondisyon ng input."
    },

    {
      en: "Function",
      enDef: "A relationship that assigns an output to an input.",
      fil: "Function / Punsiyon",
      filDef: "Isang relasyon kung saan ang isang input ay may katumbas na output."
    },

    {
      en: "Input",
      enDef: "The value placed into a function.",
      fil: "Input",
      filDef: "Ang halagang ipinapasok sa function."
    },

    {
      en: "Output",
      enDef: "The result produced by a function.",
      fil: "Output",
      filDef: "Ang sagot o resultang lumalabas mula sa function."
    },

    {
      en: "Condition",
      enDef: "A statement that determines when a particular rule applies.",
      fil: "Kondisyon",
      filDef: "Pahayag na nagsasabi kung kailan gagamitin ang isang rule."
    },

    {
      en: "Boundary",
      enDef: "A value where one piece or rule changes into another.",
      fil: "Hangganan",
      filDef: "Halagang nagsisilbing transition mula sa isang rule papunta sa isa."
    },

    {
      en: "Ceiling Function",
      enDef: "A function that rounds a number upward to the nearest integer.",
      fil: "Ceiling Function",
      filDef: "Function na nagro-round up sa pinakamalapit na whole number."
    },

    {
      en: "Floor Function",
      enDef: "A function that rounds a number downward to the nearest integer.",
      fil: "Floor Function",
      filDef: "Function na nagro-round down sa pinakamalapit na whole number."
    },

    {
      en: "Overtime",
      enDef: "Work performed beyond the regular working hours.",
      fil: "Overtime",
      filDef: "Trabahong ginagawa lampas sa regular na oras ng trabaho."
    },

    {
      en: "Rate",
      enDef: "The amount charged or earned per unit.",
      fil: "Rate / Singil",
      filDef: "Halagang binabayaran o kinikita bawat unit."
    },

    {
      en: "Threshold",
      enDef: "A point at which a rule or rate changes.",
      fil: "Hangganang Halaga",
      filDef: "Halagang kapag nalampasan ay maaaring magbago ang rule o rate."
    },

    {
      en: "Domain",
      enDef: "The set of possible input values.",
      fil: "Domain",
      filDef: "Set ng lahat ng posibleng input values."
    },

    {
      en: "Range",
      enDef: "The set of possible output values.",
      fil: "Range",
      filDef: "Set ng lahat ng posibleng output values."
    },

    {
      en: "Variable",
      enDef: "A symbol representing a value that can change.",
      fil: "Variable",
      filDef: "Simbolo na kumakatawan sa isang halagang maaaring magbago."
    }

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

  const videoList =
    document.getElementById("videoList");

  const videos = [

    {
      lang: "EN",
      title: "Piecewise Functions",
      channel: "Khan Academy",
      description:
        "Introduction to piecewise functions and how different rules apply to different inputs.",
      url:
        "https://www.youtube.com/results?search_query=Khan+Academy+piecewise+functions"
    },

    {
      lang: "EN",
      title: "Piecewise Functions",
      channel: "The Organic Chemistry Tutor",
      description:
        "Worked examples showing how to evaluate and understand piecewise functions.",
      url:
        "https://www.youtube.com/results?search_query=Organic+Chemistry+Tutor+piecewise+functions"
    },

    {
      lang: "EN",
      title: "Evaluating Piecewise Functions",
      channel: "Math Tutorials",
      description:
        "Practice evaluating functions by identifying which condition applies.",
      url:
        "https://www.youtube.com/results?search_query=evaluating+piecewise+functions"
    },

    {
      lang: "FIL",
      title: "Piecewise Function Tagalog",
      channel: "YouTube Search",
      description:
        "Filipino-language search results for piecewise function lessons.",
      url:
        "https://www.youtube.com/results?search_query=piecewise+function+Tagalog"
    },

    {
      lang: "FIL",
      title: "Piecewise Function Filipino Tutorial",
      channel: "YouTube Search",
      description:
        "Search results for Filipino explanations and examples of piecewise functions.",
      url:
        "https://www.youtube.com/results?search_query=piecewise+function+Filipino+tutorial"
    }

  ];


  videos.forEach(video => {

    const div = document.createElement("article");

    div.className = "video-item";

    div.innerHTML = `
      <div class="video-thumb" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"></path>
        </svg>
      </div>

      <div class="video-body">

        <span class="video-lang ${video.lang === "EN" ? "en" : "fil"}">
          ${video.lang === "EN" ? "English" : "Filipino"}
        </span>

        <div class="video-title">
          ${video.title}
        </div>

        <div class="video-channel">
          ${video.channel}
        </div>

        <div class="video-desc">
          ${video.description}
        </div>

        <a
          class="video-link"
          href="${video.url}"
          target="_blank"
          rel="noopener noreferrer"
        >
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


  /* Sound */

  const muteBtn =
    document.getElementById("muteBtn");

  let soundOn = true;

  muteBtn.addEventListener("click", () => {

    soundOn = !soundOn;

    muteBtn.textContent =
      soundOn ? "Sound: on" : "Sound: off";

  });


  /* Confetti */

  const canvas =
    document.getElementById("confetti");

  const ctx =
    canvas.getContext("2d");

  let confettiPieces = [];
  let confettiAnimation = null;


  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }


  window.addEventListener(
    "resize",
    resizeCanvas
  );

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
        rotationSpeed:
          -0.08 + Math.random() * 0.16
      });

    }

    if (confettiAnimation) {
      cancelAnimationFrame(confettiAnimation);
    }

    animateConfetti();
  }


  function animateConfetti() {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    let active = false;

    confettiPieces.forEach(piece => {

      piece.y += piece.speedY;
      piece.x += piece.speedX;
      piece.rotation += piece.rotationSpeed;

      if (piece.y < canvas.height + 30) {
        active = true;
      }

      ctx.save();

      ctx.translate(
        piece.x,
        piece.y
      );

      ctx.rotate(piece.rotation);

      const colors = [
        "#7c3aed",
        "#ec4899",
        "#14b8a6",
        "#f59e0b",
        "#3b82f6",
        "#10b981"
      ];

      ctx.fillStyle =
        colors[
          Math.floor(
            Math.random() * colors.length
          )
        ];

      ctx.fillRect(
        -piece.width / 2,
        -piece.height / 2,
        piece.width,
        piece.height
      );

      ctx.restore();
    });

    if (active) {
      confettiAnimation =
        requestAnimationFrame(
          animateConfetti
        );
    } else {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  }

});