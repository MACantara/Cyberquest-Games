import { gameState, updateGameStats } from './gameState.js';
import { updateMentorMessage, showResultModal, updateAccountVisual } from './uiUpdates.js';

export function handleSecurityAction(action) {
    const account = gameState.currentAccount;
    const isCorrect = action === account.correctAction;
    
    if (isCorrect) {
        handleCorrectAction(account, action);
    } else {
        handleWrongAction(account, action);
    }
    
    gameState.completedAccounts.push(account.id);
    updateGameStats();
    updateAccountVisual(account.id, isCorrect);
    
    // Check if level complete
    if (gameState.vaultSecurity >= 90 && gameState.securedAccounts >= 3) {
        setTimeout(() => endGame(true), 2000);
    } else {
        setTimeout(() => {
            document.getElementById('account-details').classList.add('hidden');
            updateMentorMessage("Good work! Continue securing the remaining accounts. Each vulnerability you patch makes The Null's job harder.");
        }, 2000);
    }
}

export function handleCorrectAction(account, action) {
    gameState.securedAccounts++;
    
    switch(action) {
        case 'enable-mfa':
            gameState.mfaEnabled++;
            gameState.vaultSecurity += 15;
            account.mfaEnabled = true;
            showResultModal('🛡️', 'MFA Enabled!', 
                `Multi-factor authentication activated for ${account.email}.`,
                '<div class="text-green-400">Account security significantly improved. Brute-force attacks will now fail.</div>'
            );
            break;
        case 'force-reset':
            gameState.vaultSecurity += 20;
            showResultModal('🔄', 'Password Reset!', 
                `Forced password reset initiated for ${account.email}.`,
                '<div class="text-green-400">User will be required to create a strong password on next login.</div>'
            );
            break;
        case 'lockdown':
            gameState.vaultSecurity += 25;
            gameState.attackIntensity -= 20;
            showResultModal('🔒', 'Account Locked!', 
                `Emergency lockdown applied to ${account.email}.`,
                '<div class="text-green-400">Critical admin account secured. Attack intensity reduced.</div>'
            );
            break;
        case 'verify-safe':
            gameState.vaultSecurity += 10;
            showResultModal('✅', 'Account Verified!', 
                `${account.email} confirmed as secure.`,
                '<div class="text-green-400">Strong password and MFA confirmed. No action needed.</div>'
            );
            break;
    }
    
    updateMentorMessage("Excellent security decision! The vault is more secure now.");
}

export function handleWrongAction(account, action) {
    gameState.breachedAccounts++;
    gameState.vaultSecurity -= 10;
    gameState.attackIntensity += 15;
    
    showResultModal('❌', 'Security Breach!', 
        `Incorrect action allowed The Null to exploit ${account.email}.`,
        `<div class="text-red-400">The wrong security measure failed to protect this account. Attack intensity increased.</div>`
    );
    
    updateMentorMessage("That wasn't the right approach. The Null exploited the vulnerability while you were implementing the wrong security measure.");
}

export function endGame(success) {
    if (success) {
        updateMentorMessage("Outstanding work, Nova! You've successfully defended the Alumni Vault and prevented The Null from accessing sensitive records.");
        document.getElementById('complete-level').disabled = false;
        
        showResultModal(
            '🏆',
            'Vault Secured!',
            'You\'ve successfully completed The Password Heist and earned the Credential Guardian badge.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-orange-900 border border-orange-600 rounded p-3">
                        <p class="text-orange-300 font-semibold">🏆 Digital Badge Earned</p>
                        <p class="text-orange-200 text-sm">Credential Guardian - Level 4 Cleared</p>
                    </div>
                    <div class="text-sm space-y-1">
                        <p><strong>Final Vault Security:</strong> ${gameState.vaultSecurity}%</p>
                        <p><strong>Accounts Secured:</strong> ${gameState.securedAccounts}</p>
                        <p><strong>MFA Deployments:</strong> ${gameState.mfaEnabled}</p>
                        <p><strong>Attack Intensity:</strong> Reduced to ${gameState.attackIntensity}%</p>
                    </div>
                </div>
            `
        );
    }
}
