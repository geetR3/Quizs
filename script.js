// Function to fetch quiz data from a JSON file
async function fetchQuizData() {
    try {
        const response = await fetch('quizData.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Global variables
let quizData = [];
let currentQuestion = 0;
let selectedAnswers = [];

// Get elements from the DOM
const questionEl = document.querySelector('.question');
const optionsEl = document.querySelector('.options');
const resultEl = document.querySelector('.result');
const scoreEl = document.getElementById('score');
const backBtn = document.querySelector('.back-btn');
const nextBtn = document.querySelector('.next-btn');
const submitBtn = document.querySelector('.submit-btn');
const restartBtn = document.querySelector('.restart-btn');

// Initialize the quiz
async function initQuiz() {
    quizData = await fetchQuizData();
    if (quizData && quizData.length > 0) {
        selectedAnswers = new Array(quizData.length).fill(null);
        loadQuestion();
    } else {
        questionEl.textContent = "Error loading quiz data.";
    }
}

// Load the current question
function loadQuestion() {
    if (currentQuestion >= quizData.length) {
        return;
    }

    const currentQuiz = quizData[currentQuestion];
    questionEl.textContent = `${currentQuestion + 1}. ${currentQuiz.question}`;
    optionsEl.innerHTML = '';

    currentQuiz.options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.textContent = option;
        // अब onclick event सीधे checkAndSelectAnswer फ़ंक्शन को कॉल करेगा
        button.onclick = () => checkAndSelectAnswer(option, button);
        
        // पिछले चयन को हाइलाइट करें
        if (selectedAnswers[currentQuestion] === option) {
            button.classList.add('selected');
        }

        // यदि उत्तर पहले ही दिया जा चुका है, तो सही/गलत रंग दिखाएं
        if (selectedAnswers[currentQuestion] !== null) {
            if (option === currentQuiz.answer) {
                button.classList.add('correct');
            } else if (option === selectedAnswers[currentQuestion]) {
                button.classList.add('incorrect');
            }
        }
        optionsEl.appendChild(button);
    });

    // बटनों को दिखाएँ/छुपाएँ
    backBtn.style.display = currentQuestion === 0 ? 'none' : 'block';
    nextBtn.style.display = currentQuestion === quizData.length - 1 ? 'none' : 'block';
    submitBtn.style.display = currentQuestion === quizData.length - 1 ? 'block' : 'none';
}

// चेक करें और उत्तर को चुनें, साथ ही तुरंत रंग बदलें
function checkAndSelectAnswer(selectedOption, clickedButton) {
    // अगर उत्तर पहले से ही चुना हुआ है, तो कुछ न करें
    if (selectedAnswers[currentQuestion] !== null) {
        return;
    }

    selectedAnswers[currentQuestion] = selectedOption;
    
    // सभी विकल्पों के लिए 'selected' क्लास हटाएँ
    document.querySelectorAll('.options .option').forEach(btn => {
        btn.classList.remove('selected');
    });

    clickedButton.classList.add('selected');
    
    // सही और गलत उत्तरों का रंग बदलें
    const currentQuiz = quizData[currentQuestion];
    const isCorrect = (selectedOption === currentQuiz.answer);
    
    // सभी विकल्पों को सही या गलत के अनुसार रंग दें
    document.querySelectorAll('.options .option').forEach(btn => {
        if (btn.textContent === currentQuiz.answer) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedOption) {
            btn.classList.add('incorrect');
        }
    });

    // थोड़ी देर बाद अगले प्रश्न पर जाएं
    setTimeout(() => {
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            loadQuestion();
        } else {
            // अंतिम प्रश्न पर, सबमिट बटन दिखाने के लिए
            submitBtn.style.display = 'block';
            nextBtn.style.display = 'none';
        }
    }, 1000); // 1 सेकंड का विलंब
}

// Navigate to the next question
nextBtn.addEventListener('click', () => {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
});

// Navigate to the previous question
backBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
});

// Submit the quiz and calculate the score
submitBtn.addEventListener('click', () => {
    let score = 0;
    for (let i = 0; i < quizData.length; i++) {
        if (selectedAnswers[i] === quizData[i].answer) {
            score++;
        }
    }
    endQuiz(score);
});

// End the quiz and show the results
function endQuiz(finalScore) {
    questionEl.style.display = 'none';
    optionsEl.style.display = 'none';
    backBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'none';
    resultEl.style.display = 'block';
    scoreEl.textContent = `${finalScore} out of ${quizData.length}`;
    restartBtn.style.display = 'block';
}

// Restart the quiz
restartBtn.addEventListener('click', () => {
    currentQuestion = 0;
    selectedAnswers = new Array(quizData.length).fill(null);
    questionEl.style.display = 'block';
    optionsEl.style.display = 'flex';
    resultEl.style.display = 'none';
    restartBtn.style.display = 'none';
    loadQuestion();
});

// Initialize the quiz
initQuiz();
