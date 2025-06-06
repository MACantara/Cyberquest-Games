import { gameState, updateGameStats } from './gameState.js';
import { showResultModal } from './uiUpdates.js';

export function handleVaultLockdown() {
    gameState.vaultSecurity = 100;
    gameState.attackIntensity = 0;
    showResultModal('🔒', 'Emergency Lockdown', 
        'All vault access suspended. The Null has been blocked.',
        '<div class="text-blue-400">Emergency protocol activated. All accounts temporarily inaccessible.</div>'
    );
    updateGameStats();
}

export function handleMassReset() {
    gameState.vaultSecurity += 30;
    showResultModal('🔄', 'Mass Reset Initiated', 
        'All alumni passwords reset. Users will be prompted to create new credentials.',
        '<div class="text-yellow-400">Disruptive but effective. All weak passwords eliminated.</div>'
    );
    updateGameStats();
}

export function handleDeployMFA() {
    gameState.mfaEnabled = 4;
    gameState.vaultSecurity += 40;
    gameState.attackIntensity -= 30;
    showResultModal('🛡️', 'MFA Deployed', 
        'Multi-factor authentication enabled for all accounts.',
        '<div class="text-green-400">Excellent decision! Brute-force attacks are now ineffective.</div>'
    );
    updateGameStats();
}
