export const gameState = {
    certaintyLevel: 0,
    evidenceCollected: 0,
    connectionsMade: 0,
    logsAnalyzed: 0,
    truthScore: 0,
    truthIndicators: 0,
    currentTool: null,
    evidenceBoard: [],
    suspectConfidence: { dr: 25, mc: 15, zk: 10 },
    completedTools: []
};

export function updateGameMetrics() {
    document.getElementById('certainty-level').textContent = Math.min(100, Math.round((gameState.truthIndicators / 8) * 100));
    document.getElementById('evidence-collected').textContent = gameState.evidenceCollected;
    document.getElementById('connections-made').textContent = gameState.connectionsMade;
    document.getElementById('logs-analyzed').textContent = gameState.logsAnalyzed;
    document.getElementById('truth-score').textContent = gameState.truthScore;
    document.getElementById('truth-indicators').textContent = gameState.truthIndicators;
    
    // Update truth progress bar
    const truthProgress = (gameState.truthIndicators / 8) * 100;
    document.getElementById('truth-progress').style.width = truthProgress + '%';
    
    // Check if ready to present case
    if (gameState.truthIndicators >= 6 && gameState.evidenceCollected >= 5) {
        document.getElementById('complete-level').disabled = false;
        updateArgusMessage("Sufficient evidence gathered, Nova. You're ready to present your case. The truth is within reach.");
    }
}

export function updateConfidenceMeters() {
    const suspects = ['dr', 'mc', 'zk'];
    suspects.forEach(suspect => {
        const confidence = Math.min(100, gameState.suspectConfidence[suspect]);
        const element = document.querySelector(`#confidence-${suspect} .bg-${suspect === 'dr' ? 'red' : suspect === 'mc' ? 'blue' : 'green'}-400`);
        const textElement = document.querySelector(`#confidence-${suspect} .text-${suspect === 'dr' ? 'red' : suspect === 'mc' ? 'blue' : 'green'}-400`);
        
        if (element && textElement) {
            element.style.width = confidence + '%';
            textElement.textContent = confidence + '%';
        }
    });
}
