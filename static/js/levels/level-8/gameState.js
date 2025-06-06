export const gameState = {
    integrityScore: 100,
    vulnerabilitiesFound: 0,
    reportsSubmitted: 0,
    ethicalDecisions: 0,
    systemSecurity: 25,
    currentComponent: null,
    transparencyLevel: 100,
    responsibilityLevel: 100,
    selfInterestLevel: 0,
    completedComponents: []
};

export function updateGameMetrics() {
    document.getElementById('integrity-score').textContent = gameState.integrityScore;
    document.getElementById('vulnerabilities-found').textContent = gameState.vulnerabilitiesFound;
    document.getElementById('reports-submitted').textContent = gameState.reportsSubmitted;
    document.getElementById('ethical-decisions').textContent = gameState.ethicalDecisions;
    document.getElementById('system-security').textContent = gameState.systemSecurity;
    
    // Update conscience meter
    document.getElementById('transparency-bar').style.width = gameState.transparencyLevel + '%';
    document.getElementById('responsibility-bar').style.width = gameState.responsibilityLevel + '%';
    document.getElementById('self-interest-bar').style.width = gameState.selfInterestLevel + '%';
    
    // Update system status
    document.getElementById('security-level').textContent = 
        gameState.systemSecurity >= 75 ? 'Secure' : 
        gameState.systemSecurity >= 50 ? 'Moderate Risk' : 'Critical Risk';
    document.getElementById('patches-applied').textContent = 
        `${Math.floor(gameState.systemSecurity / 25)}/4`;
    document.getElementById('election-status').textContent = 
        gameState.systemSecurity >= 75 ? 'Ready' : 'Pending';
}
