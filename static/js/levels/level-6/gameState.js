export const gameState = {
    startupFunds: 500000,
    verifiedInvestors: 0,
    scamsDetected: 0,
    contractsAnalyzed: 0,
    trustRating: 85,
    currentInvestor: null,
    analysisSteps: {},
    sectionsExamined: {},
    totalSections: 6,
    completedInvestors: []
};

export function updateFinancialMetrics() {
    document.getElementById('startup-funds').textContent = '$' + (gameState.startupFunds / 1000) + 'K';
    document.getElementById('verified-investors').textContent = gameState.verifiedInvestors;
    document.getElementById('scams-detected').textContent = gameState.scamsDetected;
    document.getElementById('contracts-analyzed').textContent = gameState.contractsAnalyzed;
    document.getElementById('trust-rating').textContent = gameState.trustRating;
    
    // Update risk bars
    const financialRisk = Math.max(0, 100 - gameState.trustRating);
    const reputationRisk = Math.max(0, gameState.scamsDetected * 10);
    
    document.getElementById('financial-risk').style.width = financialRisk + '%';
    document.getElementById('reputation-risk').style.width = reputationRisk + '%';
}
