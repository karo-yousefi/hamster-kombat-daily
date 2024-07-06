const API = "https://nabikaz.github.io/HamsterKombat-API/config.json";
const CARDS_DIR = "src/cards.json"
const DAILY_CARDS_UPDATE_TIME = "12:00"; 
const CIPHER_UPDATE_TIME = "19:00"; 

const cardOneTitle = document.getElementById("card-one-title");
const cardTwoTitle = document.getElementById("card-two-title");
const cardThreeTitle = document.getElementById("card-three-title");

const cardOneCat = document.getElementById("card-one-cat");
const cardTwoCat = document.getElementById("card-two-cat");
const cardThreeCat = document.getElementById("card-three-cat");

const cardOnePic = document.getElementById("card-one-pic");
const cardTwoPic = document.getElementById("card-two-pic");
const cardThreePic = document.getElementById("card-three-pic");




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

// Initialize the countdowns
startCountdown(DAILY_CARDS_UPDATE_TIME, 'daily-title');
startCountdown(CIPHER_UPDATE_TIME, "cipher-title");





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
        const morseCode = apiData.morseCode;


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


getAPI(API, CARDS_DIR);

