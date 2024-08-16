let players = JSON.parse(localStorage.getItem('players')) || [];
let round = JSON.parse(localStorage.getItem('round')) || 1;
let totalRounds = JSON.parse(localStorage.getItem('totalRounds')) || 0;
let gameStarted = JSON.parse(localStorage.getItem('gameStarted')) || false;
let changesMade = false;
let bidPhase = JSON.parse(localStorage.getItem('bidPhase'));
if (bidPhase === null) {
    bidPhase = true;
}
let gameEnded = JSON.parse(localStorage.getItem('gameEnded')) || false;


document.addEventListener('DOMContentLoaded', (event) => {
    restoreGameState();
});

function restoreGameState() {
    if (gameStarted) {
        updateVisibility();

        if (gameEnded) {
            document.getElementById('next-round-button').classList.add('hidden');
            alert('Game Over! All rounds completed.');
        } else {
            // Set the Next Round button text
            if (bidPhase) {
                document.getElementById('next-round-button').textContent = `Round ${round}: Enter Bids`;
            } else {
                document.getElementById('next-round-button').textContent = `Round ${round}: Enter Tricks`;
            }

            // Restore the scoreboard header
            let scoreboardHeader = document.querySelector('#scoreboard thead tr');
            for (let i = 1; i <= totalRounds; i++) {
                let th = document.createElement('th');
                th.textContent = `Round ${i}`;
                th.classList.add('py-2', 'px-4', 'text-left');
                scoreboardHeader.insertBefore(th, scoreboardHeader.lastElementChild);
            }

            // Update the scoreboard with the current state
            updateScoreboard();
        }
    }
}

function startGame() {
    totalRounds = parseInt(document.getElementById('total-rounds').value, 10);
    if (totalRounds > 0) {
        gameStarted = true;
        changesMade = true;
        saveGameState();
        document.getElementById('settings').classList.add('hidden');
        document.getElementById('player-input').classList.remove('hidden');
        document.getElementById('scoreboard').classList.remove('hidden');
        document.getElementById('new-game-button').classList.remove('hidden');

        // Initialize Next Round button text
        document.getElementById('next-round-button').textContent = `Round 1: Enter Bids`;

        let scoreboardHeader = document.querySelector('#scoreboard thead tr');
        for (let i = 1; i <= totalRounds; i++) {
            let th = document.createElement('th');
            th.textContent = `Round ${i}`;
            th.classList.add('py-2', 'px-4', 'text-left');
            scoreboardHeader.insertBefore(th, scoreboardHeader.lastElementChild);
        }
    } else {
        alert('Please enter a valid number of rounds.');
    }
}

function updateVisibility() {
    document.getElementById('settings').classList.add('hidden');
    document.getElementById('player-input').classList.add('hidden');
    document.getElementById('scoreboard').classList.remove('hidden');
    document.getElementById('next-round-button').classList.remove('hidden');
    document.getElementById('new-game-button').classList.remove('hidden');
}


function addPlayer() {
    const playerName = document.getElementById('player-name').value;
    if (playerName) {
        players.push({ name: playerName, scores: [], bids: [], tricks: [] });
        updateScoreboard();
        document.getElementById('player-name').value = '';
        changesMade = true;
        saveGameState();

        // Show the success alert
        showAlert('Player added successfully!', 'bg-green-100 text-green-700 border border-green-400');
    }
}
// Function to finalize players and start the game
function finalizePlayers() {
    if (players.length > 0) {
        updateVisibility();
        updateScoreboard();
    } else {
        alert('Please add at least one player.');
    }
}

// Add event listener for Finalize Players button
document.getElementById('finalize-players-button').addEventListener('click', finalizePlayers);


function showAlert(message, alertClasses) {
    const alertContainer = document.getElementById('alert-container');

    // Create the alert element
    const alertElement = document.createElement('div');
    alertElement.className = `p-4 rounded ${alertClasses}`;
    alertElement.textContent = message;

    // Append the alert element to the container
    alertContainer.appendChild(alertElement);

    // Remove the alert after 0.5 seconds
    setTimeout(() => {
        alertContainer.removeChild(alertElement);
    }, 500);
}

