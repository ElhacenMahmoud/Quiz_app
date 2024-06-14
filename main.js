// Get elements
const countSpan = document.querySelector(".count span");
const bullets = document.querySelector(".bullets");
const bulletsSpans = document.querySelector(".bullets .spans");
const quizArea = document.querySelector(".quiz-area");
const quizAnswers = document.querySelector(".answers-area");
const submitButton = document.querySelector(".submit-button");
const results = document.querySelector(".results");
const countdown = document.querySelector(".countdown");

// Set options
let currentIndex = 0;
let rightAnswers = 0;

// fetch the questions
async function getQuestions() {
  const response = await fetch("./questions.json");
  const questions = await response.json();
  return questions;
}

// Questions
let questions = [];

getQuestions().then((questionsData) => {
  questions = questionsData;
  createBullets(questions.length);
  addData(questions[currentIndex], currentIndex);
  checkAnswer();
  countDownFunction();
});

// Create Bullets
function createBullets(num) {
  countSpan.textContent = num;

  for (let i = 0; i < num; i++) {
    const span = document.createElement("span");
    bulletsSpans.appendChild(span);
  }
  bulletsSpans.children[0].classList.add("on");
}

// Add data
function addData(question, index) {
  if (index < questions.length) {
    const questionElement = document.createElement("h2");
    questionElement.textContent = question.title;
    quizArea.appendChild(questionElement);

    for (let i = 1; i <= 4; i++) {
      const answerDiv = document.createElement("div");
      answerDiv.className = "answer";
      const input = document.createElement("input");
      input.type = "radio";
      input.id = `answer_${i}`;
      input.name = "question";
      input.dataset.answer = question[`answer_${i}`];
      const label = document.createElement("label");
      label.textContent = question[`answer_${i}`];
      label.htmlFor = `answer_${i}`;
      answerDiv.appendChild(input);
      answerDiv.appendChild(label);
      quizAnswers.appendChild(answerDiv);
    }
    document.querySelector(".answer:first-child input").checked = true;
  }
}

// Check answers
function checkAnswer() {
  submitButton.addEventListener("click", () => {
    const answerChosen = document.querySelector(".answer input:checked");
    if (answerChosen.dataset.answer === questions[currentIndex].right_answer) {
      currentIndex++;
      rightAnswers++;
      quizAnswers.innerHTML = "";
      quizArea.innerHTML = "";
      addData(questions[currentIndex], currentIndex);
    } else {
      quizAnswers.innerHTML = "";
      quizArea.innerHTML = "";
      currentIndex++;
      addData(questions[currentIndex], currentIndex);
    }
    currentIndex < questions.length
      ? bulletsSpans.children[currentIndex].classList.add("on")
      : false;
    message();
    clearInterval(startTime);
    countDownFunction();
  });
}

// Message function
function message() {
  if (currentIndex === questions.length) {
    quizArea.remove();
    quizAnswers.remove();
    submitButton.remove();
    bullets.remove();
    const resultSpan = document.createElement("span");
    if (rightAnswers === 4) {
      resultSpan.textContent = "Perfect";
      resultSpan.className = "perfect";
    } else if (rightAnswers >= 2) {
      resultSpan.textContent = "Good";
      resultSpan.className = "good";
    } else {
      resultSpan.textContent = "Bad";
      resultSpan.className = "bad";
    }
    results.appendChild(resultSpan);
    const resultText = document.createTextNode(
      `You answered ${rightAnswers} out of ${questions.length}`
    );
    results.appendChild(resultText);
  }
}

// Countdown
function countDownFunction() {
  if (currentIndex < questions.length) {
    let time = 10;
    startTime = setInterval(() => {
      time--;
      countdown.textContent = formatTime(time);
      if (time === 0) {
        clearInterval(startTime);
        submitButton.click();
      }
    }, 1000);
  }
}

// Format time
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
