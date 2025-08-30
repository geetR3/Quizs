// Function to fetch quiz data from a JSON file
async function fetchQuizData() {
  try {
    const response = await fetch('quizData.json'); // File ka naam
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const quizData = await response.json();
    return quizData;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

// Global variable to hold quiz data
let quizData = [];

// Initialize the quiz
async function initQuiz() {
    quizData = await fetchQuizData();
    if (quizData && quizData.length > 0) {
        loadQuestion();
    } else {
        questionEl.textContent = "Error loading quiz data.";
    }
}

// ... baaki ka code waisa hi rahega ...

// Initialize the quiz with the first question
initQuiz();

        let currentQuestion = 0;
        let score = 0;
        let timeLeft = 30;
        let timerInterval;
        const timerEl = document.getElementById('time');
        const questionEl = document.querySelector('.question');
        const optionsEl = document.querySelector('.options');
        const resultEl = document.querySelector('.result');
        const scoreEl = document.getElementById('score');
        const restartBtn = document.querySelector('.restart-btn');

        // Function to load the question
        // Function to load the question
function loadQuestion() {
    if (currentQuestion >= quizData.length) {
        endQuiz();
        return;
    }
    clearInterval(timerInterval);
    timeLeft = 30;
    timerEl.textContent = timeLeft;
    startTimer();
    const currentQuiz = quizData[currentQuestion];

    // Question number aur text ko jodein
    questionEl.textContent = `${currentQuestion + 1}. ${currentQuiz.question}`;

    optionsEl.innerHTML = '';
    currentQuiz.options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsEl.appendChild(button);
    });
}

        // Check the answer
        function checkAnswer(selectedOption) {
            if (selectedOption === quizData[currentQuestion].answer) {
                score++;
            }
            currentQuestion++;
            loadQuestion();
        }

        // Start the timer
        function startTimer() {
            timerInterval = setInterval(() => {
                timeLeft--;
                timerEl.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    endQuiz();
                }
            }, 1000);
        }

        // End the quiz and show the results
      // End the quiz and show the results
function endQuiz() {
    clearInterval(timerInterval);
    questionEl.style.display = 'none';
    optionsEl.style.display = 'none';
    resultEl.style.display = 'block';

    // Total right answers and total questions ko display karein
    scoreEl.textContent = `${score} out of ${quizData.length}`;
    
    restartBtn.style.display = 'block';
}

        // Restart the quiz
        restartBtn.addEventListener('click', () => {
            // Reset variables
            currentQuestion = 0;
            score = 0;
            timeLeft = 30;
            timerEl.textContent = timeLeft;

            // Reset the display
            questionEl.style.display = 'block';
            optionsEl.style.display = 'flex'; // Ensure options are displayed correctly
            resultEl.style.display = 'none';
            restartBtn.style.display = 'none';

            // Load the first question
            loadQuestion();
        });

        // Initialize the quiz with the first question
loadQuestion();