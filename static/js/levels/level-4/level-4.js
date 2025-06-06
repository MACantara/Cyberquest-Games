import { gameState } from './gameState.js';
import { loadAccounts, selectAccount, closeAccountDetails } from './accountHandler.js';
import { handleSecurityAction } from './securityActions.js';
import { startAttackSimulation, startLoginFeed } from './attackSimulation.js';
import { handleVaultLockdown, handleMassReset, handleDeployMFA } from './emergencyActions.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load account data
    await loadAccounts();
    
    // Initialize game
    function initGame() {
        startAttackSimulation();
        showTutorial();
        startLoginFeed();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-audit').classList.remove('hidden');
            updateMentorMessage("Start with the admin.legacy account - it's the most critical vulnerability. Admin accounts with weak passwords are The Null's primary targets.");
        }, 2000);
    }

    // Event Listeners
    // Account selection
    document.querySelectorAll('.account-item').forEach(item => {
        item.addEventListener('click', function() {
            const accountId = parseInt(this.dataset.account);
            selectAccount(accountId);
            
            // Visual feedback
            document.querySelectorAll('.account-item').forEach(a => a.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    // Security actions
    document.querySelectorAll('.security-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            if (gameState.currentAccount) {
                handleSecurityAction(action);
            }
        });
    });

    // Emergency actions
    document.getElementById('vault-lockdown').addEventListener('click', handleVaultLockdown);
    document.getElementById('mass-reset').addEventListener('click', handleMassReset);
    document.getElementById('deploy-mfa').addEventListener('click', handleDeployMFA);

    // Modal and UI event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initGame();
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('close-details').addEventListener('click', closeAccountDetails);

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '📱',
            'New Crisis Alert',
            'As the vault security stabilizes, a new crisis emerges...',
            `
                <div class="text-left bg-yellow-900 border border-yellow-600 rounded p-3">
                    <p class="text-yellow-300 font-semibold">📱 SOCIAL MEDIA CRISIS</p>
                    <p class="text-yellow-200 text-sm mt-2">"A cadet's private DMs were leaked and manipulated for clout. Rumors spread faster than truth online."</p>
                    <p class="text-gray-400 text-xs mt-2">Commander Vega: "We saved the vault, Nova—but we might've lost something more fragile: trust."</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for Level 5: The Social Web?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/5';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});