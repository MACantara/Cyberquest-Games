import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export let accounts = {};

export async function loadAccounts() {
    try {
        const response = await fetch('/static/js/levels/level-4/data/accounts.json');
        accounts = await response.json();
    } catch (error) {
        console.error('Failed to load accounts:', error);
    }
}

export function selectAccount(accountId) {
    gameState.currentAccount = accounts[accountId];
    displayAccountDetails(gameState.currentAccount);
    document.getElementById('tutorial-audit').classList.add('hidden');
    
    if (accountId === 4) {
        updateMentorMessage("Critical alert! This admin account has the weakest possible password and full system privileges. This is The Null's primary target - lock it down immediately!");
    }
}

export function displayAccountDetails(account) {
    document.getElementById('account-details').classList.remove('hidden');
    
    const strengthColors = {
        'critical': 'text-red-400',
        'weak': 'text-red-400',
        'moderate': 'text-yellow-400',
        'strong': 'text-green-400'
    };

    const adminBadge = account.adminPrivileges ? 
        '<span class="bg-red-600 text-white px-2 py-1 rounded text-xs ml-2">ADMIN</span>' : '';
    
    const mfaBadge = account.mfaEnabled ? 
        '<span class="bg-green-600 text-white px-2 py-1 rounded text-xs ml-2">MFA</span>' : 
        '<span class="bg-gray-600 text-white px-2 py-1 rounded text-xs ml-2">NO MFA</span>';

    document.getElementById('account-info').innerHTML = `
        <div class="space-y-3">
            <div>
                <h5 class="text-white font-semibold">${account.email}${adminBadge}${mfaBadge}</h5>
                <p class="text-gray-400 text-sm">Password: ${account.password}</p>
            </div>
            <div>
                <p class="text-sm">
                    <span class="text-gray-400">Strength:</span>
                    <span class="${strengthColors[account.strength]} font-semibold ml-2">${account.strength.toUpperCase()}</span>
                </p>
            </div>
            ${account.vulnerabilities.length > 0 ? `
            <div>
                <p class="text-red-300 font-semibold text-sm mb-1">Vulnerabilities:</p>
                <ul class="text-red-200 text-xs space-y-1">
                    ${account.vulnerabilities.map(vuln => `<li>• ${vuln}</li>`).join('')}
                </ul>
            </div>
            ` : '<p class="text-green-400 text-sm">No vulnerabilities detected</p>'}
        </div>
    `;
}

export function closeAccountDetails() {
    document.getElementById('account-details').classList.add('hidden');
    gameState.currentAccount = null;
}
