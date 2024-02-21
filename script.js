document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startButton').addEventListener('click', startGame); // Update event listener to call startGame
    document.getElementById('restartButton').addEventListener('click', restartGame);
    document.getElementById('memorizeButton').addEventListener('click', memorize);
    document.getElementById('hideWordButton').addEventListener('click', hideWordMode);

    fetchVerseOfTheDay(); // Start by fetching the verse of the day
});



// Global variables
let hintCount = 0;
let correctCount = 0;
let interval; // Timer interval
let hintInterval; // Hint interval
let timeLeft = 60; // Total time for the game
let verseOfTheDay; // Variable to store the randomly selected verse



function normalizeWord(word) {
    // Allow hyphens along with alphanumeric characters and remove other punctuation/whitespace
    return word.toLowerCase().replace(/[^\w\s-]|_/g, "").replace(/\s+/g, ' ');
}

/* function fetchVerseOfTheDay() {
    fetch('bible_verses.json')
        .then(response => response.json())
        .then(data => {
            // Randomly select a verse from the array
            verseOfTheDay = data[Math.floor(Math.random() * data.length)];
            displayVerseOfTheDay(); // Display the verse of the day and reference
            document.getElementById('startButton').addEventListener('click', startGame); // Add event listener to start button
        })
        .catch(error => {
            console.error('Error fetching verse of the day:', error);
        });
} */

function fetchVerseOfTheDay() {
    fetch('bible_verses.json')
        .then(response => response.json())
        .then(data => {
            const today = new Date();
            // Use the current day of the year to determine the index
            const startOfYear = new Date(today.getFullYear(), 0, 0);
            const diff = today - startOfYear;
            const oneDay = 1000 * 60 * 60 * 24;
            const dayOfYear = Math.floor(diff / oneDay);

            // Select a verse based on the day of the year, cycling through the array
            const verseIndex = dayOfYear % data.length;
            verseOfTheDay = data[verseIndex];
            displayVerseOfTheDay(); // Display the verse of the day and reference

            document.getElementById('startButton').addEventListener('click', startGame); // Add event listener to start button
        })
        .catch(error => {
            console.error('Error fetching verse of the day:', error);
        });
}


function displayVerseOfTheDay() {
    if (verseOfTheDay) {
        // Display the complete verse of the day and reference
        document.getElementById('verseOfDay').textContent = verseOfTheDay.text;
        document.getElementById('referenceVerse').textContent = verseOfTheDay.reference;
        document.getElementById('verseOfDay').classList.remove('hidden');
        document.getElementById('referenceVerse').classList.remove('hidden');
    } else {
        console.error('No verse of the day available.');
    }
}



function hideOtherButtons() {
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('memorizeButton').classList.add('hidden');
    document.getElementById('hideWordButton').classList.add('hidden');
    // Optionally show the restart button if you want to give users a way to reset or exit the mode
    document.getElementById('restartButton').classList.remove('hidden');
}

// Utility function to shuffle the words array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function hideOtherButtons() {
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('memorizeButton').classList.add('hidden');
    document.getElementById('hideWordButton').classList.add('hidden');
    // Optionally show the restart button if you want to give users a way to reset or exit the mode
    document.getElementById('restartButton').classList.remove('hidden');
}

// Utility function to shuffle the words array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}




// Shuffle array in place and return
function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function setupArrangeContainerEvents(arrangeContainer) {
    arrangeContainer.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow dropping by preventing default
    });

    arrangeContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text');
        const draggedElement = document.getElementById(id);
        // Simple drop logic, can be improved for precise placement
        arrangeContainer.appendChild(draggedElement);
    });
}

function hideOtherButtons() {
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('memorizeButton').classList.add('hidden');
    document.getElementById('hideWordButton').classList.add('hidden');
    document.getElementById('restartButton').classList.remove('hidden'); // Show the restart button
}



