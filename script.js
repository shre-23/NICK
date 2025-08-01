// Global variables
let candlesBlown = 0;
const totalCandles = 8;

// Global functions for HTML onclick handlers
function blowCandle(candleNumber) {
    const flame = document.getElementById(`flame-${candleNumber}`);
    
    // Check if candle is already blown out
    if (flame.classList.contains('blown-out')) {
        return;
    }
    
    // Blow out the candle
    flame.classList.add('blown-out');
    candlesBlown++;
    
    // Update progress
    document.getElementById('blown-count').textContent = candlesBlown;
    
    // Add confetti effect
    addConfetti();
    
    // Check if all candles are blown out
    if (candlesBlown === totalCandles) {
        setTimeout(() => {
            showPage('question-page');
            addConfetti();
        }, 1000);
    }
}

function selectAnswer(answer) {
    const resultDiv = document.getElementById('answer-result');
    const messages = {
        cake: "🎂 Lecker! Geburtstagskuchen ist das Beste! 🎂",
        presents: "🎁 Geschenke auspacken ist so aufregend! 🎁",
        friends: "👫 Freunde machen Geburtstage besonders! 👫",
        everything: "🎉 Du hast Recht! Alles an Geburtstagen ist großartig! 🎉"
    };
    
    resultDiv.innerHTML = messages[answer];
    addConfetti();
    
    // Show celebration message after a delay
    setTimeout(() => {
        resultDiv.innerHTML += "<br><br>🎈 Alles Gute zum 8. Geburtstag Nick! Hoffentlich ist dein Tag magisch! 🎈";
        addConfetti();
        
        // Show movie night prompt after another delay
        setTimeout(() => {
            showPage('movie-prompt-page');
            addConfetti();
        }, 3000);
    }, 2000);
}

// Page navigation functions
let isTransitioning = false; // Flag to prevent multiple transitions

function showPage(pageId) {
    // Prevent multiple transitions at the same time
    if (isTransitioning) {
        return;
    }
    
    // Get the currently active page
    const activePage = document.querySelector('.page.active');
    const currentPageId = activePage ? activePage.id : null;
    
    // Don't transition if we're already on the requested page
    if (currentPageId === pageId) {
        return;
    }
    
    isTransitioning = true;
    
    // Change page immediately for all pages
    switchToPage();
    
    // Function to actually switch pages
    function switchToPage() {
        // Hide all pages immediately
        const pages = document.querySelectorAll('.page');
        
        // Remove active class from all pages
        pages.forEach(page => {
            page.classList.remove('active');
            page.classList.remove('transition-out');
            page.classList.remove('transition-in');
        });
        
        // Show the requested page immediately
        const newPage = document.getElementById(pageId);
        if (newPage) {
            newPage.classList.add('active');
        }
        
        // Reset transition flag after a short delay
        setTimeout(() => {
            isTransitioning = false;
        }, 100);
    }
}

// Confetti animation
function addConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#a55eea'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 100);
    }
}

// Movie prompt functions
function answerMoviePrompt(answer) {
    if (answer === 'yes') {
        showPage('movie-trailers-page');
        addConfetti();
    } else {
        // Go directly to pottery page if user says no to movie night
        showPage('pottery-page');
        addConfetti();
    }
}

// Pottery painting functions
let selectedRating = 0;

