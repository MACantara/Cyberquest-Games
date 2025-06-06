export const endingState = {
    debriefStarted: false,
    reflectionComplete: false,
    reformChoices: [],
    characterViewed: []
};

export function updateFinalStats() {
    // These would normally come from saved game data
    const stats = {
        missionsCompleted: 10,
        ethicalScore: 95,
        threatsNeutralized: 127,
        livesProtected: 50000
    };
    
    document.getElementById('missions-completed').textContent = stats.missionsCompleted;
    document.getElementById('ethical-score').textContent = stats.ethicalScore;
    document.getElementById('threats-neutralized').textContent = stats.threatsNeutralized;
    document.getElementById('lives-protected').textContent = stats.livesProtected.toLocaleString();
}

export function updateReformChoices() {
    endingState.reformChoices = Array.from(document.querySelectorAll('.reform-checkbox:checked'))
        .map(cb => cb.value);
}

export function checkDebriefCompletion() {
    const challengeText = document.getElementById('challenge-reflection').value.trim();
    const applicationText = document.getElementById('application-reflection').value.trim();
    const reformSelected = document.querySelectorAll('.reform-checkbox:checked').length > 0;
    
    if (challengeText.length > 20 && applicationText.length > 20 && reformSelected) {
        document.getElementById('complete-debrief').disabled = false;
        endingState.reflectionComplete = true;
    }
}