// Utility function to shuffle the words array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to determine where to drop the word based on the cursor position
function getDropPosition(cursorY, container) {
    const draggableElements = [...container.querySelectorAll('.draggable-word:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = cursorY - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


function hideWordMode() {
    // Display the instruction right after the function is invoked
    showInstruction("Tap any word to hide or unhide it from view.");
    document.getElementById('instructionText').style.display = 'block'; // Make the instruction text visible

    const verseContainer = document.getElementById('verseOfDay');
    verseContainer.innerHTML = ''; // Clear existing content

    // Assuming verseOfTheDay is already fetched and available
    const words = verseOfTheDay.text.split(' ');
    
    words.forEach(word => {
        // Create an outer container for each word
        const wordContainer = document.createElement('span');
        wordContainer.className = 'wordContainer';

        // Create a span for the word itself
        const wordSpan = document.createElement('span');
        wordSpan.className = 'wordSpan';
        wordSpan.textContent = word;

        // Append the wordSpan to the wordContainer
        wordContainer.appendChild(wordSpan);
        verseContainer.appendChild(wordContainer);
        verseContainer.appendChild(document.createTextNode(' ')); // Maintain space

        // Toggle fade-out effect on click
        wordSpan.addEventListener('click', function() {
            this.classList.toggle('fade-out');
        });
    });

    // Optionally hide other buttons to focus on Hide A Word mode
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('memorizeButton').classList.add('hidden');
    document.getElementById('hideWordButton').classList.add('hidden');
    document.getElementById('restartButton').classList.add('hidden'); // Option to show restart button
}



function showInstruction(text) {
    const instructionElement = document.getElementById('instructionText');
    instructionElement.textContent = text;
    instructionElement.style.display = 'block'; // Ensure it's visible when updating text
}

function memorize() {
    // Hide buttons to focus on the memorization task
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('memorizeButton').classList.add('hidden');
    document.getElementById('hideWordButton').classList.add('hidden');
    document.getElementById('progressBar').classList.add('hidden');

    // Clear existing content and set up for memorization
    const verseContainer = document.getElementById('verseOfDay');
    verseContainer.innerHTML = ''; // Clear for new setup
    showInstruction("Words fade away every few seconds. Refresh the page to start over.");

    // Assuming verseOfTheDay is defined and contains text
    const words = verseOfTheDay.text.split(' ');

    // Create word containers and append them to the verse container
    words.forEach(word => {
        const wordContainer = document.createElement('span');
        wordContainer.className = 'wordContainer';

        const wordSpan = document.createElement('span');
        wordSpan.className = 'wordSpan';
        wordSpan.textContent = word;

        wordContainer.appendChild(wordSpan);
        verseContainer.appendChild(wordContainer);
        verseContainer.appendChild(document.createTextNode(' ')); // Maintain spacing
    });

    let wordIndices = Array.from({ length: words.length }, (_, index) => index); // Array of word indices
    let currentIndex = 0; // Initialize the current index of the word to fade out

    const timer = setInterval(() => {
        const wordSpans = document.querySelectorAll('.wordSpan'); // Select all word spans
        const wordIndex = wordIndices[currentIndex]; // Select the word index to fade out
        const wordSpan = wordSpans[wordIndex]; // Select the corresponding word span
        wordSpan.classList.add('fade-out'); // Apply fade-out class

        currentIndex = (currentIndex + 1) % wordIndices.length; // Move to the next index

        // Check if all words have faded out
        if ([...wordSpans].every(span => span.classList.contains('fade-out'))) {
            clearInterval(timer); // Clear timer if all words have faded out
            // Reset all word spans to visible after a delay of 3 seconds
            setTimeout(() => {
                wordSpans.forEach(span => span.classList.remove('fade-out')); // Remove fade-out class
                // Shuffle the word indices for the next round
                wordIndices = shuffleArray(wordIndices);
                currentIndex = 0; // Reset current index
            }, 3000);
        }
    }, 7000); // Adjusted interval time to 7 seconds
}

// Function to shuffle array elements
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}




function completeMemorization(timer) {
    clearInterval(timer);
    const spans = document.querySelectorAll('#verseOfDay .wordSpan');
    spans.forEach(span => {
        span.style.color = '#FFFFFF'; // Reset text color to make it visible again
    });
/*     document.getElementById('startButton').disabled = false;
    document.getElementById('memorizeButton').disabled = false; */
    document.getElementById('startButton').classList.remove('hidden'); // Show the start button
    document.getElementById('memorizeButton').classList.remove('hidden'); // Show the memorize button
    document.getElementById('hideWordButton').classList.remove('hidden'); // Show the hide word button
}










function startGame() {
    if (!verseOfTheDay) {
        console.error('No verse of the day available.');
        return;
    }

    showInstruction("Enter the verse word by word. Hints will appear to assist you if you get stuck.");

    document.getElementById('startButton').classList.add('hidden'); // Hide the start button
    document.getElementById('memorizeButton').classList.add('hidden'); // Hide the memorize button
    document.getElementById('hideWordButton').classList.add('hidden'); // Hide the hide word button
    document.getElementById('verseOfDay').classList.add('hidden'); // Hide the complete verse
    document.getElementById('timer').classList.remove('hidden'); // Show the timer
    document.getElementById('progressBar').classList.remove('hidden'); // Show the progress bar
    const words = verseOfTheDay.text.split(' ');
    const verseContainer = document.getElementById('verseContainer');
    verseContainer.innerHTML = '';

    words.forEach((word, index) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'wordInput';
        input.setAttribute('maxlength', 20);
        input.dataset.correctWord = normalizeWord(word);
        input.dataset.index = index;

        input.addEventListener('input', function() {
            if (normalizeWord(this.value) === this.dataset.correctWord) {
                this.classList.add('correct');
                this.classList.remove('incorrect');
                correctCount++;
                if (correctCount === words.length) {
                    clearInterval(interval);
                    clearInterval(hintInterval);
                    endGame();
                }
            } else {
                this.classList.remove('correct');
                this.classList.add('incorrect');
            }
        });

        verseContainer.appendChild(input);
    });

    startTimer();
    scheduleHints(words);
}


function startTimer() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `Time left: ${timeLeft}s`;

    interval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time left: ${timeLeft}s`;
        updateProgressBar(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(interval);
            clearInterval(hintInterval);
            revealAllWords();
            endGame();
        }
    }, 1000);
}

function scheduleHints(words) {
    const wordIndices = Array.from({ length: words.length }, (_, index) => index);
    shuffleArray(wordIndices); // Shuffle the array of word indices
    let hintIndex = 0;
    let totalWordLength = words.reduce((acc, word) => acc + word.length, 0);
    let averageWordLength = totalWordLength / words.length;
    let hintIntervalTime;

    if (words.length > 20) {
        hintIntervalTime = 5000; // If more than 20 words, set interval time to 5 seconds
    } else {
        hintIntervalTime = 10000; // If less than or equal to 20 words, set interval time to 10 seconds
    }

    hintInterval = setInterval(() => {
        if (hintIndex < words.length && timeLeft > 0) {
            provideHint(words[wordIndices[hintIndex]], wordIndices[hintIndex]);
            hintIndex++;
        }
    }, hintIntervalTime / (averageWordLength / 5));
}



function provideHint(word, index) {
    const input = document.querySelector(`input.wordInput[data-index="${index}"]:not(.correct):not(:disabled)`);
    if (input) {
        input.value = normalizeWord(word);
        input.classList.add('hint');
        input.disabled = true;
        hintCount++;
    }
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}





function updateProgressBar(timeLeft) {
    const progressBar = document.getElementById('progressBar');
    const progress = ((60 - timeLeft) / 60) * 100;
    progressBar.value = progress;
}

function revealAllWords() {
    const inputs = document.querySelectorAll('input.wordInput');
    inputs.forEach(input => {
        const correctWord = input.dataset.correctWord;
        if (!input.classList.contains('correct')) {
            input.value = correctWord; // Show correct word for all inputs not correctly answered
            input.classList.remove('incorrect');
        }
        input.disabled = true;
    });
}

function endGame() {
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('progressBar').classList.add('hidden');
    document.getElementById('restartButton').classList.remove('hidden'); // Show the restart button
    const scoreDisplay = document.createElement('div');
    scoreDisplay.setAttribute('id', 'scoreSummary'); // Set ID for the scoreDisplay

    const verseText = verseOfTheDay.text;
    const wordsInVerse = verseText.split(' ');
    const totalWords = wordsInVerse.length;

    const inputs = document.querySelectorAll('input.wordInput');
    let incorrectWords = [];

    inputs.forEach(input => {
        const index = input.dataset.index;
        const correctWord = input.dataset.correctWord;
        if (input.classList.contains('incorrect')) {
            incorrectWords.push({ index, incorrectWord: input.value, correctWord });
        }
    });

    let scoreSummary = `<h3>Score Summary</h3>`;
    scoreSummary += `<p>Total Words: ${totalWords}</p>`;
    scoreSummary += `<p class="correct-words">Correct Words: ${correctCount}</p>`; // Example of adding a class
    if (incorrectWords.length > 0) {
        scoreSummary += `<p class="incorrect-words">Incorrect Words: ${incorrectWords.length}</p>`;
        incorrectWords.forEach(incorrectWord => {
            scoreSummary += `<p class="incorrect-word-detail">${incorrectWord.incorrectWord} (${incorrectWord.correctWord})</p>`; // Example of adding a class
        });
    }
    scoreSummary += `<p>Hints Used: ${hintCount}</p>`;
    scoreSummary += `<p class="total-score">Total Score: ${correctCount - (hintCount - incorrectWords.length)}</p>`; // Example of adding a class

    scoreDisplay.innerHTML = scoreSummary;
    document.getElementById('app').appendChild(scoreDisplay);
}



function restartGame() {
    // Remove the score summary if it exists
    const scoreSummaryElement = document.getElementById('scoreSummary');
    if (scoreSummaryElement) {
        scoreSummaryElement.remove();
    }

    // Reset variables
    correctCount = 0;
    hintCount = 0;

    // Clear intervals
    clearInterval(interval);
    clearInterval(hintInterval);

    // Reset timer
    timeLeft = 60;
    updateProgressBar(timeLeft);
    document.getElementById('timer').textContent = `Time left: ${timeLeft}s`;

    // Remove words and reset input fields
    const verseContainer = document.getElementById('verseContainer');
    verseContainer.innerHTML = '';

    // Restart the game with the same verse
    startGame();

    // Hide the restart button
    document.getElementById('restartButton').classList.add('hidden');
}

document.getElementById('restartButton').addEventListener('click', restartGame);