function selectRating(rating) {
    selectedRating = rating;
    
    // Update UI to show selected rating
    const ratingBtns = document.querySelectorAll('.rating-btn');
    ratingBtns.forEach((btn, index) => {
        if (index + 1 <= rating) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    addConfetti();
}

function answerPottery(answer) {
    const resultDiv = document.getElementById('pottery-result');
    let message = '';
    
    if (answer === 'yes') {
        if (selectedRating >= 7) {
            message = "Das ist wunderbar! Du wirst am 23. August in Mainz eine tolle Tasse gestalten! 🎨";
        } else if (selectedRating >= 4) {
            message = "Super! Es wird ein tolles Erlebnis sein, deine eigene Tasse am 23. August in Mainz zu bemalen! 🎨";
        } else {
            message = "Klasse! Keine Sorge, wenn du noch nicht so sicher bist, du wirst viel Spaß beim Gestalten deiner Tasse am 23. August in Mainz haben! 🎨";
        }
    } else {
        message = "Das ist in Ordnung! Wir können eine andere lustige Aktivität zusammen finden! 🎮";
    }
    
    resultDiv.innerHTML = message;
    addConfetti();
    
    // Show Greece page after a delay
    setTimeout(() => {
        showPage('greece-page');
        addConfetti();
    }, 4000);
}

// Movie trailer functions
function showTrailer(movieId) {
    const trailerOverlay = document.getElementById('trailer-overlay');
    const trailerContent = document.getElementById('trailer-content');
    
    // YouTube trailer IDs
    const trailers = {
        'harry-potter': 'vAKb6OySiks', // Harry Potter and the Sorcerer's Stone trailer
        'big-hero-6': 'Sa0OmhohPPA',   // Big Hero 6 trailer
        'jungle-book': 'ueC206L0W1I'    // The Jungle Book (2016) trailer
    };
    
    // Create iframe with YouTube embed
    trailerContent.innerHTML = `
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${trailers[movieId]}" 
                frameborder="0" allowfullscreen></iframe>
    `;
    
    // Show the overlay
    trailerOverlay.classList.add('active');
    
    // Add keyboard listener for ESC key
    document.addEventListener('keydown', handleTrailerKeydown);
    
    // Add click outside to close
    trailerOverlay.addEventListener('click', handleTrailerClick);
}

function closeTrailer() {
    const trailerOverlay = document.getElementById('trailer-overlay');
    const trailerContent = document.getElementById('trailer-content');
    
    // Clear the content to stop video playback
    trailerContent.innerHTML = '';
    
    // Hide the overlay
    trailerOverlay.classList.remove('active');
    
    // Remove event listeners
    document.removeEventListener('keydown', handleTrailerKeydown);
    trailerOverlay.removeEventListener('click', handleTrailerClick);
}

// Helper functions for trailer controls
function handleTrailerKeydown(event) {
    if (event.key === 'Escape') {
        closeTrailer();
    }
}

function handleTrailerClick(event) {
    // Close if clicking outside the trailer container
    if (event.target === event.currentTarget) {
        closeTrailer();
    }
}

// Greek facts function
function showGreekFact(location) {
    const factElement = document.getElementById('greece-fact');
    const facts = {
        'athens': "Athen ist die Heimat der Akropolis, einer 2.500 Jahre alten antiken Zitadelle mit dem berühmten Parthenon-Tempel! 🏛️",
        'santorini': "Santorini hat wunderschöne weiße Gebäude mit blauen Kuppeln und wurde durch einen gewaltigen Vulkanausbruch vor Tausenden von Jahren geformt! 🌋",
        'crete': "Kreta ist die größte Insel Griechenlands und war die Heimat der antiken minoischen Zivilisation mit erstaunlichen Palästen wie Knossos! 🏝️",
        'rhodes': "Rhodos hat eine riesige mittelalterliche Altstadt und hatte einst eine gigantische Statue namens Koloss von Rhodos, eines der Sieben Weltwunder der Antike! 🏰",
        'mykonos': "Mykonos ist berühmt für seine Windmühlen, wunderschönen Strände und ein Viertel namens 'Klein-Venedig', wo Gebäude über dem Meer hängen! ⛵",
        'thessaloniki': "Thessaloniki ist die zweitgrößte Stadt Griechenlands mit einer wunderschönen Uferpromenade und dem berühmten Weißen Turm! Sie hat köstliches Essen und über 2.300 Jahre Geschichte! 🗼"
    };
    
    factElement.innerHTML = facts[location] || "Klicke auf einen Ort, um einen interessanten Fakt zu erfahren!";
    factElement.classList.add('fact-highlight');
    
    // Remove highlight after animation completes
    setTimeout(() => {
        factElement.classList.remove('fact-highlight');
    }, 3000);
}

// Greece page timer functionality
let greeceTimerInterval;

// Function to start the Greece page timer
function startGreeceTimer() {
    const timerElement = document.getElementById('greece-timer');
    const continueButton = document.getElementById('greece-continue-btn');
    let timeLeft = 60; // 60 seconds = 1 minute
    
    // Make sure the button is disabled initially
    continueButton.disabled = true;
    continueButton.style.opacity = '0.5';
    continueButton.style.cursor = 'not-allowed';
    
    // Clear any existing interval
    if (greeceTimerInterval) {
        clearInterval(greeceTimerInterval);
    }
    
    // Update the timer every second
    greeceTimerInterval = setInterval(() => {
        timeLeft--;
        
        // Calculate minutes and seconds for display
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        // Update the timer text
        timerElement.textContent = `Erkunde die Karte für ${minutes}:${seconds < 10 ? '0' : ''}${seconds} Minuten`;
        
        // When time is up, enable the continue button
        if (timeLeft <= 0) {
            clearInterval(greeceTimerInterval);
            timerElement.textContent = 'Du kannst jetzt fortfahren!';
            continueButton.disabled = false;
            continueButton.style.opacity = '1';
            continueButton.style.cursor = 'pointer';
            
            // Add event listener to the button
            continueButton.onclick = function() {
                showPage('final-page');
            };
            
            // Add confetti effect
            addConfetti();
        }
    }, 1000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Show landing page first
    showPage('landing-page');
    
    // Add click handler to the landing page to proceed to candles
    document.getElementById('landing-page').addEventListener('click', function() {
        showPage('candle-page');
        addConfetti();
    });
    
    // Add some initial confetti on load
    setTimeout(() => {
        addConfetti();
    }, 500);
    
    // Add observer to detect when Greece page becomes active
    let greeceTimerStarted = false; // Flag to prevent multiple timer starts
    
    const greecePageObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'class' &&
                document.getElementById('greece-page').classList.contains('active') &&
                !greeceTimerStarted) {
                // Start the timer when Greece page becomes active (only once)
                greeceTimerStarted = true;
                setTimeout(() => {
                    startGreeceTimer();
                }, 500); // Small delay to ensure page is fully loaded
            } else if (mutation.type === 'attributes' && 
                       mutation.attributeName === 'class' &&
                       !document.getElementById('greece-page').classList.contains('active')) {
                // Reset flag when leaving Greece page
                greeceTimerStarted = false;
            }
        });
    });
    
    // Start observing the Greece page for class changes
    if (document.getElementById('greece-page')) {
        greecePageObserver.observe(document.getElementById('greece-page'), {
            attributes: true
        });
    }
});
