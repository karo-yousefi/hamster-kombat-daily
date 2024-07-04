const API = "https://nabikaz.github.io/HamsterKombat-API/config.json";
const cardsDirectory = "src/cards.json"

const cardOneTitle = document.getElementById("card-one-title");
const cardTwoTitle = document.getElementById("card-two-title");
const cardThreeTitle = document.getElementById("card-three-title");

const cardOneCat = document.getElementById("card-one-cat");
const cardTwoCat = document.getElementById("card-two-cat");
const cardThreeCat = document.getElementById("card-three-cat");

const cardOnePic = document.getElementById("card-one-pic");
const cardTwoPic = document.getElementById("card-two-pic");
const cardThreePic = document.getElementById("card-three-pic");




function getAPI(API, cardsDirectory){
    fetch(API)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(apiData => {
        let dailyCard = apiData.dailyCard;
        let morseCode = apiData.morseCode;

        // Check if dailyCard is an array and has at least 3 elements
        // if (!Array.isArray(dailyCard) || dailyCard.length < 3) {
        //     throw new Error('Invalid dailyCard data');
        // }

        fetch(cardsDirectory)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const cardOne = data[dailyCard[0]];
            const cardTwo = data[dailyCard[1]];
            const cardThree = data[dailyCard[2]];

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

            cardOnePic.src = cardOne.pic;
            cardTwoPic.src = cardTwo.pic;
            cardThreePic.src = cardThree.pic;

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


getAPI(API);





// function getAPI(API){
//     fetch(API)
//     .then(response => response.json())
//     .then(apiData => {
//         let dailyCard = apiData.dailyCard;
//         let morseCode = apiData.morseCode;

//         fetch(cardsDirectory)
//         .then(response => response.json())
//         .then(data => {
            
//             const cardOne = data[dailyCard[0]];
//             const cardTwo = data[dailyCard[1]];
//             const cardThree = data[dailyCard[2]];

//             cardOneTitle.innerHTML = cardOne.name;
//             cardTwoTitle.innerHTML = cardTwo.name;
//             cardThreeTitle.innerHTML = cardThree.name;

//             cardOneCat.innerHTML = cardOne.cat;
//             cardTwoCat.innerHTML = cardTwo.cat;
//             cardThreeCat.innerHTML = cardThree.cat;

//             cardOnePic.src = cardOne;
//             cardTwoPic.src = cardTwo.pic;
//             cardThreePic.src = cardThree.pic;

//         })

//     })
//     .catch(error => {
//         console.log("--==ERROR==--");
//         console.log(error);
//     })
// }
