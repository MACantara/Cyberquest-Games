export const gameState = {
    // Blue Team (Player) Stats
    systemIntegrity: 100,
    defensesDeployed: 0,
    patternsBroken: 0,
    adaptationCycles: 0,
    
    // Red Team (AI) Stats  
    aiConfidence: 75,
    learningProgress: 25,
    predictabilityScore: 60,
    aiSuccessRate: 67,
    aiPredictions: 0,
    correctPredictions: 0,
    
    // Battle State
    currentScenario: null,
    completedScenarios: [],
    scenarioTimer: null,
    battlePhase: 'preparation', // preparation, active, complete
    
    // Pattern Analysis
    playerPatterns: {
        responseSpeed: [], // Track decision times
        riskTolerance: [], // Track conservative vs aggressive choices
        preferredStrategies: {}, // Count usage of different approaches
        predictabilityTrend: []
    },
    
    // Ghost Timeline Data
    ghostPredictions: [],
    alternateOutcomes: {},
    
    // Performance Metrics
    roundsWon: 0,
    roundsLost: 0,
    totalRounds: 0,
    unpredictableActions: 0
};

export function updateGameMetrics() {
    // Update Blue Team indicators
    const elements = {
        'system-integrity': gameState.systemIntegrity + '%',
        'integrity-text': gameState.systemIntegrity + '%', 
        'adaptation-cycles': gameState.adaptationCycles,
        'patterns-broken': gameState.patternsBroken,
        
        // Update Red Team indicators
        'ai-confidence': gameState.aiConfidence + '%',
        'learning-progress': gameState.learningProgress + '%',
        'learning-text': gameState.learningProgress + '%',
        'predictability-score': gameState.predictabilityScore + '%',
        'ai-success-rate': Math.round(gameState.aiSuccessRate) + '%'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    // Update progress bars
    updateProgressBar('system-integrity', gameState.systemIntegrity, getIntegrityColor(gameState.systemIntegrity));
    updateProgressBar('learning-progress', gameState.learningProgress, 'bg-red-400');
    
    // Update AI confidence color
    const confidenceElement = document.getElementById('ai-confidence');
    if (confidenceElement) {
        if (gameState.aiConfidence >= 80) {
            confidenceElement.className = 'text-lg font-bold text-red-400';
        } else if (gameState.aiConfidence >= 50) {
            confidenceElement.className = 'text-lg font-bold text-yellow-400';
        } else {
            confidenceElement.className = 'text-lg font-bold text-green-400';
        }
    }
    
    // Update predictability score color
    const predictabilityElement = document.getElementById('predictability-score');
    if (predictabilityElement) {
        if (gameState.predictabilityScore >= 70) {
            predictabilityElement.className = 'text-lg font-bold text-red-400';
        } else if (gameState.predictabilityScore >= 40) {
            predictabilityElement.className = 'text-lg font-bold text-yellow-400';
        } else {
            predictabilityElement.className = 'text-lg font-bold text-green-400';
        }
    }
}

function updateProgressBar(id, percentage, colorClass) {
    const bar = document.getElementById(id);
    if (bar) {
        bar.style.width = percentage + '%';
        bar.className = `h-2 rounded-full transition-all duration-1000 ${colorClass}`;
    }
}

function getIntegrityColor(integrity) {
    if (integrity >= 80) return 'bg-blue-400';
    if (integrity >= 50) return 'bg-yellow-400';
    return 'bg-red-400';
}

export function trackPlayerPattern(action, responseTime, riskLevel) {
    // Track response speed
    gameState.playerPatterns.responseSpeed.push(responseTime);
    if (gameState.playerPatterns.responseSpeed.length > 10) {
        gameState.playerPatterns.responseSpeed.shift(); // Keep only last 10
    }
    
    // Track risk tolerance
    gameState.playerPatterns.riskTolerance.push(riskLevel);
    if (gameState.playerPatterns.riskTolerance.length > 10) {
        gameState.playerPatterns.riskTolerance.shift();
    }
    
    // Track strategy preferences
    if (!gameState.playerPatterns.preferredStrategies[action]) {
        gameState.playerPatterns.preferredStrategies[action] = 0;
    }
    gameState.playerPatterns.preferredStrategies[action]++;
    
    // Calculate current predictability
    updatePredictabilityScore();
}

function updatePredictabilityScore() {
    let predictabilityFactors = [];
    
    // Response speed consistency (more consistent = more predictable)
    if (gameState.playerPatterns.responseSpeed.length >= 3) {
        const speeds = gameState.playerPatterns.responseSpeed;
        const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
        const variance = speeds.reduce((acc, speed) => acc + Math.pow(speed - avgSpeed, 2), 0) / speeds.length;
        const speedPredictability = Math.max(0, 100 - (variance * 10)); // Lower variance = higher predictability
        predictabilityFactors.push(speedPredictability);
    }
    
    // Risk tolerance consistency
    if (gameState.playerPatterns.riskTolerance.length >= 3) {
        const risks = gameState.playerPatterns.riskTolerance;
        const avgRisk = risks.reduce((a, b) => a + b, 0) / risks.length;
        const riskVariance = risks.reduce((acc, risk) => acc + Math.pow(risk - avgRisk, 2), 0) / risks.length;
        const riskPredictability = Math.max(0, 100 - (riskVariance * 20));
        predictabilityFactors.push(riskPredictability);
    }
    
    // Strategy repetition (more repetition = more predictable)
    const totalActions = Object.values(gameState.playerPatterns.preferredStrategies).reduce((a, b) => a + b, 0);
    if (totalActions >= 3) {
        const maxStrategy = Math.max(...Object.values(gameState.playerPatterns.preferredStrategies));
        const strategyPredictability = (maxStrategy / totalActions) * 100;
        predictabilityFactors.push(strategyPredictability);
    }
    
    // Calculate overall predictability
    if (predictabilityFactors.length > 0) {
        const avgPredictability = predictabilityFactors.reduce((a, b) => a + b, 0) / predictabilityFactors.length;
        gameState.predictabilityScore = Math.round(avgPredictability);
        
        // Add to trend
        gameState.playerPatterns.predictabilityTrend.push(gameState.predictabilityScore);
        if (gameState.playerPatterns.predictabilityTrend.length > 5) {
            gameState.playerPatterns.predictabilityTrend.shift();
        }
    }
}

export function simulateAILearning() {
    // Increase AI confidence based on successful predictions
    if (gameState.correctPredictions > 0 && gameState.aiPredictions > 0) {
        const successRate = (gameState.correctPredictions / gameState.aiPredictions) * 100;
        gameState.aiSuccessRate = (gameState.aiSuccessRate + successRate) / 2; // Moving average
        
        if (successRate > 70) {
            gameState.aiConfidence = Math.min(95, gameState.aiConfidence + 5);
            gameState.learningProgress = Math.min(100, gameState.learningProgress + 10);
        }
    }
    
    // Decrease AI confidence when patterns are broken
    if (gameState.patternsBroken > 0) {
        gameState.aiConfidence = Math.max(20, gameState.aiConfidence - (gameState.patternsBroken * 5));
    }
    
    updateGameMetrics();
}

export function generateGhostPrediction(scenario) {
    // Generate what would happen in an alternate timeline
    const predictions = [
        `Ghost timeline: AI predicts you'll choose "${scenario.predictedResponse}" in 2.3 seconds`,
        `Parallel reality: Your usual response fails, AI adapts with countermeasure: ${scenario.aiCountermeasure}`,
        `Quantum echo: ${scenario.ghostScenario}`,
        `Mirror outcome: AI confidence increases to ${Math.min(95, gameState.aiConfidence + 15)}%`
    ];
    
    gameState.ghostPredictions = predictions;
    return predictions;
}

export function resetBattle() {
    // Reset for new battle while keeping learning progress
    gameState.currentScenario = null;
    gameState.completedScenarios = [];
    gameState.battlePhase = 'preparation';
    
    if (gameState.scenarioTimer) {
        clearInterval(gameState.scenarioTimer);
        gameState.scenarioTimer = null;
    }
}
