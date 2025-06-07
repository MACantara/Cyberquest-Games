export const gameState = {
    integrityScore: 100,
    vulnerabilitiesFound: 0,
    componentsAnalyzed: 0,
    ethicalDecisions: 0,
    currentComponent: null,
    
    // Decision tracking
    disclosureDecisions: [],
    
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
}

export function recordEthicalDecision(decisionType, impact) {
    gameState.ethicalDecisions++;
    gameState.ethicalChoicesMade++;
    
    // Adjust integrity score based on decision
    switch(decisionType) {
        case 'responsible_disclosure':
            gameState.integrityScore = Math.min(100, gameState.integrityScore + 10);
            break;
            
        case 'sell_exploit':
            gameState.integrityScore = Math.max(0, gameState.integrityScore - 30);
            break;
            
        case 'public_disclosure':
            gameState.integrityScore = Math.max(0, gameState.integrityScore - 5);
            break;
            
        case 'ignore_vulnerability':
            gameState.integrityScore = Math.max(0, gameState.integrityScore - 20);
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
    // Calculate overall ethical performance based on integrity score
    return Math.max(0, Math.min(100, gameState.integrityScore));
}
