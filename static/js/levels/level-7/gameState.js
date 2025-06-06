export const gameState = {
    predictabilityScore: 75,
    patternsBroken: 0,
    aiPredictions: 0,
    systemIntegrity: 100,
    adaptationCycles: 1,
    currentScenario: null,
    playerBehavior: {},
    aiConfidence: 75,
    completedScenarios: []
};

export function updateGameMetrics() {
    document.getElementById('predictability-score').textContent = gameState.predictabilityScore;
    document.getElementById('patterns-broken').textContent = gameState.patternsBroken;
    document.getElementById('ai-predictions').textContent = gameState.aiPredictions;
    document.getElementById('system-integrity').textContent = gameState.systemIntegrity;
    document.getElementById('adaptation-cycles').textContent = gameState.adaptationCycles;
    
    // Update progress bars
    document.getElementById('core-integrity').style.width = gameState.systemIntegrity + '%';
    document.getElementById('ai-confidence').style.width = gameState.aiConfidence + '%';
    
    // Update adaptation status
    document.getElementById('learning-rate').textContent = gameState.aiConfidence > 60 ? 'High' : gameState.aiConfidence > 30 ? 'Medium' : 'Low';
    document.getElementById('prediction-confidence').textContent = gameState.aiConfidence + '%';
    document.getElementById('next-move').textContent = gameState.predictabilityScore > 60 ? 'Predictable' : gameState.predictabilityScore > 30 ? 'Uncertain' : 'Unpredictable';
}
