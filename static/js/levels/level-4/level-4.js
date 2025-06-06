import { gameState } from './gameState.js';
import { loadAccounts, selectAccount, closeAccountDetails } from './accountHandler.js';
import { handleSecurityAction } from './securityActions.js';
import { startAttackSimulation, startLoginFeed } from './attackSimulation.js';
import { handleVaultLockdown, handleMassReset, handleDeployMFA } from './emergencyActions.js';
import { updateMentorMessage, showResultModal, updateEmergencyStats } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load account data
    await loadAccounts();
    
    // Initialize emergency response
    function initEmergencyResponse() {
        startAttackSimulation();
        startLoginFeed();
        showEmergencyTutorial();
        startEmergencyTimer();
    }

    // Emergency tutorial system
    function showEmergencyTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-audit').classList.remove('hidden');
            updateMentorMessage("CRITICAL: admin.legacy is under active attack! This account has full vault access and a password of 'admin123'. Secure it immediately before The Null breaks in!");
        }, 2000);
    }

    // Emergency countdown timer
    function startEmergencyTimer() {
        let timeRemaining = 300; // 5 minutes
        
        const timer = setInterval(() => {
            timeRemaining--;
            
            if (timeRemaining <= 0) {
                clearInterval(timer);
                handleEmergencyTimeout();
            }
            
            // Increase urgency as time runs out
            if (timeRemaining <= 60) {
                document.getElementById('critical-banner').classList.add('bg-red-700');
                document.body.classList.add('animate-pulse');
            }
        }, 1000);
        
        gameState.emergencyTimer = timer;
    }

    function handleEmergencyTimeout() {
        showResultModal(
            '💀',
            'VAULT BREACHED!',
            'Time ran out! The Null successfully compromised the Alumni Vault.',
            `
                <div class="text-red-400 space-y-2">
                    <p class="font-bold">⚠️ SECURITY FAILURE</p>
                    <p class="text-sm">The Null gained access to:</p>
                    <ul class="text-xs list-disc list-inside space-y-1">
                        <li>15,000 alumni records</li>
                        <li>Administrative credentials</li>
                        <li>Financial information</li>
                        <li>Personal communications</li>
                    </ul>
                    <p class="text-red-300 text-sm mt-3">Emergency protocols have been activated. All systems locked down.</p>
                </div>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.reload(); // Restart the level
        };
    }

    // Event Listeners
    // Account selection with urgency feedback
    document.querySelectorAll('.account-item').forEach(item => {
        item.addEventListener('click', function() {
            const accountId = parseInt(this.dataset.account);
            selectAccount(accountId);
            
            // Visual feedback with emergency styling
            document.querySelectorAll('.account-item').forEach(a => {
                a.classList.remove('ring-2', 'ring-red-400', 'ring-yellow-400');
            });
            
            if (accountId === 1) { // Critical admin account
                this.classList.add('ring-2', 'ring-red-400');
                updateMentorMessage("EXCELLENT! You selected the most critical account. The Null is actively trying to crack this password. Deploy MFA or force a password reset immediately!");
            } else {
                this.classList.add('ring-2', 'ring-yellow-400');
            }
        });
    });

    // Security actions with immediate feedback
    document.querySelectorAll('.security-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            if (gameState.currentAccount) {
                handleSecurityAction(action);
                
                // Immediate visual feedback
                this.innerHTML = '<i class="bi bi-check-lg mr-2"></i> DEPLOYED';
                this.classList.remove('hover:bg-blue-700', 'hover:bg-yellow-700', 'hover:bg-red-700', 'hover:bg-green-700');
                this.classList.add('bg-gray-600', 'cursor-not-allowed');
                this.disabled = true;
                
                // Update emergency stats
                updateEmergencyStats({
                    vaultSecurity: gameState.vaultSecurity,
                    securedAccounts: gameState.securedAccounts
                });
            }
        });
    });

    // Emergency protocol buttons
    document.getElementById('vault-lockdown').addEventListener('click', function() {
        if (confirm('⚠️ EMERGENCY LOCKDOWN\n\nThis will lock ALL vault access immediately. Continue?')) {
            handleVaultLockdown();
            this.innerHTML = '🔒 LOCKDOWN ACTIVE';
            this.classList.add('bg-gray-600', 'cursor-not-allowed');
            this.disabled = true;
        }
    });

    document.getElementById('mass-reset').addEventListener('click', function() {
        if (confirm('⚠️ MASS PASSWORD RESET\n\nThis will force ALL users to reset passwords. Continue?')) {
            handleMassReset();
            this.innerHTML = '🔄 RESET INITIATED';
            this.classList.add('bg-gray-600', 'cursor-not-allowed');
            this.disabled = true;
        }
    });

    document.getElementById('deploy-mfa').addEventListener('click', function() {
        handleDeployMFA();
        this.innerHTML = '🛡️ MFA DEPLOYED';
        this.classList.add('bg-gray-600', 'cursor-not-allowed');
        this.disabled = true;
        
        updateMentorMessage("EXCELLENT! Emergency MFA deployment successful. The Null's attack effectiveness has been severely reduced!");
    });

    // Modal and UI event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initEmergencyResponse();
        
        updateMentorMessage("Emergency response activated! You have 5 minutes to secure the vault before The Null completes their attack. Focus on the highest-risk accounts first!");
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('close-details').addEventListener('click', closeAccountDetails);

    document.getElementById('complete-level').addEventListener('click', function() {
        // Clear emergency timer
        if (gameState.emergencyTimer) {
            clearInterval(gameState.emergencyTimer);
        }
        
        showResultModal(
            '🛡️',
            'VAULT SECURED!',
            'Emergency response successful! The Null has been repelled.',
            `
                <div class="text-left bg-green-900 border border-green-600 rounded p-3">
                    <p class="text-green-300 font-semibold">🏆 EMERGENCY RESPONSE COMPLETE</p>
                    <p class="text-green-200 text-sm mt-2">Alumni Vault secured with time to spare. All vulnerable accounts protected and emergency protocols deployed successfully.</p>
                    <p class="text-gray-400 text-xs mt-2">But new threats emerge in the digital age...</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 5: The Social Web?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/5';
        };
    });

    // Show opening emergency modal
    document.getElementById('cutscene-modal').classList.remove('hidden');
});