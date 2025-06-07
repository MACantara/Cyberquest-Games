export const gameState = {
    integrityScore: 100,
    ethicalScore: 100,
    vulnerabilitiesFound: 0,
    componentsAnalyzed: 0,
    ethicalDecisions: 0,
    currentComponent: null,
    
    // Ethical compass metrics
    transparencyLevel: 100,
    responsibilityLevel: 100,
    selfInterestLevel: 0,
    
    // Decision tracking
    disclosureDecisions: [],
    temptationResistance: 100,
    
    // Audit progress
    completedComponents: [],
    criticalVulnFound: false,
    auditComplete: false,
    
    // Ethical dilemmas encountered
    dilemmasCompleted: [],
    ethicalChoicesMade: 0
};

export function updateGameMetrics() {
    // Update main metrics display
    document.getElementById('integrity-score').textContent = gameState.integrityScore;
    document.getElementById('vulnerabilities-found').textContent = gameState.vulnerabilitiesFound;
    document.getElementById('ethical-score').textContent = gameState.ethicalScore;
    
    // Update ethical compass
    document.getElementById('transparency-level').textContent = gameState.transparencyLevel + '%';
    document.getElementById('responsibility-level').textContent = gameState.responsibilityLevel + '%';
    document.getElementById('self-interest-level').textContent = gameState.selfInterestLevel + '%';
    
    // Update progress bars
    document.getElementById('transparency-bar').style.width = gameState.transparencyLevel + '%';
    document.getElementById('responsibility-bar').style.width = gameState.responsibilityLevel + '%';
    document.getElementById('self-interest-bar').style.width = gameState.selfInterestLevel + '%';
    
    // Update bar colors based on values
    updateEthicalBarColors();
}

function updateEthicalBarColors() {
    const transparencyBar = document.getElementById('transparency-bar');
    const responsibilityBar = document.getElementById('responsibility-bar');
    const selfInterestBar = document.getElementById('self-interest-bar');
    
    // Transparency color (green when high)
    if (gameState.transparencyLevel >= 80) {
        transparencyBar.className = 'bg-green-400 h-2 rounded-full transition-all duration-500';
    } else if (gameState.transparencyLevel >= 50) {
        transparencyBar.className = 'bg-yellow-400 h-2 rounded-full transition-all duration-500';
    } else {
        transparencyBar.className = 'bg-red-400 h-2 rounded-full transition-all duration-500';
    }
    
    // Responsibility color (blue when high)
    if (gameState.responsibilityLevel >= 80) {
        responsibilityBar.className = 'bg-blue-400 h-2 rounded-full transition-all duration-500';
    } else if (gameState.responsibilityLevel >= 50) {
        responsibilityBar.className = 'bg-yellow-400 h-2 rounded-full transition-all duration-500';
    } else {
        responsibilityBar.className = 'bg-red-400 h-2 rounded-full transition-all duration-500';
    }
    
    // Self-interest color (red is bad when high)
    if (gameState.selfInterestLevel >= 50) {
        selfInterestBar.className = 'bg-red-500 h-2 rounded-full transition-all duration-500 animate-pulse';
    } else if (gameState.selfInterestLevel >= 25) {
        selfInterestBar.className = 'bg-yellow-500 h-2 rounded-full transition-all duration-500';
    } else {
        selfInterestBar.className = 'bg-green-500 h-2 rounded-full transition-all duration-500';
    }
}

export function recordEthicalDecision(decisionType, impact) {
    gameState.ethicalDecisions++;
    gameState.ethicalChoicesMade++;
    
    // Adjust ethical metrics based on decision
    switch(decisionType) {
        case 'responsible_disclosure':
            gameState.transparencyLevel = Math.min(100, gameState.transparencyLevel + 15);
            gameState.responsibilityLevel = Math.min(100, gameState.responsibilityLevel + 20);
            gameState.ethicalScore = Math.min(100, gameState.ethicalScore + 10);
            break;
            
        case 'sell_exploit':
            gameState.transparencyLevel = Math.max(0, gameState.transparencyLevel - 40);
            gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 50);
            gameState.selfInterestLevel = Math.min(100, gameState.selfInterestLevel + 60);
            gameState.ethicalScore = Math.max(0, gameState.ethicalScore - 30);
            break;
            
        case 'public_disclosure':
            gameState.transparencyLevel = Math.min(100, gameState.transparencyLevel + 25);
            gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 15);
            gameState.ethicalScore = Math.max(0, gameState.ethicalScore - 5);
            break;
            
        case 'ignore_vulnerability':
            gameState.responsibilityLevel = Math.max(0, gameState.responsibilityLevel - 30);
            gameState.ethicalScore = Math.max(0, gameState.ethicalScore - 20);
            break;
    }
    
    // Track decision for final assessment
    gameState.disclosureDecisions.push({
        type: decisionType,
        impact: impact,
        timestamp: Date.now()
    });
    
    updateGameMetrics();
}

export function calculateFinalEthicalRating() {
    // Calculate overall ethical performance
    const transparencyWeight = 0.3;
    const responsibilityWeight = 0.4;
    const selfInterestPenalty = 0.3;
    
    const ethicalRating = (
        (gameState.transparencyLevel * transparencyWeight) +
        (gameState.responsibilityLevel * responsibilityWeight) -
        (gameState.selfInterestLevel * selfInterestPenalty)
    );
    
    return Math.max(0, Math.min(100, ethicalRating));
}
