import { gameState, updateGameStats } from './gameState.js';
import { updateMentorMessage, showResultModal, updateAccountVisual, createEmergencyAlert } from './uiUpdates.js';

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
    
    // Update real-time stats
    window.updateEmergencyStats({
        vaultSecurity: gameState.vaultSecurity,
        securedAccounts: gameState.securedAccounts,
        compromisedAccounts: gameState.breachedAccounts
    });
    
    // Check if vault is secure enough
    if (gameState.vaultSecurity >= 90 && gameState.securedAccounts >= 3) {
        setTimeout(() => endEmergencyResponse(true), 2000);
    } else if (gameState.vaultSecurity <= 10) {
        setTimeout(() => endEmergencyResponse(false), 1000);
    } else {
        setTimeout(() => {
            document.getElementById('account-details').classList.add('hidden');
            document.getElementById('account-placeholder').classList.remove('hidden');
            updateMentorMessage("Security action deployed! Continue securing accounts - every second counts in this emergency response.");
        }, 2000);
    }
}

export function handleCorrectAction(account, action) {
    gameState.securedAccounts++;
    account.status = 'secured';
    
    // Immediate visual feedback
    createEmergencyAlert(`✅ ${account.email} SECURED`, 'success');
    
    switch(action) {
        case 'enable-mfa':
            gameState.mfaEnabled++;
            gameState.vaultSecurity += 25;
            gameState.attackIntensity -= 15;
            account.mfaEnabled = true;
            
            showResultModal('🛡️', 'MFA DEPLOYED!', 
                `Multi-factor authentication activated for ${account.email}`,
                `
                    <div class="text-green-400 space-y-2">
                        <p class="font-bold">✅ IMMEDIATE PROTECTION ACTIVE</p>
                        <ul class="text-sm space-y-1">
                            <li>• Password-only attacks now blocked</li>
                            <li>• Attack intensity reduced by 15%</li>
                            <li>• Account breach time: INDEFINITE</li>
                        </ul>
                        <p class="text-green-300 text-sm mt-3">+25% Vault Security</p>
                    </div>
                `
            );
            
            // Update the attack display immediately
            updateBreachEstimate(account, 'BLOCKED');
            break;
            
        case 'force-reset':
            gameState.vaultSecurity += 20;
            gameState.attackIntensity -= 10;
            
            showResultModal('🔄', 'EMERGENCY RESET!', 
                `Forced password reset initiated for ${account.email}`,
                `
                    <div class="text-yellow-400 space-y-2">
                        <p class="font-bold">⚡ RESET IN PROGRESS</p>
                        <ul class="text-sm space-y-1">
                            <li>• Current password invalidated</li>
                            <li>• User locked out until reset</li>
                            <li>• Strong password will be required</li>
                        </ul>
                        <p class="text-yellow-300 text-sm mt-3">+20% Vault Security</p>
                    </div>
                `
            );
            
            updateBreachEstimate(account, 'RESET REQUIRED');
            break;
            
        case 'lockdown':
            gameState.vaultSecurity += 30;
            gameState.attackIntensity -= 25;
            
            showResultModal('🔒', 'EMERGENCY LOCKDOWN!', 
                `Critical account ${account.email} locked down immediately`,
                `
                    <div class="text-red-400 space-y-2">
                        <p class="font-bold">🚨 ACCOUNT LOCKED</p>
                        <ul class="text-sm space-y-1">
                            <li>• All access suspended</li>
                            <li>• Admin intervention required</li>
                            <li>• Attack vector eliminated</li>
                        </ul>
                        <p class="text-orange-300 text-sm mt-3">+30% Vault Security (Disruptive)</p>
                    </div>
                `
            );
            
            updateBreachEstimate(account, 'LOCKED');
            break;
            
        case 'verify-safe':
            gameState.vaultSecurity += 10;
            
            showResultModal('✅', 'ACCOUNT VERIFIED!', 
                `${account.email} confirmed as secure - no action needed`,
                `
                    <div class="text-green-400 space-y-2">
                        <p class="font-bold">✅ VERIFICATION COMPLETE</p>
                        <p class="text-sm">Strong password and MFA confirmed. Resources can be focused on higher-risk accounts.</p>
                        <p class="text-green-300 text-sm mt-3">+10% Vault Security</p>
                    </div>
                `
            );
            break;
    }
    
    updateMentorMessage(`Excellent emergency response! ${account.email} is now secure. The Null's attack on this account has been neutralized.`);
}

