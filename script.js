// DOM Elements
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const setupDiv = document.querySelector('.setup');
const quizDiv = document.querySelector('.quiz');
const questionEl = document.querySelector('.question');
const optionsEl = document.querySelector('.options');
const resultDiv = document.querySelector('.result');
const numQuestionsSelect = document.getElementById('numQuestions');

let allQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Utility: shuffle array
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Load selected topics
function loadSelectedTopics() {
  // Get all checkboxes in topics div
  const checkboxes = document.querySelectorAll('.topics input[type="checkbox"]');
  const selectedTopics = [];

  checkboxes.forEach(cb => {
    if (cb.checked) selectedTopics.push(cb.value);
  });

  let questionsPool = [];

  selectedTopics.forEach(topic => {
    if (window.hasOwnProperty(topic) && Array.isArray(window[topic])) {
      questionsPool = questionsPool.concat(window[topic]);
    }
  });

  return shuffleArray(questionsPool);
}

// Show a question
function showQuestion() {
  optionsEl.innerHTML = '';
  const q = allQuestions[currentQuestionIndex];
  questionEl.textContent = q.question;

  ['optionA', 'optionB', 'optionC', 'optionD'].forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = q[opt];
    btn.addEventListener('click', () => checkAnswer(btn, q));
    optionsEl.appendChild(btn);
  });
}

// Check answer
function checkAnswer(button, question) {
  const correct = question.optionA; // assuming optionA is correct
  if (button.textContent === correct) {
    button.classList.add('correct');
    score++;
  } else {
    button.classList.add('wrong');
    // highlight the correct option
    Array.from(optionsEl.children).forEach(btn => {
      if (btn.textContent === correct) btn.classList.add('correct');
    });
  }
  // disable all buttons after selection
  Array.from(optionsEl.children).forEach(btn => btn.disabled = true);
}

// Next question
nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < allQuestions.length) {
    showQuestion();
  } else {
    // Quiz finished
    quizDiv.style.display = 'none';
    resultDiv.style.display = 'block';
    resultDiv.textContent = `You got ${score} out of ${allQuestions.length} correct!`;
  }
});

// Start quiz
startBtn.addEventListener('click', () => {
  allQuestions = loadSelectedTopics();
  const maxQ = parseInt(numQuestionsSelect.value);
  allQuestions = allQuestions.slice(0, maxQ);

  if (allQuestions.length === 0) {
    alert('Please select at least one topic!');
    return;
  }

  score = 0;
  currentQuestionIndex = 0;
  setupDiv.style.display = 'none';
  quizDiv.style.display = 'block';
  resultDiv.style.display = 'none';
  showQuestion();
});