function showScoreModal(playerName, promptText, callback) {
    const modal = document.getElementById('score-modal');
    const modalTitle = document.getElementById('score-modal-title');
    const modalInput = document.getElementById('score-modal-input');
    const modalSubmit = document.getElementById('score-modal-submit');
    const modalCancel = document.getElementById('score-modal-cancel'); // Cancel button

    modalTitle.textContent = `${promptText} for ${playerName}`;
    modalInput.value = '';  // Clear the previous input
    modal.classList.remove('hidden');

    modalSubmit.onclick = function () {
        const value = parseInt(modalInput.value, 10);
        modal.classList.add('hidden');
        callback(value);
    };

    modalCancel.onclick = function () {
        modal.classList.add('hidden');
    };

    modalInput.focus();  // Focus the input to bring up the number pad
}


function nextRound() {
    if (round <= totalRounds) {
        if (bidPhase) {
            enterBids();
        } else {
            enterTricks();
        }
    }
}

function enterBids() {
    let allBidsEntered = true;
    const roundBids = [];
    let bidIndex = 0;

    const enterNextBid = () => {
        if (bidIndex < players.length) {
            showScoreModal(players[bidIndex].name, 'Enter bid', bid => {
                if (isNaN(bid)) {
                    allBidsEntered = false;
                    alert("Invalid bid entered. Please enter a valid number.");
                    enterNextBid();
                } else {
                    roundBids.push(bid);
                    bidIndex++;
                    enterNextBid();
                }
            });
        } else {
            if (!allBidsEntered) {
                alert("Bid entry canceled. No bids were saved, and the round did not advance.");
                return;
            }

            players.forEach((player, index) => {
                player.bids.push(roundBids[index]);
            });

            bidPhase = false;
            document.getElementById('next-round-button').textContent = `Round ${round}: Enter Tricks`;
            changesMade = true;
            saveGameState();
            updateScoreboard(); // Update the scoreboard to show the bids
        }
    };

    enterNextBid();
}


function enterTricks() {
    let allTricksEntered = true;
    const roundTricks = [];
    let trickIndex = 0;

    const enterNextTrick = () => {
        if (trickIndex < players.length) {
            showScoreModal(players[trickIndex].name, 'Enter tricks won', tricks => {
                if (isNaN(tricks)) {
                    allTricksEntered = false;
                    alert("Invalid tricks entered. Please enter a valid number.");
                    enterNextTrick();
                } else {
                    roundTricks.push(tricks);
                    trickIndex++;
                    enterNextTrick();
                }
            });
        } else {
            if (!allTricksEntered) {
                alert("Trick entry canceled. No tricks were saved, and the round did not advance.");
                return;
            }

            players.forEach((player, index) => {
                player.tricks.push(roundTricks[index]);
                calculateScore(player, index);
            });

            bidPhase = true;
            round++;
            document.getElementById('next-round-button').textContent = `Round ${round}: Enter Bids`;
            changesMade = true;
            updateScoreboard();
            saveGameState();

            if (round > totalRounds) {
                gameEnded = true;
                updateScoreboard(true); // Show ranks only when the game is over
                document.getElementById('next-round-button').classList.add('hidden');
                alert('Game Over! All rounds completed.');
                saveGameState();  // Save the game state to indicate the game has ended
            }
        }
    };

    enterNextTrick();
}


function calculateScore(player, index) {
    const bid = player.bids[player.bids.length - 1];
    const tricks = player.tricks[player.tricks.length - 1];
    let score;

    if (tricks < bid) {
        score = -bid;
    } else if (tricks === bid) {
        score = bid;
    } else {
        score = bid + 0.1 * (tricks - bid);
    }

    player.scores.push(score);
}

