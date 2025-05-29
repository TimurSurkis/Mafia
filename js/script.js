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
let civilians = 4; // Number of civilians
let nightCount = 0;
let doctorMessage;
let previousDoctorMessage;
let randomMafia;
let randomDoctor;
let randomPlayer;
let possibleValues = [];
let valueToRemove;
let playerToRemove;
let playerToPush;
let index;
let killRandom;
let saveRandom;
let previousSave;
const allPlayers = mafia + detective + doctor + civilians;

for (let i = 1; i <= allPlayers; i++) {
    possibleValues.push(i); // Create an array of all players
}

if (playerRole.value == "detective") {
    randomMafia = Math.floor(Math.random() * (mafia + doctor + civilians) + 1);
    randomDoctor = Math.floor(Math.random() * (mafia + doctor + civilians) + 1);
    randomPlayer = Math.floor(Math.random() * (mafia + doctor + civilians) + 1);
    while (randomMafia == randomDoctor) {
        randomDoctor = Math.floor(Math.random() * (mafia + doctor + civilians) + 1); // Ensure doctor and mafia are not the same
    }
    while (randomPlayer == randomMafia || randomPlayer == randomDoctor) {
        randomPlayer = Math.floor(Math.random() * (mafia + doctor + civilians) + 1); // Ensure player is not the same as mafia or doctor
    }
    console.log("Mafia: ", randomMafia);
    console.log("Doctor: ", randomDoctor);
    console.log("Player: ", randomPlayer);

    continueBtn.onclick = () => {
        chooseMafia.innerHTML = ""; // Clear previous options
        for (const player of possibleValues) {
            if (player != randomPlayer) {
                chooseMafia.innerHTML += `<option value="${player}">Player ${player}</option>`;
            }
        }

        addHidden(continueBtn);
        nightCount++;
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
            do {
                    killRandom = Math.floor(Math.random() * possibleValues.length);
                    killRandom = possibleValues[killRandom];
                    if (!possibleValues.includes(randomDoctor)) {
                        killRandom = Math.floor(Math.random() * possibleValues.length);
                        killRandom = possibleValues[killRandom];
                    } else {
                        continue; // Continue if doctor is alive
                    }
            } while (killRandom == randomMafia)

            console.log("Kill: ", killRandom);

            if (killRandom == randomDoctor) {
                playerToRemove = randomDoctor;
            } else if (killRandom == randomPlayer) {
                playerToRemove = randomPlayer;
            } else if(killRandom != randomMafia && killRandom != randomDoctor && killRandom != randomPlayer) {
                playerToRemove = killRandom; // Civilian choosed to be killed
            }

            if (possibleValues.includes(randomDoctor)) {
                setTimeout(() => {
                    textarea.textContent += `\nDoctor is trying to save someone...`;
                    let doctorPossibleValues = [...possibleValues]; // Create a copy of possible values to modify

                    // Doctor can't save the same player twice
                    if (previousSave == randomDoctor) {
                        valueToRemove = randomDoctor;
                        index = doctorPossibleValues.indexOf(valueToRemove);
                        if (index > -1) {
                            doctorPossibleValues.splice(index, 1); // Remove doctor from possible values
                        }
                    } else if (previousSave == randomPlayer) {
                        valueToRemove = randomPlayer;
                        index = doctorPossibleValues.indexOf(valueToRemove);
                        if (index > -1) {
                            doctorPossibleValues.splice(index, 1); // Remove player from possible values
                        }
                    } else if (previousSave != randomDoctor && previousSave != randomPlayer) {
                        valueToRemove = previousSave; // Civilian choosed to be saved
                        index = doctorPossibleValues.indexOf(valueToRemove);
                        if (index > -1) {
                            doctorPossibleValues.splice(index, 1); // Remove civilian from possible values
                        }
                    }

                    saveRandom = Math.floor(Math.random() * doctorPossibleValues.length);
                    console.log("Previous save: ", previousSave);
                    saveRandom = doctorPossibleValues[saveRandom]; // Get a random value from the possible values
                    previousSave = saveRandom; // Store the last saved player
                    console.log("Save: ", saveRandom);
                    
                        if (saveRandom == killRandom) {
                            playerToRemove = null; // No one was killed
                        }
                        if (saveRandom == randomDoctor) {
                            playerToPush = randomDoctor; // Add doctor back to possible values
                        } else if (saveRandom == randomPlayer) {
                            playerToPush = randomPlayer; // Add player back to possible values
                        } else if (saveRandom != randomDoctor && saveRandom != randomPlayer && killRandom == saveRandom) {
                            playerToPush = killRandom; // Add civilian back to possible values
                        } else if (saveRandom != randomDoctor && saveRandom != randomPlayer && killRandom != saveRandom) {
                            playerToPush = saveRandom;
                        }
                        if ((killRandom == randomDoctor && saveRandom != randomDoctor) || (killRandom == randomPlayer && saveRandom != randomPlayer)) {
                            doctorMessage = '';
                        }
                }, 2000);
            }

            const yourMoveDelay = possibleValues.includes(randomDoctor) ? 4000 : 2000; // Delay for your move based on whether doctor is alive

            setTimeout(() => {
                textarea.textContent += `\n\nYour move. Choose who's the mafia.`;
                removeHidden(chooseMafia);
                removeHidden(chooseMafiaBtn);

                chooseMafiaBtn.onclick = () => {
                    addHidden(chooseMafia);
                    addHidden(chooseMafiaBtn);
                    if (chooseMafia.value == randomMafia) {
                        possibleValues.splice(possibleValues.indexOf(randomMafia), 1); // Mafia killed
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

const votePlayer = document.querySelector('#vote-player');
const votePlayerBtn = document.querySelector('#vote-player-btn');

function endNight() {
    textarea.textContent = `Night ${nightCount} is over.`;
    let index;

    index = possibleValues.indexOf(playerToRemove);
    if (index > -1) {
        possibleValues.splice(index, 1); // Remove player from possible values
    }

    setTimeout(() => {
        if ((possibleValues - randomMafia - randomDoctor - randomPlayer).length == 0) {
            textarea.textContent += `\nAll civilians have been killed. The game is over.`;
            removeHidden(continueBtn);
            return; // End the game if all civilians are dead
        }

        let role;
        if (killRandom == randomDoctor) {
            role = "Doctor";
        } else if (killRandom != randomPlayer && killRandom != randomDoctor) {
            role = "Civilian";
        }

        if (killRandom != saveRandom) {
            textarea.textContent += `\nPlayer ${playerToRemove} has been killed. He was a ${role}.`;
        }

        if (possibleValues.includes(playerToPush) == false) {
            possibleValues.push(playerToPush); // Add player back to possible values
        } else {
            console.log("Player already exists in possible values.");
        }

        let doctorKillTimeout = 2000;
        let mafiaPlayerTimeout = 3000;

        if (possibleValues.includes(randomDoctor)) {
            setTimeout(() => {
                doctorKillTimeout = 3000;
                mafiaPlayerTimeout = 4000;
            }, 2000);
        }

        previousDoctorMessage = doctorMessage; // Store the last doctor message

        if (playerToRemove == randomDoctor) {
            setTimeout(() => {
                textarea.textContent += `\nDoctor has been killed.`;
                index = possibleValues.indexOf(playerToRemove);
                if (index > -1) {
                    possibleValues.splice(index, 1); // Remove doctor from possible values
                }
            }, doctorKillTimeout);
        }
        
        setTimeout(() => {
            if (!possibleValues.includes(randomPlayer) && !possibleValues.includes(randomMafia)) {
                textarea.textContent += `\nMafia and you have been killed. The game is over.`;
            } else if (!possibleValues.includes(randomPlayer) && possibleValues.includes(randomMafia)) {
                textarea.textContent += `\nYou've been killed. Mafia has won!`;
            } else if (possibleValues.includes(randomPlayer) && !possibleValues.includes(randomMafia)) {
                textarea.textContent += `\nMafia has been killed. You have won!`;
            } else {
                textarea.textContent += `\nYou haven't found mafia yet. The game continues...`;
            };
        }, mafiaPlayerTimeout);

        if (possibleValues.includes(randomPlayer) && possibleValues.includes(randomMafia)) {
            setTimeout(() => {
                textarea.textContent = `Time to vote for the player you think is the mafia.\n\n`;
                console.log("Possible values before voting: ", possibleValues);

                let votes = {};
                for (const player of possibleValues) {
                    votes[player] = 0; // Initialize votes for each player
                }
                let randomPlayerToVote;
                for (let i = 1; i < possibleValues.length; i++) {
                    do {
                        randomPlayerToVote = Math.floor(Math.random() * possibleValues.length + 1);
                    } while (possibleValues.includes(randomPlayerToVote) == false)
                    votes[randomPlayerToVote]++; // Randomly vote for a player;
                    console.log(randomPlayerToVote);
                }
                for (const player in votes) {
                    textarea.textContent += `\nPlayer ${player} has ${votes[player]} votes.`;
                }

                votePlayer.innerHTML = ""; // Clear previous options
                removeHidden(votePlayer);
                removeHidden(votePlayerBtn);
                for (const player in votes) {
                    votePlayer.innerHTML += `<option value="${player}">Player ${player}</option>`;
                }

                votePlayerBtn.onclick = () => {
                    addHidden(votePlayer);
                    addHidden(votePlayerBtn);
                    const votedPlayer = votePlayer.value;
                    votes[votedPlayer]++; // Increment the vote for the selected player


                    let maxVotes = 0;
                    let playerToKick;
                    for (const vote in votes) {
                        if (votes[vote] > maxVotes) {
                            maxVotes = votes[vote];
                            playerToKick = vote; // Find the player with the most votes
                        }
                    }
                    console.log("Player to kick: ", playerToKick);

                    index = possibleValues.indexOf(parseInt(playerToKick));
                    if (index > -1) {
                        possibleValues.splice(index, 1); // Remove player from possible values
                    }
                    console.log("Possible values after voting: ", possibleValues);
                    if (playerToKick == randomMafia) {
                        textarea.textContent = `Player ${playerToKick} has been kicked out. He was Mafia! You have won!`;
                    } else if (playerToKick == randomPlayer) {
                        textarea.textContent = `You have been kicked out.`;
                    } else if (playerToKick == randomDoctor) {
                        textarea.textContent = `Player ${playerToKick} has been kicked out. He was the doctor. The game continues...`;
                    } else {
                        textarea.textContent = `Player ${playerToKick} has been kicked out. He was a civilian. The game continues...`;
                    }
                    removeHidden(continueBtn);
                }
            }, 5000);
        }
    }, 1000);
}