export const gameState = {
    vaultSecurity: 45,
    securedAccounts: 0,
    breachedAccounts: 0,
    mfaEnabled: 0,
    attackIntensity: 75,
    currentAccount: null,
    completedAccounts: [],
    loginAttempts: 0
};

export function updateGameStats() {
    document.getElementById('vault-security').textContent = Math.max(0, gameState.vaultSecurity);
    document.getElementById('secured-accounts').textContent = gameState.securedAccounts;
    document.getElementById('breached-accounts').textContent = gameState.breachedAccounts;
    document.getElementById('mfa-enabled').textContent = gameState.mfaEnabled;
    document.getElementById('attack-intensity').textContent = Math.max(0, gameState.attackIntensity);
}

export function updateAttackStats(accounts) {
    // Simulate ongoing attacks
    if (Math.random() < 0.3) {
        const weakAccounts = Object.values(accounts).filter(acc => 
            acc.strength === 'weak' || acc.strength === 'critical'
        );
        if (weakAccounts.length > 0 && !gameState.completedAccounts.includes(4)) {
            gameState.attackIntensity += 5;
        }
    }
}