function updateScoreboard(showRanks = false) {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = '';

    // Calculate total scores
    let sortedPlayers = [...players].map(player => {
        return {
            ...player,
            totalScore: player.scores.reduce((acc, score) => acc + score, 0)
        };
    });

    // Sort players by score only if showRanks is true
    if (showRanks) {
        sortedPlayers.sort((a, b) => b.totalScore - a.totalScore);
    }

    // Append players to the scoreboard with ranks
    sortedPlayers.forEach((player, index) => {
        let row = `<tr class="border-t">
                    <td class="py-2 px-4 rank-column ${showRanks ? '' : 'hidden'}">${index + 1}</td> <!-- Rank -->
                    <td class="py-2 px-4">${player.name}</td>`;

        // Add scores or bids for completed rounds
        for (let i = 0; i < totalRounds; i++) {
            if (i < player.scores.length) {
                row += `<td class="py-2 px-4">${player.scores[i].toFixed(1)}</td>`;
            } else if (i < player.bids.length) {
                row += `<td class="py-2 px-4 text-gray-500">
                           ${player.bids[i]}
                           <span class="edit-bid" id ="ab" data-player="${index}" data-round="${i}">
                               <i class="fas fa-edit" style="margin-left: 20px;"></i> <!-- Font Awesome edit icon -->
                           </span>
                        </td>`;
            } else {
                row += `<td class="py-2 px-4"></td>`;
            }
        }
        row += `<td class="py-2 px-4">${player.totalScore.toFixed(1)}</td></tr>`;
        playersList.innerHTML += row;
    });

    // Show or hide the rank column based on the showRanks parameter
    const rankColumns = document.querySelectorAll('.rank-column');
    rankColumns.forEach(col => {
        if (showRanks) {
            col.classList.remove('hidden');
        } else {
            col.classList.add('hidden');
        }
    });

    // Add event listeners to edit bid icons
    document.querySelectorAll('.edit-bid').forEach(icon => {
        icon.addEventListener('click', function () {
            const playerIndex = this.dataset.player;
            const roundIndex = this.dataset.round;
            showEditBidModal(playerIndex, roundIndex);
        });
    });
}



function showEditBidModal(playerIndex, roundIndex) {
    const playerName = players[playerIndex].name;
    const currentBid = players[playerIndex].bids[roundIndex];

    showScoreModal(playerName, 'Edit bid', newBid => {
        if (!isNaN(newBid)) {
            players[playerIndex].bids[roundIndex] = newBid;
            changesMade = true;
            saveGameState();
            updateScoreboard();
        } else {
            alert('Please enter a valid number.');
        }
    });

    // Pre-fill the modal input with the current bid
    const modalInput = document.getElementById('score-modal-input');
    modalInput.value = currentBid;
}


function saveGameState() {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('round', JSON.stringify(round));
    localStorage.setItem('totalRounds', JSON.stringify(totalRounds));
    localStorage.setItem('gameStarted', JSON.stringify(gameStarted));
    localStorage.setItem('bidPhase', JSON.stringify(bidPhase));
    localStorage.setItem('gameEnded', JSON.stringify(gameEnded));
}


// Double confirmation for page reload or exit
window.addEventListener('beforeunload', function (e) {
    if (gameStarted && changesMade) {
        const confirmationMessage = 'Are you sure you want to leave? Your game progress will be lost.';
        e.preventDefault();
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Event listener for New Game button
document.getElementById('new-game-button').addEventListener('click', function () {
    // Add a delay before showing the confirmation message
    setTimeout(function () {
        if (confirm("Are you sure you want to start a new game? This will reset all scores.")) {
            // Reset the game and reload the site if confirmed
            resetGame();
            window.location.reload();  // Reload the site to reset everything
        }
    }, 1800);  // 1.8-second delay
});

// Function to reset the game
function resetGame() {
    // Clear all game-related variables and states
    players = [];
    totalRounds = 0;
    round = 1;
    gameStarted = false;
    gameEnded = false;
    changesMade = false;
    localStorage.clear();  // Clear the saved game state in localStorage

    // Hide all game-related elements and show settings
    document.getElementById('settings').classList.remove('hidden');
    document.getElementById('player-input').classList.add('hidden');
    document.getElementById('scoreboard').classList.add('hidden');
    document.getElementById('next-round-button').classList.add('hidden');
    document.getElementById('new-game-button').classList.add('hidden');

    // Clear the scoreboard
    document.querySelector('#scoreboard thead tr').innerHTML = `
        <th class="py-2 px-4 text-left">Player</th>
        <th class="py-2 px-4 text-left">Total Score</th>
    `;
    document.getElementById('players-list').innerHTML = '';
}


document.getElementById('start-game-button').addEventListener('click', startGame);
document.getElementById('add-player-button').addEventListener('click', addPlayer);
document.getElementById('next-round-button').addEventListener('click', nextRound);
document.getElementById('new-game-button').addEventListener('click', newGame);