export function handleWrongAction(account, action) {
    gameState.breachedAccounts++;
    gameState.vaultSecurity -= 15;
    gameState.attackIntensity += 20;
    account.status = 'compromised';
    
    // Immediate visual feedback
    createEmergencyAlert(`❌ ${account.email} COMPROMISED`, 'error');
    
    showResultModal('💀', 'SECURITY BREACH!', 
        `Wrong action allowed The Null to compromise ${account.email}!`,
        `
            <div class="text-red-400 space-y-2">
                <p class="font-bold">⚠️ ACCOUNT COMPROMISED</p>
                <p class="text-sm">The incorrect security measure failed to protect this account. The Null exploited the vulnerability.</p>
                <ul class="text-sm space-y-1 mt-2">
                    <li>• Attack intensity increased by 20%</li>
                    <li>• Vault security decreased by 15%</li>
                    <li>• Account data potentially accessed</li>
                </ul>
                <p class="text-red-300 text-sm mt-3">Emergency containment required!</p>
            </div>
        `
    );
    
    updateMentorMessage("Critical error! The wrong security measure allowed The Null to exploit the vulnerability. We need to move faster on the remaining accounts!");
    
    // Update breach estimate to show immediate compromise
    updateBreachEstimate(account, 'BREACHED');
}

function updateBreachEstimate(account, status) {
    const estimateElement = document.getElementById('estimated-breach');
    const riskElement = document.getElementById('risk-level');
    
    if (estimateElement && riskElement) {
        switch(status) {
            case 'BLOCKED':
                estimateElement.textContent = '∞';
                estimateElement.className = 'text-green-400 text-lg font-bold';
                riskElement.textContent = 'SECURED';
                riskElement.className = 'text-green-400 text-lg font-bold';
                break;
            case 'RESET REQUIRED':
                estimateElement.textContent = 'N/A';
                estimateElement.className = 'text-yellow-400 text-lg font-bold';
                riskElement.textContent = 'RESETTING';
                riskElement.className = 'text-yellow-400 text-lg font-bold';
                break;
            case 'LOCKED':
                estimateElement.textContent = 'LOCKED';
                estimateElement.className = 'text-orange-400 text-lg font-bold';
                riskElement.textContent = 'SUSPENDED';
                riskElement.className = 'text-orange-400 text-lg font-bold';
                break;
            case 'BREACHED':
                estimateElement.textContent = '00:00';
                estimateElement.className = 'text-red-500 text-lg font-bold animate-pulse';
                riskElement.textContent = 'BREACHED';
                riskElement.className = 'text-red-500 text-lg font-bold animate-pulse';
                break;
        }
    }
}

export function endEmergencyResponse(success) {
    // Clear emergency timer
    if (gameState.emergencyTimer) {
        clearInterval(gameState.emergencyTimer);
    }
    
    if (success) {
        updateMentorMessage("OUTSTANDING! Emergency response successful. The Alumni Vault has been secured and The Null's attack has been repelled.");
        document.getElementById('complete-level').disabled = false;
        
        // Stop attack simulations
        gameState.attackIntensity = 0;
        document.getElementById('intensity-bar').style.width = '0%';
        
        showResultModal(
            '🏆',
            'VAULT SECURED!',
            'Emergency containment successful! The Null has been repelled.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-green-900 border border-green-600 rounded p-3">
                        <p class="text-green-300 font-semibold">🏆 EMERGENCY RESPONSE COMPLETE</p>
                        <p class="text-green-200 text-sm">Credential Guardian - Password Security Specialist</p>
                    </div>
                    <div class="text-sm space-y-1">
                        <p><strong>Final Vault Security:</strong> ${gameState.vaultSecurity}%</p>
                        <p><strong>Accounts Secured:</strong> ${gameState.securedAccounts}</p>
                        <p><strong>Emergency MFA Deployments:</strong> ${gameState.mfaEnabled}</p>
                        <p><strong>Response Time:</strong> ${300 - window.emergencyTimer}s</p>
                    </div>
                </div>
            `
        );
    } else {
        showResultModal(
            '💀',
            'VAULT BREACHED!',
            'The Null successfully compromised the Alumni Vault.',
            `
                <div class="text-red-400 space-y-2">
                    <p class="font-bold">⚠️ EMERGENCY RESPONSE FAILED</p>
                    <p class="text-sm">Insufficient security measures allowed The Null to breach the vault.</p>
                    <p class="text-red-300 text-sm mt-3">All alumni data potentially compromised.</p>
                </div>
            `
        );
    }
}
