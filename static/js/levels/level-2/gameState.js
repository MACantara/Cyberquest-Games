export const gameState = {
    securityScore: 100,
    threatLevel: 0,
    cadetsAffected: 0,
    emailsAnalyzed: 0,
    currentEmail: null,
    phishingCount: 0,
    blocksCount: 0,
    analysisSteps: {},
    completedEmails: []
};

export function updateGameStats() {
    document.getElementById('security-score').textContent = gameState.securityScore;
    document.getElementById('threat-level').textContent = gameState.threatLevel;
    document.getElementById('cadets-affected').textContent = gameState.cadetsAffected;
    document.getElementById('emails-analyzed').textContent = gameState.emailsAnalyzed;
    document.getElementById('phishing-count').textContent = gameState.phishingCount;
    document.getElementById('blocks-count').textContent = gameState.blocksCount;
    
    // Update threat meter
    const threatBar = document.getElementById('threat-bar');
    const threatDisplay = document.getElementById('threat-display');
    const threatStatus = document.getElementById('threat-status');
    
    threatBar.style.width = gameState.threatLevel + '%';
    
    if (gameState.threatLevel >= 75) {
        threatBar.className = 'bg-red-500 h-4 rounded transition-all duration-500';
        threatDisplay.textContent = '🔴';
        threatStatus.textContent = 'Critical Threat';
        threatStatus.className = 'text-sm text-red-400';
    } else if (gameState.threatLevel >= 40) {
        threatBar.className = 'bg-yellow-500 h-4 rounded transition-all duration-500';
        threatDisplay.textContent = '🟡';
        threatStatus.textContent = 'Elevated Risk';
        threatStatus.className = 'text-sm text-yellow-400';
    } else {
        threatBar.className = 'bg-green-400 h-4 rounded transition-all duration-500';
        threatDisplay.textContent = '🟢';
        threatStatus.textContent = 'System Secure';
        threatStatus.className = 'text-sm text-green-400';
    }
}
