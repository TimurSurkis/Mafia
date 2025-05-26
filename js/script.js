const startForm = document.querySelector('#start-form');
const playerName = document.querySelector('#name');
const playerRole = document.querySelector('#role');
const submitBtn = document.querySelector('#submit');
const gameInfo = document.querySelector('#game-info');

function addHidden(para) {
    para.setAttribute("hidden", "true");
}

function removeHidden(para) {
    para.removeAttribute('hidden');
}

addHidden(gameInfo);

let newPlayer;

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const playerInfo = document.querySelector("#player-info");
    if (playerRole != "default") {
        removeHidden(gameInfo);
        playerInfo.innerHTML = `Name: ${playerName.value} <br> Role: ${playerRole.value}`;
    }
})

const startBtn = document.querySelector('#start-btn');
const textarea = document.querySelector('#hello-name');
const continueBtn = document.querySelector('#continue');
const nights = document.querySelector('#night-count');
const chooseMafia = document.querySelector('#choose-mafia');
const chooseMafiaBtn = document.querySelector('#choose-mafia-btn');

startBtn.onclick = () => {
    addHidden(startForm);
    addHidden(gameInfo);

    if (playerRole.value == "detective") {
        removeHidden(continueBtn);
        removeHidden(textarea);;
        textarea.innerText = `Hello, ${playerName.value}! You are a detective. There're mafia, civilians, and a doctor. Your task is to find out who the mafia is. Good luck!`;
    }
}

let mafia = 1; // Number of mafia members
let detective = 1; // Number of detectives
let doctor = 1; // Number of doctors
let civilians = 3; // Number of civilians
let nightCount = 0;
let doctorMessage;
let previousDoctorMessage;

if (playerRole.value == "detective") {
    const randomMafia = Math.floor(Math.random() * (mafia + doctor + civilians) + 1);

    continueBtn.onclick = () => {
        chooseMafia.innerHTML = ""; // Clear previous options
        for (let i = 1; i <= mafia+doctor+civilians; i++) {
            chooseMafia.innerHTML += `<option value="${i}">Player ${i}</option>`
        }

        addHidden(continueBtn);
        nightCount += 1;
        nights.textContent = `Night ${nightCount}`;

        if (nightCount == 1) {
            textarea.textContent = "1st night...";
        } else if (nightCount == 2) {
            textarea.textContent = "2nd night...";
        } else if (nightCount == 3) {
            textarea.textContent = "3rd night...";
        } else {
            textarea.textContent = `${nightCount}th night...`;
        };  

        setTimeout(() => {
            textarea.textContent += `\nThe mafia is planning their move...`;
            let killRandom = Math.floor(Math.random() * 5 + 1);
            console.log(killRandom);

            if (doctor == 0) {
                killRandom = Math.floor(Math.random() * 5 + 2); // If no doctor, mafia can only kill player or civilian
            }

            if (killRandom == 1) {
                doctor -= 1; // Doctor killed
                doctor += 1;
            } else if (killRandom == 2) {
                detective -= 1; // Player killed
            } else if(killRandom >= 3) {
                civilians -= 1; // Civilian killed
            }

            if (doctor > 0) {
                setTimeout(() => {
                    let possibleValues;
                    textarea.textContent += `\nDoctor is trying to save someone...`;

                    if (previousDoctorMessage == `Doctor has saved themselves.`) {
                        possibleValues = [2, 3, 4, 5]; // If doctor saved themselves last time, they can only save player or civilian
                    } else if (previousDoctorMessage == `Doctor has saved the player.`) {
                        possibleValues = [1, 3, 4, 5]; // If doctor saved player last time, they can only save themselves or civilian
                    } else if (previousDoctorMessage == `Doctor has saved a civilian.`) {
                        possibleValues = [1, 2]; // If doctor saved civilian last time, they can only save themselves or player
                    } else {
                        possibleValues = [1, 2, 3, 4, 5]; // If no previous message, doctor can save themselves, player, or civilian
                    }
                    console.log(possibleValues);
                    let saveRandom = Math.floor(Math.random() * possibleValues.length);
                    saveRandom = possibleValues[saveRandom]; // Get a random value from the possible values
                    
                        if (saveRandom == 1) {
                            doctor += 1; // Doctor saves themselves
                            doctorMessage = `Doctor has saved himself.`;
                        } else if (saveRandom == 2) {
                            detective += 1; // Player saved
                            doctorMessage = `Doctor has saved the player.`;
                        } else if(saveRandom >= 3) {
                            civilians += 1; // Civilian saved
                            doctorMessage = `Doctor has saved a civilian.`;
                        };
                }, 2000);
            }

            const yourMoveDelay = doctor > 0 ? 4000 : 2000; // Delay for your move based on whether doctor is alive

            if (killRandom == 1 && doctor > 0) {
                doctor -= 1; // Doctor killed
            }

            setTimeout(() => {
                textarea.textContent += `\n\nYour move. Choose who's the mafia.`;
                removeHidden(chooseMafia);
                removeHidden(chooseMafiaBtn);

                chooseMafiaBtn.onclick = () => {
                    addHidden(chooseMafia);
                    addHidden(chooseMafiaBtn);
                    if (chooseMafia.value == randomMafia) {
                        mafia -= 1; // Mafia killed
                    } else {
                        mafia = mafia; // Mafia not killed
                    }
                    endNight();
                }
            }, yourMoveDelay);

        }, 1000);
    }
}

let previousDoctor = 1; // Store previous doctor count
let previousCivilians = 3; // Store previous civilians count

function endNight() {
    setTimeout(() => {
        textarea.textContent = `Night ${nightCount} is over.`;

        if (civilians == 0) {
            textarea.textContent += `\nAll civilians have been killed. The game is over.`;
            removeHidden(continueBtn);
            return; // End the game if all civilians are dead
        }
        if (civilians < previousCivilians) {
            textarea.textContent += `\nOne civilian has been killed.`;
            previousCivilians = civilians; // Update previous civilian count
        }
        
        if (doctor > 0) {
            setTimeout(() => {
                textarea.textContent += `\n${doctorMessage}`;
            }, 2000);
        }

        previousDoctorMessage = doctorMessage; // Store the last doctor message

        if (doctor < previousDoctor) {
            setTimeout(() => {
                textarea.textContent += `\nThe doctor has been killed.`;
                previousDoctor = doctor; // Update previous doctor count
            }, 3000);
        }
        
        setTimeout(() => {
            if (detective == 0 && mafia == 0) {
                textarea.textContent += `\nMafia and you have been killed. The game is over.`;
            } else if (detective == 0 && mafia > 0) {
                textarea.textContent += `\nYou've been killed. Mafia has won!`;
            } else if (detective > 0 && mafia == 0) {
                textarea.textContent += `\nMafia has been killed. You have won!`;
            } else {
                textarea.textContent += `\nYou haven't found mafia yet. The game continues...`;
                removeHidden(continueBtn);
            }
        }, 4000);
    }, 1000);
}
