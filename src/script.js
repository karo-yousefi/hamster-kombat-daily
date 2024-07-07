const API = "https://nabikaz.github.io/HamsterKombat-API/config.json"; // API to get the daily data
const CARDS_DIR = "src/cards.json" // JSON file with all the cards data
const DAILY_CARDS_UPDATE_TIME = "12:00";  // Daily combo update time in UTC
const CIPHER_UPDATE_TIME = "19:00";  // Cipher code update time in UTC

// Daily cards name
const cardOneTitle = document.getElementById("card-one-title"); 
const cardTwoTitle = document.getElementById("card-two-title");
const cardThreeTitle = document.getElementById("card-three-title");

// Daily cards category
const cardOneCat = document.getElementById("card-one-cat");
const cardTwoCat = document.getElementById("card-two-cat");
const cardThreeCat = document.getElementById("card-three-cat");

 // Daily cards picture
const cardOnePic = document.getElementById("card-one-pic");
const cardTwoPic = document.getElementById("card-two-pic");
const cardThreePic = document.getElementById("card-three-pic");

// Cipher code (string + morse)
const cipherCode = document.getElementById("cipher-code");
const cipherCodeString = document.getElementById("cipher-code-string");

// Letters to morse code
const morseCodeDic = {
    "A": ".-",
    "B": "-...",
    "C": "-.-.",
    "D": "-..",
    "E": ".",
    "F": "..-.",
    "G": "--.",
    "H": "....",
    "I": "..",
    "J": ".---",
    "K": "-.-",
    "L": ".-..",
    "M": "--",
    "N": "-.",
    "O": "---",
    "P": ".--.",
    "Q": "--.-",
    "R": ".-.",
    "S": "...",
    "T": "-",
    "U": "..-",
    "W": ".--",
    "X": "-..-",
    "Y": "-.--",
    "Z": "--.."
 };

// A function to calculating the countdown timer
function calculateTimeRemaining(targetTimeUTC) {
	const now = new Date();
	const nowUTC = new Date(now.toISOString().slice(0, 19) + 'Z');
	const [targetHour, targetMinute] = targetTimeUTC.split(':').map(Number);

	const target = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth(), nowUTC.getUTCDate(), targetHour, targetMinute, 0));

	// If the target time is in the past, set it to the next day
	if (target < nowUTC) {
		target.setUTCDate(target.getUTCDate() + 1);
	}

	const timeRemaining = target - nowUTC;
	return timeRemaining;
}

function formatTime(ms) {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startCountdown(targetTimeUTC, elementId) {
	const timerElement = document.getElementById(elementId);

	function updateTimer() {
		const timeRemaining = calculateTimeRemaining(targetTimeUTC);

		if (timeRemaining <= 0) {
			targetTimeUTC = '24:00';
			setTimeout(() => startCountdown(targetTimeUTC, elementId), 1000);
			return;
		}

        if (elementId === "daily-title"){
		    timerElement.innerHTML = "Daily Cards | "+ formatTime(timeRemaining);
        }
        else{
		    timerElement.innerHTML = "Cipher | "+ formatTime(timeRemaining);
        }
	}

	updateTimer();
	setInterval(updateTimer, 1000);
}

// Converting the string to morse code and updating the HTML elements
async function stringToMorse(string){
    const word = await Array.from(string);
    let result = "";
    for(i of word){
        result += morseCodeDic[i];
        result += "  /  "; // Seperating the resulats by /
    }
    cipherCode.innerHTML = result;
    cipherCodeString.innerHTML = "( " + string + " )";
}


function getAPI(API, cardsDirectory){
    fetch(API)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(apiData => {
        
        const dailyCards= apiData.dailyCards;
        const morseCodeWord = apiData.morseCode;
        
        stringToMorse(morseCodeWord);

        // Check if dailyCard is an array and has at least 3 elements
        if (!Array.isArray(dailyCards) || dailyCards.length < 3) {
            console.error('Invalid dailyCard data:', dailyCards); // More detailed error log
            throw new Error('Invalid dailyCard data');
        }

        fetch(cardsDirectory)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const cardOne = data[dailyCards[0]];
            const cardTwo = data[dailyCards[1]];
            const cardThree = data[dailyCards[2]];


            // Check if cardOne, cardTwo, and cardThree exist
            if (!cardOne || !cardTwo || !cardThree) {
                throw new Error('Invalid card data');
            }

            cardOneTitle.innerHTML = cardOne.name;
            cardTwoTitle.innerHTML = cardTwo.name;
            cardThreeTitle.innerHTML = cardThree.name;

            cardOneCat.innerHTML = cardOne.cat;
            cardTwoCat.innerHTML = cardTwo.cat;
            cardThreeCat.innerHTML = cardThree.cat;

            cardOnePic.src = "src/cards/" + cardOne.pic + ".webp";
            cardTwoPic.src = "src/cards/" + cardTwo.pic + ".webp";
            cardThreePic.src = "src/cards/" + cardThree.pic + ".webp";


        })
        .catch(error => {
            console.log("--==ERROR in second fetch==--");
            console.log(error);
        });

    })
    .catch(error => {
        console.log("--==ERROR in first fetch==--");
        console.log(error);
    });
}


// Calling the fcuntions when the page refreshes 
startCountdown(DAILY_CARDS_UPDATE_TIME, 'daily-title'); // Initialize the countdown
startCountdown(CIPHER_UPDATE_TIME, "cipher-title"); // Initialize the countdown
getAPI(API, CARDS_DIR);

// Note: also need to be called when the timers hit zero