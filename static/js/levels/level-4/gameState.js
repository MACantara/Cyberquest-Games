export const gameState = {
    vaultSecurity: 25,
    securedAccounts: 0,
    breachedAccounts: 0,
    mfaEnabled: 0,
    attackIntensity: 85,
    currentAccount: null,
    completedAccounts: [],
    loginAttempts: 1247,
    emergencyTimer: null
};

export function updateGameStats() {
    const vaultElement = document.getElementById('vault-security');
    const securedElement = document.getElementById('secured-accounts');
    const compromisedElement = document.getElementById('compromised-accounts');
    const intensityElement = document.getElementById('attack-intensity');
    
    if (vaultElement) vaultElement.textContent = Math.max(0, gameState.vaultSecurity) + '%';
    if (securedElement) securedElement.textContent = gameState.securedAccounts;
    if (compromisedElement) compromisedElement.textContent = gameState.breachedAccounts;
    if (intensityElement) intensityElement.textContent = Math.max(0, gameState.attackIntensity) + '%';
}

export function updateAttackStats(accounts = null) {
    // Simulate ongoing attacks - accounts parameter is optional now
    if (Math.random() < 0.3) {
        // Only increase intensity if we have vulnerable accounts
        if (gameState.securedAccounts < 3) {
            gameState.attackIntensity = Math.min(gameState.attackIntensity + 2, 100);
        } else {
            gameState.attackIntensity = Math.max(gameState.attackIntensity - 5, 20);
        }
    }
    
    // Update login attempts
    gameState.loginAttempts += Math.floor(Math.random() * 50) + 20;
    
    // Update display elements
    const loginElement = document.getElementById('login-attempts');
    const intensityElement = document.getElementById('attack-intensity');
    const intensityBar = document.getElementById('intensity-bar');
    
    if (loginElement) {
        loginElement.textContent = gameState.loginAttempts.toLocaleString();
    }
    
    if (intensityElement) {
        intensityElement.textContent = Math.floor(gameState.attackIntensity) + '%';
    }
    
    if (intensityBar) {
        intensityBar.style.width = gameState.attackIntensity + '%';
    }
}
