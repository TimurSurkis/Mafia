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
            killRandom = Math.floor(Math.random() * possibleValues.length);
            console.log("Kill: ", killRandom);

            if (!possibleValues.includes(randomDoctor)) {
                while (killRandom == randomDoctor) {
                    killRandom = Math.floor(Math.random() * possibleValues.length); // Ensure mafia does not kill the doctor
                }
            }
            while (killRandom == randomMafia) {
                killRandom = Math.floor(Math.random() * 5 + 1); // Ensure mafia does not kill himself
            }

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
                    console.log("Possible values before removing: ", possibleValues);

                    if (previousDoctorMessage == `Doctor has saved himself.`) {
                        valueToRemove = randomDoctor;
                        index = possibleValues.indexOf(valueToRemove);
                        if (index > -1) {
                            possibleValues.splice(index, 1); // Remove doctor from possible values
                        }
                    } else if (previousDoctorMessage == `Doctor has saved the player.`) {
                        valueToRemove = randomPlayer;
                        index = possibleValues.indexOf(valueToRemove);
                        if (index > -1) {
                            possibleValues.splice(index, 1); // Remove player from possible values
                        }
                    } else if (previousDoctorMessage == `Doctor has saved a civilian.`) {
                        valueToRemove = allPlayers - (randomDoctor + randomPlayer + killRandom);
                        index = possibleValues.indexOf(valueToRemove);
                        if (index > -1) {
                            possibleValues.splice(index, 1); // Remove civilian from possible values
                        }
                    }
                    console.log("Possible values after removing: ", possibleValues);

                    let saveRandom = Math.floor(Math.random() * possibleValues.length);
                    while (saveRandom == randomMafia) {
                        saveRandom = Math.floor(Math.random() * possibleValues.length); // Ensure doctor does not save the mafia
                    }
                    saveRandom = possibleValues[saveRandom]; // Get a random value from the possible values
                    console.log("Save: ", saveRandom);
                    
                        if (saveRandom == killRandom) {
                            playerToRemove = null; // No one was killed
                        }
                        if (saveRandom == randomDoctor) {
                            playerToPush = randomDoctor; // Add doctor back to possible values
                            doctorMessage = `Doctor has saved himself.`;
                        } else if (saveRandom == randomPlayer) {
                            playerToPush = randomPlayer; // Add player back to possible values
                            doctorMessage = `Doctor has saved the player.`;
                        } else if (saveRandom != randomDoctor && saveRandom != randomPlayer && killRandom == saveRandom) {
                            doctorMessage = `Doctor has saved a civilian.`;
                        } else if (saveRandom != randomDoctor && saveRandom != randomPlayer && killRandom != saveRandom) {
                            doctorMessage = `Doctor has saved another civilian.`;
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
    console.log("Possible values after removing: ", possibleValues);

    setTimeout(() => {
        if ((possibleValues - randomMafia - randomDoctor - randomPlayer).length == 0) {
            textarea.textContent += `\nAll civilians have been killed. The game is over.`;
            removeHidden(continueBtn);
            return; // End the game if all civilians are dead
        }
        if (playerToRemove == killRandom) { 
            index = possibleValues.indexOf(playerToRemove);
            if (index > -1) {
                possibleValues.splice(index, 1); // Remove civilian from possible values
            }
            textarea.textContent += `\nOne civilian has been killed.`;
        } else if (doctorMessage == "Doctor has saved a civilian.") {
            textarea.textContent += "\nMafia has attempted to kill a civilian.";
        } else if (doctorMessage == "Doctor has saved the player.") {
            textarea.textContent += "\nMafia has attempted to kill the player."
        } else if (doctorMessage == "Doctor has saved himself.") {
            textarea.textContent += "\nMafia has attempted to kill the doctor.";
        }
        if (!possibleValues.includes(playerToPush)) {
            possibleValues.push(playerToPush); // Add player back to possible values
        }

        let doctorKillTimeout = 2000;
        let mafiaPlayerTimeout = 3000;

        if (possibleValues.includes(randomDoctor)) {
            setTimeout(() => {
                textarea.textContent += `\n${doctorMessage}`;
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
                const allPlayers = [];
                const voteCounts = {};
                textarea.textContent += `\n\nNow it's time to vote for the player you think is the mafia.`;

                function aiVote() {
                    for (const i in possibleValues) {
                        allPlayers.push(possibleValues[i]); // Add all players except the mafia
                    }
                    for (let i = 0; i < allPlayers.length; i++) {
                        const randomVote = Math.floor(Math.random() * allPlayers.length);
                        voteCounts[allPlayers[randomVote]] = (voteCounts[allPlayers[randomVote]] || 0) + 1;
                    }
                }
                aiVote(); // AI votes for players
                votePlayer.innerHTML = ""; // Clear previous options
                for (const i in possibleValues) {
                    votePlayer.innerHTML += `<option value="${possibleValues[i]``}">Player ${possibleValues[i]}</option>`
                }
                for (const player in voteCounts) {
                    const voteCount = voteCounts[player];
                    textarea.textContent += `\nPlayer ${player} has ${voteCount} votes.`;
                }

                removeHidden(votePlayer);
                removeHidden(votePlayerBtn);
                votePlayerBtn.onclick = () => {
                    addHidden(votePlayer);
                    addHidden(votePlayerBtn);
                    const playerVote = parseInt(votePlayer.value);
                    voteCounts[playerVote] = (voteCounts[playerVote] || 0) + 1; // Add player's vote
                    let maxVotes = 0;
                    let votedPlayer;

                    for (const player in voteCounts) {
                        if (voteCounts[player] > maxVotes) {
                            maxVotes = voteCounts[player];
                            votedPlayer = player; // Player with the most votes
                        }
                    }
                    let index;
                    if (votedPlayer == randomMafia) {
                        index = possibleValues.indexOf(randomMafia);
                        if (index > -1) {
                            possibleValues.splice(index, 1); // Remove mafia from possible values
                        }
                        textarea.textContent = `\nPlayer ${votedPlayer} has been voted out. He was the mafia.`;
                    } else if (votedPlayer == randomDoctor && possibleValues.includes(randomDoctor)) {
                        index = possibleValues.indexOf(randomDoctor);
                        if (index > -1) {
                            possibleValues.splice(index, 1); // Remove mafia from possible values
                        }
                        textarea.textContent = `\nPlayer ${votedPlayer} has been voted out. He was the doctor.`;
                    } else if (votedPlayer == randomPlayer && possibleValues.includes(randomPlayer)) {
                        index = possibleValues.indexOf(randomPlayer);
                        if (index > -1) {
                            possibleValues.splice(index, 1); // Remove mafia from possible values
                        }
                        textarea.textContent = `\nPlayer ${votedPlayer}(you) has been voted out. He was the detective.`;
                    } else if (votedPlayer != randomDoctor && votedPlayer != randomPlayer && votedPlayer != randomMafia) {
                        index = possibleValues.indexOf(votedPlayer);
                        if (index > -1) {
                            possibleValues.splice(index, 1); // Remove mafia from possible values
                        }
                        textarea.textContent = `\nPlayer ${votedPlayer} has been voted out. He was a civilian.`;
                    } else {
                        textarea.textContent = `\nNo one has been voted out.`;
                    }
                    removeHidden(continueBtn);
                    console.log("Possible values after voting: ", possibleValues);
                }

            }, mafiaPlayerTimeout + 1000);
        }
    }, 1000);
}